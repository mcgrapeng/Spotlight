<script setup lang="ts">
import { computed, onMounted, ref, watch } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { useI18n } from 'vue-i18n'
import { ArrowLeft, RefreshCw, Bot, AlertCircle, AlertTriangle, Clock, Star, Search } from '@lucide/vue'
import { toast } from 'vue-sonner'
import { podsApi, eventsApi, favoritesApi } from '@/api/endpoints'
import { useClusterStore } from '@/stores/cluster'
import { useRelativeTime } from '@/composables/useRelativeTime'
import { usePodLogs } from '@/composables/usePodLogs'
import { useResource } from '@/composables/useResource'
import PageHeader from '@/components/common/PageHeader.vue'
import { Button } from '@/components/ui/button'
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui/tabs'
import { Card, CardContent } from '@/components/ui/card'
import PodStatusPill from '@/components/pod/PodStatusPill.vue'
import LogViewer from '@/components/log/LogViewer.vue'
import { useAiStore } from '@/stores/ai'
import LoadingState from '@/components/common/LoadingState.vue'
import ErrorState from '@/components/common/ErrorState.vue'
import EmptyState from '@/components/common/EmptyState.vue'
import StatusChip from '@/components/common/StatusChip.vue'
import ReasonChip from '@/components/common/ReasonChip.vue'
import { workloadPrefix } from '@/lib/podName'
import { cn } from '@/lib/utils'
import { containerDotClass, containerTone, podTone } from '@/lib/container'
import { restartTextClass } from '@/lib/restart'
import dayjs from '@/utils/dayjs'
import type { PodOut, LogLineOut, EventOut } from '@/api/types'

const { formatRel } = useRelativeTime()

const route = useRoute()
const router = useRouter()
const cluster = useClusterStore()
const { t } = useI18n()
const tab = ref('logs')
const logsTabActive = ref(tab.value === 'logs')

/**
 * 事实条上那个 n/n —— 数的是「没坏的容器」，不是 `c.ready`。
 *
 * `c.ready` 是 K8s 的瞬时快照：容器正在 crash loop 而 ready 还没翻转
 * 的那一段时间里，ready 仍是 true。于是这个数字会说「1/1 都好」，
 * 而同一屏的状态点是红的、标题区的芯片是「CrashLoopBackOff」——
 * 三个数互相打架。现在它们数的是同一件事（containerTone）。
 */
const healthyContainers = computed(
  () => (pod.value?.containers ?? []).filter((c) => containerTone(c) === 'success').length,
)

/** 容器状态点，和 Pods 表格里的圆点用同一套判定。 */
function containerDot(c: { ready?: boolean; state?: string; reason?: string | null }): string {
  return containerDotClass(c)
}

/**
 * 真正坏掉的容器。
 *
 * phase 会撒谎：一个 CrashLoopBackOff 的 Pod，phase 仍然是 Running
 * （Pod 本身没退出循环，是里面的容器在循环）。所以详情页不能只显示
 * phase —— 那是读者被总览页指过来之后唯一能看到的真相，而这个界面
 * 必须告诉他「哪儿坏了」。判定复用 lib/container.ts 的那份，Pods
 * 表格的圆点用的是同一个函数，两边不会给出相反的答案。
 */
const brokenContainers = computed(
  () => (pod.value?.containers ?? []).filter((c) => containerTone(c) === 'error'),
)

/** Pod 级 reason（Evicted / NodeAffinity 之类）。和容器 reason 是两回事。 */
const podReason = computed(() => pod.value?.reason ?? null)

/**
 * 标题区的判定：容器坏了就说容器的原因，没坏就说 phase。
 *
 * 原因值原样显示（CrashLoopBackOff / ImagePullBackOff / OOMKilled…）——
 * 它们是 K8s API 字段值，读者要能拿去敲 kubectl，和事件页的 reason
 * 同一个处理。
 *
 * 标签只用原因，不带容器名：390px 上「redis · CrashLoopBackOff」是
 * 165px，加上两个 40px 的按钮就把标题挤成 0 宽（实测过）。哪个容器
 * 坏了由事实条的容器组说（它紧挨着「容器 ● 1/2」），两处各说一件事。
 */
const verdictLabel = computed(() => brokenContainers.value[0]?.reason ?? null)

/**
 * 标题区胶囊的色调：与 Pod 列表的状态列**同一个**判定。
 *
 * 之前这里只看「有没有容器坏了」，于是「在跑但没就绪」的 Pod 在列表里
 * 是琥珀、在详情页是绿色——同一个 Pod 两个颜色。凌晨三点从列表点进详情，
 * 第一眼看到的是绿色「运行中」。
 */
const verdictTone = computed(() => podTone(pod.value?.containers ?? []))

/**
 * 容器状态的读屏文本：每个容器的名字 + 状态 + 原因。
 *
 * 之前那一组状态点是 aria-hidden 的，读屏只会念出「容器 1/1」——
 * 一个正在 crash loop 的容器被读成一个健康容器。格式和 Pods 表格
 * 那一行的 title 一致（`name: waiting (ImagePullBackOff)`）。
 */
const containerStateLabel = computed(() =>
  (pod.value?.containers ?? [])
    .map((c) => `${c.name}: ${c.state}${c.reason ? ` (${c.reason})` : ''}`)
    .join('; '),
)

/** Map a container's K8s state/reason to a phase pill. Never label a
 *  CrashLoopBackOff / ImagePullBackOff container as "Pending". */
function containerPhase(c: { state: string; ready?: boolean; reason?: string | null }): string {
  if (c.state === 'running') return 'Running'
  if (c.state === 'terminated') {
    return (c.reason ?? '') === 'Completed' ? 'Succeeded' : 'Failed'
  }
  if (c.state === 'waiting') {
    const r = (c.reason ?? '').toLowerCase()
    const failed = r.includes('backoff') || r.includes('imagepull') || r.includes('errimage') || r.includes('error')
    return failed ? 'Failed' : 'Pending'
  }
  return 'Unknown'
}

// ponytail: 重启次数的颜色走共享的阶梯（@/lib/restart）。它只给琥珀和
// 中性两种 —— 一个重启了 21,320 次的 Pod 仍然是 Running，它没有失败，
// 它只是需要人看一眼。之前最高档穿的是 error 红，于是同一个数字在
// 仪表盘 hero 是琥珀、在重启条是红、在这一条事实条上还是红。
const restartTone = restartTextClass

const name = computed(() => String(route.params.name ?? ''))
const namespace = computed(() => String(route.params.namespace ?? cluster.activeNamespace))

const logStreaming = ref(true)
const logUnread = ref(0)

// AI 分析：打开全局共享的面板（同一个组件，命令行面板和 Pod 详情页都用它）。
// 之前这里是独立的一套 analyze/loading/result 三件套加一个自己的抽屉，
// 于是「AI 会思考」这件事在两个地方各长了一套实现，而全局入口根本不存在。
const ai = useAiStore()

function openAIAnalyzer() {
  ai.openAnalyze({
    namespace: namespace.value,
    name: name.value,
    logContent: filteredLogsForAI.value.map((l) => l.content).join('\n'),
  })
}

// Shared auto-follow ref: usePodLogs reads it to decide whether new SSE
// lines are prepended or held back; LogViewer reads/writes it for the pill
// toggle and scroll-to-top detection. A single ref is the source of truth.
const logAutoFollow = ref(true)

const { lines: logLines, unreadCount, error: logError, errorPermission: logErrorPermission, start: logStart } = usePodLogs({
  cluster, namespace, name, enabled: logsTabActive,
  streaming: logStreaming,
  autoFollow: logAutoFollow,
})

const filteredLogsForAI = ref<readonly LogLineOut[]>([])
// Keep logUnread in sync with composable (it owns the count via SSR appends).
// Module-level watch (not onMounted) so it survives HMR and the page-load
// race between component setup and log stream startup.
watch(unreadCount, (v) => { logUnread.value = v }, { immediate: true })

// ── 收藏 ──────────────────────────────────────────────────────────────────
// 收藏夹以前只能看不能加：POST /favorites 全仓没有调用方，
// 空状态却让人「去 Pod 详情页添加」——而那里根本没有收藏按钮。
const favoriteId = ref<number | null>(null)
const favBusy = ref(false)
// The id belongs to the pod that is on screen. A list reply that arrives
// after the user moved to another pod must not write over the new pod's
// state — and the star must never offer "remove" for a favourite of a pod
// that is no longer shown.
let favSeq = 0

async function syncFavorite() {
  const p = pod.value
  if (!p) return
  const mySeq = ++favSeq
  favBusy.value = true
  try {
    const favs = await favoritesApi.list()
    if (mySeq !== favSeq) return
    // A favourite is cluster-scoped: `default/nginx` exists in nearly every
    // cluster, so matching on the name alone would show pod B's star as
    // "favourited" and the next click would delete pod A's favourite.
    const targetCluster = cluster.activeCluster ?? ''
    favoriteId.value = favs.find(
      (f) => f.resource_type === 'pod' && f.name === p.name
        && f.namespace === p.namespace && f.cluster === targetCluster,
    )?.id ?? null
  } catch {
    if (mySeq === favSeq) favoriteId.value = null
  } finally {
    if (mySeq === favSeq) favBusy.value = false
  }
}

async function toggleFavorite() {
  const p = pod.value
  if (!p || favBusy.value) return
  favBusy.value = true
  try {
    if (favoriteId.value !== null) {
      await favoritesApi.remove(favoriteId.value)
      favoriteId.value = null
      toast.success(t('toast.favoriteDeleted'))
    } else {
      const created = await favoritesApi.add({
        resource_type: 'pod', name: p.name, namespace: p.namespace,
        cluster: cluster.activeCluster ?? '', note: '',
      })
      favoriteId.value = created.id
      toast.success(t('toast.favoriteAdded', { name: p.name }))
    }
  } catch (e: any) {
    toast.error(e?.response?.data?.detail ?? t('state.error'))
  } finally {
    favBusy.value = false
  }
}

// Ponytail: 把 load() + onMounted + name/namespace watch 替换成 useResource。
const { data: pod, loading, error, errorStatus, reload: load } = useResource<PodOut>(
  () => podsApi.get(cluster.activeCluster!, namespace.value, name.value),
  {
    watch: () => [name.value, namespace.value],
    skip: () => !name.value,
  },
)

// 404 = 「它没了」，不是「加载失败」。两者的出路不一样：重试对前者
// 永远不会成功。
const notFound = computed(() => errorStatus.value === 404)

// The star reflects whether THIS pod is already in the caller's favorites.
// The previous pod's id has to go first: it belongs to a favourite of a
// pod that is no longer on screen, and clicking the star would delete it.
watch(pod, () => {
  favoriteId.value = null
  void syncFavorite()
}, { immediate: true })

// Pod events fetched lazily on tab switch. Separate resource so switching to
// Events tab triggers a fetch (not blocked by the pod fetch).
const podNs = computed(() => pod.value?.namespace ?? namespace.value)
const {
  data: podEventsRaw,
  loading: podEventsLoading,
} = useResource<EventOut[]>(
  () => eventsApi.list({
    cluster: cluster.activeCluster, namespace: podNs.value, limit: 200,
  }).then((all) => all.filter(e =>
    e.involved_kind === 'Pod' && e.involved_name === pod.value?.name,
  )),
  { watch: () => [podNs.value, pod.value?.name], skip: () => !podNs.value || !pod.value },
)
const podEvents = computed(() => podEventsRaw.value ?? [])

watch(tab, (v) => {
  logsTabActive.value = v === 'logs'
  // Coming back to the Logs tab means the user is looking — reset unread pill.
  if (v === 'logs') logUnread.value = 0
})
function back() { router.push({ name: 'pods' }) }

/**
 * 已删掉的 Pod：按「工作负载名」回列表搜。
 *
 * ReplicaSet 滚动会换掉名字里的哈希后缀（…-85598c7564-fvq7l 变成
 * …-566b6cf577-d6zhl）。旧书签 404 时，读者要找的是那个服务，不是那个
 * 已经消失的名字 —— 按前缀搜得到重建后的 Pod。
 */
function searchByName() {
  router.push({ name: 'pods', query: { search: workloadPrefix(name.value) } })
}
</script>

<template>
  <LoadingState v-if="loading && !pod" />
  <!--
    404 是另一种状态：不是「加载失败」，是「它没了」。
    重试复活不了被删掉或被重建的 Pod，而「只有重试」把读者留在死胡同里
    —— 凌晨三点拿着旧书签的人，此刻需要的是「回到列表」和「按名字找
    到重建后的那个」。
  -->
  <ErrorState
    v-else-if="error"
    :title="notFound ? t('pod.notFoundTitle') : undefined"
    :message="notFound ? t('pod.notFoundMessage') : error"
    :retryable="!notFound"
    @retry="load"
  >
    <template v-if="notFound" #actions>
      <div class="flex flex-wrap items-center justify-center gap-2 mb-4">
        <Button variant="outline" size="sm" @click="back">
          <ArrowLeft :size="14" :stroke-width="1.75" class="mr-1" />
          {{ t('pod.backToPods') }}
        </Button>
        <Button variant="outline" size="sm" @click="searchByName">
          <Search :size="14" :stroke-width="1.75" class="mr-1" />
          {{ t('pod.notFoundSearch') }}
        </Button>
      </div>
    </template>
  </ErrorState>
  <!--
    ponytail: log-first 布局。
    之前这个页面是 2 栏 + 日志框 h-[60vh] min-h-[400px]：6 行日志时底下空 400px，
    5000 行时刚好，而且 AI 分析按钮被挤在日志工具栏右侧像是断开的。
    现在页面自己撑满视口高度，日志区吃掉全部剩余高度，元数据收成一条事实条。
  -->
  <div
    v-else-if="pod"
    class="flex flex-col"
    :style="{ height: 'calc(100dvh - var(--app-chrome-h))' }"
  >
    <div class="flex items-center mb-1 -ml-2 shrink-0">
      <Button variant="ghost" size="sm" @click="back">
        <ArrowLeft :size="14" :stroke-width="1.75" class="mr-1" />
        {{ t('pod.backToPods') }}
      </Button>
    </div>

    <!--
      标题是身份串：等宽（DESIGN.md —— 字面量用等宽，读者要拿它敲
      kubectl），窄屏降一档 + 限两行。这个页面是 log-first 的：390px 下
      标题折 5 行，日志区就只剩 3 行 —— 标题区必须让位。
    -->
    <PageHeader
      :title="pod.name"
      :subtitle="`${pod.namespace} · ${pod.node || t('pod.unscheduled')}`"
      title-class="font-mono text-lg sm:text-2xl line-clamp-2"
      class="shrink-0"
    >
      <template #actions>
        <!--
          标题区只放一个状态元素，而且坏的时���它不是 phase。

          phase 会撒谎：一个 CrashLoopBackOff 的 Pod，phase 仍然是 Running。
          所以坏的时候显示判定（故障原因），不坏的时候才显示 phase ——
          标题区的右上角永远不会是「一片绿 + 真相在两行之下」。

          标签只用原因，不带容器名：390px 上「redis · CrashLoopBackOff」
          是 165px，加上两个 40px 的按钮就把标题挤成 0 宽（实测过）。
          哪个容器坏了由事实条的容器组说（它紧挨着「容器 ● 1/2」），
          两处各说一件事，不重复。
        -->
        <ReasonChip
          v-if="verdictLabel"
          :term="verdictLabel"
          tone="error"
          size="sm"
          class="mr-2"
        />
        <PodStatusPill
          v-else
          :phase="pod.phase"
          :tone-override="verdictTone"
          class="mr-2"
        />
        <Button
          variant="outline" size="sm" :disabled="favBusy" @click="toggleFavorite"
          :aria-label="favoriteId !== null ? t('pod.unfavorite') : t('pod.favorite')"
        >
          <template #icon>
            <Star
              :size="14" :stroke-width="1.75"
              :class="favoriteId !== null ? 'fill-current text-warning-foreground' : ''"
            />
          </template>
        </Button>
        <Button variant="outline" size="sm" @click="load" :loading="loading" :aria-label="t('pod.refresh')">
          <template #icon>
            <RefreshCw :size="14" :stroke-width="1.75" />
          </template>
        </Button>
      </template>
    </PageHeader>

    <!-- 事实条：重启次数 / 存在时间 / IP 这些关键事实之前全被收在默认折叠的
         「元数据」面板里，标题区只有 namespace · node。现在常驻一行。 -->
    <div class="flex flex-wrap items-center gap-x-5 gap-y-1 py-2.5 border-y border-border shrink-0 text-xs">
      <div class="flex items-baseline gap-1.5">
        <span class="text-muted-foreground">{{ t('pod.metaRestarts') }}</span>
        <span
          class="font-medium tabular-nums"
          :class="restartTone(pod.restart_count)"
        >{{ pod.restart_count.toLocaleString() }}</span>
      </div>
      <div class="flex items-baseline gap-1.5">
        <span class="text-muted-foreground">{{ t('pod.metaAge') }}</span>
        <span class="font-medium text-foreground">{{ pod.age || '—' }}</span>
      </div>
      <div class="flex items-baseline gap-1.5">
        <span class="text-muted-foreground">{{ t('pod.metaIp') }}</span>
        <span class="font-mono text-foreground">{{ pod.pod_ip || '—' }}</span>
      </div>
      <div v-if="pod.owner_kind" class="flex items-baseline gap-1.5 min-w-0">
        <span class="text-muted-foreground">{{ t('pod.metaOwner') }}</span>
        <span class="font-mono text-foreground truncate">{{ pod.owner_kind }}/{{ pod.owner_name }}</span>
      </div>
      <!-- 容器降级到事实条上的一个概况（几个状态点 + n/n）。
           之前容器独占左边 280px 一栏，日志被挤得看不全；
           逐个容器的镜像 / 状态 / reason 挪到「详情」页签里。
           那组状态点原来是 aria-hidden 的，读屏只会念「容器 1/1」——
           一个正在 crash loop 的容器被读成一个健康的。现在整组给一个
           名字（role=img + aria-label），状态和原因一起念出来。 -->
      <div class="flex items-baseline gap-1.5">
        <span class="text-muted-foreground">{{ t('pod.metaContainers') }}</span>
        <span class="flex items-center gap-1.5">
          <span role="img" :aria-label="containerStateLabel" class="flex items-center gap-1">
            <span
              v-for="c in pod.containers"
              :key="c.name"
              class="block size-1.5 rounded-full"
              :class="containerDot(c)"
              :title="`${c.name}: ${c.state}${c.reason ? ` (${c.reason})` : ''}`"
            />
          </span>
          <span
            class="font-mono tabular-nums font-medium"
            :class="brokenContainers.length ? 'text-error' : ''"
          >{{ healthyContainers }}/{{ pod.containers.length }}</span>
        </span>
      </div>
      <!--
        判定在标题区（右上角）。这里只留两件事：
        容器组（「容器 ● 1/2」+ 每个容器的名字和原因），以及 Pod 自己的
        reason（Evicted / NodeAffinity 之类）—— 它是 Pod 层面的事实，
        和容器的原因不是一回事，两个都坏的时候两个都要说。
        两处不重复同一个字符串：标题区说「坏了、什么原因」，这里说
        「几个容器、哪个容器、Pod 自己怎么了」。
      -->
      <ReasonChip
        v-if="podReason"
        :term="podReason"
        tone="error"
        size="xs"
      />
    </div>

    <div class="flex-1 min-h-0 mt-4 flex flex-col">
        <Tabs v-model="tab" class="w-full flex-1 min-h-0 flex flex-col">
          <TabsList class="self-start">
            <TabsTrigger value="logs">{{ t('pod.tabLogs') }}</TabsTrigger>
            <TabsTrigger value="events">{{ t('pod.tabEvents') }}</TabsTrigger>
            <TabsTrigger value="details">{{ t('pod.tabDetails') }}</TabsTrigger>
          </TabsList>

          <TabsContent value="logs" class="mt-2 flex-1 min-h-0 flex flex-col">
            <div class="flex items-center justify-between mb-2 shrink-0">
              <h2 class="text-sm font-semibold">{{ t('pod.containerLogs') }}</h2>
              <Button variant="outline" size="sm" @click="openAIAnalyzer">
                <Bot :size="14" :stroke-width="1.75" class="mr-1" />
                {{ t('pod.aiAnalyze') }}
              </Button>
            </div>
            <!-- 日志区吃掉全部剩余高度：6 行时下面没有空洞，5000 行时也不用滚外层。 -->
            <div class="flex-1 min-h-0">
              <LogViewer
                :lines="logLines"
                v-model:streaming="logStreaming"
                v-model:auto-follow="logAutoFollow"
                :unread-count="logUnread"
                :containers="pod.containers.map(c => c.name)"
                :pod-name="name"
                :namespace="namespace"
                :error="logError"
                :error-permission="logErrorPermission"
                @update:filtered="filteredLogsForAI = $event"
                @clear="logLines = []"
                @consume-unread="logUnread = 0"
                @retry="logStart"
              />
            </div>
          </TabsContent>

          <TabsContent value="events" class="mt-2 flex-1 min-h-0 overflow-y-auto">
            <LoadingState v-if="podEventsLoading && podEvents.length === 0" :message="t('pod.loadingEvents')" />
            <EmptyState
              v-else-if="!podEventsLoading && podEvents.length === 0"
              :title="t('pod.noEventsTitle')"
              :description="t('pod.noEventsDescription')"
            />
            <div v-else class="space-y-2">
              <div
                v-for="ev in podEvents"
                :key="ev.name"
                class="flex items-start gap-3 p-3 rounded-card border border-border bg-card"
              >
                <component
                  :is="ev.type === 'Warning' ? AlertTriangle : AlertCircle"
                  :size="14"
                  :stroke-width="1.75"
                  :class="cn('shrink-0 mt-0.5', ev.type === 'Warning' ? 'text-warning' : 'text-muted-foreground')"
                />
                <div class="flex-1 min-w-0">
                  <div class="flex items-center gap-2 flex-wrap text-sm">
                    <StatusChip
                      :tone="ev.type === 'Warning' ? 'warning' : 'neutral'"
                      :label="t(`eventType.${ev.type}`, ev.type)"
                      size="xs"
                    />
                    <ReasonChip
                      :term="ev.reason"
                      :context="ev.involved_name"
                      size="xs"
                      tone="neutral"
                      class="font-mono text-foreground"
                    />
                  </div>
                  <p class="text-sm text-muted-foreground mt-1">{{ ev.message }}</p>
                  <div class="text-xs text-muted-foreground mt-1 flex gap-3">
                    <span :title="ev.last_seen ?? undefined">
                      <Clock :size="12" class="inline -mt-0.5" :stroke-width="1.75" />
                      {{ formatRel(ev.last_seen ?? null) }}
                    </span>
                    <span>×{{ ev.count }}</span>
                  </div>
                </div>
              </div>
            </div>
          </TabsContent>

          <!-- 详情：逐个容器的镜像 / 状态 / reason，以及事实条上放不下的字段。 -->
          <TabsContent value="details" class="mt-2 flex-1 min-h-0 overflow-y-auto">
            <Card class="p-0">
              <CardContent class="p-4">
                <h2 class="text-sm font-semibold mb-3">{{ t('pod.containers', { count: pod.containers.length }) }}</h2>
                <div class="space-y-2">
                  <div
                    v-for="c in pod.containers"
                    :key="c.name"
                    class="flex items-center justify-between gap-3 p-2 rounded-md border border-border"
                  >
                    <div class="min-w-0 flex-1">
                      <div class="font-mono text-xs font-medium truncate">{{ c.name }}</div>
                      <!-- 只留镜像名。reason 由右边的芯片说（带解释），
                           两处都写同一个串，读者会以为是两件事。 -->
                      <div class="text-xs text-muted-foreground truncate">
                        {{ c.image }}
                      </div>
                    </div>
                    <div class="flex items-center gap-1.5 shrink-0">
                      <!-- 坏掉的容器：reason 用 error 芯片，别再塞在灰字里 ——
                           读者来这个页签就是为了知道哪个容器坏了、为什么。
                           芯片本身可点开术语解释。 -->
                      <ReasonChip
                        v-if="containerTone(c) === 'error'"
                        :term="c.reason ?? c.state"
                        :context="c.name"
                        tone="error"
                        size="xs"
                      />
                      <PodStatusPill :phase="containerPhase(c)" />
                    </div>
                  </div>
                </div>

                <div class="mt-4 pt-4 border-t border-border grid grid-cols-1 sm:grid-cols-2 gap-x-6 gap-y-3">
                  <div class="flex items-baseline gap-2 text-sm">
                    <span class="text-muted-foreground text-xs w-20 shrink-0">{{ t('pod.metaNamespace') }}</span>
                    <span class="font-mono text-foreground truncate">{{ pod.namespace }}</span>
                  </div>
                  <div class="flex items-baseline gap-2 text-sm">
                    <span class="text-muted-foreground text-xs w-20 shrink-0">{{ t('pod.metaNode') }}</span>
                    <span class="font-mono text-foreground truncate">{{ pod.node || '—' }}</span>
                  </div>
                  <div class="flex items-baseline gap-2 text-sm">
                    <span class="text-muted-foreground text-xs w-20 shrink-0">{{ t('pod.metaIp') }}</span>
                    <span class="font-mono text-foreground truncate">{{ pod.pod_ip || '—' }}</span>
                  </div>
                  <div v-if="pod.owner_kind" class="flex items-baseline gap-2 text-sm min-w-0">
                    <span class="text-muted-foreground text-xs w-20 shrink-0">{{ t('pod.metaOwner') }}</span>
                    <span class="font-mono text-foreground truncate">{{ pod.owner_kind }}/{{ pod.owner_name }}</span>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
    </div>

  </div>
</template>
