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
      :class="cn(
        // ponytail: 暗色下不用反色填充。
        //
        // 反色填充在亮色下是「近黑底白图标」（对的），在暗色下就变成
        // rgb(245,245,245) 的一块白方块，坐在 rgb(24,24,27) 的侧栏上 ——
        // 整条侧栏最亮、最抢眼的东西，而它只是个主题开关。round-2 批过
        // 同一件事（侧边栏激活项的纯黑药丸）：「夜里三点，一块纯黑比一段
        // 文字重得多」——同一条理由，在暗色下指向的是那块白。
        //
        // 暗色下换成 accent 表面：比侧栏亮，但不是一个白方块。
        //
        // size-6 → size-7：这个分组在**侧边栏**（主导航区），不是日志
        // 那种密集工具栏。24px 低于 32px 的舒适下限，三个 24px 的按钮
        // 加起来刚好是「点不准」的手感。
        'inline-flex items-center justify-center size-7 rounded-md transition-colors ease-app dur-fast',
        'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-background',
        mode === opt.key
          ? 'bg-foreground text-background dark:bg-accent dark:text-accent-foreground'
          : 'text-muted-foreground hover:text-foreground',
      )"
      @click="setMode(opt.key)"
    >
      <component :is="opt.icon" :size="14" :stroke-width="1.75" aria-hidden="true" />
      <span class="sr-only">{{ t(opt.label) }}</span>
    </button>
    <span class="sr-only" aria-live="polite">{{ t(resolved === 'dark' ? 'theme.dark' : 'theme.light') }}</span>
  </div>
</template>
