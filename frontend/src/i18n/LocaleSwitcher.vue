<script setup lang="ts">
import { useI18n } from 'vue-i18n'
import { setLocale, LOCALES, type Locale } from '@/i18n'
import { cn } from '@/lib/utils'

const { locale } = useI18n()

// ponytail: 调用方（AppHeader）需要把它放到 grid 的指定单元格里。
const props = defineProps<{ class?: string }>()

// Deliberately untranslated: `中文` and `EN` read the same in both locales, so
// the control never relabels itself and there is no chicken-and-egg problem.
const LABELS: Record<Locale, string> = {
  'zh-CN': '中文',
  'en-US': 'EN',
}

async function pick(l: Locale) {
  // Must await: `setLocale` hands off to dayjs after a microtask, so an
  // un-awaited call would paint one frame of stale-language timestamps.
  //
  // The `.catch()` mirrors the boot-time call in `main.ts` and is
  // belt-and-braces — both locales are statically registered, so nothing here can
  // reject today. It stays so that a future async loader surfaces as a no-op
  // instead of an unhandled rejection through Vue's async error handling.
  await setLocale(l).catch(() => {})
}
</script>

<template>
  <div
    role="group"
    :aria-label="'Language / 语言'"
    :class="cn('inline-flex items-center rounded-md border border-border p-0.5 shrink-0', props.class)"
  >
    <button
      v-for="l in LOCALES"
      :key="l"
      type="button"
      :aria-pressed="locale === l"
      :class="cn(
        'px-2 h-6 text-2xs font-medium rounded whitespace-nowrap shrink-0 transition-colors ease-app dur-fast',
        locale === l
          ? 'bg-foreground text-background'
          : 'text-muted-foreground hover:text-foreground',
      )"
      @click="pick(l)"
    >
      {{ LABELS[l] }}
    </button>
  </div>
</template>
