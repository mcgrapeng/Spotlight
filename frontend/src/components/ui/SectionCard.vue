<script setup lang="ts">
defineProps<{
  title?: string
  count?: string | number
  flush?: boolean
}>()
</script>

<template>
  <section class="card">
    <header v-if="title || count !== undefined || $slots.actions" class="card__header">
      <div class="flex items-center gap-2">
        <h3 v-if="title" class="card__title">{{ title }}</h3>
        <span v-else><slot name="title" /></span>
        <span v-if="count !== undefined" class="text-[11px] text-zinc-500 tabular-nums">{{ count }}</span>
      </div>
      <div v-if="$slots.actions" class="flex items-center gap-2">
        <slot name="actions" />
      </div>
    </header>
    <div :class="[flush ? 'card__body--flush' : 'card__body']">
      <slot />
    </div>
  </section>
</template>
