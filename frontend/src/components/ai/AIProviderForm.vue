<script setup lang="ts">
import { ref, computed } from 'vue'
import { Save, X } from '@lucide/vue'
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from '@/components/ui/dialog'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import type { AIProviderIn } from '@/api/types'

const props = defineProps<{
  open: boolean
  initial?: Partial<AIProviderIn>
}>()

const emit = defineEmits<{
  'update:open': [value: boolean]
  save: [data: AIProviderIn]
}>()

const form = ref<AIProviderIn>({
  name: props.initial?.name ?? '',
  provider: props.initial?.provider ?? 'openai',
  model: props.initial?.model ?? 'gpt-4o-mini',
  api_base: props.initial?.api_base ?? null,
  api_key: props.initial?.api_key ?? '',
  temperature: props.initial?.temperature ?? 0.7,
  max_tokens: props.initial?.max_tokens ?? 2048,
  is_default: props.initial?.is_default ?? false,
})

const apiBaseInput = computed<string>({
  get: () => form.value.api_base ?? '',
  set: (v: string) => { form.value.api_base = v || null },
})

const providerOptions = [
  { value: 'openai',    label: 'OpenAI' },
  { value: 'anthropic', label: 'Anthropic' },
  { value: 'azure',     label: 'Azure' },
  { value: 'gemini',    label: 'Gemini' },
  { value: 'ollama',    label: 'Ollama' },
  { value: 'deepseek',  label: 'DeepSeek' },
]

function onSubmit() {
  emit('save', { ...form.value })
  emit('update:open', false)
}

function close() {
  emit('update:open', false)
}
</script>

<template>
  <Dialog :open="open" @update:open="(v) => emit('update:open', v)">
    <DialogContent class="sm:max-w-[480px]">
      <DialogHeader>
        <DialogTitle>{{ initial ? '编辑 Provider' : '添加 Provider' }}</DialogTitle>
        <DialogDescription>
          通过 LiteLLM 统一适配 OpenAI / Anthropic / Azure / Gemini / Ollama / DeepSeek 等
        </DialogDescription>
      </DialogHeader>

      <form class="grid gap-4 py-4" @submit.prevent="onSubmit">
        <div class="grid gap-1.5">
          <label class="text-sm font-medium" for="provider-name">名称</label>
          <Input id="provider-name" v-model="form.name" placeholder="默认" required />
        </div>

        <div class="grid gap-1.5">
          <label class="text-sm font-medium" for="provider-provider">Provider</label>
          <select
            id="provider-provider"
            v-model="form.provider"
            class="flex h-9 w-full rounded-md border border-input bg-background px-3 text-sm"
          >
            <option v-for="o in providerOptions" :key="o.value" :value="o.value">{{ o.label }}</option>
          </select>
        </div>

        <div class="grid gap-1.5">
          <label class="text-sm font-medium" for="provider-model">Model</label>
          <Input id="provider-model" v-model="form.model" placeholder="gpt-4o-mini" required />
        </div>

        <div class="grid gap-1.5">
          <label class="text-sm font-medium" for="provider-key">API Key</label>
          <Input id="provider-key" v-model="form.api_key" type="password" placeholder="sk-..." />
        </div>

        <div class="grid gap-1.5">
          <label class="text-sm font-medium" for="provider-base">Base URL（可选）</label>
          <Input id="provider-base" v-model="apiBaseInput" placeholder="https://api.openai.com/v1" />
        </div>

        <label class="flex items-center gap-2 text-sm">
          <input v-model="form.is_default" type="checkbox" class="h-4 w-4 rounded border-input" />
          设为默认 provider
        </label>
      </form>

      <DialogFooter>
        <Button variant="outline" type="button" @click="close">
          <X :size="14" :stroke-width="1.75" class="mr-1" />
          取消
        </Button>
        <Button type="submit" @click="onSubmit">
          <Save :size="14" :stroke-width="1.75" class="mr-1" />
          保存
        </Button>
      </DialogFooter>
    </DialogContent>
  </Dialog>
</template>