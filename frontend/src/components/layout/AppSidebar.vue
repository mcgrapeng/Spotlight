<script setup lang="ts">
import { computed, onMounted, onUnmounted, ref, watch } from 'vue'
import { useRoute } from 'vue-router'
import { useI18n } from 'vue-i18n'
import {
  LayoutDashboard, Box, Server, Activity, Star, Sparkles, Settings,
  PanelLeftClose, PanelLeftOpen,
} from '@lucide/vue'
import { cn } from '@/lib/utils'
import { eventsApi } from '@/api/endpoints'
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
const badgeKey = computed(() =>
  STORAGE_KEYS.cacheEventsBadgeFor(
    cluster.activeCluster ?? 'none', cluster.activeNamespace || '_all',
  ),
)
const badgeFetch = useCachedFetch<number>({
  key: badgeKey.value,
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

const navItems = computed(() => [
  { path: '/dashboard', label: t('nav.dashboard'), icon: LayoutDashboard, badge: 0 },
  { path: '/pods',      label: t('nav.pods'),      icon: Box,        badge: 0 },
  { path: '/nodes',     label: t('nav.nodes'),     icon: Server,     badge: 0 },
  { path: '/events',    label: t('nav.events'),    icon: Activity,   badge: eventBadge.value },
  { path: '/favorites', label: t('nav.favorites'), icon: Star,       badge: 0 },
  { path: '/ai',        label: t('nav.ai'),        icon: Sparkles,   badge: 0 },
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
          'relative flex items-center gap-3 rounded-md text-sm font-medium transition-colors',
          'hover:bg-sidebar-accent',
          isActive(item.path)
            ? 'bg-foreground text-background hover:bg-foreground/90'
            : 'text-sidebar-foreground',
          props.collapsed ? 'justify-center h-10 w-10 mx-auto' : 'px-3 h-9',
        )"
        :aria-current="isActive(item.path) ? 'page' : undefined"
        @click="$emit('navigate')"
      >
        <component
          :is="item.icon"
          :size="18"
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
      <router-link
        to="/settings"
        :class="cn(
          'flex items-center gap-3 rounded-md text-sm font-medium transition-colors',
          'hover:bg-sidebar-accent',
          isActive('/settings')
            ? 'bg-foreground text-background hover:bg-foreground/90'
            : 'text-sidebar-foreground',
          props.collapsed ? 'justify-center h-10 w-10 mx-auto' : 'px-3 h-9',
        )"
        :aria-current="isActive('/settings') ? 'page' : undefined"
      >
        <Settings :size="18" :stroke-width="1.75" class="shrink-0" aria-hidden="true" />
        <span v-if="!props.collapsed">{{ t('nav.settings') }}</span>
      </router-link>
      <!-- ponytail: 折叠按钮贴在 sidebar 自己身上 —— 视觉归属清晰，logo 不被抢位 -->
      <button
        type="button"
        :class="cn(
          'flex items-center gap-3 rounded-md text-sm font-medium transition-colors',
          'hover:bg-sidebar-accent text-sidebar-foreground',
          props.collapsed ? 'justify-center h-10 w-10 mx-auto' : 'px-3 h-9',
        )"
        :aria-label="props.collapsed ? t('nav.expandSidebar') : t('nav.collapseSidebar')"
        :title="props.collapsed ? t('nav.expandSidebar') : t('nav.collapseSidebar')"
        @click="$emit('toggle-sidebar')"
      >
        <PanelLeftOpen v-if="props.collapsed" :size="18" :stroke-width="1.75" class="shrink-0" aria-hidden="true" />
        <PanelLeftClose v-else :size="18" :stroke-width="1.75" class="shrink-0" aria-hidden="true" />
        <span v-if="!props.collapsed">{{ t('nav.collapseSidebar') }}</span>
      </button>
    </div>
  </nav>
</template>
