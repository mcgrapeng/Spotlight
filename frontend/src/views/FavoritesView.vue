<script setup lang="ts">
import { computed, onMounted, ref } from 'vue'
import { useRouter } from 'vue-router'
import { Star, Trash, ArrowRight, Box, Server, Stack } from '@vicons/tabler'
import PageHeader from '@/components/ui/PageHeader.vue'
import EmptyState from '@/components/ui/EmptyState.vue'
import LoadingState from '@/components/ui/LoadingState.vue'
import ErrorState from '@/components/ui/ErrorState.vue'
import { favoritesApi } from '@/api/endpoints'
import { useClusterStore } from '@/stores/cluster'
import type { Favorite } from '@/domain/types'

const router = useRouter()
const cluster = useClusterStore()
const items = ref<Favorite[]>([])
const loading = ref(true)
const errorMsg = ref<string | null>(null)

async function load() {
  loading.value = true
  errorMsg.value = null
  try { items.value = await favoritesApi.list() }
  catch (e: any) { errorMsg.value = e?.response?.data?.detail ?? e?.message ?? '加载失败' }
  finally { loading.value = false }
}
onMounted(load)

async function remove(row: Favorite) {
  await favoritesApi.remove(row.id)
  load()
}

function iconFor(type: string) {
  if (type === 'pod') return Box
  if (type === 'node') return Server
  if (type === 'namespace') return Stack
  return Star
}

function goTo(row: Favorite) {
  if (row.resource_type === 'pod')
    router.push({ name: 'pod-detail', params: { namespace: row.namespace, name: row.name } })
}

function timeAgo(iso: string): string {
  const ms = Date.now() - new Date(iso).getTime()
  if (ms < 60_000) return '刚刚'
  const min = Math.floor(ms / 60_000)
  if (min < 60) return `${min} 分钟前`
  const hr = Math.floor(min / 60)
  if (hr < 24) return `${hr} 小时前`
  return `${Math.floor(hr / 24)} 天前`
}

const subtitle = computed(() => `跨会话持久化 · ${items.value.length} 项`)

// Group by namespace for visual hierarchy
const grouped = computed(() => {
  const map = new Map<string, Favorite[]>()
  for (const it of items.value) {
    const key = it.namespace || it.cluster || '__cluster__'
    if (!map.has(key)) map.set(key, [])
    map.get(key)!.push(it)
  }
  return Array.from(map.entries()).map(([ns, list]) => ({ namespace: ns, items: list }))
})
</script>

<template>
  <div class="page space-y-5">
    <PageHeader title="收藏夹" :subtitle="subtitle" />

    <ErrorState v-if="errorMsg" :message="errorMsg" :on-retry="load" />

    <LoadingState v-else-if="loading" variant="skeleton" :rows="4" height="80px" />

    <EmptyState
      v-else-if="!items.length"
      :icon="Star"
      title="暂无收藏"
      description="在 Pod 详情页用 ☆ 按钮添加关注的资源"
    />

    <div v-else class="space-y-5">
      <section v-for="g in grouped" :key="g.namespace">
        <header class="flex items-center gap-2 mb-3">
          <h2 class="text-[12px] font-semibold uppercase tracking-wider text-zinc-500">{{ g.namespace }}</h2>
          <span class="text-[11px] text-zinc-600 tabular-nums">{{ g.items.length }}</span>
        </header>
        <ul class="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-3">
          <li
            v-for="row in g.items"
            :key="row.id"
            class="card p-4 transition-colors hover:border-zinc-700 cursor-pointer group"
            @click="goTo(row)"
            @keydown.enter="goTo(row)"
            tabindex="0"
            role="link"
            :aria-label="`前往 ${row.resource_type} ${row.name}`"
          >
            <div class="flex items-start gap-3">
              <div class="shrink-0 w-9 h-9 rounded-md bg-indigo-500/10 text-indigo-400 flex items-center justify-center" aria-hidden="true">
                <NIcon :component="iconFor(row.resource_type)" :size="15" />
              </div>
              <div class="flex-1 min-w-0">
                <div class="flex items-center gap-1.5">
                  <span class="chip" :class="row.resource_type === 'pod' ? 'chip--info' : 'chip--neutral'">{{ row.resource_type }}</span>
                  <span class="text-[10.5px] text-zinc-500 tabular-nums">#{{ row.id }}</span>
                </div>
                <code class="mt-1.5 block text-[13px] text-zinc-100 font-mono truncate">{{ row.name }}</code>
                <p v-if="row.note" class="mt-1 text-[11.5px] text-zinc-500 truncate">{{ row.note }}</p>
                <p v-else class="mt-1 text-[11px] text-zinc-600">未设备注</p>
              </div>
              <div class="flex flex-col items-end gap-2 shrink-0">
                <button
                  type="button"
                  class="btn-ghost !w-7 !h-7 opacity-0 group-hover:opacity-100 transition-opacity"
                  @click.stop="remove(row)"
                  :aria-label="`移除收藏 ${row.name}`"
                >
                  <NIcon :component="Trash" :size="12" color="#fb7185" />
                </button>
                <NIcon :component="ArrowRight" :size="13" class="text-zinc-500" />
              </div>
            </div>
            <div class="mt-3 pt-3 border-t border-zinc-800/60 text-[10.5px] text-zinc-500 tabular-nums flex items-center justify-between">
              <span class="font-mono truncate">{{ row.cluster || '—' }}</span>
              <span>{{ timeAgo(row.created_at) }}</span>
            </div>
          </li>
        </ul>
      </section>
    </div>
  </div>
</template>