<script setup lang="ts">
import type { HTMLAttributes } from "vue"
import { useVModel } from "@vueuse/core"
import { cn } from '@/lib/utils'

/**
 * A multi-line input, same visual language as Input.vue.
 *
 * The AI question box was a single-line Input, so a multi-clause question
 * ("which pod is restarting, and is it the same one as yesterday?") had to
 * be crammed onto one line. Enter inserts a newline here; the caller
 * decides which chord submits.
 */
const props = defineProps<{
  defaultValue?: string | number
  modelValue?: string | number
  rows?: number
  class?: HTMLAttributes["class"]
}>()

const emits = defineEmits<{
  (e: "update:modelValue", payload: string | number): void
}>()

const modelValue = useVModel(props, "modelValue", emits, {
  passive: false,
  defaultValue: props.defaultValue,
})
</script>

<template>
  <textarea
    v-model="modelValue"
    :rows="rows ?? 2"
    :class="cn('flex w-full resize-none rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-background disabled:cursor-not-allowed disabled:opacity-50', props.class)"
  />
</template>
