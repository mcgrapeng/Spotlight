import { describe, expect, it } from 'vitest'
import { EXPLAINED_TERMS, hasExplanation } from '../k8sTerms'
import { getI18n } from '@/i18n'

const i18n = getI18n()

/** vue-i18n 找不到键时返回键本身 —— 这就是「缺翻译」的判据。 */
function tr(locale: 'zh-CN' | 'en-US', key: string): string {
  i18n.global.locale.value = locale
  return i18n.global.t(key)
}

describe('K8s term explanations', () => {
  it('explains the terms a first-timer meets on a broken pod', () => {
    // 这几个是「凌晨三点的 Pod 详情页」上最常见的死因。
    for (const term of ['CrashLoopBackOff', 'ImagePullBackOff', 'OOMKilled', 'BackOff']) {
      expect(hasExplanation(term), term).toBe(true)
    }
  })

  it('does not explain a term it does not know', () => {
    // 猜一个解释比不解释更糟：读者会以为它说的是真的。
    expect(hasExplanation('SomeBrandNewReason')).toBe(false)
    expect(hasExplanation('')).toBe(false)
    expect(hasExplanation(null)).toBe(false)
    expect(hasExplanation(undefined)).toBe(false)
  })

  it('keeps phases out — they are already bilingual', () => {
    // phase 由 PodStatusPill 显示成「运行中 Running」，不需要解释。
    //
    // 而且 `Failed` 一词两义：作为 phase 是「容器以失败结束」，作为事件
    // reason 是「某个动作失败了」。混在一张表里会给读者一个错的解释，
    // 而错的解释比没有解释更糟。
    for (const phase of ['Running', 'Pending', 'Succeeded', 'Unknown']) {
      expect(hasExplanation(phase), phase).toBe(false)
    }
    // 事件意义上的 Failed 是收着的。
    expect(hasExplanation('Failed')).toBe(true)
  })

  it('covers the reasons a real cluster actually emits', () => {
    // 取自真实集群的 400 条事件：故障类的、生命周期类的、节点类的。
    const real = [
      'Scheduled', 'Pulling', 'Pulled', 'Created', 'Started', 'SuccessfulCreate',
      'SuccessfulUpdate', 'SuccessfulDelete', 'SawCompletedJob', 'ScalingReplicaSet',
      'Killing', 'Unhealthy', 'FailedToRetrieveImagePullSecret', 'FailedScheduling',
      'FailedMount', 'Evicted', 'NodeNotReady', 'KubeletNotReady', 'NodeHasDiskPressure',
      'NodeHasMemoryPressure', 'NetworkNotReady', 'InvalidImageName', 'FailedAttachVolume',
      'InspectFailed', 'ContainersNotReady', 'PodCompleted',
    ]
    for (const term of real) {
      expect(hasExplanation(term), term).toBe(true)
    }
  })

  it('lists every term only once', () => {
    expect(new Set(EXPLAINED_TERMS).size).toBe(EXPLAINED_TERMS.length)
  })

  it('has an explanation in BOTH languages', () => {
    // 文案在 i18n 文件里，而清单在这里。两边会漂——所以这个守卫必须有。
    // 少一种语言，英文界面下的解释就等于没有（它会渲染成键名本身）。
    for (const locale of ['zh-CN', 'en-US'] as const) {
      for (const term of EXPLAINED_TERMS) {
        const what = tr(locale, `term.explain.${term}.what`)
        const next = tr(locale, `term.explain.${term}.next`)
        expect(what, `${locale} ${term}.what`).not.toBe(`term.explain.${term}.what`)
        expect(next, `${locale} ${term}.next`).not.toBe(`term.explain.${term}.next`)
        expect(what.trim().length, `${locale} ${term}.what`).toBeGreaterThan(0)
        expect(next.trim().length, `${locale} ${term}.next`).toBeGreaterThan(0)
      }
    }
  })

  it('does not leave a Chinese sentence in the English copy', () => {
    // 英文界面下弹出一句中文，对英文用户是无效的帮助。
    for (const term of EXPLAINED_TERMS) {
      const what = tr('en-US', `term.explain.${term}.what`)
      expect(/[\u4e00-\u9fff]/.test(what), `${term}.what still has Chinese`).toBe(false)
    }
  })
})
