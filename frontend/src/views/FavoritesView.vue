<script setup lang="ts">
import { computed, h, onMounted, ref } from 'vue'
import { useRouter } from 'vue-router'
import { NDataTable, NButton, NIcon } from 'naive-ui'
import { Star, Trash } from '@vicons/tabler'
import PageHeader from '@/components/ui/PageHeader.vue'
import EmptyState from '@/components/ui/EmptyState.vue'
import LoadingState from '@/components/ui/LoadingState.vue'
import ErrorState from '@/components/ui/ErrorState.vue'
import { favoritesApi } from '@/api/endpoints'
import type { Favorite } from '@/domain/types'

const router = useRouter()
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

function goTo(row: Favorite) {
  if (row.resource_type === 'pod')
    router.push({ name: 'pod-detail', params: { namespace: row.namespace, name: row.name } })
}

const subtitle = computed(() => `跨会话持久化 · 共 ${items.value.length} 项`)
</script>

<template>
  <div class="page space-y-4">
    <PageHeader title="收藏夹" :subtitle="subtitle" />
    <ErrorState v-if="errorMsg" :message="errorMsg" :on-retry="load" />
    <div v-else class="card card__body--flush">
      <LoadingState v-if="loading" variant="skeleton" :rows="4" height="200px" />
      <EmptyState
        v-else-if="!items.length"
        :icon="Star"
        title="暂无收藏"
        description="在 Pod 详情页用 ☆ 按钮添加关注的资源"
      />
      <NDataTable
        v-else
        :columns="[
          { title: '类型', key: 'resource_type', width: 100,
            render: (r: Favorite) => h('span', { class: r.resource_type === 'pod' ? 'chip chip--info' : 'chip chip--neutral' }, () => r.resource_type) },
          { title: '名称', key: 'name',
            render: (r: Favorite) =>
              h('a', {
                class: 'inline-flex items-center gap-1.5 text-indigo-400 hover:text-indigo-300 transition-colors cursor-pointer font-mono text-[12.5px] focus-visible:outline-none focus-visible:underline rounded px-1',
                onClick: () => goTo(r),
                role: 'link', tabindex: 0,
                onKeydown: (e: KeyboardEvent) => { if (e.key === 'Enter') goTo(r) },
              }, `${r.namespace ? r.namespace + '/' : ''}${r.name}`) },
          { title: 'Cluster', key: 'cluster', width: 260, render: (r: Favorite) => h('span', { class: 'text-zinc-500 text-[12px] font-mono' }, r.cluster || '—') },
          { title: '备注', key: 'note', render: (r: Favorite) => h('span', { class: 'text-zinc-400 text-[12.5px]' }, r.note || '—') },
          { title: '', key: 'op', width: 60,
            render: (r: Favorite) =>
              h(NButton, { size: 'tiny', quaternary: true, type: 'error', onClick: () => remove(r), 'aria-label': `移除 ${r.name}` },
                () => [h(NIcon, { component: Trash, size: 13 })]),
          },
        ]"
        :data="items" size="medium" :bordered="false" />
    </div>
  </div>
</template>
