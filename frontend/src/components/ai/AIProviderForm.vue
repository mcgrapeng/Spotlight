<script setup lang="ts">
import { ref, computed } from 'vue'
import { useI18n } from 'vue-i18n'
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
import AppSelect from '@/components/ui/AppSelect.vue'
import type { AIProviderIn } from '@/api/types'

const { t } = useI18n()

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
  enabled: props.initial?.enabled ?? true,
  extra: props.initial?.extra ?? {},
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
        <DialogTitle>{{ initial ? t('ai.editTitle') : t('ai.addTitle') }}</DialogTitle>
        <DialogDescription>
          {{ t('ai.subtitle') }}
        </DialogDescription>
      </DialogHeader>

      <form class="grid gap-4 py-4" @submit.prevent="onSubmit">
        <div class="grid gap-1.5">
          <label class="text-sm font-medium" for="provider-name">{{ t('ai.fieldName') }}</label>
          <Input id="provider-name" v-model="form.name" :placeholder="t('ai.fieldNamePlaceholder')" required />
        </div>

        <div class="grid gap-1.5">
          <label class="text-sm font-medium" for="provider-provider">Provider</label>
          <AppSelect
            id="provider-provider"
            v-model="form.provider"
            :options="providerOptions"
            class="w-full"
          />
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
          <label class="text-sm font-medium" for="provider-base">{{ t('ai.fieldBaseUrl') }}</label>
          <Input id="provider-base" v-model="apiBaseInput" placeholder="https://api.openai.com/v1" />
        </div>

        <label class="flex items-center gap-2 text-sm">
          <input v-model="form.is_default" type="checkbox" class="h-4 w-4 rounded border-input" />
          {{ t('ai.formSetDefault') }}
        </label>
      </form>

      <DialogFooter>
        <Button variant="outline" type="button" @click="close">
          <X :size="14" :stroke-width="1.75" class="mr-1" />
          {{ t('ai.cancel') }}
        </Button>
        <Button type="submit" @click="onSubmit">
          <Save :size="14" :stroke-width="1.75" class="mr-1" />
          {{ t('ai.save') }}
        </Button>
      </DialogFooter>
    </DialogContent>
  </Dialog>
</template>