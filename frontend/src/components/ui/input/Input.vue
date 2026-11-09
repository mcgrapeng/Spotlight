<script setup lang="ts">
import type { HTMLAttributes } from "vue"
import { useVModel } from "@vueuse/core"
import { ref } from "vue"
import { cn } from '@/lib/utils'

const props = defineProps<{
  defaultValue?: string | number
  modelValue?: string | number
  class?: HTMLAttributes["class"]
}>()

const emits = defineEmits<{
  (e: "update:modelValue", payload: string | number): void
}>()

const modelValue = useVModel(props, "modelValue", emits, {
  passive: false,
  defaultValue: props.defaultValue,
})

// The log panel's `/` shortcut focuses the search box through this ref. The
// component instance does not expose the root element's DOM methods, so
// without this the shortcut threw "focus is not a function" instead of
// focusing anything.
const inputEl = ref<HTMLInputElement | null>(null)
function focus() {
  inputEl.value?.focus()
}
defineExpose({ focus })
</script>

<template>
  <input ref="inputEl" v-model="modelValue" :class="cn('flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-foreground file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-background disabled:cursor-not-allowed disabled:opacity-50', props.class)">
</template>
