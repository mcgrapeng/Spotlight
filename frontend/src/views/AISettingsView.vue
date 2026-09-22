<script setup lang="ts">
import { computed, h, onMounted, ref } from 'vue'
import { NDataTable, NEmpty, NModal, NButton, useMessage, NIcon } from 'naive-ui'
import { Plus, Robot, Key, Pencil, Trash, Stars, Power } from '@vicons/tabler'
import PageHeader from '@/components/ui/PageHeader.vue'
import EmptyState from '@/components/ui/EmptyState.vue'
import LoadingState from '@/components/ui/LoadingState.vue'
import AIProviderForm from '@/components/ai/AIProviderForm.vue'
import { aiApi } from '@/api/endpoints'
import { useAIProviders } from '@/composables/useAIProviders'
import type { AIProvider, AIProviderInput } from '@/domain/types'

const { providers, loading, load, remove, setDefault, toggle } = useAIProviders()
const msg = useMessage()

const showAdd = ref(false)
const editing = ref<(AIProviderInput & { id?: number }) | null>(null)

onMounted(load)

const activeCount = computed(() => providers.value.filter((p) => p.enabled).length)
const activeProvider = computed(() => providers.value.find((p) => p.enabled) ?? null)

function openAdd() { editing.value = null; showAdd.value = true }
function openEdit(p: AIProvider) {
  editing.value = {
    id: p.id, name: p.name, provider: p.provider, model: p.model,
    api_key: '', api_base: p.api_base, temperature: p.temperature, max_tokens: p.max_tokens,
    is_default: p.is_default, enabled: p.enabled, extra: p.extra,
  }
  showAdd.value = true
}
async function onSaved() { showAdd.value = false; await load() }
async function onDelete(p: AIProvider) {
  await remove(p.id)
  msg.success(`已删除 ${p.name}`)
}
async function onToggle(p: AIProvider) {
  if (p.enabled) {
    // Already enabled → disable it.
    await toggle(p)
    msg.success(`${p.name} 已禁用`)
  } else {
    if (activeCount.value >= 1) {
      msg.warning('同时只能启用一个模型，请先禁用当前启用的模型')
      return
    }
    await toggle(p)
    msg.success(`${p.name} 已启用`)
  }
}
async function makeDefault(p: AIProvider) {
  await setDefault(p.id)
  msg.success(`${p.name} 已设为默认`)
}

const columns = computed(() => [
  { title: '', key: 'default', width: 40,
    render: (r: AIProvider) => r.is_default
      ? h(NIcon, { component: Stars, size: 13, color: '#fbbf24', 'aria-label': '默认模型' })
      : h('span', { class: 'text-zinc-700' }, '·') },
  { title: '名称', key: 'name', minWidth: 200,
    render: (r: AIProvider) => h('div', { class: 'flex items-center gap-2' }, [
      r.is_default && h('span', { class: 'chip chip--warn' }, () => '默认'),
      r.enabled && h('span', { class: 'chip chip--ok' }, () => '已启用'),
      h('span', { class: 'text-zinc-100' }, r.name),
    ]) },
  { title: 'Provider', key: 'provider', width: 130,
    render: (r: AIProvider) => h('span', {
      class: r.provider === 'ollama' ? 'chip chip--neutral' : 'chip chip--info',
    }, () => r.provider) },
  { title: 'Model', key: 'model', minWidth: 200,
    render: (r: AIProvider) => h('code', {
      class: 'text-zinc-300 text-[12px] font-mono truncate block',
    }, r.model) },
  { title: 'API Key', key: 'key', width: 180,
    render: (r: AIProvider) =>
      h('div', { class: 'flex items-center gap-1.5 text-zinc-500 text-[12px] font-mono' },
        [h(NIcon, { component: Key, size: 11 }), r.api_key_masked]) },
  { title: '', key: 'op', width: 220,
    render: (r: AIProvider) =>
      h('div', { class: 'flex items-center gap-1' }, [
        h('button', {
          class: 'btn-ghost',
          title: r.enabled ? '禁用' : '启用',
          'aria-label': r.enabled ? `禁用 ${r.name}` : `启用 ${r.name}`,
          onClick: () => onToggle(r),
        }, [
          h(NIcon, { component: Power, size: 13, color: r.enabled ? '#22c55e' : '#71717a' }),
        ]),
        !r.is_default && h('button', {
          class: 'btn-ghost',
          'aria-label': `设为默认 ${r.name}`,
          onClick: () => makeDefault(r),
        }, [h('span', { class: 'text-[11px]' }, '默认模型')]),
        h('button', {
          class: 'btn-ghost',
          'aria-label': `编辑 ${r.name}`,
          onClick: () => openEdit(r),
        }, [h(NIcon, { component: Pencil, size: 13 })]),
        h('button', {
          class: 'btn-ghost',
          'aria-label': `删除 ${r.name}`,
          onClick: () => onDelete(r),
        }, [h(NIcon, { component: Trash, size: 13, color: '#fb7185' })]),
      ]) },
])
</script>

<template>
  <div class="page space-y-4">
    <PageHeader title="AI 模型" subtitle="通过 LiteLLM 统一适配 OpenAI / Anthropic / Azure / Gemini / Ollama / DeepSeek 等">
      <template #actions>
        <button class="btn-primary" @click="openAdd">
          <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">
            <line x1="12" y1="5" x2="12" y2="19" /><line x1="5" y1="12" x2="19" y2="12" />
          </svg>
          添加 Provider
        </button>
      </template>
    </PageHeader>

    <!-- Single-active explanation -->
    <div class="ai-callout" role="status">
      <NIcon :component="Stars" :size="14" class="shrink-0" color="#fbbf24" />
      <span class="text-[12px] text-zinc-300">
        系统限制同时只能启用一个 AI 模型；该模型会在 Pod 详情页「AI 分析」中自动选用，无需选择。
      </span>
      <span v-if="activeProvider" class="ml-auto chip chip--ok shrink-0">
        当前：
        <code class="font-mono ml-1">{{ activeProvider.name }}</code>
      </span>
    </div>

    <div class="card card__body--flush">
      <LoadingState v-if="loading" variant="skeleton" :rows="3" height="120px" />
      <EmptyState
        v-else-if="!providers.length"
        :icon="Robot"
        title="还没有配置"
        description="添加后可在 Pod 详情页一键分析日志"
      >
        <template #actions>
          <button class="btn-primary" @click="openAdd">
            <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">
              <line x1="12" y1="5" x2="12" y2="19" /><line x1="5" y1="12" x2="19" y2="12" />
            </svg>
            添加第一个
          </button>
        </template>
      </EmptyState>
      <NDataTable
        v-else
        :columns="columns"
        :data="providers"
        size="medium"
        :bordered="false"
      />
    </div>

    <NModal v-model:show="showAdd" preset="card"
            :title="editing?.id ? '编辑 Provider' : '添加 Provider'"
            style="max-width: 680px" :bordered="false">
      <AIProviderForm :initial="editing ?? undefined" @saved="onSaved">
        <template #actions>
          <NButton @click="showAdd = false">取消</NButton>
        </template>
      </AIProviderForm>
    </NModal>
  </div>
</template>

<style scoped>
.ai-callout {
  display: flex; align-items: center; gap: 10px;
  padding: 10px 14px;
  background: rgba(245, 158, 11, 0.06);
  border: 1px solid rgba(245, 158, 11, 0.25);
  border-radius: 6px;
}
</style>