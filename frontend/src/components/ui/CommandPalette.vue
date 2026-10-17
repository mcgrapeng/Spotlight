<script setup lang="ts">
import { computed, ref } from 'vue'
import { useRouter } from 'vue-router'
import { useI18n } from 'vue-i18n'
import { useMagicKeys, whenever } from '@vueuse/core'
import {
  CommandDialog, CommandInput, CommandList,
  CommandEmpty, CommandGroup, CommandItem, CommandSeparator,
} from '@/components/ui/command'
import { Dialog, DialogContent, DialogTitle } from '@/components/ui/dialog'
import {
  LayoutDashboard, Box, Server, Activity, Star, Sparkles, Settings,
  RefreshCw, Bot, Keyboard,
} from '@lucide/vue'
import { isTypingTarget } from '@/composables/useKeyboardShortcuts'

const { t } = useI18n()
const router = useRouter()
const open = ref(false)
const shortcutsOpen = ref(false)

const keys = useMagicKeys()
const cmdK = computed(() => keys['Meta+K']?.value || keys['Ctrl+K']?.value)
const shiftSlash = computed(() => keys['Shift+/']?.value)  // ? key on US layout

whenever(cmdK, () => { open.value = true })
whenever(shiftSlash, () => {
  // "?" typed inside a text field is a character, not a shortcut
  if (isTypingTarget(document.activeElement)) return
  shortcutsOpen.value = true
})

// ponytail: 补全中英文双向 keywords，让中文用户能搜出、英文也能搜出 (Audit §2.4)
// label 是 chrome，跟随语言；keywords 是搜索索引，刻意保持双语不翻译 —— 否则英文界面
// 下中文用户（或反过来）就搜不到任何入口。
const navItems = computed(() => [
  { path: '/dashboard',  label: t('nav.dashboard'), icon: LayoutDashboard, keywords: ['dashboard', 'overview', '总览', '首页', 'home'] },
  { path: '/pods',       label: t('nav.pods'),      icon: Box,             keywords: ['pod', 'pods', '容器', 'workload', 'deployment'] },
  { path: '/nodes',      label: t('nav.nodes'),     icon: Server,          keywords: ['node', 'nodes', '节点', '机器', 'host'] },
  { path: '/events',     label: t('nav.events'),    icon: Activity,        keywords: ['event', 'events', '事件', '告警', 'warning'] },
  { path: '/favorites',  label: t('nav.favorites'), icon: Star,            keywords: ['favorite', 'favorites', '收藏', '书签', 'bookmark'] },
  { path: '/ai',         label: t('nav.ai'),        icon: Sparkles,        keywords: ['ai', 'model', 'llm', 'openai', 'anthropic', '设置', 'provider'] },
  { path: '/settings',   label: t('nav.settings'),  icon: Settings,        keywords: ['setting', 'settings', '配置', 'preferences', 'preference'] },
])

const actions = computed(() => [
  {
    id: 'refresh',
    label: t('palette.actions.refresh'),
    icon: RefreshCw,
    action: () => window.location.reload(),
    keywords: ['refresh', 'reload', '刷新', '重载'],
  },
  {
    id: 'ai',
    label: t('palette.actions.ai'),
    icon: Bot,
    action: () => router.push('/ai'),
    keywords: ['ai', 'assistant', '助手', '分析'],
  },
  {
    id: 'shortcuts',
    label: t('palette.actions.shortcuts'),
    icon: Keyboard,
    action: () => { shortcutsOpen.value = true },
    keywords: ['shortcuts', 'hotkeys', '快捷键', '?'],
  },
])

const shortcuts = computed(() => [
  { combo: '⌘ K / Ctrl K', desc: t('palette.shortcuts.openPalette') },
  { combo: 'g d / p / n / e / f / a', desc: t('palette.shortcuts.quickNav') },
  { combo: '? (Shift+/)', desc: t('palette.shortcuts.showPanel') },
  { combo: '/', desc: t('palette.shortcuts.focusSearch') },
  { combo: 'k / K', desc: t('palette.shortcuts.pauseStream') },
  { combo: 'l / L', desc: t('palette.shortcuts.toggleFollow') },
  { combo: 'c', desc: t('palette.shortcuts.copyAll') },
  { combo: '⌘ F', desc: t('palette.shortcuts.searchNative') },
])

function go(path: string) {
  router.push(path)
  open.value = false
}

function run(action: { action: () => void }) {
  action.action()
  open.value = false
}

defineExpose({
  open: () => { open.value = true },
  close: () => { open.value = false },
})
</script>

<template>
  <CommandDialog v-model:open="open">
    <CommandInput :placeholder="t('palette.placeholder')" />
    <CommandList>
      <CommandEmpty>{{ t('palette.noResults') }}</CommandEmpty>

      <CommandGroup :heading="t('palette.navGroup')">
        <CommandItem
          v-for="item in navItems"
          :key="item.path"
          :value="`${item.label} ${item.path} ${item.keywords.join(' ')}`"
          @select="go(item.path)"
        >
          <component :is="item.icon" :size="16" :stroke-width="1.75" class="mr-2" />
          <span>{{ item.label }}</span>
          <span class="ml-auto text-2xs text-muted-foreground font-mono">{{ item.path }}</span>
        </CommandItem>
      </CommandGroup>

      <CommandSeparator />

      <CommandGroup :heading="t('palette.actionsGroup')">
        <CommandItem
          v-for="action in actions"
          :key="action.id"
          :value="`${action.label} ${action.keywords.join(' ')}`"
          @select="run(action)"
        >
          <component :is="action.icon" :size="16" :stroke-width="1.75" class="mr-2" />
          <span>{{ action.label }}</span>
        </CommandItem>
      </CommandGroup>
    </CommandList>
    <!-- ponytail: footer 显示快捷键提示，让命令面板在第一次打开就有"专业工具"的感觉 -->
    <div class="border-t border-border px-3 py-2 flex items-center gap-3 text-2xs text-muted-foreground">
      <span><kbd class="font-mono">↑↓</kbd> {{ t('palette.footer.select') }}</span>
      <span><kbd class="font-mono">⏎</kbd> {{ t('palette.footer.open') }}</span>
      <span><kbd class="font-mono">esc</kbd> {{ t('palette.footer.close') }}</span>
      <span class="ml-auto"><kbd class="font-mono">?</kbd> {{ t('palette.footer.allShortcuts') }}</span>
    </div>
  </CommandDialog>

  <!-- 全局快捷键面板（reka Dialog：焦点陷阱 / Esc / 遮罩关闭） -->
  <Dialog :open="shortcutsOpen" @update:open="(v) => (shortcutsOpen = v)">
    <DialogContent class="sm:max-w-md">
      <DialogTitle class="flex items-center gap-2">
        <Keyboard :size="14" :stroke-width="1.75" />
        {{ t('palette.shortcutsTitle') }}
      </DialogTitle>
      <dl class="space-y-2">
        <div v-for="s in shortcuts" :key="s.combo" class="flex items-center gap-3 text-sm">
          <dt class="font-mono text-xs bg-muted px-2 py-0.5 rounded shrink-0 min-w-[140px] text-center">
            {{ s.combo }}
          </dt>
          <dd class="text-muted-foreground">{{ s.desc }}</dd>
        </div>
      </dl>
    </DialogContent>
  </Dialog>
</template>
