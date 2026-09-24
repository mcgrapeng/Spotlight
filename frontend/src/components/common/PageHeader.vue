<script setup lang="ts">
defineProps<{
  title: string
  subtitle?: string
}>()
</script>

<template>
  <header class="border-b border-border pb-4">
    <div class="flex items-start justify-between gap-4">
      <div class="min-w-0 flex-1">
        <h1 class="text-2xl font-bold tracking-tight">{{ title }}</h1>
        <p v-if="subtitle" class="mt-1 text-sm text-muted-foreground">{{ subtitle }}</p>
      </div>
      <div v-if="$slots.actions" class="flex items-center gap-2 shrink-0">
        <slot name="actions" />
      </div>
    </div>
    <div v-if="$slots.extra" class="mt-4">
      <slot name="extra" />
    </div>
  </header>
</template>