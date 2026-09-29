<script setup lang="ts">
import { onMounted, ref } from 'vue'
import { Plus, Star, Trash2, Pencil, AlertTriangle } from '@lucide/vue'
import { aiApi } from '@/api/endpoints'
import PageHeader from '@/components/common/PageHeader.vue'
import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'
import LoadingState from '@/components/common/LoadingState.vue'
import ErrorState from '@/components/common/ErrorState.vue'
import EmptyState from '@/components/common/EmptyState.vue'
import AIProviderForm from '@/components/ai/AIProviderForm.vue'
import type { AIProvider, AIProviderInput } from '@/domain/types'

const providers = ref<AIProvider[]>([])
const loading = ref(true)
const error = ref<string | null>(null)
const dialogOpen = ref(false)
const editing = ref<(Partial<AIProviderInput> & { id?: number }) | undefined>()

// ponytail: 删除确认从原生 confirm() 升级为内联 Dialog，与全站设计语言一致 (Audit §10.1)
const deleteConfirm = ref<{ id: number; name: string } | null>(null)
const deleting = ref(false)

async function load() {
  loading.value = true
  error.value = null
  try {
    providers.value = await aiApi.listProviders()
  } catch (e: any) {
    error.value = e?.response?.data?.detail ?? e?.message ?? '加载失败'
  } finally {
    loading.value = false
  }
}

onMounted(load)

function openCreate() {
  editing.value = undefined
  dialogOpen.value = true
}

function openEdit(p: AIProvider) {
  editing.value = {
    id: p.id, name: p.name, provider: p.provider, model: p.model,
    api_base: p.api_base, temperature: p.temperature, max_tokens: p.max_tokens,
    is_default: p.is_default, enabled: p.enabled,
  }
  dialogOpen.value = true
}

async function save(data: AIProviderInput) {
  if (editing.value?.id) {
    await aiApi.updateProvider(editing.value.id, data)
  } else {
    await aiApi.addProvider(data)
  }
  await load()
}

function requestRemove(p: AIProvider) {
  deleteConfirm.value = { id: p.id, name: p.name }
}

async function confirmRemove() {
  if (!deleteConfirm.value) return
  deleting.value = true
  try {
    await aiApi.deleteProvider(deleteConfirm.value.id)
    providers.value = providers.value.filter(p => p.id !== deleteConfirm.value!.id)
  } finally {
    deleting.value = false
    deleteConfirm.value = null
  }
}

async function setDefault(p: AIProvider) {
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
  </PageHeader>

  <LoadingState v-if="loading && providers.length === 0" />
  <ErrorState v-else-if="error" :message="error" @retry="load" />
  <EmptyState v-else-if="providers.length === 0" title="没有 Provider" description="点击右上角添加" />

  <div v-else class="space-y-3">
    <Card v-for="p in providers" :key="p.id" class="p-0">
      <CardContent class="p-4">
        <div class="flex items-center gap-3">
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

  <!-- 内联删除确认 (替代原生 confirm) -->
  <Teleport to="body">
    <div
      v-if="deleteConfirm"
      class="fixed inset-0 z-50 flex items-center justify-center bg-black/50 px-4"
      role="dialog"
      aria-modal="true"
      aria-labelledby="delete-provider-title"
      @click.self="deleteConfirm = null"
    >
      <Card class="w-full max-w-sm p-0">
        <CardContent class="p-5">
          <div class="flex items-start gap-3">
            <span class="inline-flex items-center justify-center size-9 rounded-md shrink-0 bg-error/10 text-error">
              <AlertTriangle :size="16" :stroke-width="1.75" aria-hidden="true" />
            </span>
            <div class="flex-1 min-w-0">
              <h3 id="delete-provider-title" class="text-base font-semibold">删除 Provider？</h3>
              <p class="mt-2 text-sm text-muted-foreground">
                将删除 <span class="font-mono text-foreground">{{ deleteConfirm.name }}</span>。已使用此 Provider 的 AI 分析记录不会被清理，但新增分析将无法选择它。此操作不可撤销。
              </p>
            </div>
          </div>
          <div class="mt-5 flex justify-end gap-2">
            <Button variant="outline" size="sm" :disabled="deleting" @click="deleteConfirm = null">
              取消
            </Button>
            <Button variant="destructive" size="sm" :disabled="deleting" @click="confirmRemove">
              <Trash2 :size="14" :stroke-width="1.75" class="mr-1" />
              {{ deleting ? '删除中…' : '删除' }}
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  </Teleport>
</template>