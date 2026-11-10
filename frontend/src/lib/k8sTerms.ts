/**
 * 收录了解释的 K8s reason。
 *
 * 为什么需要它：主要用户是 SRE，他们认识这些词；但值班的人会把只读
 * 账号分发给同事，其中有应用开发 —— 他们不认识 `CrashLoopBackOff`。
 * 界面上只给一个英文串，等于把「为什么坏了」这个产品承诺又还回去了。
 *
 * **解释的文案在 i18n 文件里**（`term.explain.<Term>.what` / `.next`）：
 * 界面语言跟着浏览器走，英文界面下弹出来的解释也必须是英文——
 * 否则这个解释对一半的用户等于没有。
 *
 * 这里只收 **reason**，不收 phase。phase 由 `PodStatusPill` 显示，
 * 它本来就是双语的（「运行中 Running」），不需要解释。而 `Failed`
 * 一词两义：作为 phase 是「容器以失败结束」，作为事件 reason 是
 * 「某个动作失败了」——两句话完全不同。混在一起会给读者一个错的
 * 解释，而错的解释比没有解释更糟。
 *
 * 键是 kubectl 打印的原样拼写。判定按原样匹配（K8s 的大小写不统一，
 * 比如 `OOMKilled` / `CrashLoopBackOff`），不归一化 —— 归一化之后
 * `oomkilled` 和 `OOMKilled` 会变成两个条目，而界面只显示后者。
 */
export const EXPLAINED_TERMS: readonly string[] = [
  // —— 容器状态 ——
  'CrashLoopBackOff',
  'ImagePullBackOff',
  'ErrImagePull',
  'CreateContainerConfigError',
  'CreateContainerError',
  'OOMKilled',
  'Error',
  'Completed',
  'RunContainerError',

  // —— Pod 事件 ——
  'BackOff',
  'Failed',
  'FailedScheduling',
  'FailedMount',
  'FailedAttachVolume',
  'FailedToRetrieveImagePullSecret',
  'FailedCreatePodSandBox',
  'InvalidImageName',
  'InspectFailed',
  'NetworkNotReady',
  'Unhealthy',
  'Evicted',
  'NodeNotReady',
  'KubeletNotReady',
  'NodeHasDiskPressure',
  'NodeHasMemoryPressure',
  'Preempted',
  'Terminating',
  'Killing',

  // —— Pod 级 reason（`status.reason`，不是容器的）——
  'ContainersNotReady',
  'PodCompleted',

  // —— Pod 生命周期（正常事件）——
  'Scheduled',
  'SuccessfulCreate',
  'Pulling',
  'Pulled',
  'Created',
  'Started',
  'SuccessfulUpdate',
  'SuccessfulDelete',
  'SawCompletedJob',
  'ScalingReplicaSet',
]

/**
 * 这个词有没有解释。
 *
 * 没收录的词返回 false —— 那意味着界面上照常显示那个串，不假装解释得了。
 * 「猜一个解释」比「不解释」更糟：读者会以为它说的是真的。
 */
export function hasExplanation(term: string | null | undefined): boolean {
  return !!term && EXPLAINED_TERMS.includes(term)
}
