<script setup lang="ts">
import { Monitor, Moon, Sun } from '@lucide/vue'
import { useI18n } from 'vue-i18n'
import { cn } from '@/lib/utils'
import { useTheme, type ThemeMode } from '@/composables/useTheme'

const { t } = useI18n()
const { mode, resolved, setMode } = useTheme()

const OPTIONS: Array<{ key: ThemeMode; icon: typeof Sun; label: string }> = [
  { key: 'light', icon: Sun, label: 'theme.light' },
  { key: 'dark', icon: Moon, label: 'theme.dark' },
  { key: 'system', icon: Monitor, label: 'theme.system' },
]
</script>

<template>
  <div role="group" :aria-label="t('theme.label')" class="inline-flex items-center rounded-md border border-border p-0.5">
    <button
      v-for="opt in OPTIONS"
      :key="opt.key"
      type="button"
      :aria-pressed="mode === opt.key"
      :title="t(opt.label)"
      :class="cn('inline-flex items-center justify-center size-6 rounded transition-colors', 'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring', mode === opt.key ? 'bg-foreground text-background' : 'text-muted-foreground hover:text-foreground')"
      @click="setMode(opt.key)"
    >
      <component :is="opt.icon" :size="13" :stroke-width="1.75" aria-hidden="true" />
      <span class="sr-only">{{ t(opt.label) }}</span>
    </button>
    <span class="sr-only" aria-live="polite">{{ t(resolved === 'dark' ? 'theme.dark' : 'theme.light') }}</span>
  </div>
</template>
