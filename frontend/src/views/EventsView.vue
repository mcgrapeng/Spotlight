<script setup lang="ts">
import { computed, onMounted, ref, watch } from 'vue'
import { RefreshCw, AlertTriangle, AlertCircle, ChevronDown, ChevronRight } from '@lucide/vue'
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
const expanded = ref<Set<string>>(new Set())

function toggleExpand(name: string) {
  const next = new Set(expanded.value)
  if (next.has(name)) next.delete(name)
  else next.add(name)
  expanded.value = next
}

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
// ponytail: 告警数 = 告警源条目数（与列表行数一致）。每行的发生次数
// 在 row 内部用 `×N 次` 单独显示 —— 这里不重复加总，避免与可见行数对不上。
const warningEntries = computed(() =>
  events.value.filter(e => e.type === 'Warning').length,
)
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
      <div class="flex flex-wrap items-center gap-1.5 mt-3" role="tablist" aria-label="按类型过滤">
        <button
          v-for="t in ['all', 'Warning', 'Normal'] as const"
          :key="t"
          type="button"
          role="tab"
          :aria-selected="typeFilter === t"
          @click="typeFilter = t"
          :class="cn(
            'inline-flex items-center gap-2 h-8 px-3 rounded-md border text-xs font-medium transition-colors',
            typeFilter === t
              ? t === 'Warning'
                ? 'bg-warning text-warning-foreground border-warning'
                : 'bg-foreground text-background border-foreground'
              : 'bg-background text-muted-foreground border-border hover:bg-muted/40',
          )"
        >
          <AlertTriangle
            v-if="t === 'Warning'"
            :size="12" :stroke-width="2" aria-hidden="true"
          />
          <AlertCircle
            v-else-if="t === 'Normal'"
            :size="12" :stroke-width="2" aria-hidden="true"
          />
          <span>{{ t === 'all' ? '全部' : t }}</span>
          <span :class="cn(
            'tabular-nums text-2xs px-1.5 py-0.5 rounded',
            typeFilter === t ? 'bg-black/15' : 'bg-muted text-muted-foreground',
          )">{{ t === 'all' ? events.length : countByType[t] }}</span>
        </button>
        <span v-if="warningEntries > 0" class="text-xs text-warning ml-1 inline-flex items-center gap-1">
          <AlertTriangle :size="12" :stroke-width="2" />
          {{ warningEntries }} 个告警源
        </span>
        <span v-if="totalEvents > events.length" class="text-xs text-muted-foreground ml-auto">
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
        'group block rounded-lg border transition-colors overflow-hidden',
        ev.involved_kind === 'Pod'
          ? 'cursor-pointer hover:border-foreground/30'
          : '',
        ev.type === 'Warning'
          ? 'border-warning/40 bg-warning/5 hover:bg-warning/10 border-l-[3px] border-l-warning'
          : 'border-border bg-card opacity-90 hover:opacity-100 border-l-[3px] border-l-transparent',
      )"
    >
      <div class="flex items-start gap-3 p-3">
        <component
          :is="ev.type === 'Warning' ? AlertTriangle : AlertCircle"
          :size="18"
          :stroke-width="1.75"
          :class="cn(
            'shrink-0 mt-0.5',
            ev.type === 'Warning' ? 'text-warning' : 'text-muted-foreground',
          )"
          aria-hidden="true"
        />
        <div class="flex-1 min-w-0">
          <div class="flex items-center gap-2 flex-wrap">
            <span :class="cn(
              'inline-flex items-center rounded px-2 py-0.5 text-xs font-semibold border',
              ev.type === 'Warning'
                ? 'bg-warning-bg text-warning border-warning-border'
                : 'bg-muted text-muted-foreground border-border',
            )">{{ ev.type }}</span>
            <span class="inline-flex items-center rounded px-2 py-0.5 bg-muted text-foreground font-mono text-xs border border-border">{{ ev.reason }}</span>
            <span class="text-xs text-muted-foreground">{{ ev.namespace }}</span>
            <span class="text-xs text-muted-foreground font-mono">{{ ev.involved_kind }}/{{ ev.involved_name }}</span>
          </div>
          <!-- ponytail: message 是用户来 events 页面真正要读的内容，必须是视觉主角 -->
          <p
            :class="cn(
              'mt-2 text-[15px] leading-snug',
              ev.type === 'Warning' ? 'text-foreground font-medium' : 'text-foreground/80',
            )"
            :title="ev.message"
          >
            {{ expanded.has(ev.name) || ev.message.length < 160
              ? ev.message
              : ev.message.slice(0, 160) + '…' }}
          </p>
          <div class="text-xs text-muted-foreground mt-2 flex items-center gap-3">
            <span :title="ev.last_seen ?? undefined">{{ formatRel(ev.last_seen) }}</span>
            <span v-if="ev.count > 1" class="inline-flex items-center gap-1">
              <span class="opacity-60">×</span>
              <span class="tabular-nums font-medium">{{ ev.count }}</span>
              <span class="opacity-60">次</span>
            </span>
            <button
              v-if="ev.message.length >= 160"
              type="button"
              class="ml-auto inline-flex items-center gap-1 text-xs text-muted-foreground hover:text-foreground"
              @click.stop.prevent="toggleExpand(ev.name)"
            >
              <component
                :is="expanded.has(ev.name) ? ChevronDown : ChevronRight"
                :size="12" :stroke-width="2" aria-hidden="true"
              />
              {{ expanded.has(ev.name) ? '收起' : '展开' }}
            </button>
          </div>
        </div>
      </div>
    </component>
  </div>
</template>