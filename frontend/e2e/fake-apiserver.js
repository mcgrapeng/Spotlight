/**
 * A stand-in kube-apiserver: a real HTTP server on a real socket speaking real
 * Kubernetes JSON, which the real `kubernetes` Python SDK talks to over real TCP.
 *
 * Not a `page.route()` mock. That distinction is the whole point: mocked
 * fixtures answer whatever they are asked for, which is exactly why the
 * `?context=` / `?cluster=` mismatch survived since the initial commit — with a
 * mock, asking for the wrong cluster still returns plausible data. Here each
 * server serves ONE context and stamps its own short name into every object it
 * returns, so selecting the wrong cluster is impossible to miss.
 *
 *   node fake-apiserver.js <short-name> <port>
 *
 * Routes are matched on path shape so it survives SDK version drift. Anything
 * else returns a real Kubernetes 404 Status, so the client sees an error rather
 * than silently succeeding.
 *
 * Note on required fields: the SDK's pydantic models reject `None` for several
 * string/list fields. `spec.containers`, `containerStatuses.imageID` and
 * `containerID` must be present or the response 500s during deserialisation —
 * see `tests/unit/infrastructure/test_log_decode.py` for the sibling lesson.
 */
import http from 'node:http'

const shortName = process.argv[2] ?? 'unnamed'
const port = Number(process.argv[3] ?? 0)

if (!shortName || !port) {
  console.error('usage: node fake-apiserver.js <short-name> <port>')
  process.exit(2)
}

const PRIMARY_NS = `${shortName}-ns`
const SHARED_NS = 'shared-ns'
const NODE_NAME = `${shortName}-node`

function pod(namespace, name, phase = 'Running', opts = {}) {
  const {
    ready = true,
    restartCount = 3,
    state = 'running',
    reason = null,
  } = opts
  const containerState = state === 'waiting'
    ? { waiting: { reason: reason || 'CrashLoopBackOff' } }
    : state === 'terminated'
      ? { terminated: { reason: reason || 'Error', exitCode: 1 } }
      : { running: { startedAt: '2026-01-01T00:00:00Z' } }
  return {
    apiVersion: 'v1',
    kind: 'Pod',
    metadata: {
      name,
      namespace,
      uid: `uid-${name}`,
      resourceVersion: '1',
      creationTimestamp: '2026-01-01T00:00:00Z',
      labels: { app: name },
    },
    spec: {
      nodeName: NODE_NAME,
      // Required by V1PodSpec — the SDK rejects a null here.
      containers: [{ name: 'app', image: 'img:1' }],
      restartPolicy: 'Always',
    },
    status: {
      phase,
      podIP: '10.1.2.3',
      startTime: '2026-01-01T00:00:00Z',
      containerStatuses: [
        {
          name: 'app',
          ready,
          restartCount,
          image: 'img:1',
          // Also required — V1ContainerStatus rejects null strings.
          imageID: 'docker://img1',
          containerID: 'containerd://abc',
          state: containerState,
        },
      ],
    },
  }
}

const PODS = [
  pod(PRIMARY_NS, `${shortName}-pod-a`),
  pod(SHARED_NS, `${shortName}-pod-b`),
  // 判定三档各留一个样本：功能走查（functional-live.spec.ts）要能断言
  // 「坏了」「需要人看一眼」「正常」三个筛选各自命中多少行。
  pod(PRIMARY_NS, `${shortName}-broken-pod`, 'Running', { ready: false, state: 'waiting', reason: 'CrashLoopBackOff' }),
  pod(PRIMARY_NS, `${shortName}-notready-pod`, 'Running', { ready: false, state: 'running' }),
  pod(SHARED_NS, `${shortName}-noisy-pod`, 'Running', { restartCount: 500 }),
]

/**
 * 事件样本：功能走查要验「告警筛选计数 = 真值」「reason 芯片有解释」
 * 「消息句式解释在弹层里」「长消息能展开」。
 */
function event(name, reason, message, type, count = 1, involved = `${shortName}-notready-pod`) {
  return {
    apiVersion: 'v1',
    kind: 'Event',
    metadata: {
      name,
      namespace: PRIMARY_NS,
      uid: `uid-${name}`,
      resourceVersion: '1',
      creationTimestamp: '2026-01-01T00:00:00Z',
    },
    involvedObject: {
      kind: 'Pod',
      name: involved,
      namespace: PRIMARY_NS,
      uid: `uid-${involved}`,
      apiVersion: 'v1',
      resourceVersion: '1',
      fieldPath: 'spec.containers{app}',
    },
    reason,
    message,
    type,
    count,
    firstTimestamp: '2026-01-01T00:00:00Z',
    lastTimestamp: '2026-01-01T00:05:00Z',
    source: { component: 'kubelet', host: NODE_NAME },
  }
}

const EVENTS = [
  event(
    `${shortName}-event-unhealthy`,
    'Unhealthy',
    'Readiness probe failed: HTTP probe failed with statuscode: 503',
    'Warning',
    13,
  ),
  event(
    `${shortName}-event-pull-secret`,
    'FailedToRetrieveImagePullSecret',
    'Unable to retrieve some image pull secrets (harbor-example); attempting to pull the image may not succeed.',
    'Warning',
    4,
    `${shortName}-broken-pod`,
  ),
  // 长消息：窄屏下会撑破三行截断，于是「展开」按钮出现。
  event(
    `${shortName}-event-long`,
    'Pulled',
    'Container image "harbor.example.internal/team/eval-alert-monitor:basic-20260910-1@sha256:abcdef0123456789abcdef0123456789abcdef0123456789abcdef0123456789" already present on machine',
    'Normal',
    2,
    `${shortName}-pod-a`,
  ),
]

function list(kind, items) {
  return { apiVersion: 'v1', kind, metadata: { resourceVersion: '1' }, items }
}

// 日志序号：每轮 /log 请求都往前推一点，模拟真实应用持续产出新内容。
let logSeq = 0

const ROUTES = [  {
    // 带 ANSI 的多行日志：严重度词在 ANSI 之后（后端的 level 正则允许
    // ANSI 前缀），于是「着色」「只看错误」「去重」「下载」这些功能点
    // 在 CI 里也有真东西可测。
    //
    // 每轮多带一个序号：真实应用每轮都会打新内容，固定内容会让日志流
    // 攒下一堆重复行，把「去重」这类断言测成假阳性。
    match: (p) => p.endsWith('/log'),
    send: (res) => {
      const n = ++logSeq
      return send(
        res,
        200,
        [
          `[31mERROR[0m ${shortName} something failed #${n}`,
          `[33mWARN[0m ${shortName} something is off #${n}`,
          `INFO ${shortName} everything else is fine #${n}`,
          '',
        ].join('\n'),
        'text/plain',
      )
    },
  },
  {
    match: (p) => p.endsWith('/namespaces'),
    send: (res) => send(res, 200, list('NamespaceList', [PRIMARY_NS, SHARED_NS].map((name) => ({
      apiVersion: 'v1',
      kind: 'Namespace',
      metadata: { name, uid: `uid-${name}`, creationTimestamp: '2026-01-01T00:00:00Z' },
      status: { phase: 'Active' },
    })))),
  },
  { match: (p) => p.endsWith('/pods'), send: (res) => send(res, 200, list('PodList', PODS)) },
  {
    // 单个 Pod：/api/v1/namespaces/<ns>/pods/<name>。
    // 详情页、Pod 日志都走这条路径 —— 没有它，详情页一律 404。
    match: (p) => /\/pods\/[^/]+$/.test(p),
    send: (res, p) => {
      const name = decodeURIComponent(String(p).split('/').pop() || '')
      const found = PODS.find((pod) => pod.metadata.name === name)
      if (!found) return send(res, 404, JSON.stringify({ kind: 'Status', status: 'Failure', code: 404, message: 'pods "' + name + '" not found' }), 'application/json')
      return send(res, 200, JSON.stringify(found), 'application/json')
    },
  },
  {
    match: (p) => p.endsWith('/nodes'),
    send: (res) => send(res, 200, list('NodeList', [{
      apiVersion: 'v1',
      kind: 'Node',
      metadata: { name: NODE_NAME, uid: `uid-${NODE_NAME}`, creationTimestamp: '2026-01-01T00:00:00Z' },
      status: {
        conditions: [{ type: 'Ready', status: 'True' }],
        capacity: { cpu: '4', memory: '8Gi', pods: '110' },
        allocatable: { cpu: '3800m', memory: '7Gi', pods: '110' },
      },
    }])),
  },
  { match: (p) => p.endsWith('/events'), send: (res) => send(res, 200, list('EventList', EVENTS)) },
]

function send(res, code, payload, contentType = 'application/json') {
  const body = typeof payload === 'string' ? payload : JSON.stringify(payload)
  res.writeHead(code, {
    'Content-Type': contentType,
    'Content-Length': Buffer.byteLength(body),
  })
  res.end(body)
}

const server = http.createServer((req, res) => {
  const path = (req.url ?? '').split('?')[0]
  const route = ROUTES.find((r) => r.match(path))
  // path 也传给 send：单个 Pod 的路由要从路径里取 Pod 名。
  if (route) return route.send(res, path)
  // A real Kubernetes 404, so an unmapped path surfaces as an error rather
  // than an empty success.
  send(res, 404, {
    kind: 'Status',
    apiVersion: 'v1',
    status: 'Failure',
    message: `${shortName}: no such path ${req.url}`,
    reason: 'NotFound',
    code: 404,
  })
})

server.listen(port, '127.0.0.1', () => {
  console.log(`fake apiserver '${shortName}' on 127.0.0.1:${port}`)
})
