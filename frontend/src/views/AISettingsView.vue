<script setup lang="ts">
import { computed, ref } from 'vue'
import { useI18n } from 'vue-i18n'
import { Plus, Star, Trash2, Pencil, AlertTriangle } from '@lucide/vue'
import { aiApi } from '@/api/endpoints'
import { useResource } from '@/composables/useResource'
import PageHeader from '@/components/common/PageHeader.vue'
import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'
import { Dialog, DialogContent, DialogTitle } from '@/components/ui/dialog'
import LoadingState from '@/components/common/LoadingState.vue'
import ErrorState from '@/components/common/ErrorState.vue'
import EmptyState from '@/components/common/EmptyState.vue'
import AIProviderForm from '@/components/ai/AIProviderForm.vue'
import type { AIProviderOut, AIProviderIn } from '@/api/types'

const { t } = useI18n()

// Ponytail: 把 load() + onMounted 替换成 useResource,模板只读 `providers.length`
// → 用 computed 派生,避免每次 reactive 触发时全数组铺平。
const dialogOpen = ref(false)
const editing = ref<(Partial<AIProviderIn> & { id?: number }) | undefined>()

// ponytail: 删除确认从原生 confirm() 升级为内联 Dialog，与全站设计语言一致 (Audit §10.1)
const deleteConfirm = ref<{ id: number; name: string } | null>(null)
const deleting = ref(false)

const { data: _raw, loading, error, reload: load } = useResource<AIProviderOut[]>(
  () => aiApi.listProviders(),
)
const providers = computed(() => _raw.value ?? [])

function openCreate() {
  editing.value = undefined
  dialogOpen.value = true
}

function openEdit(p: AIProviderOut) {
  editing.value = {
    id: p.id, name: p.name, provider: p.provider, model: p.model,
    api_base: p.api_base, temperature: p.temperature, max_tokens: p.max_tokens,
    is_default: p.is_default, enabled: p.enabled,
  }
  dialogOpen.value = true
}

async function save(data: AIProviderIn) {
  if (editing.value?.id) {
    await aiApi.updateProvider(editing.value.id, data)
  } else {
    await aiApi.addProvider(data)
  }
  await load()
}

function requestRemove(p: AIProviderOut) {
  deleteConfirm.value = { id: p.id, name: p.name }
}

async function confirmRemove() {
  if (!deleteConfirm.value) return
  deleting.value = true
  try {
    await aiApi.deleteProvider(deleteConfirm.value.id)
    await load()  // simplest correct path; refetch from server
  } finally {
    deleting.value = false
    deleteConfirm.value = null
  }
}

async function setDefault(p: AIProviderOut) {
  await aiApi.setDefault(p.id)
  await load()
}
</script>

<template>
  <PageHeader :title="t('route.ai')" :subtitle="t('ai.subtitle')">
    <template #actions>
      <Button @click="openCreate">
        <Plus :size="14" :stroke-width="1.75" class="mr-1" />
        {{ t('ai.addTitle') }}
      </Button>
    </template>
    <template #extra>
      <p class="text-2xs text-muted-foreground">
        {{ t('ai.oneEnabledHint') }}
      </p>
    </template>
  </PageHeader>

  <LoadingState v-if="loading && providers.length === 0" />
  <ErrorState v-else-if="error" :message="error" @retry="load" />
  <EmptyState
    v-else-if="providers.length === 0"
    :title="t('ai.emptyTitle')"
    :description="t('ai.emptyDescription')"
  />

  <div v-else class="space-y-3">
    <Card v-for="p in providers" :key="p.id" class="p-0">
      <CardContent class="p-4">
        <div class="flex items-center gap-3">
          <span
            v-if="p.enabled"
            class="inline-flex items-center rounded px-2 py-0.5 text-2xs font-semibold bg-success-bg text-success border border-success-border"
          >
            {{ t('ai.enabled') }}
          </span>
          <span
            v-if="p.is_default"
            class="inline-flex items-center gap-1 px-1.5 py-0.5 rounded text-2xs font-semibold bg-foreground text-background"
          >
            <Star :size="10" :stroke-width="1.75" fill="currentColor" />
            {{ t('ai.isDefault') }}
          </span>
          <span class="font-mono text-sm font-semibold">{{ p.name }}</span>
          <span class="text-xs px-1.5 py-0.5 rounded bg-muted text-muted-foreground font-mono">{{ p.provider }}</span>
          <span class="text-xs text-muted-foreground font-mono">{{ p.model }}</span>
          <span class="ml-auto text-xs text-muted-foreground font-mono">{{ p.api_key_masked }}</span>
        </div>
        <div class="flex gap-1 mt-3 justify-end">
          <Button v-if="!p.is_default" variant="ghost" size="sm" @click="setDefault(p)">
            {{ t('ai.setDefault') }}
          </Button>
          <Button variant="ghost" size="sm" @click="openEdit(p)" :aria-label="t('ai.edit')">
            <Pencil :size="12" :stroke-width="1.75" />
          </Button>
          <Button variant="ghost" size="sm" @click="requestRemove(p)" :aria-label="t('ai.delete')">
            <Trash2 :size="12" :stroke-width="1.75" />
          </Button>
        </div>
      </CardContent>
    </Card>
  </div>

  <AIProviderForm v-model:open="dialogOpen" :initial="editing" @save="save" />

  <!-- 删除确认（reka Dialog：自带焦点陷阱 / Esc / 遮罩关闭） -->
  <Dialog
    :open="!!deleteConfirm"
    @update:open="(v) => { if (!v) deleteConfirm = null }"
  >
    <DialogContent class="sm:max-w-sm">
      <DialogTitle class="flex items-start gap-3">
        <span class="inline-flex items-center justify-center size-9 rounded-md shrink-0 bg-error/10 text-error">
          <AlertTriangle :size="16" :stroke-width="1.75" aria-hidden="true" />
        </span>
        {{ t('ai.deleteTitle') }}
      </DialogTitle>
      <i18n-t keypath="ai.deleteDescription" tag="p" class="text-sm text-muted-foreground">
        <template #name>
          <span class="font-mono text-foreground">{{ deleteConfirm?.name }}</span>
        </template>
      </i18n-t>
      <div class="mt-3 flex justify-end gap-2">
        <Button variant="outline" size="sm" :disabled="deleting" @click="deleteConfirm = null">
          {{ t('ai.cancel') }}
        </Button>
        <Button variant="destructive" size="sm" :disabled="deleting" @click="confirmRemove">
          <Trash2 :size="14" :stroke-width="1.75" class="mr-1" />
          {{ deleting ? t('ai.deleting') : t('ai.delete') }}
        </Button>
      </div>
    </DialogContent>
  </Dialog>
</template>