<script setup lang="ts">
import { computed, ref } from 'vue'
import { useRouter } from 'vue-router'
import { useMagicKeys, whenever } from '@vueuse/core'
import {
  CommandDialog, CommandInput, CommandList,
  CommandEmpty, CommandGroup, CommandItem, CommandSeparator,
} from '@/components/ui/command'
import {
  LayoutDashboard, Box, Server, Activity, Star, Sparkles, Settings,
  RefreshCw, Bot,
} from '@lucide/vue'

const router = useRouter()
const open = ref(false)

const keys = useMagicKeys()
const cmdK = computed(() => keys['Meta+K']?.value || keys['Ctrl+K']?.value)

whenever(cmdK, () => {
  open.value = true
})

const navItems = [
  { path: '/dashboard',  label: '总览',    icon: LayoutDashboard, keywords: ['dashboard', 'overview', '总览'] },
  { path: '/pods',       label: 'Pods',    icon: Box,             keywords: ['pod', '容器'] },
  { path: '/nodes',      label: 'Nodes',   icon: Server,          keywords: ['node', '节点'] },
  { path: '/events',     label: 'Events',  icon: Activity,        keywords: ['event', '事件'] },
  { path: '/favorites',  label: '收藏夹',  icon: Star,            keywords: ['favorite', '收藏'] },
  { path: '/ai',         label: 'AI 模型', icon: Sparkles,        keywords: ['ai', 'model', '设置'] },
  { path: '/settings',   label: '设置',    icon: Settings,        keywords: ['setting', '配置'] },
]

const actions = [
  {
    id: 'refresh',
    label: '刷新当前页面',
    icon: RefreshCw,
    action: () => window.location.reload(),
    keywords: ['refresh', 'reload', '刷新'],
  },
  {
    id: 'ai',
    label: '打开 AI 助手',
    icon: Bot,
    action: () => router.push('/ai'),
    keywords: ['ai', 'assistant', '助手'],
  },
]

function go(path: string) {
  router.push(path)
  open.value = false
}

function run(action: { action: () => void }) {
  action.action()
  open.value = false
}

// Exposed for AppLayout's keyboard-shortcut handler and AppHeader's open-palette event.
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
  </CommandDialog>
</template>
