<script setup lang="ts">
import { computed, onMounted, ref, watch } from 'vue'
import { RefreshCw, AlertTriangle, AlertCircle } from '@lucide/vue'
import { eventsApi } from '@/api/endpoints'
import { useClusterStore } from '@/stores/cluster'
import PageHeader from '@/components/common/PageHeader.vue'
import { Button } from '@/components/ui/button'
import LoadingState from '@/components/common/LoadingState.vue'
import ErrorState from '@/components/common/ErrorState.vue'
import EmptyState from '@/components/common/EmptyState.vue'
import { cn } from '@/lib/utils'
import dayjs from 'dayjs'
import relativeTime from 'dayjs/plugin/relativeTime'
import 'dayjs/locale/zh-cn'
import type { EventInfo } from '@/domain/types'

dayjs.extend(relativeTime)
dayjs.locale('zh-cn')

function formatRel(iso: string | null) {
  if (!iso) return '—'
  return dayjs(iso).fromNow()
}

const cluster = useClusterStore()
const events = ref<EventInfo[]>([])
const loading = ref(true)
const error = ref<string | null>(null)
const typeFilter = ref<'all' | 'Warning' | 'Normal'>('all')

async function load() {
  loading.value = true
  error.value = null
  try {
    events.value = await eventsApi.list({
      cluster: cluster.activeCluster,
      namespace: cluster.activeNamespace,
      limit: 500,
    })
  } catch (e: any) {
    error.value = e?.response?.data?.detail ?? e?.message ?? '加载失败'
  } finally {
    loading.value = false
  }
}

onMounted(load)
watch(() => cluster.activeCluster, load)
watch(() => cluster.activeNamespace, load)

const filtered = computed(() => {
  if (typeFilter.value === 'all') return events.value
  return events.value.filter(e => e.type === typeFilter.value)
})

const countByType = computed<Record<string, number>>(() => {
  const c: Record<string, number> = { Warning: 0, Normal: 0 }
  for (const e of events.value) {
    if (e.type in c) c[e.type]++
  }
  return c
})

const totalEvents = computed(() => events.value.length)
</script>

<template>
  <PageHeader
    :title="`Events · ${cluster.activeCluster || ''}`"
    :subtitle="`${cluster.activeNamespace} · ${filtered.length} / ${events.length} 个事件`"
  >
    <template #actions>
      <Button variant="outline" size="sm" @click="load" :disabled="loading" aria-label="刷新">
        <RefreshCw :size="14" :stroke-width="1.75" :class="loading && 'animate-spin'" />
      </Button>
    </template>
    <template #extra>
      <div class="flex flex-wrap items-center gap-2 mt-3">
        <Button
          v-for="t in ['all', 'Warning', 'Normal'] as const"
          :key="t"
          size="sm"
          :variant="typeFilter === t ? 'default' : 'outline'"
          @click="typeFilter = t"
        >
          {{ t === 'all' ? '全部' : t }}
          <span class="ml-1.5 text-2xs tabular-nums opacity-70">({{ t === 'all' ? events.length : countByType[t] }})</span>
        </Button>
        <span v-if="totalEvents > events.length" class="text-2xs text-warning ml-2">
          只显示最近 {{ events.length }} / 总 {{ totalEvents }} 个
        </span>
      </div>
    </template>
  </PageHeader>

  <LoadingState v-if="loading && events.length === 0" />
  <ErrorState v-else-if="error" :message="error" @retry="load" />
  <EmptyState v-else-if="filtered.length === 0" title="没有事件" />

  <div v-else class="space-y-2">
    <component
      :is="ev.involved_kind === 'Pod' ? 'router-link' : 'div'"
      v-for="ev in filtered"
      :key="ev.name"
      v-bind="ev.involved_kind === 'Pod' ? { to: { name: 'pod-detail', params: { namespace: ev.namespace, name: ev.involved_name } } } : {}"
      :class="cn(
        'flex items-start gap-3 p-3 rounded-lg border transition-colors',
        ev.involved_kind === 'Pod'
          ? 'border-border bg-card hover:bg-muted/30 hover:border-foreground/20 cursor-pointer'
          : 'border-border bg-card opacity-75',
      )"
    >
      <component
        :is="ev.type === 'Warning' ? AlertTriangle : AlertCircle"
        :size="16"
        :stroke-width="1.75"
        :class="cn('shrink-0 mt-0.5', ev.type === 'Warning' ? 'text-warning' : 'text-muted-foreground')"
      />
      <div class="flex-1 min-w-0">
        <div class="flex items-center gap-2 flex-wrap">
          <span :class="cn(
            'inline-flex items-center rounded px-1.5 py-0.5 text-2xs font-medium border',
            ev.type === 'Warning'
              ? 'bg-warning-bg text-warning border-warning-border'
              : 'bg-muted text-muted-foreground border-border',
          )">{{ ev.type }}</span>
          <span class="inline-flex items-center rounded px-1.5 py-0.5 bg-muted text-foreground font-mono text-2xs border border-border">{{ ev.reason }}</span>
          <span class="text-2xs text-muted-foreground">{{ ev.namespace }}</span>
          <span class="text-2xs text-muted-foreground font-mono">{{ ev.involved_kind }}/{{ ev.involved_name }}</span>
        </div>
        <p class="text-sm text-muted-foreground mt-1">{{ ev.message }}</p>
        <div class="text-2xs text-muted-foreground mt-1 flex gap-3">
          <span :title="ev.last_seen ?? undefined">{{ formatRel(ev.last_seen) }}</span>
          <span>×{{ ev.count }}</span>
        </div>
      </div>
    </component>
  </div>
</template>