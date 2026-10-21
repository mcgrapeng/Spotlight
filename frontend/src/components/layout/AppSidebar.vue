<script setup lang="ts">
import { computed, onMounted, onUnmounted, ref, watch } from 'vue'
import { useRoute } from 'vue-router'
import { useI18n } from 'vue-i18n'
import {
  LayoutDashboard, Box, Server, Activity, Star, Settings,
  PanelLeftClose, PanelLeftOpen,
} from '@lucide/vue'
import { cn } from '@/lib/utils'
import { eventsApi } from '@/api/endpoints'
import ThemeToggle from '@/components/common/ThemeToggle.vue'
import LocaleSwitcher from '@/i18n/LocaleSwitcher.vue'
import { useClusterStore } from '@/stores/cluster'
import { useCachedFetch } from '@/composables/useCachedFetch'
import { STORAGE_KEYS } from '@/storage-keys'

const props = withDefaults(defineProps<{
  collapsed?: boolean
}>(), { collapsed: false })

defineEmits<{
  navigate: []
  'toggle-sidebar': []
}>()

const { t } = useI18n()
const route = useRoute()
const cluster = useClusterStore()
const eventBadge = ref<number>(0)
let badgeTimer: ReturnType<typeof setInterval> | null = null

// ponytail: badge namespace 跟随顶部 combobox，与 Events 页面对齐。
// 否则用户在 default namespace 看到 badge 24 但页面 0 条，怀疑事件丢了。
// (Audit §2.3 + 用户实测反馈)
const badgeFetch = useCachedFetch<number>({
  key: '',
  fetcher: async () => {
    const events = await eventsApi.list({
      cluster: cluster.activeCluster,
      namespace: cluster.activeNamespace || '_all',
      limit: 500,
    })
    return events.filter(e => e.type === 'Warning').length
  },
  data: ref<number | null>(null) as unknown as import('vue').Ref<number | null>,
  loading: ref(false) as unknown as import('vue').Ref<boolean>,
  error: ref<string | null>(null) as unknown as import('vue').Ref<string | null>,
  ttlMs: 30_000,
})
// ponytail: hydrate from cache on mount and watch keys — useCachedFetch handles
// the localStorage TTL check, so this stays the only path that actually hits
// the network every 5 min (vs. 1 min before). 5 min is fine for a sidebar
// badge — the user clicks /events to see the live list anyway.
async function refreshEventBadge() {
  if (!cluster.activeCluster) {
    eventBadge.value = 0
    return
  }
  // Rekey before reading: the watchers below fire on cluster/namespace change,
  // and a handle pinned to the setup-time key would keep replaying the count
  // captured for whatever was selected on mount.
  badgeFetch.rekey(STORAGE_KEYS.cacheEventsBadgeFor(
    cluster.activeCluster, cluster.activeNamespace || '_all',
  ))
  try {
    const v = await badgeFetch.loadOrHydrate()
    if (typeof v === 'number') eventBadge.value = v
  } catch { /* keep last value */ }
}

onMounted(() => {
  refreshEventBadge()
  // 5min — the page-level events view is the source of truth; the sidebar
  // badge is a "there's something to look at" hint, not a real-time counter.
  badgeTimer = setInterval(refreshEventBadge, 5 * 60_000)
})
onUnmounted(() => {
  if (badgeTimer) clearInterval(badgeTimer)
})
watch(() => cluster.activeCluster, refreshEventBadge)
watch(() => cluster.activeNamespace, refreshEventBadge)

// ponytail: 导航只放「工作面」。AI 模型是配置页，住在设置里（`/ai` 路径不动，
// 书签不失效），不跟总览 / Pods 这类每天干活的面并排。
const navItems = computed(() => [
  { path: '/dashboard', label: t('nav.dashboard'), icon: LayoutDashboard, badge: 0 },
  { path: '/pods',      label: t('nav.pods'),      icon: Box,        badge: 0 },
  { path: '/nodes',     label: t('nav.nodes'),     icon: Server,     badge: 0 },
  { path: '/events',    label: t('nav.events'),    icon: Activity,   badge: eventBadge.value },
  { path: '/favorites', label: t('nav.favorites'), icon: Star,       badge: 0 },
])

const isActive = (path: string) =>
  route.path === path || route.path.startsWith(path + '/')
</script>

<template>
  <nav class="flex flex-col h-full py-3" :aria-label="t('nav.main')">
    <div class="flex-1 px-2 flex flex-col gap-0.5">
      <router-link
        v-for="item in navItems"
        :key="item.path"
        :to="item.path"
        :class="cn(
          'relative flex items-center gap-3 rounded-md text-sm transition-colors ease-app dur-fast',
          'hover:bg-sidebar-accent',
          'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-background',
          // ponytail: 激活项从纯黑药丸改成「更深的字 + 一条竖线」。
          // 纯反色让侧栏里最亮的色块是当前项，而读者的视线应该在内容上；
          // 夜里 3 点，屏幕上一块纯黑比一段文字重得多。
          //
          // 但也不能只是换个浅灰底：--accent 和 --sidebar-accent 在亮色下
          // 是同一个值（#F4F4F5），而 --accent-foreground 和
          // --sidebar-foreground 也是同一个值 —— 那样「当前项」和「鼠标
          // 悬停的那一项」长得一模一样，而当前项和普通项只差 1.03:1 的
          // 对比，等于没有标记。所以标记由竖线和字重承担：颜色最深的
          // 那一项是当前页，悬停只是一层很淡的底。
          isActive(item.path)
            ? 'text-sidebar-foreground font-semibold'
            : 'text-muted-foreground font-medium',
          props.collapsed ? 'justify-center h-10 w-10 mx-auto' : 'px-3 h-9',
        )"
        :aria-current="isActive(item.path) ? 'page' : undefined"
        @click="$emit('navigate')"
      >
        <span
          v-if="isActive(item.path)"
          class="absolute -left-0.5 top-1/2 h-4 w-0.5 -translate-y-1/2 rounded-full bg-sidebar-foreground"
          aria-hidden="true"
        />
        <component
          :is="item.icon"
          :size="20"
          :stroke-width="1.75"
          class="shrink-0"
          aria-hidden="true"
        />
        <span v-if="!props.collapsed" class="flex-1 truncate">{{ item.label }}</span>
        <span
          v-if="!props.collapsed && item.badge"
          class="ml-auto inline-flex items-center justify-center h-5 min-w-[20px] px-1.5 rounded-full bg-warning text-warning-foreground text-2xs font-semibold"
        >
          {{ item.badge }}
        </span>
        <span
          v-else-if="props.collapsed && item.badge"
          class="absolute top-1.5 right-1.5 h-1.5 w-1.5 rounded-full bg-warning"
          aria-hidden="true"
        />
      </router-link>
    </div>

    <div class="px-2 pt-2 border-t border-sidebar-border flex flex-col gap-0.5">
      <!--
        ponytail: 偏好（主题 + 语言）挨着设置放在侧边栏底部。
        这两样一天用一次，顶栏最好的位置应该留给「范围」（集群 + 命名空间）。
        折叠态整行不渲染：侧边栏折叠后只剩 64px，内容盒 48px，而主题切换
        本身就有 78px —— 塞进去会被 aside 的 overflow-hidden 切掉一截，
        「跟随系统」那个按钮既看不全也点不到。折叠态去设置页改主题。
      -->
      <div
        v-if="!props.collapsed"
        class="flex items-center gap-1 shrink-0 px-3 h-9"
      >
        <ThemeToggle />
        <LocaleSwitcher class="ml-auto" />
      </div>
      <router-link
        to="/settings"
        :class="cn(
          'relative flex items-center gap-3 rounded-md text-sm transition-colors ease-app dur-fast',
          'hover:bg-sidebar-accent',
          'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-background',
          isActive('/settings')
            ? 'text-sidebar-foreground font-semibold'
            : 'text-muted-foreground font-medium',
          props.collapsed ? 'justify-center h-10 w-10 mx-auto' : 'px-3 h-9',
        )"
        :aria-current="isActive('/settings') ? 'page' : undefined"
      >
        <span
          v-if="isActive('/settings')"
          class="absolute -left-0.5 top-1/2 h-4 w-0.5 -translate-y-1/2 rounded-full bg-sidebar-foreground"
          aria-hidden="true"
        />
        <Settings :size="20" :stroke-width="1.75" class="shrink-0" aria-hidden="true" />
        <span v-if="!props.collapsed">{{ t('nav.settings') }}</span>
      </router-link>
      <!-- ponytail: 折叠按钮贴在 sidebar 自己身上 —— 视觉归属清晰，logo 不被抢位 -->
      <button
        type="button"
        :class="cn(
          'flex items-center gap-3 rounded-md text-sm font-medium transition-colors ease-app dur-fast',
          'hover:bg-sidebar-accent text-muted-foreground',
          'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-background',
          props.collapsed ? 'justify-center h-10 w-10 mx-auto' : 'px-3 h-9',
        )"
        :aria-label="props.collapsed ? t('nav.expandSidebar') : t('nav.collapseSidebar')"
        :title="props.collapsed ? t('nav.expandSidebar') : t('nav.collapseSidebar')"
        @click="$emit('toggle-sidebar')"
      >
        <PanelLeftOpen v-if="props.collapsed" :size="20" :stroke-width="1.75" class="shrink-0" aria-hidden="true" />
        <PanelLeftClose v-else :size="20" :stroke-width="1.75" class="shrink-0" aria-hidden="true" />
        <span v-if="!props.collapsed">{{ t('nav.collapseSidebar') }}</span>
      </button>
    </div>
  </nav>
</template>
