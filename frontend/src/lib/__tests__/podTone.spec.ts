import { describe, expect, it } from 'vitest'
import { containerTone, podTone } from '../container'

/**
 * 同一个 Pod 在列表和详情页必须是同一种颜色。
 *
 * 这不是审美问题：列表的状态列和详情页的标题是值班的人连着看的两个
 * 界面。一个 Pod 在列表里是琥珀（「要人看一眼」）、在详情页是绿色
 * （「运行中」），等于告诉他两件互相矛盾的事。
 */
describe('pod tone', () => {
  const runningNotReady = { name: 'z8m', ready: false, state: 'running', reason: null }
  const healthy = { name: 'web', ready: true, state: 'running', reason: null }
  const broken = { name: 'redis', ready: false, state: 'waiting', reason: 'CrashLoopBackOff' }

  it('says amber when a container runs but is not ready', () => {
    expect(containerTone(runningNotReady)).toBe('warning')
    expect(podTone([runningNotReady])).toBe('warning')
  })

  it('says red when any container is broken, whatever the others say', () => {
    expect(podTone([healthy, runningNotReady, broken])).toBe('error')
    expect(podTone([broken])).toBe('error')
  })

  it('says nothing when every container is ready', () => {
    // 全部就绪 = 用 phase 自己的颜色（绿），不用判定覆盖。
    expect(podTone([healthy, healthy])).toBeUndefined()
  })

  it('says nothing when there are no containers', () => {
    expect(podTone([])).toBeUndefined()
  })
})
