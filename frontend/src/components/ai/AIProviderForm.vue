<script setup lang="ts">
import { ref, watch } from 'vue'
import { NSelect, NInput, NInputNumber, NSwitch, NButton, NSpace, useMessage } from 'naive-ui'
import { useAIProviders } from '@/composables/useAIProviders'
import type { AIProviderInput } from '@/domain/types'

const emit = defineEmits<{ (e: 'saved'): void }>()
const msg = useMessage()

const { add, update } = useAIProviders()

const props = defineProps<{ initial?: (AIProviderInput & { id?: number }) }>()

const PROVIDERS = [
  { label: 'OpenAI', value: 'openai', modelHint: 'gpt-4o-mini' },
  { label: 'Anthropic', value: 'anthropic', modelHint: 'claude-3-5-sonnet-latest' },
  { label: 'Azure OpenAI', value: 'azure', modelHint: 'gpt-4o' },
  { label: 'Gemini', value: 'gemini', modelHint: 'gemini-1.5-pro' },
  { label: 'Ollama (local)', value: 'ollama', modelHint: 'llama3.1' },
  { label: 'DeepSeek', value: 'deepseek', modelHint: 'deepseek-chat' },
]

const form = ref<AIProviderInput & { id?: number }>({
  id: props.initial?.id,
  name: props.initial?.name ?? '',
  provider: props.initial?.provider ?? 'openai',
  model: props.initial?.model ?? 'gpt-4o-mini',
  api_key: props.initial?.api_key ?? '',
  api_base: props.initial?.api_base ?? null,
  temperature: props.initial?.temperature ?? 0.2,
  max_tokens: props.initial?.max_tokens ?? 1024,
  is_default: props.initial?.is_default ?? false,
  enabled: props.initial?.enabled ?? true,
  extra: props.initial?.extra ?? {},
})

const providerOptions = PROVIDERS.map((p) => ({ label: p.label, value: p.value }))
const modelHint = ref<string>('')

watch(() => form.value.provider, (v) => {
  const p = PROVIDERS.find((x) => x.value === v)
  if (p && !form.value.model) modelHint.value = p.modelHint
}, { immediate: true })

const saving = ref(false)
async function submit() {
  if (!form.value.name || !form.value.provider || !form.value.model) {
    msg.error('name / provider / model 必填')
    return
  }
  if (form.value.provider !== 'ollama' && !form.value.api_key && !form.value.id) {
    msg.error('非 ollama 必须填写 API Key')
    return
  }
  saving.value = true
  try {
    if (form.value.id) {
      const { id, ...rest } = form.value
      await update(id, rest)
      msg.success('已更新')
    } else {
      const { id, ...rest } = form.value
      await add(rest)
      msg.success('已添加')
    }
    emit('saved')
  } finally {
    saving.value = false
  }
}
</script>

<template>
  <form class="grid grid-cols-2 gap-4" @submit.prevent="submit">
    <div>
      <p class="section-title mb-1">显示名</p>
      <NInput v-model:value="form.name" placeholder="my-openai" />
    </div>
    <div>
      <p class="section-title mb-1">Provider</p>
      <NSelect v-model:value="form.provider" :options="providerOptions" />
    </div>
    <div>
      <p class="section-title mb-1">模型</p>
      <NInput v-model:value="form.model" :placeholder="modelHint" />
    </div>
    <div>
      <p class="section-title mb-1">API Base (可选)</p>
      <NInput v-model:value="form.api_base" placeholder="https://api.openai.com/v1" />
    </div>
    <div class="col-span-2">
      <p class="section-title mb-1">API Key <span v-if="form.id" class="text-zinc-500">(留空表示不修改)</span></p>
      <NInput v-model:value="form.api_key" type="password" show-password-on="click" placeholder="sk-..." />
    </div>
    <div>
      <p class="section-title mb-1">Temperature</p>
      <NInputNumber v-model:value="form.temperature" :min="0" :max="2" :step="0.1" />
    </div>
    <div>
      <p class="section-title mb-1">Max Tokens</p>
      <NInputNumber v-model:value="form.max_tokens" :min="64" :max="32768" :step="64" />
    </div>
    <div class="col-span-2 flex items-center gap-6">
      <NSwitch v-model:value="form.is_default">
        <template #checked>默认</template>
        <template #unchecked>默认</template>
      </NSwitch>
      <NSwitch v-model:value="form.enabled">
        <template #checked>启用</template>
        <template #unchecked>启用</template>
      </NSwitch>
    </div>
    <div class="col-span-2 flex justify-end gap-2 pt-2">
      <NSpace>
        <slot name="actions" />
        <NButton type="primary" :loading="saving" @click="submit">保存</NButton>
      </NSpace>
    </div>
  </form>
</template>
