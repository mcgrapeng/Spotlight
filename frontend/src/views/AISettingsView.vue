<script setup lang="ts">
import { onMounted, ref } from 'vue'
import { Plus, Star, Trash2, Pencil } from '@lucide/vue'
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

async function remove(id: number) {
  if (!confirm('确定删除？')) return
  await aiApi.deleteProvider(id)
  providers.value = providers.value.filter(p => p.id !== id)
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
          <Button variant="ghost" size="sm" @click="remove(p.id)" aria-label="删除">
            <Trash2 :size="12" :stroke-width="1.75" />
          </Button>
        </div>
      </CardContent>
    </Card>
  </div>

  <AIProviderForm v-model:open="dialogOpen" :initial="editing" @save="save" />
</template>