<script setup lang="ts">
import { computed, nextTick, onMounted, onUnmounted, ref, watch } from 'vue'
import { useRoute } from 'vue-router'
import { useI18n } from 'vue-i18n'
import {
  LayoutDashboard, Box, Server, Activity, Star, Settings,
  PanelLeftClose, PanelLeftOpen, Bot,
} from '@lucide/vue'
import { cn } from '@/lib/utils'
import { eventsApi } from '@/api/endpoints'
import ThemeToggle from '@/components/common/ThemeToggle.vue'
import LocaleSwitcher from '@/i18n/LocaleSwitcher.vue'
import { useClusterStore } from '@/stores/cluster'
import { useCachedFetch } from '@/composables/useCachedFetch'
import { useAiStore } from '@/stores/ai'
import { STORAGE_KEYS } from '@/storage-keys'
import dayjs from '@/utils/dayjs'

const props = withDefaults(defineProps<{
  collapsed?: boolean
}>(), { collapsed: false })

const emit = defineEmits<{
  navigate: []
  'toggle-sidebar': []
}>()

const { t } = useI18n()
const route = useRoute()
const cluster = useClusterStore()
const ai = useAiStore()
const eventBadge = ref<number>(0)
let badgeTimer: ReturnType<typeof setInterval> | null = null

/**
 * 问 Spotlight —— 一个动作，不是一个页面。
 *
 * 之前这个面板只有两个入口：⌘J 和 ⌘K 面板里的一行。两个都是键盘和弦：
 * 新用户看不到，手机上没有和弦键，于是这个产品最能吹的那件事在手机上
 * 结构性不可达。现在它在侧栏里有一个带文字的按钮，桌面侧栏和手机抽屉
 * 里都在（两处渲染的是同一个组件）。
 *
 * 注意它不在导航项里 —— 导航项是「去哪里」，这个是「做什么」。所以它
 * 单独一行，样式也跟导航项区分开。
 */
function openAsk() {
  emit('navigate')   // 手机上先收起抽屉，别让两个 sheet 叠在一起
  void nextTick(() => ai.openAsk())
}

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
    // ponytail: 徽标数的是「最近 5 分钟里的告警」，和仪表盘那张卡的
    // 口径一样（后端 dashboard 的 warning_events 也是 5 分钟窗口）。
    //
    // 之前这里数的是「最近 500 条事件里有几条 Warning」—— 没有时间窗口。
    // 于是徽标可能显示 1，而仪表盘显示 0（或者反过来），两个数字在同一
    // 屏上打架，读者只能猜哪个是真的。
    //
    // 5 分钟这个窗口也是「需要处理」的时间尺度：一个 20 分钟前烧完就
    // 停了的问题，不该在侧边栏继续闪。
    const cutoff = dayjs().subtract(5, 'minute')
    return events.filter(
      (e) => e.type === 'Warning' && !!e.last_seen && dayjs(e.last_seen).isAfter(cutoff),
    ).length
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
  // 60s — the same cadence as the dashboard's own poll, so the badge and
  // the dashboard never disagree about how many warnings there are. The
  // page-level events view is still the source of truth; the badge is a
  // "there's something to look at" hint.
  badgeTimer = setInterval(refreshEventBadge, 60_000)
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
  {
    path: '/events',
    label: t('nav.events'),
    icon: Activity,
    badge: eventBadge.value,
    // ponytail: 徽标点进去就该是告警。
    //
    // 徽标写着「1」，读者点它的心理预期是「带我去看那 1 条」。之前跳转
    // 到 /events，而那一页默认列 500 条事件（真实集群：498 条 Normal、
    // 2 条 Warning），告警排在很后面。于是徽标说的是「有 1 条告警」，
    // 点进去看到的却是一屏调度完成的流水账。
    //
    // 没有徽标（没有告警）的时候还是普通的一页 —— 那时候读者要的就是
    // 全部事件。
    query: eventBadge.value > 0 ? { type: 'Warning' } : undefined,
  },
  { path: '/favorites', label: t('nav.favorites'), icon: Star,       badge: 0 },
])

const isActive = (path: string) =>
  route.path === path || route.path.startsWith(path + '/')
</script>

<template>
  <nav class="flex flex-col h-full py-3" :aria-label="t('nav.main')">
    <div class="flex-1 px-2 flex flex-col gap-0.5">
      <!--
        问 Spotlight：单独一行，放在导航项之前。

        它不是导航目的地（点了不会换路由，是打开一个覆盖面板），所以
        样式刻意和导航项区分开：带边框、底色更实。混在导航项里会被
        读成「另一个页面」，而它是「问一句话」。

        放在最上面是因为它是这个产品最该被看见的能力，而总览页恰恰
        是「还不知道该问哪个 Pod」的时候 —— 那正是该问的时刻。
      -->
      <button
        type="button"
        :class="cn(
          'mb-1 flex items-center gap-3 rounded-md text-sm font-medium transition-colors ease-app dur-fast',
          'border border-sidebar-border bg-sidebar-accent/50 hover:bg-sidebar-accent',
          'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-background',
          props.collapsed ? 'justify-center h-10 w-10 mx-auto' : 'px-3 h-9',
        )"
        :aria-label="t('nav.askAi')"
        :title="t('nav.askAi')"
        @click="openAsk"
      >
        <Bot :size="20" :stroke-width="1.75" class="shrink-0" aria-hidden="true" />
        <span v-if="!props.collapsed" class="truncate">{{ t('nav.askAi') }}</span>
      </button>

      <router-link
        v-for="item in navItems"
        :key="item.path"
        :to="{ path: item.path, query: item.query }"
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
          class="ml-auto inline-flex items-center justify-center h-5 min-w-[20px] px-1.5 rounded-full bg-warning text-warning-foreground text-xs font-semibold"
          :title="t('nav.warningBadgeHint')"
          :aria-label="t('nav.warningBadgeHint', { count: item.badge })"
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
