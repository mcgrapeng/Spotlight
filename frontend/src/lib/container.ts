/**
 * The colour of a container's status dot.
 *
 * Two places draw it — the Pods table and the pod detail page — and they
 * disagreed about what "not ready" means. One of them painted every
 * waiting container amber, which quietly made amber mean "normal, still
 * starting" as well as "needs attention" — the same thing the amber
 * action card means, one column over.
 *
 * So amber is NOT for "still starting". It is for the case that is neither
 * starting nor working:
 *
 *   ready               green  — it is running and serving
 *   running, not ready  amber  — it is up but not serving. The readiness
 *                                   probe is failing. This is a signal.
 *   broken              red    — CrashLoopBackOff, Error, OOMKilled
 *   other               grey   — still being scheduled or pulled.
 *                                   Normal, not a signal.
 *
 * The amber case used to be grey, and that was a false negative: a pod
 * whose readiness probe had been failing for 62 days was painted exactly
 * like a pod that was still pulling its image.
 */
export type ContainerTone = 'success' | 'warning' | 'error' | 'neutral'

/** 判定函数读的容器字段 —— 各处 API 容器形状的公共子集。 */
export type ContainerFacts = {
  ready?: boolean
  state?: string
  reason?: string | null
}

const TONE_CLASS: Record<ContainerTone, string> = {
  success: 'bg-success',
  warning: 'bg-warning',
  error: 'bg-error',
  neutral: 'bg-muted-foreground/50',
}

export function containerTone(c: ContainerFacts): ContainerTone {
  // 故障原因先看，ready 后看。
  //
  // 之前 `if (c.ready) return 'success'` 排在最前面，于是 ready 一旦
  // 为真，后面的 reason 判定根本没机会跑。而 reason 才是「这个容器
  // 到底怎么了」的答案：state 是 waiting 就说明它没在运行，ready 不
  // 可能比 reason 更权威。ready 是 K8s 的一个瞬时快照，reason 是
  // 状态机给出的结论 —— 这个产品自己的原则就是「phase 会撒谎，判定
  // 不会」（lib/restart.ts 同理：21,320 次重启的 Pod 仍然是 Running，
  // 它没失败，它只是需要人看一眼）。
  const reason = (c.reason ?? '').toLowerCase()
  if (c.state === 'waiting' && reason === 'crashloopbackoff') return 'error'
  if (c.state === 'terminated' && (reason === 'error' || reason === 'oomkilled')) return 'error'
  // A container that cannot be pulled or configured is broken, not "still
  // starting". It was amber before amber was reserved for "needs
  // attention" — but a failed image pull IS something to act on, so it
  // joins the error tier rather than the neutral one.
  if (
    reason === 'imagepullbackoff' ||
    reason === 'errimagepull' ||
    reason === 'createcontainerconfigerror' ||
    reason === 'createcontainererror'
  ) return 'error'
  if (c.ready) return 'success'
  // 在跑，但没就绪：就绪探针没过。它既不是「还在起步」，也不是「坏了」
  // —— 它是「起来了但不提供服务」，这是需要人看一眼的那种状态。
  if (c.state === 'running') return 'warning'
  return 'neutral'
}

/**
 * 一个 Pod 的判定：容器的判定优先，最坏优先。
 *
 * 列表的状态列和详情页的标题必须用**同一个**函数——同一个 Pod 在两处
 * 显示两个颜色（列表琥珀、详情绿），比任何一个单独的错误都更糟：凌晨
 * 三点的人从列表点进详情，第一眼看到的是绿色「运行中」。
 */
export function podTone(
  containers: ContainerFacts[],
): ContainerTone | undefined {
  if (!containers.length) return undefined
  let worst: ContainerTone | undefined
  for (const c of containers) {
    const t = containerTone(c)
    if (t === 'error') return 'error'
    if (t === 'warning') worst = 'warning'
  }
  return worst
}

/**
 * 状态筛选：判定桶（error 坏了 / warning 需要人看一眼 / ok 正常）。
 *
 * 筛选必须走判定 —— phase 会撒谎：289 个 Pod 里 273 个是 Running，按 phase
 * 筛「失败」得 0 条，而唯一真正坏掉的那个就在 Running 里。判定只在前端
 * （podTone），所以筛选也在前端做：同一个筛选控件一半语义在服务端、一半
 * 在客户端，迟早对不上。
 *
 * phase 值（?status=Failed）是 Dashboard「去看看」的深链兼容路径，按字段
 * 匹配 —— 那张卡数的就是 phase=Failed，它的链接不能断。
 */
export function podMatchesFilter(
  p: { phase?: string; containers?: ContainerFacts[] },
  filter: string,
): boolean {
  if (filter === 'all') return true
  const tone = podTone(p.containers ?? [])
  if (filter === 'error' || filter === 'warning') return tone === filter
  if (filter === 'ok') return tone !== 'error' && tone !== 'warning'
  return p.phase === filter
}

/**
 * 这个 Pod 要不要显示状态胶囊。
 *
 * 290 行里 273 个是 Running，每行一枚描边绿胶囊 —— 那是一面绿墙，把真正
 * 坏掉的那几个埋在几页之外。凌晨三点扫这一列，异常该自己跳出来。
 *
 * 所以「健康且在跑」的 Pod 不出声：胶囊只在有话可说时出现 —— 判定偏离
 * 健康（坏了/要人看一眼），或者 phase 不是 Running（等待中、已成功，
 * 这些同样是读者要读的事实）。判定从不下场：读不到容器状态时显示胶囊，
 * 不装作一切正常。
 */
export function podNeedsStatusChip(p: {
  phase?: string
  containers?: ContainerFacts[]
}): boolean {
  const containers = p.containers ?? []
  if (!containers.length) return true
  if (p.phase !== 'Running') return true
  return containers.some((c) => containerTone(c) !== 'success')
}

export function containerDotClass(c: ContainerFacts): string {
  return TONE_CLASS[containerTone(c)]
}

/**
 * 容器的一句话描述：名字 + 状态 + 原因。
 *
 * 描述和判定必须同源。之前 tooltip 用的是 `c.ready`，圆点用的是
 * containerTone —— 于是一个红点的悬停文字写着「ready」。同一个容器，
 * 颜色说坏了、悬停说好，两个答案。
 *
 * `readyLabel` 由调用方给（文案走 i18n，不在 lib 里绑死语言）。
 */
export function containerStateText(
  c: { name: string; ready?: boolean; state?: string; reason?: string | null },
  readyLabel: string,
  notReadyLabel?: string,
): string {
  const tone = containerTone(c)
  const state =
    tone === 'success' ? readyLabel
      : tone === 'warning' ? `${c.state ?? 'running'}${notReadyLabel ? ` (${notReadyLabel})` : ''}`
        : (c.state ?? '')
  return `${c.name}: ${state}${c.reason ? ` (${c.reason})` : ''}`
}
