/**
 * 事件正文的句式词典。
 *
 * 40 词的 k8sTerms 解释的是 reason 名词（Unhealthy 是什么），不解释事件
 * 正文那句话（「Readiness probe failed: HTTP probe failed with statuscode:
 * 503」在说什么）—— 而只读账号分发给应用开发后，真正要读的恰恰是这句话。
 *
 * 只收真实集群里出现过的句式族（2026-11-11 的 200 条事件 + 值班经典故障）。
 * 没收录的句子返回 null，不显示解释入口 —— 猜一个解释比不解释更糟，
 * 和 k8sTerms 同一条规矩。
 *
 * 文案在 i18n 的 eventExplain.<key> 下（界面语言跟着浏览器走），这里只
 * 列收录了哪些句式。测试守着双语对等（eventExplain.spec）。
 */
const PATTERNS: { re: RegExp; key: string }[] = [
  // 句式按「这句话长什么样」匹配，不是按 reason —— 要解释的就是正文。
  { re: /^Readiness probe failed/i, key: 'readinessProbeFailed' },
  { re: /^Liveness probe failed/i, key: 'livenessProbeFailed' },
  { re: /Unable to retrieve some image pull secrets/i, key: 'imagePullSecret' },
  { re: /^Back-off restarting failed container/i, key: 'backoffRestart' },
  { re: /was OOMKilled|memory limit exceeded/i, key: 'oomKilled' },
  { re: /^Failed to pull image|^Error: ErrImagePull|^Error: ImagePullBackOff/i, key: 'imagePullFailed' },
  { re: /MountVolume\.SetUp failed|Unable to attach or mount volumes/i, key: 'volumeMountFailed' },
  { re: /^\d+\/\d+ nodes are available/i, key: 'schedulingFailed' },
  { re: /^Evicted|The node was low on resource/i, key: 'evicted' },
  { re: /failed to create (a )?container|CreateContainerConfigError/i, key: 'createContainerFailed' },
]

/** 收录了的句式族键 —— 测试拿它守双语对等，和 k8sTerms 的 EXPLAINED_TERMS 同理。 */
export const EVENT_MESSAGE_KEYS = PATTERNS.map((p) => p.key)

/** 这句事件正文有没有收录的解释；没有就返回 null（不显示解释入口）。 */
export function eventExplanationKey(message: string | null | undefined): string | null {
  if (!message) return null
  for (const p of PATTERNS) {
    if (p.re.test(message)) return p.key
  }
  return null
}
