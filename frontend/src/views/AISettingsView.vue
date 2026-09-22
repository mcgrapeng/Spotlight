<script setup lang="ts">
import { computed, h, onMounted, ref } from 'vue'
import { NCard, NButton, NTag, NDataTable, NEmpty, NModal, useMessage } from 'naive-ui'
import AIProviderForm from '@/components/ai/AIProviderForm.vue'
import { useAIProviders } from '@/composables/useAIProviders'
import type { AIProvider, AIProviderInput } from '@/domain/types'

const { providers, loading, load, remove, setDefault } = useAIProviders()
const msg = useMessage()

const showAdd = ref(false)
const editing = ref<AIProviderInput & { id?: number } | null>(null)

onMounted(load)

function openAdd() { editing.value = null; showAdd.value = true }
function openEdit(p: AIProvider) {
  editing.value = {
    id: p.id, name: p.name, provider: p.provider, model: p.model,
    api_key: '',  // never expose secret back; user re-enters to change
    api_base: p.api_base, temperature: p.temperature, max_tokens: p.max_tokens,
    is_default: p.is_default, enabled: p.enabled, extra: p.extra,
  }
  showAdd.value = true
}
async function onSaved() { showAdd.value = false; await load() }
async function onDelete(p: AIProvider) {
  await remove(p.id)
  msg.success('已删除')
}
async function makeDefault(p: AIProvider) {
  await setDefault(p.id)
  msg.success(`${p.name} 已设为默认`)
}

const columns = computed(() => [
  { title: '默认', key: 'default', width: 70,
    render: (r: AIProvider) => r.is_default
      ? h(NTag, { size: 'small', type: 'success', round: true }, () => '★')
      : h('span', { class: 'text-zinc-600' }, '—') },
  { title: '名称', key: 'name', render: (r: AIProvider) => h('span', { class: 'text-zinc-100' }, r.name) },
  { title: 'Provider', key: 'provider', width: 130,
    render: (r: AIProvider) => h(NTag, { size: 'small', round: true }, () => r.provider) },
  { title: 'Model', key: 'model', width: 220,
    render: (r: AIProvider) => h('code', { class: 'text-zinc-300 text-xs font-mono' }, r.model) },
  { title: 'API Key', key: 'key', width: 180,
    render: (r: AIProvider) => h('span', { class: 'text-zinc-500 text-xs font-mono' }, r.api_key_masked) },
  { title: '启用', key: 'enabled', width: 70,
    render: (r: AIProvider) => h(NTag, { size: 'small', type: r.enabled ? 'success' : 'default', round: true }, () => r.enabled ? '是' : '否') },
  { title: '操作', key: 'op', width: 240,
    render: (r: AIProvider) =>
      h('div', { class: 'flex gap-1' }, [
        !r.is_default && h(NButton, { size: 'tiny', quaternary: true, onClick: () => makeDefault(r) }, () => '设默认'),
        h(NButton, { size: 'tiny', quaternary: true, onClick: () => openEdit(r) }, () => '编辑'),
        h(NButton, { size: 'tiny', quaternary: true, type: 'error', onClick: () => onDelete(r) }, () => '删除'),
      ]) },
])
</script>

<template>
  <div class="p-8 space-y-6 max-w-[1440px] mx-auto">
    <header class="flex items-center justify-between">
      <div>
        <h1 class="text-2xl font-semibold tracking-tight text-zinc-50">AI 模型</h1>
        <p class="text-sm text-zinc-500 mt-1">
          通过 <code class="kbd">LiteLLM</code> 统一适配 OpenAI / Anthropic / Azure / Gemini / Ollama / DeepSeek 等
        </p>
      </div>
      <NButton type="primary" @click="openAdd">+ 添加 Provider</NButton>
    </header>

    <NCard :bordered="false">
      <NEmpty v-if="!loading && !providers.length" description="还没有配置 · 添加一个 Provider 后，Pod 详情页可一键分析日志">
        <NButton type="primary" @click="openAdd">+ 添加第一个 Provider</NButton>
      </NEmpty>
      <NDataTable v-else :columns="columns" :data="providers" size="small" :bordered="false" :loading="loading" />
    </NCard>

    <NModal v-model:show="showAdd" preset="card" :title="editing?.id ? '编辑 Provider' : '添加 Provider'" style="max-width: 720px">
      <AIProviderForm :initial="editing ?? undefined" @saved="onSaved">
        <template #actions>
          <NButton @click="showAdd = false">取消</NButton>
        </template>
      </AIProviderForm>
    </NModal>
  </div>
</template>
