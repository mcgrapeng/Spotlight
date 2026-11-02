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

  it('marks a failed image pull as an error, not as "still starting"', () => {
    expect(containerTone({ ready: false, state: 'waiting', reason: 'ImagePullBackOff' })).toBe('error')
    expect(containerTone({ ready: false, state: 'waiting', reason: 'ErrImagePull' })).toBe('error')
    expect(containerTone({ ready: false, state: 'waiting', reason: 'CreateContainerConfigError' })).toBe('error')
  })
})
