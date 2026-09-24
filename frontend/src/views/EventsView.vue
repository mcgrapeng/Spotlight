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
import type { EventInfo } from '@/domain/types'

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
      limit: 200,
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
</script>

<template>
  <PageHeader :title="`Events · ${cluster.activeCluster || ''}`" :subtitle="cluster.activeNamespace">
    <template #actions>
      <Button variant="outline" size="sm" @click="load" :disabled="loading">
        <RefreshCw :size="14" :stroke-width="1.75" :class="loading && 'animate-spin'" />
      </Button>
    </template>
    <template #extra>
      <div class="flex gap-2 mt-3">
        <Button
          v-for="t in ['all', 'Warning', 'Normal'] as const"
          :key="t"
          size="sm"
          :variant="typeFilter === t ? 'default' : 'outline'"
          @click="typeFilter = t"
        >
          {{ t === 'all' ? '全部' : t }}
        </Button>
      </div>
    </template>
  </PageHeader>

  <LoadingState v-if="loading && events.length === 0" />
  <ErrorState v-else-if="error" :message="error" @retry="load" />
  <EmptyState v-else-if="filtered.length === 0" title="没有事件" />

  <div v-else class="space-y-2">
    <div
      v-for="ev in filtered"
      :key="ev.name"
      class="flex items-start gap-3 p-3 rounded-lg border border-border bg-card"
    >
      <component
        :is="ev.type === 'Warning' ? AlertTriangle : AlertCircle"
        :size="16"
        :stroke-width="1.75"
        :class="cn('shrink-0 mt-0.5', ev.type === 'Warning' ? 'text-warning' : 'text-muted-foreground')"
      />
      <div class="flex-1 min-w-0">
        <div class="flex items-center gap-2 flex-wrap">
          <span class="font-semibold text-sm">{{ ev.reason }}</span>
          <span class="text-2xs text-muted-foreground">{{ ev.namespace }}</span>
          <span class="text-2xs text-muted-foreground font-mono">{{ ev.involved_kind }}/{{ ev.involved_name }}</span>
        </div>
        <p class="text-sm text-muted-foreground mt-1">{{ ev.message }}</p>
        <div class="text-2xs text-muted-foreground mt-1 flex gap-3">
          <span>{{ ev.last_seen }}</span>
          <span>×{{ ev.count }}</span>
        </div>
      </div>
    </div>
  </div>
</template>