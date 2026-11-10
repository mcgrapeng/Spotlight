<script setup lang="ts">
import { computed, onMounted, onUnmounted, ref, watch } from 'vue'
import { RefreshCw, AlertCircle, Activity, AlertTriangle, ChevronRight, Inbox } from '@lucide/vue'
import { podsApi } from '@/api/endpoints'
import { useClusterStore } from '@/stores/cluster'
import { useCachedFetch } from '@/composables/useCachedFetch'
import { useRelativeTime } from '@/composables/useRelativeTime'
import PageHeader from '@/components/common/PageHeader.vue'
import ReasonChip from '@/components/common/ReasonChip.vue'
import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'
import { cn, formatNumber } from '@/lib/utils'
import { isNoisyRestarts } from '@/lib/restart'
import PodStatusPill from '@/components/pod/PodStatusPill.vue'
import PhaseBar, { type PhaseSlice } from '@/components/common/PhaseBar.vue'
import RestartList from '@/components/common/RestartList.vue'
import EmptyState from '@/components/common/EmptyState.vue'
import type { DashboardOut } from '@/api/types'
import LoadingState from '@/components/common/LoadingState.vue'
import ErrorState from '@/components/common/ErrorState.vue'
import dayjs from '@/utils/dayjs'
import { useI18n } from 'vue-i18n'

const { t } = useI18n()

// ponytail: 相对时间格式化之前在这个文件里另写了一份（和 Events / PodDetail
// 重复三遍）。现在统一走 useRelativeTime。
const { formatRel } = useRelativeTime()

const cluster = useClusterStore()
const stats = ref<DashboardOut | null>(null)
// The cluster/namespace the snapshot on screen belongs to.
const statsTarget = ref<string>('')
const loading = ref(true)
const error = ref<string | null>(null)
// ponytail: 刷新失败单独一个错误位，不复用 error。
//
// error 绑在 <ErrorState> 上，而 ErrorState 会把整个仪表盘换成一张错误页。
// 之前后台轮询失败时，useCachedFetch 把异常写进 error，页面于是从「287 个
// Pod」变成「加载失败」—— 一句代码注释承诺的「保留上一次成功读到的那一版」
// 一次也没兑现。夜里 apiserver 抖一下，整块屏幕就没了。
//
// 现在：error 只管「第一次就没数据」，refreshError 管「有数据但刷新失败」。
const refreshError = ref<string | null>(null)
// ponytail: 「一屏数据都没有」的消息另有一个位置。
//
// `error` 是 useCachedFetch 的（opts.error）：它在每次 load 开头清空自己，
// 后台静默轮询也算一次 —— 所以写进去的消息一分钟后就自己没了，
// 而 stats 已经被集群切换清空，模板三个分支一个都不匹配，页面就成了一片空白。
// 这个 ref 不归那个组合式函数管。
const loadError = ref<string | null>(null)
const refreshing = ref(false)
const lastRefreshed = ref<Date | null>(null)

// ponytail: 仪表盘自己会刷新。
//
// 之前这一页只有三种刷新：进页面、切集群/命名空间、手点「刷新」。开着的
// 页面可以一整天不动 —— 而右上角写着「更新于 几秒前」。那不是刷新，是
// 一句没人维护的谎。
//
// 60 秒一轮，和侧边栏徽标的轮询同频。后端对 dashboard 快照有 5 秒 TTL，
// 所以每分钟只有一次真的打 apiserver（4 个 list 调用），不至于把集群
// 压出褶子；60 秒也够短 —— on-call 的人不会盯着一个一分钟前的数字
// 找罪魁。
const AUTO_REFRESH_MS = 60_000
let autoTimer: ReturnType<typeof setInterval> | null = null

/**
 * 静默刷新：不转刷新按钮，不弹错误。
 *
 * 失败的时候不更新 lastRefreshed —— 「更新于 3 分钟前」本身就是那个
 * 失败的事实，比一个一闪而过的红条诚实。屏幕上的数字是上一次成功读到
 * 的那一版，时间戳告诉读者它有多旧。
 *
 * 静默还意味着不写 error：这个页面的 error 绑着 <ErrorState>，而
 * ErrorState 会把整块仪表盘换成错误页。后台轮询失败一次就丢一屏数据，
 * 是这个产品最不能犯的错。
 */
async function autoRefresh() {
  if (!cluster.activeCluster) return
  const ok = await statsFetch.refresh(true)
  if (ok) {
    lastRefreshed.value = new Date()
    refreshError.value = null
  } else {
    // 静默的是「不弹错误页」，不是「不告诉读者」。快照留着，时刻停在
    // 上一次成功刷新的那一秒。
    refreshError.value = t('dashboard.refreshFailed')
  }
}

const statsFetch = useCachedFetch<DashboardOut>({
  key: '',
  fetcher: () => podsApi.stats(cluster.activeCluster!, cluster.activeNamespace),
  data: stats as unknown as import('vue').Ref<DashboardOut | null>,
  loading,
  error,
  // axios 的原始英文（"Network Error"）不该出现在中文界面上。
  errorFallback: t('state.error'),
  ttlMs: 30_000,
})

// ponytail: load() now ACTUALLY USES useCachedFetch. Cache hit → 0 network,
// miss → fetch + cache. silent=true → bypass cache (user wants fresh).
async function load(silent = false) {
  if (!cluster.activeCluster) return
  // Rekey here, not at setup: a `computed(...).value` captured at store setup
  // freezes at 'none' and serves one cluster's dashboard for every other one.
  // 命名空间也进键：快照是按命名空间的，键里没有它就会串。
  const target = `dashboard:${cluster.activeCluster}:${cluster.activeNamespace || '_all'}`
  statsFetch.rekey(target)
  error.value = null
  refreshError.value = null
  // A different cluster/namespace is a DIFFERENT snapshot. Keeping the old
  // one on screen showed cluster A's numbers under cluster B's name — and
  // the error state never fired, because `stats` was still set.
  const targetChanged = target !== statsTarget.value
  if (targetChanged) {
    stats.value = null
    lastRefreshed.value = null
    statsTarget.value = target
  }
  if (silent) {
    refreshing.value = true
    try {
      // silent: a failed refresh keeps the snapshot on screen. Only the
      // staleness of `lastRefreshed` says anything went wrong.
      const ok = await statsFetch.refresh(true)
      if (ok) {
        lastRefreshed.value = new Date()
        loadError.value = null
      } else if (stats.value === null) {
        // No snapshot on screen: this has to be the error page. `refreshError`
        // is rendered only inside the `stats` branch, so a failure without a
        // snapshot must not go there (blank page).
        //
        // `stats === null` rather than the targetChanged flag: that flag is
        // one-shot, and switching a cluster fires TWO loads (the cluster
        // watcher and the namespace one), so the first of them already
        // consumed it.
        loadError.value = t('state.error')
      } else {
        refreshError.value = t('dashboard.refreshFailed')
      }
    } finally {
      refreshing.value = false
    }
  } else {
    loading.value = true
    try {
      const v = await statsFetch.loadOrHydrate()
      // A failed first load returns null: the composable has already put
      // the reason in `error`, and the page shows the error state.
      if (v) {
        stats.value = v
        lastRefreshed.value = new Date()
        loadError.value = null
      }
    } finally {
      loading.value = false
    }
  }
}

onMounted(() => {
  load()
  autoTimer = setInterval(autoRefresh, AUTO_REFRESH_MS)
})
onUnmounted(() => {
  if (autoTimer) clearInterval(autoTimer)
})
watch(() => cluster.activeCluster, () => load())
watch(() => cluster.activeNamespace, () => load(true))

const phaseCounts = computed(() => {
  const s = stats.value
  if (!s) return { running: 0, pending: 0, failed: 0, succeeded: 0 }
  return {
    running: s.running, pending: s.pending, failed: s.failed, succeeded: s.succeeded
  }
})

// ponytail: 阶段分布。DashboardOut 一直带着 running/pending/failed/succeeded，
// 但之前只有 failed 被读到 —— 258 个 running 和 17 个 pending 从来没显示过，
// 一个 287 Pod 的集群在界面上就是四个平级数字。
const phaseSlices = computed<PhaseSlice[]>(() => {
  const c = phaseCounts.value
  return [
    { key: 'running', label: t('phase.Running'), value: c.running, color: 'hsl(var(--success))' },
    // ponytail: 琥珀色只留给「需要处理」。Pending 是「在等调度」，集群的正常
    // 状态 —— 把它染成琥珀等于把「没出故障」说成「需要注意」。
    //
    // 颜色也从「文本色」改成「表面色」：之前用 --muted-foreground（#52525B），
    // 那是给字用的深灰，铺在 12px 高的条上是一块接近黑的实心板，比 258 个
    // Running 的绿块还重。17 个待调度的 Pod 是集群的正常状态，不该是全条
    // 第二抢眼的东西。Pending 和 Succeeded 走两级表面灰，条上只留绿和红
    // 两个有含义的颜色。
    // 三个灰必须两两不同：Succeeded 之前用了 --muted，而 PhaseBar 的底槽
    // 就是 bg-muted —— 那一段画出来和底槽一个颜色，等于没画，而
    // aria-label 里还报着「Succeeded 12」。
    { key: 'pending', label: t('phase.Pending'), value: c.pending, color: 'hsl(var(--muted-foreground) / 0.35)' },
    { key: 'failed', label: t('phase.Failed'), value: c.failed, color: 'hsl(var(--error))' },
    // Succeeded 比 Pending 更淡一级：两级灰在同一根条上要分得开。
    { key: 'succeeded', label: t('phase.Succeeded'), value: c.succeeded, color: 'hsl(var(--border))' },
  ]
})

/**
 * The phases that actually have pods in them — the legend's job.
 *
 * Zero-valued phases used to take a slot each, and "失败 Failed 0" came
 * with a red dot: the only red on the first screen, marking nothing.
 * Red means failed in this product; the failure count is already in the
 * subtitle, and that is where a zero belongs.
 */
const nonZeroPhases = computed(() => phaseSlices.value.filter((s) => s.value > 0))

// ponytail: noisyRestarts hoisted out of template. Previous version ran
// `stats.restart_top.filter(p => p.restarts > 5).slice(0, 5)` twice per render
// (once for v-if, once for v-for) — now computed once.
//
// 阈值从 `> 5` 换成 isNoisyRestarts（>= 10），跟 hero 用的那一个对齐。
// 之前这张卡的标题写着「频繁重启」，里面却躺着 6 次、7 次、9 次重启的
// Pod，而同一屏的 hero 说「2 个 Pod 频繁重启」—— 同一个词，两个门槛。
// 接到真实集群上一看更明显：重启次数是 157 / 12 / 9 / 9 / 9，卡片列了
// 5 个，hero 说 2 个。
const noisyRestarts = computed(() => {
  const all = stats.value?.restart_top ?? []
  return all.filter(p => isNoisyRestarts(p.restarts)).slice(0, 5)
})

type ActionLink =
  | { name: 'pods'; query?: Record<string, string> }
  | { name: 'events'; query?: Record<string, string> }
  | { name: 'nodes'; query?: Record<string, string> }

const actionItems = computed<Array<{
  severity: 'critical' | 'warning'
  label: string
  detail: string
  link: ActionLink
  /** The number that earns the 48px slot on the first screen. */
  metric: { value: string; unit: string }
}>>(() => {
  const items: Array<{
    severity: 'critical' | 'warning'; label: string; detail: string; link: ActionLink
    metric: { value: string; unit: string }
  }> = []

  if (phaseCounts.value.failed > 0) {
    items.push({
      severity: 'critical',
      label: t('dashboard.actionFailedPods', { count: phaseCounts.value.failed }),
      detail: t('dashboard.actionFailedPodsDetail'),
      link: { name: 'pods', query: { status: 'Failed' } },
      metric: {
        value: formatNumber(phaseCounts.value.failed),
        unit: t('dashboard.unitFailedPods'),
      },
    })
  }

  if (stats.value?.nodes_ready !== undefined && stats.value.nodes_total > 0) {
    const notReady = stats.value.nodes_total - stats.value.nodes_ready
    if (notReady > 0) {
      items.push({
        severity: 'critical',
        label: t('dashboard.actionNodesNotReady', { count: notReady }),
        detail: t('dashboard.actionNodesNotReadyDetail', {
          ready: stats.value.nodes_ready,
          total: stats.value.nodes_total,
        }),
        link: { name: 'nodes' },
        metric: { value: formatNumber(notReady), unit: t('dashboard.unitNotReadyNodes') },
      })
    }
  }

  // ponytail: 频繁重启排在告警事件前面。两者严重级别相同（都是 warning），
  // 排序是稳定的，所以谁先入队谁排前面。「3 个 Pod 频繁重启（最高 21,320 次）」
  // 点名了要看的对象，「25 个 Warning 事件」只是一个计数 —— 而告警计数里
  // 往往就是同一个崩溃循环，换个单位说了一遍。
  const noisy = (stats.value?.restart_top ?? []).filter(p => isNoisyRestarts(p.restarts)).slice(0, 3)
  if (noisy.length > 0) {
    const worst = Math.max(...noisy.map(p => p.restarts))
    items.push({
      severity: 'warning',
      label: t('dashboard.actionFrequentRestarts', { count: noisy.length }),
      // 详情说人话：具体是哪几个 Pod 交给「频繁重启」那张表。
      detail: t('dashboard.actionFrequentRestartsDetail'),
      // ponytail: 链接把 Pod 表按重启次数倒序打开。
      //
      // 之前是 { name: 'pods' } —— 287 个 Pod 按名字排，罪魁不在视野里。
      // 首屏那个「去看看」承诺的是「3 个 Pod 频繁重启」，点进去却要读者
      // 自己再点一次表头才知道该看哪一列。
      link: { name: 'pods', query: { sort: 'restarts', dir: 'desc' } },
      // 21,320 是这一屏里最刺眼的数字，之前它躺在右下角 16px 的表里。
      // 48px 的主位应该放数字，不是放一句短语。
      metric: { value: formatNumber(worst), unit: t('dashboard.unitRestarts') },
    })
  }

  if (stats.value?.warning_events && stats.value.warning_events > 0) {
    // ponytail: 「有几条告警」和「这条告警吵了多少次」是两个数。
    //
    // 真实集群上只有 1 条 Warning（FailedToRetrieveImagePullSecret），
    // 从 9 月 8 日起已经重复了 49,002 次。仪表盘只写「1 个 Warning
    // 事件」，读者读到的是「发生过一次」—— 那个 1 回答的是「几件事
    // 不对」，不是「多吵」。一个六周没停过的告警写着「1」，读起来
    // 像已经翻篇了。
    //
    // 两个数一起给：主位是「几件事」（1），副位是「多吵」（49,002）。
    // 没有重复次数（count = 1）的时候就不加这半句。
    const repeats = Math.max(0, ...(stats.value.recent_warns ?? []).map(w => w.count ?? 1))
    items.push({
      severity: 'warning',
      label: t('dashboard.actionWarningEvents', { count: stats.value.warning_events }),
      detail: repeats > 1
        ? t('dashboard.actionWarningEventsRepeated', { count: formatNumber(repeats) })
        : t('dashboard.actionWarningEventsDetail'),
      link: { name: 'events', query: { type: 'Warning' } },
      metric: {
        value: formatNumber(stats.value.warning_events),
        unit: t('dashboard.unitWarningEvents'),
      },
    })
  }

  return items.sort((a, b) => {
    if (a.severity !== b.severity) return a.severity === 'critical' ? -1 : 1
    return 0
  })
})

// ponytail: 首屏主位是「最该管的一件事」，不是一个永远不会变红的健康分。
// 重启 21,320 次的 Pod phase 仍然是 Running，健康分照旧是 94% —— 一个说不了
// 「坏」的数字会持续把注意力从故障上拿走。所以健康分降级成阶段条下面一行
// 事实说明，判定句（「一切正常」这类）整段删掉。
//
// 主位放的是这一项的数字，48px 配数字，配短语太浪费 —— 「3 个 Pod 频繁
// 重启」七个中文字在手机上折两行，把整屏往下推。
const heroAction = computed(() => actionItems.value[0] ?? null)
const heroTitle = computed(() => heroAction.value?.label ?? t('dashboard.heroAllClear'))
const heroDetail = computed(() => heroAction.value?.detail ?? t('dashboard.heroAllClearHint'))
const heroMetric = computed(() => heroAction.value?.metric ?? null)
const heroTone = computed(() => {
  if (!heroAction.value) return 'text-success'
  return heroAction.value.severity === 'critical' ? 'text-error' : 'text-warning'
})

// ponytail: 值变了，主位的数字动一下。
//
// 仪表盘每分钟自己刷新，刷新完 21,320 变成 3,200 —— 48px 的数字直接被
// 换掉，没有任何动静。盯着这块屏的人很可能根本没发现数字变了，于是
// 以为「还是 21,320」。
//
// key 在值变化时加一，元素被换掉，animate-value-in 就跑一次。第一次渲染
// 不动（key 是 0，没有动画类）：进场动效不是这条规则要的东西，这条规则
// 只管「数据到了」。
const heroValueKey = ref(0)
watch(() => heroMetric.value?.value, (v, old) => {
  // ponytail: 第一次不算「变了」。数据第一次到的时候，old 是 undefined，
  // 条件成立会把 key 加一，于是每次进页面都重播一次「值变了」的入场动画。
  // 进场动效和「值变了」动效是两件事：前者属于组件，后者属于数据。
  if (old === undefined) return
  if (v !== undefined && v !== old) heroValueKey.value += 1
})

// ponytail: 主位讲第一件事，下面这张卡讲剩下的。以前两张卡讲的是同一句
// 话（actionItems[0]），中间只隔 60px —— 看的人会当成渲染 bug。
const restItems = computed(() => actionItems.value.slice(1))

const compactStats = computed(() => {
  const s = stats.value
  if (!s) return ''
  return t('dashboard.compactStats', {
    total: formatNumber(s.total_pods),
    running: formatNumber(s.running),
    failed: formatNumber(s.failed),
    nodesReady: s.nodes_ready,
    nodesTotal: s.nodes_total,
    warnings: s.warning_events,
  })
})

const recentActivity = computed(() => {
  const items: Array<{ time: string; icon: string; label: string; pod: string }> = []
  // server now inlines recent_warns in /pods/stats (warning-only, cap 8) —
  // iterate directly, no extra client-side filter.
  const evs = stats.value?.recent_warns ?? []
  for (let i = 0; i < evs.length && items.length < 8; i++) {
    const ev = evs[i]
    if (ev.last_seen) {
      items.push({
        time: formatRel(ev.last_seen),
        icon: 'warn',
        label: ev.reason,
        pod: `${ev.namespace}/${ev.involved_name}`,
      })
    }
  }
  return items
})
</script>

<template>
  <LoadingState v-if="!stats && loading" />
  <!-- ponytail: 只有「一屏数据都没有」才整页换成错误页。有数据的时候，
       刷新失败只更新 refreshError，快照留在屏幕上。 -->
  <ErrorState v-else-if="(error || loadError) && !stats" :message="error || loadError || ''" @retry="load" />
  <div v-else-if="stats">

    <PageHeader :title="t('route.dashboard')" :subtitle="compactStats">
      <template #actions>
        <!--
          ponytail: 可见的是绝对时刻，相对时间做 title。
          相对时间是一句关于「现在」的话，读者要信浏览器的时钟；绝对时刻
          是一个能复述的事实 —— 凌晨三点跟人确认「你看到的是哪一版」的时候，
          要的是后者。上一轮审计的建议就是这个方向，之前实现反了。
        -->
        <span
          class="text-xs text-muted-foreground tabular-nums hidden sm:inline"
          :title="lastRefreshed ? t('dashboard.updatedTitle', {
            stamp: dayjs(lastRefreshed).format('YYYY-MM-DD HH:mm:ss'),
            rel: formatRel(lastRefreshed.toISOString()),
          }) : undefined"
        >
          {{ lastRefreshed ? t('dashboard.updatedAt', { time: dayjs(lastRefreshed).format('HH:mm:ss') }) : '' }}
        </span>
        <!-- ponytail: 刷新失败是一条小字，不是整页错误。快照还在屏幕上，
             「更新于 3 分钟前」已经说明它有多旧。 -->
        <span v-if="refreshError" class="text-xs text-warning" role="status">
          {{ refreshError }}
        </span>
        <Button variant="outline" size="sm" :loading="refreshing" @click="load(true)" :aria-label="t('dashboard.refresh')">
          <template #icon>
            <RefreshCw :size="14" :stroke-width="1.75" />
          </template>
          {{ t('dashboard.refresh') }}
        </Button>
      </template>
    </PageHeader>

    <!--
      Hero：整个首屏只回答一个问题 —— 现在最该管的是什么。
      之前主位是 48px 的健康度 + 一句判定「一切正常」：一个变不了红的数字
      （重启 21,320 次的 Pod phase 还是 Running）持续把注意力从故障上拿走，
      往下两行就是「3 个 Pod 频繁重启 / 最高 21,320 次重启」。
      现在主位是 actionItems[0] 的数字，48px 配数字不配短语。
    -->
    <Card class="p-0 mb-4">
      <CardContent class="p-5">
        <div class="flex flex-col lg:flex-row lg:items-center gap-6">
          <div class="lg:flex-1 min-w-0">
            <div class="text-xs text-muted-foreground tracking-wide mb-2">{{ t('dashboard.heroEyebrow') }}</div>
            <!-- ponytail: 没有 action item 时用 34px 而不是 48px ——
                 「一切正常」是这一屏里唯一不需要抢注意力的信息。 -->
            <div
              v-if="heroMetric"
              class="flex items-baseline gap-2"
            >
              <span
                :key="heroValueKey"
                class="text-4xl md:text-5xl font-bold tabular-nums tracking-tight leading-[1.05] break-words"
                :class="[heroTone, heroValueKey > 0 ? 'animate-value-in' : '']"
              >{{ heroMetric.value }}</span>
              <span class="text-xl font-semibold" :class="heroTone">{{ heroMetric.unit }}</span>
            </div>
            <h2
              v-else
              class="text-3xl font-bold tracking-tight leading-[1.15]"
              :class="heroTone"
            >{{ heroTitle }}</h2>
            <div v-if="heroAction" class="mt-1.5 text-base font-semibold text-foreground">
              {{ heroTitle }}
            </div>
            <p class="mt-1 text-sm text-muted-foreground">{{ heroDetail }}</p>
            <router-link
              v-if="heroAction"
              :to="heroAction.link"
              class="mt-3 inline-flex items-center gap-1 rounded-sm text-sm font-medium text-foreground transition-colors ease-app dur-fast hover:underline underline-offset-4 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-background"
            >
              {{ t('dashboard.heroOpen') }}
              <ChevronRight :size="14" :stroke-width="2" aria-hidden="true" />
            </router-link>
          </div>

          <div class="lg:w-[420px] lg:shrink-0">
            <!--
              ponytail: 这里原来还有两个重复。

              头部右边写着「282 Pod」，而副标题里已经写着「287 个 Pod」——
              同一个总数说两遍。下面的「272 / 282 个 Pod 处于 Running」是
              第三遍，而图例里的「运行中 Running 272」是第四遍。

              规则很简单：一个数字只出现一次。总数在副标题，阶段数在图例
              （图例是那根条的刻度），于是头部和那行说明都删掉。
            -->
            <div class="mb-2">
              <span class="text-xs text-muted-foreground tracking-wide">{{ t('dashboard.phaseDistribution') }}</span>
            </div>
            <PhaseBar :slices="phaseSlices" height="12px" />
            <div class="mt-2 flex flex-wrap gap-x-5 gap-y-1.5">
              <div v-for="s in nonZeroPhases" :key="s.key" class="flex items-center gap-1.5 text-xs">
                <span class="size-2 rounded-full shrink-0" :style="{ background: s.color }" aria-hidden="true" />
                <span class="text-muted-foreground">{{ s.label }}</span>
                <span class="font-mono tabular-nums font-medium">{{ formatNumber(s.value) }}</span>
              </div>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>

    <!-- Section 1: Action Required (only if there ARE actions left after the hero) -->
    <Card v-if="restItems.length > 0" class="p-0 mb-4">
      <CardContent class="p-4">
        <div class="flex items-center justify-between mb-3">
          <h2 class="text-sm font-semibold flex items-center gap-2">
            <AlertCircle :size="16" class="text-warning" :stroke-width="2" />
            {{ t('dashboard.actionRequired', { count: restItems.length }) }}
          </h2>
          <span class="text-xs text-muted-foreground">{{ t('dashboard.actionHint') }}</span>
        </div>
        <div class="space-y-2">
          <router-link
            v-for="(item, i) in restItems"
            :key="i"
            :to="item.link"
            class="flex items-start gap-3 p-2.5 rounded-md border border-border transition-colors ease-app dur-fast hover:bg-muted/50 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-background"
            :class="item.severity === 'critical' ? 'bg-error/5' : 'bg-warning/5'"
          >
            <span
              :class="cn(
                'shrink-0 mt-0.5 w-1.5 self-stretch rounded-full',
                item.severity === 'critical' ? 'bg-error' : 'bg-warning'
              )"
              aria-hidden="true"
            />
            <div class="flex-1 min-w-0">
              <div class="text-sm font-medium">{{ item.label }}</div>
              <div class="text-xs text-muted-foreground">{{ item.detail }}</div>
            </div>
            <ChevronRight class="shrink-0 text-muted-foreground" :size="14" :stroke-width="1.75" aria-hidden="true" />
          </router-link>
        </div>
      </CardContent>
    </Card>

    <!--
      ponytail: 两张 StatCard 整行删掉。

      「告警 25」和上面行动卡里的「25 个 Warning 事件」是同一件事，只隔了
      60px，一个在 26px 一个在 14px；「节点 3/3」和副标题里的「3/3 节点」
      也是同一件事。四个数字里有两个是重复的，剩下两个（告警、节点）在
      真实集群上又都是非信号 —— 一个集群只有 1 条告警、3 个节点全 Ready。

      数字去重之后，这一行就没有内容了。空出来的地方不补东西：首屏该
      回答「现在最该管的是什么」，多摆两张卡只会让那个答案更不响。
      节点和告警的细节分别在 Nodes 页和 Events 页。
    -->

    <!-- Section 3: Recent Activity + Top Noisy -->
    <!--
      ponytail: 两张卡各占一半，各按内容高。
      之前是 2/3 + 1/3，比例是拍的：真实集群上「最近活动」只有 1 行
      （Warning 只有一条，一直在重复触发），于是 2/3 那张卡里六成是空白，
      而 1/3 那张卡挤着 2 根条。items-start 让每张卡按自己的内容高，
      忙的集群上活动多，左边自然长一点。
    -->
    <div class="grid grid-cols-1 lg:grid-cols-2 gap-4 mb-6 items-start">
      <!-- Recent activity -->
      <Card class="p-0">
        <CardContent class="p-4">
          <h2 class="text-sm font-semibold mb-3 flex items-center gap-2">
            <Activity :size="16" :stroke-width="1.75" />
            {{ t('dashboard.recentActivity') }}
            <span class="text-xs text-muted-foreground ml-auto">{{ t('dashboard.recentActivityWindow') }}</span>
          </h2>
          <!-- ponytail: 空态收成一行。共享的 EmptyState 是 40px 图标 + py-16 的
               居中大块，在「没有事件」时占了整个下半屏的四成面积，说的却只是
               没有事件。真正的信号（重启次数）在右边的条形图里。 -->
          <div
            v-if="recentActivity.length === 0"
            class="flex items-center gap-2 py-3 text-sm text-muted-foreground"
          >
            <Inbox :size="16" :stroke-width="1.75" aria-hidden="true" />
            {{ t('dashboard.recentActivityEmpty') }}
          </div>
          <ol v-else class="space-y-1.5">
            <li
              v-for="(item, i) in recentActivity"
              :key="i"
              class="flex items-start gap-3 text-sm py-1"
            >
              <span
                class="shrink-0 w-5 flex justify-center pt-1.5"
                aria-hidden="true"
              >
                <span
                  class="block size-1.5 rounded-full"
                  :class="item.icon === 'warn' ? 'bg-warning' : 'bg-muted-foreground/40'"
                />
              </span>
              <span class="shrink-0 text-xs text-muted-foreground w-16 tabular-nums">{{ item.time }}</span>
              <!--
                这是事件的 reason，和事件页那枚是同一个词。事件页那枚可以
                点开看解释，这枚不能——同样的外观、不同的行为，读者只能
                靠试才知道哪个能点。统一走 ReasonChip。
              -->
              <ReasonChip
                :term="item.label"
                :context="item.pod"
                size="xs"
                tone="neutral"
                class="shrink-0 font-mono text-foreground"
              />
              <span class="flex-1 min-w-0 truncate font-mono text-xs">{{ item.pod }}</span>
            </li>
          </ol>
        </CardContent>
      </Card>

      <!-- Top noisy (1/3 width on lg) -->
      <Card class="p-0">
        <CardContent class="p-4">
          <h2 class="text-sm font-semibold mb-3 flex items-center gap-2">
            <AlertTriangle :size="16" :stroke-width="1.75" />
            {{ t('dashboard.frequentRestarts') }}
          </h2>
          <EmptyState
            v-if="noisyRestarts.length === 0"
            :title="t('dashboard.frequentRestartsEmpty')"
          />
          <RestartList v-else :items="noisyRestarts" />
        </CardContent>
      </Card>
    </div>

  </div>
</template>
