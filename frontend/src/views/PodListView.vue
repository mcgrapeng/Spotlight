<script setup lang="ts">
import { computed, ref } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { Search, RefreshCw, AlertCircle, AlertTriangle } from '@lucide/vue'
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
import type { PodInfo } from '@/domain/types'

const route = useRoute()
const router = useRouter()
const cluster = useClusterStore()

const search = ref<string>((route.query.search as string) || '')
const statusFilter = ref<string>('all')

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

function open(p: PodInfo) {
  router.push({ name: 'pod-detail', params: { namespace: p.namespace, name: p.name } })
}
</script>

<template>
  <div class="space-y-5">
    <PageHeader title="Pods" :subtitle="subtitle">
      <template #actions>
        <Button variant="outline" size="sm" :disabled="loading" @click="reload" aria-label="刷新列表">
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

    <ErrorState v-if="error" :message="error" @retry="reload" />

    <Card v-else class="p-0 overflow-hidden">
      <EmptyState
        v-if="!loading && data.items.length === 0"
        title="没有匹配的 Pod"
        description="调整搜索词或切换 namespace / 状态过滤"
      />
      <div v-else class="overflow-x-auto">
        <table class="w-full text-sm">
          <thead class="bg-muted/40 border-b border-border text-xs uppercase tracking-wide text-muted-foreground">
            <tr>
              <th class="text-left font-medium px-4 py-2.5 min-w-[280px]">Pod</th>
              <th class="text-left font-medium px-4 py-2.5">Namespace</th>
              <th class="text-left font-medium px-4 py-2.5 w-[180px]">Status</th>
              <th class="text-left font-medium px-4 py-2.5 w-[100px]">Containers</th>
              <th class="text-left font-medium px-4 py-2.5 w-[110px]">Restarts</th>
              <th class="text-left font-medium px-4 py-2.5 w-[180px]">Node</th>
              <th class="text-left font-medium px-4 py-2.5 w-[80px]">Age</th>
            </tr>
          </thead>
          <tbody>
            <tr
              v-for="row in data.items"
              :key="`${row.namespace}/${row.name}`"
              class="border-b border-border last:border-0 hover:bg-muted/40 cursor-pointer focus-visible:bg-muted/60 focus-visible:outline-none"
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
                    class="text-[10.5px] text-muted-foreground font-mono truncate"
                  >{{ row.owner_kind }}/{{ row.owner_name }}</span>
                </div>
              </td>
              <td class="px-4 py-2.5 font-mono text-xs text-muted-foreground">{{ row.namespace }}</td>
              <td class="px-4 py-2.5">
                <div class="flex items-center gap-2">
                  <PodStatusPill :phase="row.phase" />
                  <span
                    v-if="row.reason"
                    class="rounded px-1.5 py-0.5 text-2xs font-semibold bg-error-bg text-error border border-error-border"
                  >{{ row.reason }}</span>
                </div>
              </td>
              <td class="px-4 py-2.5 tabular-nums text-[12.5px]">
                <span :class="cn(readyOf(row) === row.containers.length ? 'text-muted-foreground' : 'text-warning')">
                  {{ readyOf(row) }}<span class="text-muted-foreground/60">/</span>{{ row.containers.length }}
                </span>
              </td>
              <td class="px-4 py-2.5">
                <div
                  v-if="row.restart_count > 0"
                  class="flex items-center gap-1 tabular-nums text-[12.5px]"
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
                <span v-else class="text-muted-foreground/60 tabular-nums text-[12.5px]">0</span>
              </td>
              <td class="px-4 py-2.5">
                <span v-if="nodeShort(row)" class="font-mono text-xs text-muted-foreground truncate">{{ nodeShort(row) }}</span>
                <span v-else class="text-muted-foreground/60">—</span>
              </td>
              <td class="px-4 py-2.5 tabular-nums text-xs text-muted-foreground">{{ row.age ?? '—' }}</td>
            </tr>
            <tr v-if="loading && data.items.length === 0">
              <td colspan="7" class="px-4 py-2">
                <LoadingState message="加载 Pod 列表…" />
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </Card>
  </div>
</template>