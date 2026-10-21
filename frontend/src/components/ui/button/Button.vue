<script setup lang="ts">
import { computed } from "vue"
import type { PrimitiveProps } from "reka-ui"
import type { HTMLAttributes } from "vue"
import type { ButtonVariants } from "."
import { Primitive } from "reka-ui"
import { Loader2 } from "@lucide/vue"
import { cn } from '@/lib/utils'
import { buttonVariants } from "."

interface Props extends PrimitiveProps {
  variant?: ButtonVariants["variant"]
  size?: ButtonVariants["size"]
  /**
   * Swaps the `icon` slot for a spinner, disables the button and marks it
   * busy. Five pages used to hand-roll `:disabled="loading"` plus an
   * `animate-spin` on their own icon; the state was written down five times
   * and every copy could drift.
   */
  loading?: boolean
  /** Disabled without the busy state (e.g. a submit that needs input). */
  disabled?: boolean
  class?: HTMLAttributes["class"]
}

const props = withDefaults(defineProps<Props>(), {
  as: "button",
  loading: false,
  disabled: false,
})

// The spinner has to sit where the icon was, or the button changes width
// when it enters the loading state.
const spinnerSize = computed(() => (props.size === "xs" ? 12 : 14))
const isDisabled = computed(() => props.disabled || props.loading)
</script>

<template>
  <Primitive
    :as="as"
    :as-child="asChild"
    :disabled="isDisabled && as === 'button' ? true : undefined"
    :aria-busy="loading ? 'true' : undefined"
    :class="cn(buttonVariants({ variant, size }), props.class)"
  >
    <Loader2
      v-if="loading"
      :size="spinnerSize"
      :stroke-width="2"
      class="animate-spin shrink-0"
      aria-hidden="true"
    />
    <slot v-else name="icon" />
    <slot />
  </Primitive>
</template>
