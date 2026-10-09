<script setup lang="ts">
import { computed, ref } from 'vue'
import { useRouter } from 'vue-router'
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
const navItems = [
  { path: '/dashboard',  label: '总览',    icon: LayoutDashboard, keywords: ['dashboard', 'overview', '总览', '首页', 'home'] },
  { path: '/pods',       label: 'Pods',    icon: Box,             keywords: ['pod', 'pods', '容器', 'workload', 'deployment'] },
  { path: '/nodes',      label: 'Nodes',   icon: Server,          keywords: ['node', 'nodes', '节点', '机器', 'host'] },
  { path: '/events',     label: 'Events',  icon: Activity,        keywords: ['event', 'events', '事件', '告警', 'warning'] },
  { path: '/favorites',  label: '收藏夹',  icon: Star,            keywords: ['favorite', 'favorites', '收藏', '书签', 'bookmark'] },
  { path: '/ai',         label: 'AI 模型', icon: Sparkles,        keywords: ['ai', 'model', 'llm', 'openai', 'anthropic', '设置', 'provider'] },
  { path: '/settings',   label: '设置',    icon: Settings,        keywords: ['setting', 'settings', '配置', 'preferences', 'preference'] },
]

const actions = [
  {
    id: 'refresh',
    label: '刷新当前页面',
    icon: RefreshCw,
    action: () => window.location.reload(),
    keywords: ['refresh', 'reload', '刷新', '重载'],
  },
  {
    id: 'ai',
    label: '打开 AI 助手',
    icon: Bot,
    action: () => router.push('/ai'),
    keywords: ['ai', 'assistant', '助手', '分析'],
  },
  {
    id: 'shortcuts',
    label: '显示快捷键面板',
    icon: Keyboard,
    action: () => { shortcutsOpen.value = true },
    keywords: ['shortcuts', 'hotkeys', '快捷键', '?'],
  },
]

const shortcuts = [
  { combo: '⌘ K / Ctrl K', desc: '打开命令面板' },
  { combo: 'g d / p / n / e / f / a', desc: '快速跳转（总览/Pods/Nodes/Events/Favorites/AI）' },
  { combo: '? (Shift+/)', desc: '显示快捷键面板' },
  { combo: '/', desc: 'LogViewer 聚焦搜索' },
  { combo: 'k / K', desc: 'LogViewer 暂停/继续流' },
  { combo: 'l / L', desc: 'LogViewer 切换自动跟随' },
  { combo: 'c', desc: 'LogViewer 复制全部' },
  { combo: '⌘ F', desc: 'LogViewer 搜索（保留原生行为）' },
]

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
    <CommandInput placeholder="输入命令、页面或操作…" />
    <CommandList>
      <CommandEmpty>未找到结果。</CommandEmpty>

      <CommandGroup heading="导航">
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

      <CommandGroup heading="操作">
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
      <span><kbd class="font-mono">↑↓</kbd> 选择</span>
      <span><kbd class="font-mono">⏎</kbd> 打开</span>
      <span><kbd class="font-mono">esc</kbd> 关闭</span>
      <span class="ml-auto"><kbd class="font-mono">?</kbd> 全部快捷键</span>
    </div>
  </CommandDialog>

  <!-- 全局快捷键面板（reka Dialog：焦点陷阱 / Esc / 遮罩关闭） -->
  <Dialog :open="shortcutsOpen" @update:open="(v) => (shortcutsOpen = v)">
    <DialogContent class="sm:max-w-md">
      <DialogTitle class="flex items-center gap-2">
        <Keyboard :size="14" :stroke-width="1.75" />
        快捷键
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
