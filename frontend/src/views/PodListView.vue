<script setup lang="ts">
import { computed, ref, watch } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { Search, RefreshCw, AlertCircle, AlertTriangle, ChevronLeft, ChevronRight, X } from '@lucide/vue'
import PageHeader from '@/components/common/PageHeader.vue'
import LoadingState from '@/components/common/LoadingState.vue'
import ErrorState from '@/components/common/ErrorState.vue'
import EmptyState from '@/components/common/EmptyState.vue'
import PodStatusPill from '@/components/pod/PodStatusPill.vue'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import { Card } from '@/components/ui/card'
import { cn } from '@/lib/utils'
import { usePodList } from '@/composables/usePodList'
import { useClusterStore } from '@/stores/cluster'
import { usePagination } from '@/composables/usePagination'
import type { PodInfo } from '@/domain/types'

const route = useRoute()
const router = useRouter()
const cluster = useClusterStore()

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

const statusOptions = [
  { value: 'all',       label: '全部' },
  { value: 'Running',   label: 'Running' },
  { value: 'Pending',   label: 'Pending' },
  { value: 'Failed',    label: 'Failed' },
  { value: 'Succeeded', label: 'Succeeded' },
]

const subtitle = computed(() => {
  const ns = cluster.activeNamespace === '_all' ? '所有 namespace' : cluster.activeNamespace
  return `${data.value.total.toLocaleString()} 个 · ${ns}`
})

function readyOf(p: PodInfo) { return p.containers.filter(c => c.ready).length }
function restartSeverity(p: PodInfo) {
  if (p.restart_count > 100) return 'critical'
  if (p.restart_count > 5)   return 'warn'
  return 'normal'
}
function nodeShort(p: PodInfo) { return p.node ? p.node.split('.')[0] : null }

const PHASE_TONE: Record<string, string> = {
  Running:   'hover:bg-success/5',
  Pending:   'hover:bg-warning/5',
  Failed:    'bg-error/5 hover:bg-error/10',
  Succeeded: 'hover:bg-muted/40',
  Unknown:   'hover:bg-muted/40',
}
function rowClass(p: PodInfo) {
  return PHASE_TONE[p.phase] ?? 'hover:bg-muted/40'
}

function open(p: PodInfo) {
  router.push({ name: 'pod-detail', params: { namespace: p.namespace, name: p.name } })
}

const pageSize = ref(20)

const { page, totalPages } = usePagination({
  totalItems: computed(() => data.value.items.length),
  pageSize,
  resetKey: computed(() => data.value.items),
})

const pagedPods = computed(() => {
  const start = (page.value - 1) * pageSize.value
  return data.value.items.slice(start, start + pageSize.value)
})
</script>

<template>
  <div class="space-y-5">
    <PageHeader title="Pods" :subtitle="subtitle">
      <template #actions>
        <Button variant="outline" size="sm" :disabled="loading" @click="reload" aria-label="刷新">
          <RefreshCw :size="14" :stroke-width="1.75" :class="cn(loading && 'animate-spin')" />
          刷新
        </Button>
      </template>
    </PageHeader>

    <!-- FilterBar -->
    <div class="flex items-center gap-3 flex-wrap" role="search" aria-label="Pod 列表筛选">
      <div class="relative w-44">
        <select
          v-model="statusFilter"
          class="flex h-10 w-full appearance-none rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
          aria-label="按状态筛选"
        >
          <option v-for="o in statusOptions" :key="o.value" :value="o.value">{{ o.label }}</option>
        </select>
      </div>
      <div class="relative flex-1 min-w-[240px] max-w-md">
        <Search :size="14" class="absolute left-2.5 top-3 text-muted-foreground" :stroke-width="1.75" />
        <Input
          v-model="search"
          placeholder="搜索 pod / container / node"
          class="pl-8"
          aria-label="搜索"
        />
      </div>
    </div>

    <div v-if="search" class="flex items-center gap-2 -mt-2 mb-2">
      <span class="text-xs text-muted-foreground">过滤:</span>
      <button
        type="button"
        class="inline-flex items-center gap-1.5 px-2 py-0.5 rounded-md bg-accent text-accent-foreground text-xs font-mono hover:bg-accent/80"
        @click="search = ''"
      >
        <span>"{{ search }}"</span>
        <X :size="11" :stroke-width="2.5" />
      </button>
      <span class="text-xs text-muted-foreground">{{ data.items.length }} 个结果</span>
    </div>

    <ErrorState v-if="error" :message="error" @retry="reload" />

    <Card v-else class="p-0 overflow-hidden">
      <EmptyState
        v-if="!loading && data.items.length === 0"
        :title="search ? `没有匹配「${search}」的 Pod` : (statusFilter !== 'all' ? `没有 ${statusFilter} 状态的 Pod` : '没有匹配的 Pod')"
        :description="search || statusFilter !== 'all' ? `当前过滤：${search ? '搜索「' + search + '」' : ''}${search && statusFilter !== 'all' ? ' + ' : ''}${statusFilter !== 'all' ? '状态 ' + statusFilter : ''}` : '调整搜索词或切换 namespace / 状态过滤'"
      >
        <template v-if="search || statusFilter !== 'all'" #action>
          <Button variant="outline" size="sm" @click="search = ''; statusFilter = 'all'">
            清除过滤
          </Button>
        </template>
      </EmptyState>
      <!-- 桌面 / 大屏: 表格 -->
      <div v-else class="overflow-auto max-h-[70vh] hidden md:block">
        <table class="w-full text-sm">
          <thead class="sticky top-0 z-10 bg-muted/60 border-b border-border text-xs uppercase tracking-wide text-muted-foreground backdrop-blur-sm">
            <tr>
              <th class="text-left font-medium px-4 py-2.5 min-w-[240px]">Pod</th>
              <th class="text-left font-medium px-4 py-2.5 hidden lg:table-cell">Namespace</th>
              <th class="text-left font-medium px-4 py-2.5 w-[160px]">Status</th>
              <th class="text-left font-medium px-4 py-2.5 w-[110px]">Containers</th>
              <th class="text-left font-medium px-4 py-2.5 w-[100px]">Restarts</th>
              <th class="text-left font-medium px-4 py-2.5 w-[140px] hidden lg:table-cell">Node</th>
              <th class="text-left font-medium px-4 py-2.5 w-[80px]">Age</th>
            </tr>
          </thead>
          <tbody>
            <tr
              v-for="row in pagedPods"
              :key="`${row.namespace}/${row.name}`"
              style="content-visibility: auto; contain-intrinsic-size: auto 44px;"
              :class="cn(
                'border-b border-border last:border-0 cursor-pointer focus-visible:bg-muted/60 focus-visible:outline-none transition-colors',
                rowClass(row),
              )"
              tabindex="0"
              role="button"
              :aria-label="`查看 ${row.name} 详情`"
              @click="open(row)"
              @keydown.enter="open(row)"
              @keydown.space.prevent="open(row)"
            >
              <td class="px-4 py-2.5 min-w-0">
                <div class="flex flex-col gap-0.5 min-w-0">
                  <span class="font-mono text-[13px] text-foreground truncate">{{ row.name }}</span>
                  <span
                    v-if="row.owner_kind"
                    class="text-2xs text-muted-foreground font-mono truncate"
                  >{{ row.owner_kind }}/{{ row.owner_name }}</span>
                </div>
              </td>
              <td class="px-4 py-2.5 hidden lg:table-cell">
                <span class="inline-flex items-center rounded-md border border-border bg-muted/40 px-1.5 py-0.5 font-mono text-[11px] text-muted-foreground">
                  {{ row.namespace }}
                </span>
              </td>
              <td class="px-4 py-2.5">
                <div class="flex items-center gap-2">
                  <PodStatusPill :phase="row.phase" />
                  <span
                    v-if="row.reason"
                    class="rounded px-1.5 py-0.5 text-2xs font-semibold bg-error-bg text-error border border-error-border"
                  >{{ row.reason }}</span>
                </div>
              </td>
              <td class="px-4 py-2.5">
                <div class="flex items-center gap-2">
                  <div class="flex items-center gap-1" :aria-label="`${readyOf(row)} of ${row.containers.length} containers ready`">
                    <span
                      v-for="(c, i) in row.containers"
                      :key="i"
                      :title="`${c.name}: ${c.ready ? 'ready' : c.state}${c.reason ? ' (' + c.reason + ')' : ''}`"
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
                    'tabular-nums text-[11px]',
                    readyOf(row) === row.containers.length ? 'text-success' : 'text-warning',
                  )">{{ readyOf(row) }}/{{ row.containers.length }}</span>
                </div>
              </td>
              <td class="px-4 py-2.5">
                <div
                  v-if="row.restart_count > 0"
                  class="flex items-center gap-1 tabular-nums text-sm"
                  :aria-label="`${row.restart_count} 次重启`"
                >
                  <AlertCircle
                    v-if="restartSeverity(row) === 'critical'"
                    :size="12" class="text-error shrink-0" :stroke-width="1.75"
                    aria-hidden="true"
                  />
                  <AlertTriangle
                    v-else-if="restartSeverity(row) === 'warn'"
                    :size="12" class="text-warning shrink-0" :stroke-width="1.75"
                    aria-hidden="true"
                  />
                  <span :class="cn(
                    restartSeverity(row) === 'critical' && 'text-error font-semibold',
                    restartSeverity(row) === 'warn' && 'text-warning',
                    restartSeverity(row) === 'normal' && 'text-muted-foreground',
                  )">
                    {{ row.restart_count.toLocaleString() }}
                  </span>
                </div>
                <span v-else class="text-muted-foreground tabular-nums text-sm">0</span>
              </td>
              <td class="px-4 py-2.5 max-w-[140px] hidden lg:table-cell">
                <span
                  v-if="nodeShort(row)"
                  class="inline-block max-w-full truncate font-mono text-xs text-muted-foreground align-bottom"
                  :title="row.node ?? undefined"
                >{{ nodeShort(row) }}</span>
                <span v-else class="text-muted-foreground">—</span>
              </td>
              <td class="px-4 py-2.5 tabular-nums text-xs text-muted-foreground whitespace-nowrap">{{ row.age ?? '—' }}</td>
            </tr>
            <tr v-if="loading && data.items.length === 0">
              <td colspan="7" class="px-4 py-2">
                <LoadingState message="加载 Pod 列表…" />
              </td>
            </tr>
          </tbody>
        </table>
      </div>

      <!-- 平板 / 手机: 卡片列表 (Audit §14.1) -->
      <div v-if="!loading && data.items.length > 0" class="md:hidden divide-y divide-border">
        <button
          v-for="row in pagedPods"
          :key="`${row.namespace}/${row.name}`"
          type="button"
          class="w-full text-left p-3 active:bg-muted/60 focus-visible:bg-muted/60 focus-visible:outline-none transition-colors"
          :class="rowClass(row)"
          :aria-label="`查看 ${row.name} 详情`"
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
              :class="cn(
                'tabular-nums',
                restartSeverity(row) === 'critical' && 'text-error font-semibold',
                restartSeverity(row) === 'warn' && 'text-warning',
              )">↻{{ row.restart_count }}</span>
          </div>
        </button>
      </div>

      <!-- Pagination footer -->
      <div
        v-if="data.items.length > 0"
        class="flex items-center justify-between gap-3 px-4 py-2.5 border-t border-border bg-muted/20 text-xs text-muted-foreground"
      >
        <div class="tabular-nums">
          第 {{ (page - 1) * pageSize + 1 }}–{{ Math.min(page * pageSize, data.items.length) }} 条 /
          共 {{ data.items.length.toLocaleString() }} 条
        </div>
        <div class="flex items-center gap-2">
          <label class="flex items-center gap-1.5">
            <span>每页</span>
            <select
              v-model.number="pageSize"
              class="h-7 rounded-md border border-input bg-background px-1.5 text-xs focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
              aria-label="每页条数"
            >
              <option v-for="n in [10, 20, 50, 100]" :key="n" :value="n">{{ n }}</option>
            </select>
          </label>
          <span class="tabular-nums">第 {{ page }} / {{ totalPages }} 页</span>
          <Button
            variant="outline"
            size="icon-sm"
            :disabled="page <= 1"
            aria-label="上一页"
            @click="page = page - 1"
          >
            <ChevronLeft :size="14" :stroke-width="1.75" />
          </Button>
          <Button
            variant="outline"
            size="icon-sm"
            :disabled="page >= totalPages"
            aria-label="下一页"
            @click="page = page + 1"
          >
            <ChevronRight :size="14" :stroke-width="1.75" />
          </Button>
        </div>
      </div>
    </Card>
  </div>
</template>