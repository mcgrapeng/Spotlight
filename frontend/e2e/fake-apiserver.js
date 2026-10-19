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

function pod(namespace, name, phase = 'Running') {
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
          ready: true,
          restartCount: 3,
          image: 'img:1',
          // Also required — V1ContainerStatus rejects null strings.
          imageID: 'docker://img1',
          containerID: 'containerd://abc',
          state: { running: { startedAt: '2026-01-01T00:00:00Z' } },
        },
      ],
    },
  }
}

const PODS = [pod(PRIMARY_NS, `${shortName}-pod-a`), pod(SHARED_NS, `${shortName}-pod-b`)]

function list(kind, items) {
  return { apiVersion: 'v1', kind, metadata: { resourceVersion: '1' }, items }
}

const ROUTES = [
  { match: (p) => p.endsWith('/log'), send: (res) => send(res, 200, `log from ${shortName}\n`, 'text/plain') },
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
  { match: (p) => p.endsWith('/events'), send: (res) => send(res, 200, list('EventList', [])) },
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
  if (route) return route.send(res)
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
