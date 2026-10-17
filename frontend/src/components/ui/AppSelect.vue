<script setup lang="ts">
import { computed, ref, type Component } from 'vue'
import { useI18n } from 'vue-i18n'
import { Check, ChevronsUpDown } from '@lucide/vue'
import { cn } from '@/lib/utils'
import { Popover, PopoverTrigger, PopoverContent } from '@/components/ui/popover'
import { Command, CommandInput, CommandList, CommandEmpty, CommandGroup, CommandItem } from '@/components/ui/command'

export interface AppSelectOption {
  value: string | number
  label: string
  hint?: string | null
}

const { t } = useI18n()

const props = withDefaults(
  defineProps<{
    options: AppSelectOption[]
    /** Always exchanged as string; numeric call sites convert themselves. */
    modelValue?: string | null
    placeholder?: string
    ariaLabel?: string
    disabled?: boolean
    id?: string
    size?: 'md' | 'sm'
    leadingIcon?: Component
    class?: string
  }>(),
  { size: 'md' },
)

const emit = defineEmits<{ 'update:modelValue': [value: string] }>()

const open = ref(false)
const selected = computed(() =>
  props.options.find((o) => String(o.value) === String(props.modelValue ?? '')),
)

function pick(o: AppSelectOption) {
  emit('update:modelValue', String(o.value))
  open.value = false
}
</script>

<template>
  <Popover v-model:open="open">
    <PopoverTrigger as-child>
      <button
        type="button"
        role="combobox"
        :id="id"
        :aria-expanded="open"
        :aria-label="ariaLabel"
        :disabled="disabled"
        :class="cn(
          'inline-flex items-center gap-2 rounded-md border border-input bg-background text-sm transition-colors',
          'hover:bg-accent hover:text-accent-foreground',
          'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2',
          'disabled:opacity-50 disabled:cursor-default',
          'justify-between',
          size === 'sm' ? 'h-7 px-1.5 text-xs' : 'h-9 px-3',
          props.class,
        )"
      >
        <component
          :is="leadingIcon"
          v-if="leadingIcon"
          :size="14"
          :stroke-width="1.75"
          class="shrink-0 text-muted-foreground"
          aria-hidden="true"
        />
        <span class="truncate" :class="selected ? '' : 'text-muted-foreground'">
          {{ selected?.label ?? placeholder ?? t('select.placeholder') }}
        </span>
        <ChevronsUpDown
          :size="size === 'sm' ? 11 : 14"
          :stroke-width="1.75"
          class="shrink-0 opacity-50"
          aria-hidden="true"
        />
      </button>
    </PopoverTrigger>
    <PopoverContent
      align="start"
      class="w-[var(--reka-popper-anchor-width)] min-w-[160px] p-0"
    >
      <Command :model-value="String(modelValue ?? '')">
        <CommandInput :placeholder="t('select.search', { label: ariaLabel ?? '' })" />
        <CommandList>
          <CommandEmpty>{{ t('select.empty') }}</CommandEmpty>
          <CommandGroup>
            <CommandItem
              v-for="o in options"
              :key="String(o.value)"
              :value="String(o.value)"
              @select="pick(o)"
            >
              <Check
                :size="14"
                :stroke-width="2"
                :class="cn('shrink-0', String(o.value) === String(modelValue ?? '') ? 'opacity-100' : 'opacity-0')"
                aria-hidden="true"
              />
              <span class="truncate flex-1">{{ o.label }}</span>
              <span
                v-if="o.hint"
                class="text-2xs uppercase tracking-wide text-muted-foreground"
              >{{ o.hint }}</span>
            </CommandItem>
          </CommandGroup>
        </CommandList>
      </Command>
    </PopoverContent>
  </Popover>
</template>
