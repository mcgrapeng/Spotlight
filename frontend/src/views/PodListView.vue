<script setup lang="ts">
import { computed, ref, watch } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { useI18n } from 'vue-i18n'
import { Search, RefreshCw, AlertCircle, AlertTriangle, ChevronLeft, ChevronRight, Info, X } from '@lucide/vue'
import PageHeader from '@/components/common/PageHeader.vue'
import LoadingState from '@/components/common/LoadingState.vue'
import ErrorState from '@/components/common/ErrorState.vue'
import EmptyState from '@/components/common/EmptyState.vue'
import PodStatusPill from '@/components/pod/PodStatusPill.vue'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import { Card } from '@/components/ui/card'
import AppSelect from '@/components/ui/AppSelect.vue'
import { cn } from '@/lib/utils'
import { usePodList } from '@/composables/usePodList'
import { useClusterStore } from '@/stores/cluster'
import { usePagination } from '@/composables/usePagination'
import { usePodSorting, DENSITY_CLASSES, type PodDensity } from '@/composables/usePodSorting'
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

const { data, loading, error, reload } = usePodList({
  cluster: computed(() => cluster.activeCluster),
  namespace: computed(() => cluster.activeNamespace),
  status: statusFilter,
  search,
})

const LARGE_LIST_THRESHOLD = 500

const pageSizeOptions = [10, 20, 50, 100].map((n) => ({ value: n, label: String(n) }))

const statusOptions = computed(() => [
  { value: 'all', label: t('pods.filterAll') },
  { value: 'Running',   label: 'Running' },
  { value: 'Pending',   label: 'Pending' },
  { value: 'Failed',    label: 'Failed' },
  { value: 'Succeeded', label: 'Succeeded' },
])

const subtitle = computed(() => {
  const ns = cluster.activeNamespace === '_all'
    ? t('namespace.all')
    : cluster.activeNamespace
  return t('pods.subtitle', { count: data.value.total.toLocaleString(), namespace: ns })
})

// ponytail: per-row helpers memoized in two Map<string, ...> lookups keyed by
// "namespace/name". Previous version called restartSeverity(row) up to 4
// times per row inside the template — for 100 rows × 4 = 400 calls/render.
// Now: 2 calls per row in computed, 0 in template.
function readyOf(p: PodOut) { return p.containers.filter(c => c.ready).length }
function restartSeverity(p: PodOut) {
  if (p.restart_count > 100) return 'critical'
  if (p.restart_count > 5)   return 'warn'
  return 'normal'
}
function nodeShort(p: PodOut) { return p.node ? p.node.split('.')[0] : null }

const PHASE_TONE: Record<string, string> = {
  Running:   'hover:bg-success/5',
  Pending:   'hover:bg-warning/5',
  Failed:    'bg-error/5 hover:bg-error/10',
  Succeeded: 'hover:bg-muted/40',
  Unknown:   'hover:bg-muted/40',
}
function rowClass(p: PodOut) {
  return PHASE_TONE[p.phase] ?? 'hover:bg-muted/40'
}

const severityMap = computed(() => {
  const m = new Map<string, 'critical' | 'warn' | 'normal'>()
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

const { page, totalPages } = usePagination({
  totalItems: computed(() => data.value.items.length),
  pageSize,
  resetKey: computed(() => data.value.items),
})

// ponytail: 排序 + 密度。
// 排序：这张表之前一个能排序的列都没有，而 on-call 的第一个动作就是
// 「按重启次数倒序找罪魁」。默认按名称升序（可预期），点「重启」即按
// 次数倒序 —— 数字列第一次点击就用「大的在前」，小的在前没有意义。
const { sortKey, sortDir, sorted, toggle, ariaSortFor } = usePodSorting(
  computed(() => data.value.items),
)

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
  return sorted.value.slice(start, start + pageSize.value)
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
  <div class="space-y-5">
    <PageHeader :title="t('route.pods')" :subtitle="subtitle">
      <template #actions>
        <Button variant="outline" size="sm" :disabled="loading" @click="reload" :aria-label="t('pods.refresh')">
          <RefreshCw :size="14" :stroke-width="1.75" :class="cn(loading && 'animate-spin')" />
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
        <X :size="11" :stroke-width="2.5" />
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

    <ErrorState v-if="error" :message="error" @retry="reload" />

    <Card v-else class="p-0 overflow-hidden">
      <EmptyState
        v-if="!loading && data.items.length === 0"
        :title="emptyTitle"
        :description="emptyDescription"
      >
        <template v-if="filtered" #action>
          <Button variant="outline" size="sm" @click="search = ''; statusFilter = 'all'">
            {{ t('pods.clearFilters') }}
          </Button>
        </template>
      </EmptyState>
      <!-- 桌面 / 大屏: 表格 -->
      <div v-else class="overflow-auto max-h-[70vh] hidden md:block">
        <table
          class="w-full"
          :class="cn(densityClass.text, loading && data.items.length > 0 && 'opacity-60 transition-opacity ease-app')"
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
                'border-b border-border last:border-0 cursor-pointer transition-colors ease-app',
                'focus-visible:bg-muted/60 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-inset',
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
                    class="font-mono text-[13px] text-foreground truncate rounded hover:underline focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
                    :aria-label="t('pods.viewDetail', { name: row.name })"
                    @click.stop
                  >{{ row.name }}</router-link>
                  <span
                    v-if="row.owner_kind"
                    class="text-2xs text-muted-foreground font-mono truncate"
                  >{{ row.owner_kind }}/{{ row.owner_name }}</span>
                </div>
              </td>
              <td class=" hidden lg:table-cell" :class="densityClass.cell">
                <span class="inline-flex items-center rounded-md border border-border bg-muted/40 px-1.5 py-0.5 font-mono text-2xs text-muted-foreground">
                  {{ row.namespace }}
                </span>
              </td>
              <td :class="densityClass.cell">
                <div class="flex items-center gap-2">
                  <PodStatusPill :phase="row.phase" />
                  <span
                    v-if="row.reason"
                    class="rounded px-1.5 py-0.5 text-2xs font-semibold bg-error-bg text-error border border-error-border"
                  >{{ row.reason }}</span>
                </div>
              </td>
              <td :class="densityClass.cell">
                <div class="flex items-center gap-2">
                  <div class="flex items-center gap-1" :aria-label="t('pods.containersReady', { ready: readyOf(row), total: row.containers.length })">
                    <span
                      v-for="(c, i) in row.containers"
                      :key="i"
                      :title="`${c.name}: ${c.ready ? t('pods.containerReady') : c.state}${c.reason ? ' (' + c.reason + ')' : ''}`"
                      :class="cn(
                        'inline-block w-2 h-2 rounded-full',
                        c.ready
                          ? 'bg-success'
                          : c.state === 'waiting' && c.reason === 'CrashLoopBackOff'
                            ? 'bg-error'
                            : 'bg-warning',
                      )"
                    />
                  </div>
                  <span :class="cn(
                    'tabular-nums text-2xs',
                    readyOf(row) === row.containers.length ? 'text-success' : 'text-warning',
                  )">{{ readyOf(row) }}/{{ row.containers.length }}</span>
                </div>
              </td>
              <td :class="densityClass.cell">
                <div
                  v-if="row.restart_count > 0"
                  class="flex items-center gap-1 tabular-nums text-sm"
                  :aria-label="t('pods.restartsCount', { count: row.restart_count })"
                >
                  <AlertCircle
                    v-if="sevOf(row) === 'critical'"
                    :size="12" class="text-error shrink-0" :stroke-width="1.75"
                    aria-hidden="true"
                  />
                  <AlertTriangle
                    v-else-if="sevOf(row) === 'warn'"
                    :size="12" class="text-warning shrink-0" :stroke-width="1.75"
                    aria-hidden="true"
                  />
                  <span :class="cn(
                    sevOf(row) === 'critical' && 'text-error font-semibold',
                    sevOf(row) === 'warn' && 'text-warning',
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
      <div v-if="data.items.length > 0" class="md:hidden divide-y divide-border" :class="loading && 'opacity-60 transition-opacity ease-app'">
        <button
          v-for="row in pagedPods"
          :key="`${row.namespace}/${row.name}`"
          type="button"
          class="w-full text-left p-3 active:bg-muted/60 transition-colors ease-app focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-inset"
          :class="clsOf(row)"
          :aria-label="t('pods.viewDetail', { name: row.name })"
          @click="open(row)"
        >
          <div class="flex items-start justify-between gap-2 mb-1">
            <div class="min-w-0 flex-1">
              <div class="font-mono text-sm text-foreground truncate">{{ row.name }}</div>
              <div v-if="row.owner_kind" class="text-2xs text-muted-foreground font-mono truncate">
                {{ row.owner_kind }}/{{ row.owner_name }}
              </div>
            </div>
            <PodStatusPill :phase="row.phase" />
          </div>
          <div class="flex flex-wrap items-center gap-x-3 gap-y-1 text-2xs text-muted-foreground">
            <span class="font-mono">{{ row.namespace }}</span>
            <span v-if="nodeShort(row)" class="font-mono truncate max-w-[140px]">{{ nodeShort(row) }}</span>
            <span class="tabular-nums">{{ row.age ?? '—' }}</span>
            <span v-if="row.restart_count > 0"
              :title="t('pods.restartsCount', { count: row.restart_count })"
              :aria-label="t('pods.restartsCount', { count: row.restart_count })"
              :class="cn(
                'tabular-nums',
                sevOf(row) === 'critical' && 'text-error font-semibold',
                sevOf(row) === 'warn' && 'text-warning',
              )">×{{ row.restart_count }}</span>
          </div>
        </button>
      </div>

      <!-- Pagination footer -->
      <div
        v-if="data.items.length > 0"
        class="flex items-center justify-between gap-3 px-4 py-2.5 border-t border-border bg-muted/20 text-xs text-muted-foreground"
      >
        <div class="tabular-nums">
          {{ t('pods.pageRange', {
            from: (page - 1) * pageSize + 1,
            to: Math.min(page * pageSize, data.items.length),
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
