<script setup lang="ts">
import { computed, ref, watch } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { useI18n } from 'vue-i18n'
import { Search, RefreshCw, AlertTriangle, ChevronLeft, ChevronRight, Info, X } from '@lucide/vue'
import PageHeader from '@/components/common/PageHeader.vue'
import LoadingState from '@/components/common/LoadingState.vue'
import ErrorState from '@/components/common/ErrorState.vue'
import EmptyState from '@/components/common/EmptyState.vue'
import PermissionDenied from '@/components/common/PermissionDenied.vue'
import PodStatusPill from '@/components/pod/PodStatusPill.vue'
import { AlertCircle } from '@lucide/vue'
import ReasonChip from '@/components/common/ReasonChip.vue'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import { Card } from '@/components/ui/card'
import AppSelect from '@/components/ui/AppSelect.vue'
import { cn } from '@/lib/utils'
import { containerDotClass, containerStateText, containerTone, podTone } from '@/lib/container'
import type { ChipTone } from '@/lib/chip'
import { restartTone } from '@/lib/restart'
import { usePodList } from '@/composables/usePodList'
import { useClusterStore } from '@/stores/cluster'
import { usePagination } from '@/composables/usePagination'
import { usePodSorting, DENSITY_CLASSES, type PodDensity, type PodSortKey, type SortDir } from '@/composables/usePodSorting'
import SortableHeader from '@/components/common/SortableHeader.vue'
import DensityToggle from '@/components/common/DensityToggle.vue'
import { STORAGE_KEYS } from '@/storage-keys'
import type { PodOut } from '@/api/types'

const route = useRoute()
const router = useRouter()
const cluster = useClusterStore()
const { t } = useI18n()

const search = ref<string>((route.query.search as string) || '')

// ponytail: 用 computed + setter 双向同步 ?status= ... (Dashboard action items 跳转场景)。
// 避免双向 watch 写法：Vue Router 4 把 query 中 undefined 当字符串 'undefined' 保留，
// 必须显式 delete 才会真正清除。
const VALID_STATUSES = new Set(['Running', 'Pending', 'Failed', 'Succeeded'])
const statusFilter = computed<string>({
  get() {
    const v = route.query.status as string | undefined
    if (v && VALID_STATUSES.has(v)) return v
    return 'all'
  },
  set(v) {
    const newQuery = { ...route.query }
    if (v === 'all') {
      delete newQuery.status
    } else {
      newQuery.status = v
    }
    router.replace({ query: newQuery })
  },
})

const { data, loading, error, errorStatus, errorPermission, reload } = usePodList({
  cluster: computed(() => cluster.activeCluster),
  namespace: computed(() => cluster.activeNamespace),
  status: statusFilter,
  search,
})

/**
 * 没权限读 Pod 列表，是一种状态，不是「这里是空的」。
 *
 * 「0 个 Pod」是关于集群的**假事实**——它会让值班的人以为集群是空的，
 * 转头去做别的检查。所以副标题也不能写「0 个」。
 */
const permissionDenied = computed(() => errorStatus.value === 403)

const LARGE_LIST_THRESHOLD = 500

const pageSizeOptions = [10, 20, 50, 100].map((n) => ({ value: n, label: String(n) }))

// ponytail: phase 名并列一次中文和英文。phase 是 K8s API 的字段值，kubectl
// 打印的就是 Running / Pending / Failed / Succeeded，值班的人同时盯着两个
// 面板，术语对不上是真实的认知成本；但全中文又让他在 kubectl 里找不到词。
const statusOptions = computed(() => [
  { value: 'all', label: t('pods.filterAll') },
  { value: 'Running',   label: t('phase.Running') },
  { value: 'Pending',   label: t('phase.Pending') },
  { value: 'Failed',    label: t('phase.Failed') },
  { value: 'Succeeded', label: t('phase.Succeeded') },
])

const subtitle = computed(() => {
  if (permissionDenied.value) return t('pods.subtitleDenied')
  const ns = cluster.activeNamespace === '_all'
    ? t('namespace.all')
    : cluster.activeNamespace
  return t('pods.subtitle', { count: data.value.total.toLocaleString(), namespace: ns })
})

// ponytail: per-row helpers memoized in two Map<string, ...> lookups keyed by
// "namespace/name". Previous version called restartSeverity(row) up to 4
// times per row inside the template — for 100 rows × 4 = 400 calls/render.
// Now: 2 calls per row in computed, 0 in template.
/**
 * 状态列的色调：容器的判定优先于 phase。
 *
 * phase=Running 的 Pod 可能一塌糊涂——就绪探针挂了 62 天，它照样是
 * Running（K8s 的 phase 只说「至少一个容器在跑」）。凌晨三点扫这一列
 * 是最高频的动作，它必须承载判定，而不是字段。
 *
 * 最坏优先：任何容器坏了就是红的；只是没就绪是琥珀；全好才用 phase
 * 自己的颜色。
 */
function statusTone(p: PodOut): ChipTone | undefined {
  return podTone(p.containers ?? [])
}

// ponytail: 「几个容器是好的」和「这个容器坏了」必须用同一套判定。
//
// 之前这里数的是 `c.ready`，而状态点用的是 containerTone。于是一个
// ready 还没翻转但 reason 已经是 CrashLoopBackOff 的容器，会得到
// 「1/1 就绪」加一个红点 —— 同一行里两个答案。
//
// 现在两个都走 containerTone：状态点说坏，它就真的是坏的。
function readyOf(p: PodOut) {
  return p.containers.filter(c => containerTone(c) === 'success').length
}
// ponytail: the ladder lives in @/lib/restart so the table and the
// dashboard's restart bars agree. They used different thresholds (5/100
// versus 10/100/1000), so the same pod read as amber in one place and grey
// in the other.
//
// Two steps, not three: a restart count is either worth a look or it is
// not. It is never a *failure* — the phase column says whether the pod
// failed, and a pod with 21,320 restarts is still Running. So the cell
// wears amber, not red, and the tier only decides whether it says anything
// at all.
function restartSeverity(p: PodOut): 'attention' | 'normal' {
  return restartTone(p.restart_count) === 'warning' ? 'attention' : 'normal'
}
function nodeShort(p: PodOut) { return p.node ? p.node.split('.')[0] : null }

const PHASE_TONE: Record<string, string> = {
  Running:   'hover:bg-success/5',
  // ponytail: 琥珀色专供「需要处理」。Pending 是「在等调度」，集群的正常
  // 状态 —— 把它染成琥珀等于把「没出故障」说成「需要注意」。这一行以前
  // 是 hover:bg-warning/5。
  Pending:   'hover:bg-muted/40',
  Failed:    'bg-error/5 hover:bg-error/10',
  Succeeded: 'hover:bg-muted/40',
  Unknown:   'hover:bg-muted/40',
}
function rowClass(p: PodOut) {
  return PHASE_TONE[p.phase] ?? 'hover:bg-muted/40'
}

const severityMap = computed(() => {
  const m = new Map<string, 'attention' | 'normal'>()
  for (const p of data.value.items) m.set(`${p.namespace}/${p.name}`, restartSeverity(p))
  return m
})
const rowClassMap = computed(() => {
  const m = new Map<string, string>()
  for (const p of data.value.items) m.set(`${p.namespace}/${p.name}`, rowClass(p))
  return m
})
function sevOf(p: PodOut) { return severityMap.value.get(`${p.namespace}/${p.name}`) ?? 'normal' }
function clsOf(p: PodOut) { return rowClassMap.value.get(`${p.namespace}/${p.name}`) ?? 'hover:bg-muted/40' }

function open(p: PodOut) {
  router.push({ name: 'pod-detail', params: { namespace: p.namespace, name: p.name } })
}

const pageSize = ref(20)

/**
 * 只看待处理：坏了的 + 要人看一眼的。
 *
 * 状态筛选（phase）是服务端的，这个是客户端的 —— 判定（podTone）只在
 * 前端有。289 个 Pod 里 273 个是 Running，筛「失败」得 0 条，而真正
 * 该看的那个就在 Running 里：值班的人要按判定筛，不是按字段筛。
 */
const attentionOnly = ref(false)

/** 判定是 error 或 warning 的才算「待处理」。 */
function needsAttention(p: PodOut): boolean {
  const tone = podTone(p.containers ?? [])
  return tone === 'error' || tone === 'warning'
}

const { page, totalPages } = usePagination({
  totalItems: computed(() => data.value.items.length),
  pageSize,
  resetKey: computed(() => data.value.items),
})

// ponytail: 排序 + 密度。
// 排序：这张表之前一个能排序的列都没有，而 on-call 的第一个动作就是
// 「按重启次数倒序找罪魁」。默认按名称升序（可预期），点「重启」即按
// 次数倒序 —— 数字列第一次点击就用「大的在前」，小的在前没有意义。
//
// 排序键进 URL（?sort=restarts&dir=desc）：仪表盘那个「去看看」指着
// 「3 个 Pod 频繁重启」，点过去如果还是按名字排的 287 个 Pod，这个承诺
// 就没有兑现 —— 读者得自己再点一次表头才知道要看哪一列。
const VALID_SORTS = new Set<PodSortKey>([
  'name', 'namespace', 'phase', 'containers', 'restarts', 'node', 'age',
])
const querySort = computed<PodSortKey>(() => {
  const v = route.query.sort as string | undefined
  return v && VALID_SORTS.has(v as PodSortKey) ? (v as PodSortKey) : 'name'
})
const queryDir = computed<SortDir>(() => (route.query.dir === 'desc' ? 'desc' : 'asc'))

const { sortKey, sortDir, sorted, toggle, ariaSortFor } = usePodSorting(
  computed(() => data.value.items),
  { key: querySort.value, dir: queryDir.value },
)

// URL → 排序：链接带着 ?sort= 进来时，表格按那个排。组件不重新挂载
// （AppLayout 的 key 只看 path），所以这里要主动同步一次。
watch([querySort, queryDir], ([k, d]) => {
  if (k !== sortKey.value) sortKey.value = k
  if (d !== sortDir.value) sortDir.value = d
})

// 排序 → URL：排序是别人会复制粘贴的上下文，刷新和分享都该带着。
// 只在真的有差别时 replace，两个 watcher 才不会互相绕。
watch([sortKey, sortDir], ([k, d]) => {
  const isDefault = k === 'name' && d === 'asc'
  const q = { ...route.query }
  if (isDefault) {
    delete q.sort
    delete q.dir
  } else {
    q.sort = k
    q.dir = d
  }
  if (String(q.sort ?? '') === String(route.query.sort ?? '')
      && String(q.dir ?? '') === String(route.query.dir ?? '')) return
  router.replace({ query: q })
})

// 密度：默认行高是为「好看」定的，SRE 关心的是一屏能扫多少个 Pod。
const DENSITY_KEY = STORAGE_KEYS.podTableDensity
const density = ref<PodDensity>(
  (localStorage.getItem(DENSITY_KEY) as PodDensity | null) ?? 'standard',
)
watch(density, (v) => localStorage.setItem(DENSITY_KEY, v))
const densityClass = computed(() => DENSITY_CLASSES[density.value] ?? DENSITY_CLASSES.standard)
const densityLabels = computed(() => ({
  compact: t('pods.densityCompact'),
  standard: t('pods.densityStandard'),
  loose: t('pods.densityLoose'),
}))

const pagedPods = computed(() => {
  const start = (page.value - 1) * pageSize.value
  const source = attentionOnly.value ? sorted.value.filter(needsAttention) : sorted.value
  return source.slice(start, start + pageSize.value)
})

const filtered = computed(() => search.value !== '' || statusFilter.value !== 'all')

const emptyTitle = computed(() => {
  if (search.value) return t('pods.emptySearch', { query: search.value })
  if (statusFilter.value !== 'all') return t('pods.emptyStatus', { status: statusFilter.value })
  return t('pods.empty')
})

const emptyDescription = computed(() => {
  if (!filtered.value) return t('pods.emptyHint')
  const parts: string[] = []
  if (search.value) parts.push(t('pods.filterSearch', { query: search.value }))
  if (statusFilter.value !== 'all') {
    parts.push(t('pods.filterStatus', { status: statusFilter.value }))
  }
  return t('pods.emptyActiveFilters', { filters: parts.join(' + ') })
})
</script>

<template>
  <!--
    ponytail: 表格占满视口。
    之前表格卡在 40% 高度处就结束，下面 60% 是空灰底 —— 集群越空，这个
    空洞越明显，而那正是最需要「看起来正常」的场景。现在页面本身是视口
    高度的一列，表格吃掉剩余空间，滚动发生在表格内部，分页条常驻底部。
    移动端保持原来的整页滚动（md 以下不锁高度）。
  -->
  <div class="flex flex-col gap-5 md:h-[calc(100vh-var(--app-chrome-h))]">
    <PageHeader :title="t('route.pods')" :subtitle="subtitle">
      <template #actions>
        <Button variant="outline" size="sm" :loading="loading" @click="reload" :aria-label="t('pods.refresh')">
          <template #icon>
            <RefreshCw :size="14" :stroke-width="1.75" />
          </template>
          {{ t('pods.refresh') }}
        </Button>
      </template>
    </PageHeader>

    <!-- FilterBar -->
    <div class="flex items-center gap-3 flex-wrap" role="search" :aria-label="t('pods.filtersLabel')">
      <div class="w-44">
        <AppSelect
          v-model="statusFilter"
          :options="statusOptions"
          :aria-label="t('pods.filterByStatus')"
          class="w-full"
        />
      </div>
      <!-- 过滤按钮，不是标签页：aria-pressed（事件页筛选同款模式）。 -->
      <button
        type="button"
        :aria-pressed="attentionOnly"
        @click="attentionOnly = !attentionOnly"
        :class="cn(
          'inline-flex items-center gap-2 h-8 px-3 rounded-md border text-xs font-medium transition-colors ease-app dur-fast',
          attentionOnly
            ? 'bg-warning-bg text-warning border-warning-border'
            : 'bg-card text-muted-foreground border-border hover:text-foreground',
        )"
      >
        <AlertCircle :size="12" :stroke-width="2" aria-hidden="true" />
        {{ t('pods.attentionOnly') }}
      </button>
      <div class="relative flex-1 min-w-[240px] max-w-md">
        <Search :size="14" class="absolute left-2.5 top-3 text-muted-foreground" :stroke-width="1.75" />
        <Input
          v-model="search"
          :placeholder="t('pods.searchPlaceholder')"
          class="pl-8"
          :aria-label="t('pods.searchLabel')"
        />
      </div>
      <div class="ml-auto" role="group" :aria-label="t('pods.densityLabel')">
        <DensityToggle v-model="density" :labels="densityLabels" />
      </div>
    </div>

    <div v-if="search" class="flex items-center gap-2 -mt-2 mb-2">
      <span class="text-xs text-muted-foreground">{{ t('pods.filteringLabel') }}</span>
      <button
        type="button"
        class="inline-flex items-center gap-1.5 px-2 py-0.5 rounded-md bg-accent text-accent-foreground text-xs font-mono hover:bg-accent/80"
        @click="search = ''"
      >
        <span>"{{ search }}"</span>
        <X :size="12" :stroke-width="2.5" />
      </button>
      <span class="text-xs text-muted-foreground">{{ t('pods.resultCount', { count: data.items.length }) }}</span>
    </div>

    <!--
      ponytail: 大列表提示。
      /api/v1/pods 目前是全量返回、前端切片（分页器是假的），3000 Pod 的集群
      一次拉 3000 条 JSON、每次筛选全量重渲染。服务端分页要改接口契约，
      留到下一轮；在此之前，把这件事说出来，而不是让用户以为表格只加载了
      屏幕上这些。
    -->
    <p
      v-if="data.items.length > LARGE_LIST_THRESHOLD"
      class="text-xs text-muted-foreground flex items-center gap-1.5 -mt-2"
    >
      <Info :size="12" :stroke-width="1.75" class="shrink-0" aria-hidden="true" />
      {{ t('pods.largeListHint', { count: data.items.length.toLocaleString() }) }}
    </p>

    <!--
      权限不足是它自己的一种状态：没有重试按钮（重试不会授予权限），
      也不说「这里是空的」。
    -->
    <PermissionDenied
      v-if="permissionDenied"
      :permission="errorPermission"
      :subject="t('pods.subject')"
    />
    <ErrorState v-else-if="error" :message="error" @retry="reload" />

    <Card v-else class="p-0 overflow-hidden flex flex-col flex-1 min-h-0">
      <div
        v-if="!loading && data.items.length === 0"
        class="flex-1 flex items-center justify-center"
      >
      <EmptyState
        :title="emptyTitle"
        :description="emptyDescription"
      >
        <template v-if="filtered" #action>
          <Button variant="outline" size="sm" @click="search = ''; statusFilter = 'all'">
            {{ t('pods.clearFilters') }}
          </Button>
        </template>
      </EmptyState>
      </div>
      <!-- 桌面 / 大屏: 表格 -->
      <div v-else class="overflow-auto flex-1 min-h-0 hidden md:block">
        <table
          class="w-full"
          :class="cn(densityClass.text, loading && data.items.length > 0 && 'opacity-60 transition-opacity ease-app dur-base')"
        >
          <thead class="sticky top-0 z-10 bg-muted/60 border-b border-border text-xs tracking-wide text-muted-foreground backdrop-blur-sm">
            <tr>
              <th scope="col" class="text-left font-medium min-w-[240px]" :class="densityClass.head" :aria-sort="ariaSortFor('name')">
                <SortableHeader :label="t('pods.colName')" :active="sortKey === 'name'" :dir="sortDir" @toggle="toggle('name')" />
              </th>
              <th scope="col" class="text-left font-medium hidden lg:table-cell" :class="densityClass.head" :aria-sort="ariaSortFor('namespace')">
                <SortableHeader :label="t('pods.colNamespace')" :active="sortKey === 'namespace'" :dir="sortDir" @toggle="toggle('namespace')" />
              </th>
              <th scope="col" class="text-left font-medium w-[160px]" :class="densityClass.head" :aria-sort="ariaSortFor('phase')">
                <SortableHeader :label="t('pods.colStatus')" :active="sortKey === 'phase'" :dir="sortDir" @toggle="toggle('phase')" />
              </th>
              <th scope="col" class="text-left font-medium w-[110px]" :class="densityClass.head" :aria-sort="ariaSortFor('containers')">
                <SortableHeader :label="t('pods.colContainers')" :active="sortKey === 'containers'" :dir="sortDir" @toggle="toggle('containers')" />
              </th>
              <th scope="col" class="text-left font-medium w-[100px]" :class="densityClass.head" :aria-sort="ariaSortFor('restarts')">
                <SortableHeader :label="t('pods.colRestarts')" :active="sortKey === 'restarts'" :dir="sortDir" @toggle="toggle('restarts')" />
              </th>
              <th scope="col" class="text-left font-medium w-[140px] hidden lg:table-cell" :class="densityClass.head" :aria-sort="ariaSortFor('node')">
                <SortableHeader :label="t('pods.colNode')" :active="sortKey === 'node'" :dir="sortDir" @toggle="toggle('node')" />
              </th>
              <th scope="col" class="text-left font-medium w-[100px] whitespace-nowrap" :class="densityClass.head" :aria-sort="ariaSortFor('age')">
                <SortableHeader :label="t('pods.colAge')" :active="sortKey === 'age'" :dir="sortDir" @toggle="toggle('age')" />
              </th>
            </tr>
          </thead>
          <tbody>
            <tr
              v-for="row in pagedPods"
              :key="`${row.namespace}/${row.name}`"
              :style="{ contentVisibility: 'auto', containIntrinsicSize: `auto ${densityClass.intrinsic}` }"
              :class="cn(
                'border-b border-border last:border-0 cursor-pointer transition-colors ease-app dur-fast',
                'focus-visible:bg-muted/60 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-inset focus-visible:ring-offset-0',
                clsOf(row),
              )"
              tabindex="0"
              @click="open(row)"
              @keydown.enter="open(row)"
              @keydown.space.prevent="open(row)"
            >
              <td class=" min-w-0" :class="densityClass.cell">
                <div class="flex flex-col gap-0.5 min-w-0">
                  <router-link
                    :to="{ name: 'pod-detail', params: { namespace: row.namespace, name: row.name } }"
                    class="font-mono text-sm text-foreground truncate rounded-sm hover:underline focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-background"
                    :aria-label="t('pods.viewDetail', { name: row.name })"
                    @click.stop
                  >{{ row.name }}</router-link>
                  <span
                    v-if="row.owner_kind"
                    class="text-xs text-muted-foreground font-mono truncate"
                  >{{ row.owner_kind }}/{{ row.owner_name }}</span>
                </div>
              </td>
              <td class=" hidden lg:table-cell" :class="densityClass.cell">
                <!-- ponytail: nowrap —— 真实集群的命名空间普遍带连字符
                     （ai-app-test），芯片没有 nowrap 就会折成「ai-app-」
                     「test」两行，把行高撑开。 -->
                <span class="inline-flex items-center whitespace-nowrap rounded-md border border-border bg-muted/40 px-1.5 py-0.5 font-mono text-xs text-muted-foreground">
                  {{ row.namespace }}
                </span>
              </td>
              <td :class="densityClass.cell">
                <div class="flex items-center gap-2">
                  <PodStatusPill :phase="row.phase" :tone-override="statusTone(row)" />
                  <!--
                    Pod 级 reason（ContainersNotReady 等）。原来是一枚手写
                    芯片：rounded-sm / px-1.5 / font-semibold，和它旁边的
                    PodStatusPill（rounded-md / px-2 / font-medium）尺寸都对不上。
                    归到芯片系统，顺带拿到术语解释。
                  -->
                  <ReasonChip
                    v-if="row.reason"
                    :term="row.reason"
                    :context="row.name"
                    tone="error"
                    size="sm"
                  />
                </div>
              </td>
              <td :class="densityClass.cell">
                <div class="flex items-center gap-2">
                  <div
                    role="img"
                    class="flex items-center gap-1"
                    :aria-label="t('pods.containersReady', { ready: readyOf(row), total: row.containers.length })"
                  >
                    <span
                      v-for="(c, i) in row.containers"
                      :key="i"
                      :title="containerStateText(c, t('pods.containerReady'), t('pods.containerNotReady'))"
                      :class="cn(
                        'inline-block w-2 h-2 rounded-full',
                        containerDotClass(c),
                      )"
                    />
                  </div>
                  <span :class="cn(
                    'tabular-nums text-xs',
                    // ponytail: 一个还没起来的容器不是「需要注意」，是「还没
                    // 到」。数字用中性灰，绿只留给全部就绪。
                    readyOf(row) === row.containers.length ? 'text-success' : 'text-muted-foreground',
                  )">{{ readyOf(row) }}/{{ row.containers.length }}</span>
                </div>
              </td>
              <td :class="densityClass.cell">
                <div
                  v-if="row.restart_count > 0"
                  class="flex items-center gap-1 tabular-nums text-sm"
                  :aria-label="t('pods.restartsCount', { count: row.restart_count })"
                >
                  <AlertTriangle
                    v-if="sevOf(row) === 'attention'"
                    :size="12" class="text-warning shrink-0" :stroke-width="1.75"
                    aria-hidden="true"
                  />
                  <span :class="cn(
                    sevOf(row) === 'attention' && 'text-warning font-semibold',
                    sevOf(row) === 'normal' && 'text-muted-foreground',
                  )">
                    {{ row.restart_count.toLocaleString() }}
                  </span>
                </div>
                <span v-else class="text-muted-foreground tabular-nums text-sm">0</span>
              </td>
              <td class=" max-w-[140px] hidden lg:table-cell" :class="densityClass.cell">
                <span
                  v-if="nodeShort(row)"
                  class="inline-block max-w-full truncate font-mono text-xs text-muted-foreground align-bottom"
                  :title="row.node ?? undefined"
                >{{ nodeShort(row) }}</span>
                <span v-else class="text-muted-foreground">—</span>
              </td>
              <td class=" tabular-nums text-xs text-muted-foreground whitespace-nowrap" :class="densityClass.cell">{{ row.age ?? '—' }}</td>
            </tr>
            <tr v-if="loading && data.items.length === 0">
              <td colspan="7" class="px-4 py-2">
                <LoadingState :message="t('pods.loading')" />
              </td>
            </tr>
          </tbody>
        </table>
      </div>

      <!-- 平板 / 手机: 卡片列表 (Audit §14.1) -->
      <!-- Was `!loading && ...`: every filter change hid the entire card list
           on mobile while the refetch was in flight. Same flash as the table. -->
      <div v-if="data.items.length > 0" class="md:hidden divide-y divide-border" :class="loading && 'opacity-60 transition-opacity ease-app dur-base'">
        <button
          v-for="row in pagedPods"
          :key="`${row.namespace}/${row.name}`"
          type="button"
          class="w-full text-left p-3 active:bg-muted/60 transition-colors ease-app dur-fast focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-inset focus-visible:ring-offset-0"
          :class="clsOf(row)"
          :aria-label="t('pods.viewDetail', { name: row.name })"
          @click="open(row)"
        >
          <div class="flex items-start justify-between gap-2 mb-1">
            <div class="min-w-0 flex-1">
              <div class="font-mono text-sm text-foreground truncate">{{ row.name }}</div>
              <div v-if="row.owner_kind" class="text-xs text-muted-foreground font-mono truncate">
                {{ row.owner_kind }}/{{ row.owner_name }}
              </div>
            </div>
            <PodStatusPill :phase="row.phase" :tone-override="statusTone(row)" />
          </div>
          <div class="flex flex-wrap items-center gap-x-3 gap-y-1 text-xs text-muted-foreground">
            <span class="font-mono">{{ row.namespace }}</span>
            <span v-if="nodeShort(row)" class="font-mono truncate max-w-[140px]">{{ nodeShort(row) }}</span>
            <span class="tabular-nums">{{ row.age ?? '—' }}</span>
            <span v-if="row.restart_count > 0"
              :title="t('pods.restartsCount', { count: row.restart_count })"
              :aria-label="t('pods.restartsCount', { count: row.restart_count })"
              :class="cn(
                'tabular-nums',
                sevOf(row) === 'attention' && 'text-warning font-semibold',
              )">×{{ row.restart_count }}</span>
            <!--
              容器状态点：桌面表格有，手机卡片原来没有。
              于是 390px 上一个 CrashLoopBackOff 的 Pod 只显示绿色的
              「运行中 Running」和重启次数 —— 唯一的故障信号在手机上
              消失了。手机上恰恰是最需要它的地方（不在工位前）。
              名字和桌面那列一致，所以两处说的是同一件事。
            -->
            <!--
              role="img" 不是装饰：没有 role 的元素上写 aria-label 会被
              读屏丢掉（generic 不允许命名）。而这一组点恰恰是手机上唯一
              的故障信号 —— 卡片外层是 <button aria-label="查看 X 详情">，
              按钮名覆盖了内容名，容器信息只以 generic 的身份残留。
              给它 role="img"，它就成为一块有名有姓的图形。
            -->
            <span
              role="img"
              class="flex items-center gap-1"
              :aria-label="t('pods.containersReady', { ready: readyOf(row), total: row.containers.length })"
            >
              <span
                v-for="(c, i) in row.containers"
                :key="i"
                class="inline-block w-1.5 h-1.5 rounded-full"
                :class="containerDotClass(c)"
                :title="containerStateText(c, t('pods.containerReady'), t('pods.containerNotReady'))"
              />
            </span>
          </div>
        </button>
      </div>

      <!-- Pagination footer -->
      <div
        v-if="data.items.length > 0"
        class="flex items-center justify-between gap-3 px-4 py-2.5 border-t border-border bg-muted/20 text-xs text-muted-foreground shrink-0"
      >
        <div class="tabular-nums">
          {{ t('pods.pageRange', {
            from: (page - 1) * pageSize + 1,
            to: Math.min(page * pageSize, (attentionOnly ? data.items.filter(needsAttention) : data.items).length),
            total: data.items.length.toLocaleString(),
          }) }}
        </div>
        <div class="flex items-center gap-2">
          <!-- 手机上这一排塞不下：「每页 20」和「第 1 / 1 页」各自折成两行，
               四个碎片挤在一起。窄屏只留「共 N 条」+ 上下页，
               每页条数在 sm 以上再出现。 -->
          <label class="hidden sm:flex items-center gap-1.5">
            <span class="whitespace-nowrap">{{ t('pods.perPage') }}</span>
            <AppSelect
              :model-value="String(pageSize)"
              :options="pageSizeOptions"
              :aria-label="t('pods.perPageCount')"
              size="sm"
              @update:model-value="(v) => (pageSize = Number(v))"
            />
          </label>
          <span class="tabular-nums hidden sm:inline whitespace-nowrap">{{ t('pods.pageOf', { page, total: totalPages }) }}</span>
          <Button
            variant="outline"
            size="icon-sm"
            :disabled="page <= 1"
            :aria-label="t('pods.prevPage')"
            @click="page = page - 1"
          >
            <ChevronLeft :size="14" :stroke-width="1.75" />
          </Button>
          <Button
            variant="outline"
            size="icon-sm"
            :disabled="page >= totalPages"
            :aria-label="t('pods.nextPage')"
            @click="page = page + 1"
          >
            <ChevronRight :size="14" :stroke-width="1.75" />
          </Button>
        </div>
      </div>
    </Card>
  </div>
</template>
