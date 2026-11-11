import { describe, expect, it } from 'vitest'
import { EVENT_MESSAGE_KEYS, eventExplanationKey } from '../eventExplain'
import { getI18n } from '@/i18n'

const i18n = getI18n()

/** vue-i18n 找不到键时返回键本身 —— 这就是「缺翻译」的判据。 */
function tr(locale: 'zh-CN' | 'en-US', key: string): string {
  i18n.global.locale.value = locale
  return i18n.global.t(key)
}

describe('event message explanations', () => {
  it('explains the sentences a real cluster actually emits', () => {
    // 2026-11-11 真实集群的告警原文。
    expect(
      eventExplanationKey('Readiness probe failed: HTTP probe failed with statuscode: 503'),
    ).toBe('readinessProbeFailed')
    expect(
      eventExplanationKey(
        'Unable to retrieve some image pull secrets (harbor-pvg2); attempting to pull the image may not succeed.',
      ),
    ).toBe('imagePullSecret')
    expect(eventExplanationKey('Back-off restarting failed container')).toBe('backoffRestart')
  })

  it('covers the classic on-call failures', () => {
    expect(eventExplanationKey('Liveness probe failed: Get "http://10.0.0.1:8080/health": context deadline exceeded')).toBe('livenessProbeFailed')
    expect(eventExplanationKey('Container web was OOMKilled (memory limit exceeded)')).toBe('oomKilled')
    expect(eventExplanationKey('Failed to pull image "registry/app:1.2.3": not found')).toBe('imagePullFailed')
    expect(eventExplanationKey('MountVolume.SetUp failed for volume "data": volume is not bound')).toBe('volumeMountFailed')
    expect(eventExplanationKey('0/3 nodes are available: 2 Insufficient cpu, 1 node(s) had untolerated taint.')).toBe('schedulingFailed')
    expect(eventExplanationKey('The node was low on resource: memory.')).toBe('evicted')
  })

  it('does not explain a sentence it does not know', () => {
    // 猜一个解释比不解释更糟：读者会以为它说的是真的。
    expect(eventExplanationKey('Started container web')).toBeNull()
    expect(eventExplanationKey('Successfully assigned default/web-0 to node-1')).toBeNull()
    expect(eventExplanationKey('')).toBeNull()
    expect(eventExplanationKey(null)).toBeNull()
    expect(eventExplanationKey(undefined)).toBeNull()
  })

  it('every family has bilingual copy, and the English copy stays English', () => {
    for (const key of EVENT_MESSAGE_KEYS) {
      for (const part of ['what', 'next']) {
        const zh = tr('zh-CN', `eventExplain.${key}.${part}`)
        expect(zh, `${key}.${part} 缺中文`).not.toBe(`eventExplain.${key}.${part}`)
        const en = tr('en-US', `eventExplain.${key}.${part}`)
        expect(en, `${key}.${part} 缺英文`).not.toBe(`eventExplain.${key}.${part}`)
        expect(en, `${key}.${part} 英文文案混进了中文`).not.toMatch(/[\u4e00-\u9fff]/)
      }
    }
  })
})
