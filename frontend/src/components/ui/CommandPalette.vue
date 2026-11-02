<script setup lang="ts">
import { computed, defineComponent, nextTick, ref, shallowRef, watch } from 'vue'
import { useRouter } from 'vue-router'
import { useI18n } from 'vue-i18n'
import { useMagicKeys, whenever } from '@vueuse/core'
import {
  CommandDialog, CommandInput, CommandList,
  CommandEmpty, CommandGroup, CommandItem, CommandSeparator,
  useCommand, useCommandGroup,
} from '@/components/ui/command'
import { Dialog, DialogContent, DialogTitle } from '@/components/ui/dialog'
import {
  LayoutDashboard, Box, Server, Activity, Star, Sparkles, Settings,
  RefreshCw, Bot, Keyboard,
} from '@lucide/vue'
import { isTypingTarget, keyboardRegionClaimed } from '@/composables/useKeyboardShortcuts'
import { podsApi } from '@/api/endpoints'
import { useClusterStore } from '@/stores/cluster'
import { useAiStore } from '@/stores/ai'
import type { PodOut } from '@/api/types'

const { t } = useI18n()
const router = useRouter()
const cluster = useClusterStore()
const aiStore = useAiStore()
const open = ref(false)
const shortcutsOpen = ref(false)

const keys = useMagicKeys()
const cmdK = computed(() => keys['Meta+K']?.value || keys['Ctrl+K']?.value)
const shiftSlash = computed(() => keys['Shift+/']?.value)  // ? key on US layout

whenever(cmdK, () => { open.value = true })
whenever(shiftSlash, () => {
  // "?" typed inside a text field is a character, not a shortcut
  if (isTypingTarget(document.activeElement)) return
  // The log viewer has its own `?` panel, and it is the accurate one
  // (it lists the log's real bindings). Two panels opening on one keypress
  // is worse than neither.
  if (keyboardRegionClaimed.value) return
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
    action: () => { aiStore.openAsk(); open.value = false },
    keywords: ['ai', 'assistant', '助手', '分析', 'ask', '问'],
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
  { combo: 'g then d/p/n/e/f', desc: t('palette.shortcuts.quickNav') },
  { combo: '⌘ J / Ctrl J', desc: t('palette.shortcuts.openAi') },
  { combo: '? (Shift+/)', desc: t('palette.shortcuts.showPanel') },
  // ponytail: 这一组以前写的是「k/K 暂停流、l/L 切换跟随、c 复制全部」。
  // 三个键都对不上实现：暂停是 p，自动跟随根本没有快捷键，c 是清空日志
  // 不是复制。面板在教一套不存在的操作。
  { combo: 'f / /', desc: t('log.help.focusSearch') },
  { combo: 'e', desc: t('log.help.errorsOnly') },
  { combo: 'p', desc: t('log.help.pause') },
  { combo: 'c', desc: t('log.help.clear') },
  { combo: 'g / G', desc: t('log.help.jumpError') },
  { combo: 'j / k', desc: t('log.help.scroll') },
  { combo: '⌘ F', desc: t('palette.shortcuts.searchNative') },
])

/* ------------------------------------------------------------------ *
 * 资源：Pod 模糊搜索
 * ------------------------------------------------------------------ */

// ponytail: 过滤状态在 <Command> 的 provide 里（command/Command.vue 自己实现
// 了一套 filter state machine）。命令面板只是它的插槽拥有者，拿不到那个
// provide —— 但插槽内容在渲染树里的祖先就是 <Command>，所以塞一个什么都
// 不渲染的小组件进去，就能把上下文和资源组的 id 递出来。
const commandCtx = shallowRef<ReturnType<typeof useCommand> | null>(null)
const resourcesGroupId = ref<string | undefined>(undefined)

const CaptureResources = defineComponent({
  setup() {
    commandCtx.value = useCommand()
    resourcesGroupId.value = useCommandGroup()?.id
    return () => null
  },
})

// 搜索词以组件库的 filterState 为准 —— 面板自己的输入框写的就是它，
// 两边分家就会出现「框里是空的、结果还在筛」这种对不上的状态。
const search = computed(() => commandCtx.value?.filterState.search ?? '')

const pods = shallowRef<PodOut[]>([])
const podsLoading = ref(false)
const POD_MATCH_CAP = 20
/**
 * Two characters minimum.
 *
 * The pods endpoint has no limit — one call returns every pod in the
 * cluster. The palette used to fetch that whole list every time it was
 * opened (a few MB on a large cluster) and then threw all but 20 rows
 * away client-side. The endpoint already filters by name / container /
 * node / namespace, so the query goes to the server and the list only
 * arrives when there is something to search for.
 */
const MIN_POD_QUERY = 2
// Orders the requests: a slow one that lands after a newer one must not
// overwrite it.
let podsSeq = 0

async function loadPods(query: string) {
  const q = query.trim()
  const mine = ++podsSeq
  if (q.length < MIN_POD_QUERY) {
    pods.value = []
    podsLoading.value = false
    return
  }
  podsLoading.value = true
  try {
    const res = await podsApi.list({
      cluster: cluster.activeCluster,
      namespace: cluster.activeNamespace,
      search: q,
    })
    if (mine !== podsSeq) return
    pods.value = res.items
  } catch {
    if (mine !== podsSeq) return
    // 拉不到 Pod 不该让面板罢工 —— 资源区空着，其他分组照常用。
    pods.value = []
  } finally {
    if (mine === podsSeq) podsLoading.value = false
  }
}

watch(open, (v) => {
  if (!v) return
  void loadPods(search.value)
})

// The search box drives the query. Debounced: one request per keystroke
// is one request too many.
let searchTimer: ReturnType<typeof setTimeout> | null = null
watch(search, (q) => {
  if (!open.value) return
  if (searchTimer) clearTimeout(searchTimer)
  searchTimer = setTimeout(() => { void loadPods(q) }, 200)
})

const podMatches = computed(() => pods.value.slice(0, POD_MATCH_CAP))

/** Why the resources section is empty: nothing typed yet, or no match. */
const podHint = computed(() =>
  search.value.trim().length < MIN_POD_QUERY
    ? t('palette.resourcesTypeToSearch')
    : t('palette.resourcesEmpty'),
)

// ponytail: 组件库只在「搜索词变了」的时候重算一次过滤表，而 Pod 是异步
// 拉回来的：用户先打字、Pod 后到 → 这批条目从没被计过分，所在的 group 会
// 一直停在 hidden，资源区看着是空的。这里在 Pod 到达后把 group 放回可见
// 集合。只加 id、不改搜索词 —— 改搜索词会打断用户正在进行的输入法组合。
watch(podMatches, async () => {
  if (!podMatches.value.length) return
  await nextTick()
  const ctx = commandCtx.value
  const id = resourcesGroupId.value
  if (!ctx || !id) return
  ctx.filterState.filtered.groups.add(id)
})

function go(path: string) {
  router.push(path)
  open.value = false
}

function goPod(pod: PodOut) {
  router.push({ name: 'pod-detail', params: { namespace: pod.namespace, name: pod.name } })
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
          <span class="ml-auto text-xs text-muted-foreground font-mono">{{ item.path }}</span>
        </CommandItem>
      </CommandGroup>

      <CommandSeparator />

      <!-- 资源：Pod 模糊搜索。标题放在组外 —— 组件库在「搜不到」时会把整组
           隐藏掉，标题跟着一起消失的话，用户看不到这一区为什么是空的。
           外层 p-1 + 组内 p-0 是为了跟「导航」「操作」两组的缩进和行距对齐。 -->
      <div class="p-1">
        <div class="px-2 py-1.5 text-xs font-medium text-muted-foreground">
          {{ t('palette.resourcesGroup') }}
        </div>
        <CommandGroup
          class="p-0"
          :aria-label="t('palette.actions.jumpToPod')"
        >
          <CaptureResources />
          <CommandItem
            v-for="pod in podMatches"
            :key="`${pod.namespace}/${pod.name}`"
            :value="`${pod.name} ${pod.namespace}`"
            @select="goPod(pod)"
          >
            <Box :size="16" :stroke-width="1.75" class="mr-2" />
            <span class="font-mono truncate">{{ pod.name }}</span>
            <span class="ml-auto text-xs text-muted-foreground font-mono shrink-0">{{ pod.namespace }}</span>
          </CommandItem>
        </CommandGroup>
        <div
          v-if="!podMatches.length && !podsLoading"
          class="px-2 py-1.5 text-xs text-muted-foreground"
        >
          {{ podHint }}
        </div>
      </div>

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
    <div class="border-t border-border px-3 py-2 flex items-center gap-3 text-xs text-muted-foreground">
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
          <dt class="font-mono text-xs bg-muted px-2 py-0.5 rounded-sm shrink-0 min-w-[140px] text-center">
            {{ s.combo }}
          </dt>
          <dd class="text-muted-foreground">{{ s.desc }}</dd>
        </div>
      </dl>
    </DialogContent>
  </Dialog>
</template>
