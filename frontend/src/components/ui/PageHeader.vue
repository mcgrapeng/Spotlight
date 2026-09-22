<script setup lang="ts">
defineProps<{
  title: string
  subtitle?: string
  back?: boolean
}>()
import { useRouter } from 'vue-router'
const router = useRouter()
</script>

<template>
  <header class="page-header">
    <div class="min-w-0 flex-1">
      <button
        v-if="back"
        class="inline-flex items-center gap-1 text-[12px] text-zinc-500 hover:text-zinc-300 transition-colors mb-1.5 focus-visible:outline-none focus-visible:underline rounded px-1 -ml-1"
        @click="router.back()"
      >
        <svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">
          <path d="M15 18l-6-6 6-6" />
        </svg>
        返回
      </button>
      <h1 class="page-title">{{ title }}</h1>
      <p v-if="subtitle" class="page-subtitle">{{ subtitle }}</p>
    </div>
    <div v-if="$slots.actions" class="flex items-center gap-2 shrink-0">
      <slot name="actions" />
    </div>
  </header>
</template>
