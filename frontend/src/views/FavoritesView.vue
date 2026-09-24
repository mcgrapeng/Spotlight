<script setup lang="ts">
import { computed, onMounted, ref } from 'vue'
import { Star, Trash2, ExternalLink } from '@lucide/vue'
import { useRouter } from 'vue-router'
import { favoritesApi } from '@/api/endpoints'
import PageHeader from '@/components/common/PageHeader.vue'
import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'
import LoadingState from '@/components/common/LoadingState.vue'
import ErrorState from '@/components/common/ErrorState.vue'
import EmptyState from '@/components/common/EmptyState.vue'
import type { Favorite } from '@/domain/types'

const router = useRouter()
const favorites = ref<Favorite[]>([])
const loading = ref(true)
const error = ref<string | null>(null)

async function load() {
  loading.value = true
  error.value = null
  try {
    favorites.value = await favoritesApi.list()
  } catch (e: any) {
    error.value = e?.response?.data?.detail ?? e?.message ?? '加载失败'
  } finally {
    loading.value = false
  }
}

onMounted(load)

async function remove(id: number) {
  await favoritesApi.remove(id)
  favorites.value = favorites.value.filter(f => f.id !== id)
}

function open(f: Favorite) {
  if (f.resource_type === 'pod') {
    router.push({ name: 'pod-detail', params: { name: f.name, namespace: f.namespace } })
  }
}
</script>

<template>
  <PageHeader title="收藏夹" :subtitle="`${favorites.length} 个收藏`" />

  <LoadingState v-if="loading" />
  <ErrorState v-else-if="error" :message="error" @retry="load" />
  <EmptyState v-else-if="favorites.length === 0" title="还没有收藏" description="从 Pod 详情页或 Nodes 页面可以添加收藏" />

  <div v-else class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
    <Card v-for="f in favorites" :key="f.id" class="p-0">
      <CardContent class="p-4">
        <div class="flex items-start gap-2">
          <Star :size="16" class="text-warning shrink-0 mt-0.5" :stroke-width="1.75" fill="currentColor" />
          <div class="flex-1 min-w-0">
            <div class="font-mono text-sm font-semibold truncate">{{ f.name }}</div>
            <div class="text-xs text-muted-foreground">{{ f.resource_type }} · {{ f.namespace }}</div>
            <div v-if="f.note" class="text-xs mt-2">{{ f.note }}</div>
          </div>
        </div>
        <div class="flex gap-1 mt-3 justify-end">
          <Button v-if="f.resource_type === 'pod'" variant="ghost" size="sm" @click="open(f)">
            <ExternalLink :size="12" :stroke-width="1.75" />
          </Button>
          <Button variant="ghost" size="sm" @click="remove(f.id)" aria-label="删除">
            <Trash2 :size="12" :stroke-width="1.75" />
          </Button>
        </div>
      </CardContent>
    </Card>
  </div>
</template>
