<script setup lang="ts">
import { computed } from 'vue'
import { getSeverityToken } from '@/utils/severity'
import type { LogSeverity } from '@/api/types'

const props = defineProps<{ severity: LogSeverity | string }>()
const token = computed(() => getSeverityToken(props.severity))
</script>

<template>
  <span
    v-if="token.label"
    class="severity-chip"
    :style="{ color: token.fg, background: token.bg, borderColor: token.border }"
  >{{ token.label }}</span>
</template>
