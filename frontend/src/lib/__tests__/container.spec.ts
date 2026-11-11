import { describe, expect, it } from 'vitest'
import { containerDotClass, containerTone, podMatchesFilter, podNeedsStatusChip } from '../container'

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

describe('podMatchesFilter', () => {
  // P1 修复守卫：真正坏掉的那个 Pod phase 往往还是 Running（289 个里 273 个
  // 是 Running）—— 按 phase 筛「失败」永远得 0 条。筛选必须走判定。
  const broken = {
    phase: 'Running',
    containers: [{ ready: false, state: 'waiting', reason: 'CrashLoopBackOff' }],
  }
  const watching = {
    phase: 'Running',
    containers: [{ ready: false, state: 'running', reason: null }],
  }
  const healthy = {
    phase: 'Running',
    containers: [{ ready: true, state: 'running', reason: null }],
  }
  const scheduling = {
    phase: 'Pending',
    containers: [{ ready: false, state: 'waiting', reason: 'ContainerCreating' }],
  }

  it('「坏了」命中判定为 error 的 Pod，不管 phase 说什么', () => {
    expect(podMatchesFilter(broken, 'error')).toBe(true)
    expect(podMatchesFilter(watching, 'error')).toBe(false)
    expect(podMatchesFilter(healthy, 'error')).toBe(false)
    expect(podMatchesFilter(scheduling, 'error')).toBe(false)
  })

  it('「需要人看一眼」命中在跑但没就绪的 Pod', () => {
    expect(podMatchesFilter(watching, 'warning')).toBe(true)
    expect(podMatchesFilter(broken, 'warning')).toBe(false)
  })

  it('「正常」命中健康的和还在调度的', () => {
    expect(podMatchesFilter(healthy, 'ok')).toBe(true)
    expect(podMatchesFilter(scheduling, 'ok')).toBe(true)
    expect(podMatchesFilter(broken, 'ok')).toBe(false)
    expect(podMatchesFilter(watching, 'ok')).toBe(false)
  })

  it('「全部」什么都命中', () => {
    for (const p of [broken, watching, healthy, scheduling]) {
      expect(podMatchesFilter(p, 'all')).toBe(true)
    }
  })

  it('phase 值按字段匹配 —— Dashboard 深链 ?status=Failed 的兼容路径', () => {
    const failed = {
      phase: 'Failed',
      containers: [{ ready: false, state: 'terminated', reason: 'Error' }],
    }
    expect(podMatchesFilter(failed, 'Failed')).toBe(true)
    expect(podMatchesFilter(broken, 'Failed')).toBe(false)
  })
})

describe('podNeedsStatusChip', () => {
  // 290 行里 273 个是 Running，每行一枚描边绿胶囊 —— 绿墙把真正要看的
  // 那几个埋了。状态胶囊只在「有话可说」时出现。
  it('健康运行中的 Pod 不显示状态胶囊', () => {
    expect(podNeedsStatusChip({ phase: 'Running', containers: [{ ready: true, state: 'running' }] })).toBe(false)
  })

  it('判定偏离健康的要显示', () => {
    expect(podNeedsStatusChip({ phase: 'Running', containers: [{ ready: false, state: 'running' }] })).toBe(true)
    expect(podNeedsStatusChip({ phase: 'Running', containers: [{ ready: false, state: 'waiting', reason: 'CrashLoopBackOff' }] })).toBe(true)
  })

  it('phase 不是 Running 的要显示 —— 等待中、已成功也是事实', () => {
    expect(podNeedsStatusChip({ phase: 'Pending', containers: [{ ready: false, state: 'waiting', reason: 'ContainerCreating' }] })).toBe(true)
    expect(podNeedsStatusChip({ phase: 'Succeeded', containers: [{ ready: false, state: 'terminated', reason: 'Completed' }] })).toBe(true)
  })

  it('读不到容器状态时不装懂 —— 显示胶囊', () => {
    expect(podNeedsStatusChip({ phase: 'Running', containers: [] })).toBe(true)
    expect(podNeedsStatusChip({ phase: 'Running' })).toBe(true)
  })
})
