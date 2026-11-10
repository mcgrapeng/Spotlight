import { describe, expect, it } from 'vitest'
import { containerDotClass, containerTone } from '../container'

describe('container tone', () => {
  it('marks a ready container green', () => {
    expect(containerTone({ ready: true, state: 'running' })).toBe('success')
  })

  it('marks a crash loop red', () => {
    expect(containerTone({ ready: false, state: 'waiting', reason: 'CrashLoopBackOff' })).toBe('error')
  })

  it('marks an OOM kill red', () => {
    expect(containerTone({ ready: false, state: 'terminated', reason: 'OOMKilled' })).toBe('error')
  })

  it('leaves a container that is still starting neutral', () => {
    // ponytail: 琥珀色专供「需要处理」。一个正在被调度的容器是集群的正常
    // 状态，把它染成琥珀等于把「没出故障」说成「需要注意」。
    expect(containerTone({ ready: false, state: 'waiting', reason: 'ContainerCreating' })).toBe('neutral')
    expect(containerDotClass({ ready: false, state: 'waiting', reason: 'ContainerCreating' }))
      .toBe('bg-muted-foreground/50')
  })

  it('marks a running-but-not-ready container amber', () => {
    // 它既不是「还在起步」，也不是「坏了」—— 它是「起来了但不提供服务」。
    // 真实集群里有一个这样的 Pod：就绪探针挂了 62 天，phase 还是 Running。
    // 它以前是灰的，而灰在这套颜色里意味着「正常，不是信号」——一个假阴性。
    expect(containerTone({ ready: false, state: 'running', reason: null })).toBe('warning')
    expect(containerDotClass({ ready: false, state: 'running', reason: null }))
      .toBe('bg-warning')
  })

  it('marks a failed image pull as an error, not as "still starting"', () => {
    expect(containerTone({ ready: false, state: 'waiting', reason: 'ImagePullBackOff' })).toBe('error')
    expect(containerTone({ ready: false, state: 'waiting', reason: 'ErrImagePull' })).toBe('error')
    expect(containerTone({ ready: false, state: 'waiting', reason: 'CreateContainerConfigError' })).toBe('error')
  })

  it('believes the reason over the ready flag', () => {
    // ponytail: reason 优先于 ready。
    //
    // 之前 `if (c.ready) return 'success'` 排在最前面，ready 一旦为真，
    // 后面的 reason 判定根本没机会跑。于是这个「判定是否坏掉」的共享
    // 函数，权威让位给一个 kubelet 异步上报的布尔值。
    //
    // 而这个产品自己的原则就是反过来的：phase 会撒谎，判定不会
    // （lib/restart.ts 同理 —— 21,320 次重启的 Pod 仍然是 Running，
    // 它没失败，它只是需要人看一眼）。state 是 waiting 就说明容器
    // 没在运行，ready 不可能比 reason 更权威。
    expect(containerTone({ ready: true, state: 'waiting', reason: 'CrashLoopBackOff' })).toBe('error')
    expect(containerTone({ ready: true, state: 'waiting', reason: 'ImagePullBackOff' })).toBe('error')
    expect(containerDotClass({ ready: true, state: 'waiting', reason: 'CrashLoopBackOff' }))
      .toBe('bg-error')
  })

  it('still calls a healthy container healthy', () => {
    expect(containerTone({ ready: true, state: 'running', reason: null })).toBe('success')
    expect(containerTone({ ready: false, state: 'terminated', reason: 'Completed' })).toBe('neutral')
  })
})
