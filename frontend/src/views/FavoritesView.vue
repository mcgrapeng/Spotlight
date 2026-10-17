<script setup lang="ts">
import { computed } from 'vue'
import { Star, Trash2, ExternalLink } from '@lucide/vue'
import { useRouter } from 'vue-router'
import { useI18n } from 'vue-i18n'
import { favoritesApi } from '@/api/endpoints'
import { useResource } from '@/composables/useResource'
import PageHeader from '@/components/common/PageHeader.vue'
import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'
import LoadingState from '@/components/common/LoadingState.vue'
import ErrorState from '@/components/common/ErrorState.vue'
import EmptyState from '@/components/common/EmptyState.vue'
import type { FavoriteOut } from '@/api/types'

const router = useRouter()
const { t } = useI18n()

// Ponytail: 模板里只用 `favorites.length`,所以把 favorites 从 useResource
// 抽成 computed 派生。T 不变,行数从 31 → 13。
const { data: _raw, loading, error, reload: load } = useResource<FavoriteOut[]>(
  () => favoritesApi.list(),
)
const favorites = computed(() => _raw.value ?? [])

async function remove(id: number) {
  await favoritesApi.remove(id)
  // Optimistic local remove — re-list on next mount. Write the source ref,
  // not the readonly derived computed.
  _raw.value = (_raw.value ?? []).filter(f => f.id !== id)
}

function open(f: FavoriteOut) {
  if (f.resource_type === 'pod') {
    router.push({ name: 'pod-detail', params: { name: f.name, namespace: f.namespace } })
  }
}
</script>

<template>
  <PageHeader :title="t('route.favorites')" :subtitle="t('favorites.subtitle', { count: favorites.length })" />

  <LoadingState v-if="loading" />
  <ErrorState v-else-if="error" :message="error" @retry="load" />
  <EmptyState
    v-else-if="favorites.length === 0"
    :title="t('favorites.emptyTitle')"
    :description="t('favorites.emptyDescription')"
  />

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
          <Button
            v-if="f.resource_type === 'pod'"
            variant="ghost"
            size="sm"
            :aria-label="t('favorites.open', { name: f.name })"
            @click="open(f)"
          >
            <ExternalLink :size="12" :stroke-width="1.75" />
          </Button>
          <Button variant="ghost" size="sm" @click="remove(f.id)" :aria-label="t('favorites.delete')">
            <Trash2 :size="12" :stroke-width="1.75" />
          </Button>
        </div>
      </CardContent>
    </Card>
  </div>
</template>
