<script setup lang="ts">
import { computed, ref } from 'vue'
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
  <PageHeader title="AI 模型" subtitle="通过 LiteLLM 统一适配 OpenAI / Anthropic / Azure / Gemini / Ollama / DeepSeek 等">
    <template #actions>
      <Button @click="openCreate">
        <Plus :size="14" :stroke-width="1.75" class="mr-1" />
        添加 Provider
      </Button>
    </template>
    <template #extra>
      <p class="text-2xs text-muted-foreground">
        系统限制同时只能启用一个模型：启用新的 Provider 前需先禁用当前启用的。
      </p>
    </template>
  </PageHeader>

  <LoadingState v-if="loading && providers.length === 0" />
  <ErrorState v-else-if="error" :message="error" @retry="load" />
  <EmptyState v-else-if="providers.length === 0" title="没有 Provider" description="点击右上角添加" />

  <div v-else class="space-y-3">
    <Card v-for="p in providers" :key="p.id" class="p-0">
      <CardContent class="p-4">
        <div class="flex items-center gap-3">
          <span
            v-if="p.enabled"
            class="inline-flex items-center rounded px-2 py-0.5 text-2xs font-semibold bg-success-bg text-success border border-success-border"
          >
            已启用
          </span>
          <span
            v-if="p.is_default"
            class="inline-flex items-center gap-1 px-1.5 py-0.5 rounded text-2xs font-semibold bg-foreground text-background"
          >
            <Star :size="10" :stroke-width="1.75" fill="currentColor" />
            默认
          </span>
          <span class="font-mono text-sm font-semibold">{{ p.name }}</span>
          <span class="text-xs px-1.5 py-0.5 rounded bg-muted text-muted-foreground font-mono">{{ p.provider }}</span>
          <span class="text-xs text-muted-foreground font-mono">{{ p.model }}</span>
          <span class="ml-auto text-xs text-muted-foreground font-mono">{{ p.api_key_masked }}</span>
        </div>
        <div class="flex gap-1 mt-3 justify-end">
          <Button v-if="!p.is_default" variant="ghost" size="sm" @click="setDefault(p)">
            设为默认
          </Button>
          <Button variant="ghost" size="sm" @click="openEdit(p)" aria-label="编辑">
            <Pencil :size="12" :stroke-width="1.75" />
          </Button>
          <Button variant="ghost" size="sm" @click="requestRemove(p)" aria-label="删除">
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
        删除 Provider？
      </DialogTitle>
      <p class="text-sm text-muted-foreground">
        将删除 <span class="font-mono text-foreground">{{ deleteConfirm?.name }}</span>。已使用此 Provider 的 AI 分析记录不会被清理，但新增分析将无法选择它。此操作不可撤销。
      </p>
      <div class="mt-3 flex justify-end gap-2">
        <Button variant="outline" size="sm" :disabled="deleting" @click="deleteConfirm = null">
          取消
        </Button>
        <Button variant="destructive" size="sm" :disabled="deleting" @click="confirmRemove">
          <Trash2 :size="14" :stroke-width="1.75" class="mr-1" />
          {{ deleting ? '删除中…' : '删除' }}
        </Button>
      </div>
    </DialogContent>
  </Dialog>
</template>