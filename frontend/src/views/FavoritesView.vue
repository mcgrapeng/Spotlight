<script setup lang="ts">
import { onMounted, ref } from 'vue'
import { useRouter } from 'vue-router'
import { NCard, NDataTable, NButton, NEmpty, NTag, useMessage } from 'naive-ui'
import { favoritesApi } from '@/api'
import type { Favorite } from '@/types'
import { h } from 'vue'

const router = useRouter()
const message = useMessage()
const items = ref<Favorite[]>([])
const loading = ref(true)

async function load() {
  loading.value = true
  try {
    items.value = await favoritesApi.list()
  } finally {
    loading.value = false
  }
}

async function remove(row: Favorite) {
  await favoritesApi.remove(row.id)
  message.success('已移除')
  load()
}

function goTo(row: Favorite) {
  if (row.resource_type === 'pod') {
    router.push({ name: 'pod-detail', params: { namespace: row.namespace, name: row.name } })
  }
}

onMounted(load)
</script>

<template>
  <div class="p-8 space-y-6 max-w-[1440px] mx-auto">
    <header>
      <h1 class="text-2xl font-semibold tracking-tight text-zinc-50">收藏夹</h1>
      <p class="text-sm text-zinc-500 mt-1">在 Pod 详情页点击 ☆ 添加</p>
    </header>

    <NCard :bordered="false">
      <NEmpty v-if="!loading && !items.length" description="暂无收藏" class="py-12" />
      <NDataTable
        v-else
        :columns="[
          {
            title: '类型',
            key: 'resource_type',
            width: 110,
            render: (r: Favorite) =>
              h(NTag, { size: 'small', round: true, type: r.resource_type === 'pod' ? 'info' : 'default' }, () => r.resource_type),
          },
          {
            title: '名称',
            key: 'name',
            render: (r: Favorite) =>
              h(
                'a',
                { class: 'text-indigo-400 hover:underline cursor-pointer font-mono', onClick: () => goTo(r) },
                `${r.namespace ? r.namespace + '/' : ''}${r.name}`,
              ),
          },
          { title: 'Cluster', key: 'cluster', render: (r: Favorite) => h('span', { class: 'text-zinc-500 text-xs' }, r.cluster || '—') },
          { title: '备注', key: 'note', render: (r: Favorite) => h('span', { class: 'text-zinc-400 text-sm' }, r.note || '—') },
          {
            title: '操作',
            key: 'op',
            width: 100,
            render: (r: Favorite) =>
              h(NButton, { size: 'tiny', quaternary: true, type: 'error', onClick: () => remove(r) }, () => '移除'),
          },
        ]"
        :data="items"
        size="small"
        :bordered="false"
      />
    </NCard>
  </div>
</template>
