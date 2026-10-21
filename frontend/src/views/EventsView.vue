<script setup lang="ts">
import { computed, nextTick, onMounted, ref, watch, type ComponentPublicInstance } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { useI18n } from 'vue-i18n'
import { useEventListener } from '@vueuse/core'
import { RefreshCw, AlertTriangle, AlertCircle, ChevronDown, ChevronRight, Layers } from '@lucide/vue'
import { eventsApi } from '@/api/endpoints'
import { useClusterStore } from '@/stores/cluster'
import { useResource } from '@/composables/useResource'
import { useRelativeTime } from '@/composables/useRelativeTime'
import PageHeader from '@/components/common/PageHeader.vue'
import { Button } from '@/components/ui/button'
import LoadingState from '@/components/common/LoadingState.vue'
import ErrorState from '@/components/common/ErrorState.vue'
import EmptyState from '@/components/common/EmptyState.vue'
import StatusChip from '@/components/common/StatusChip.vue'
import { cn } from '@/lib/utils'
import { isAllNamespaces } from '@/utils/namespace'
import dayjs from '@/utils/dayjs'
import type { EventOut } from '@/api/types'

const { formatRel } = useRelativeTime()

const route = useRoute()
const router = useRouter()
const cluster = useClusterStore()
const { t } = useI18n()
const expanded = ref<Set<string>>(new Set())

// ponytail: 用 computed + setter 让 typeFilter 跟 URL query 双向同步
// (Dashboard ?type=Warning 跳转场景)，避免双向 watch 写错循环。
// set 时正确删除 key 而不是写 undefined —— Vue Router 4 把 undefined
// 当成字符串 'undefined' 保留在 URL 上，会让 refresh 后读到错值。
const VALID_TYPES = new Set(['Warning', 'Normal'])
const typeFilter = computed<'all' | 'Warning' | 'Normal'>({
  get() {
    const v = route.query.type as string | undefined
    if (v && VALID_TYPES.has(v)) return v as 'Warning' | 'Normal'
    return 'all'
  },
  set(v) {
    const newQuery = { ...route.query }
    if (v === 'all') {
      delete newQuery.type
    } else {
      newQuery.type = v
    }
    router.replace({ query: newQuery })
  },
})

function toggleExpand(name: string) {
  const next = new Set(expanded.value)
  if (next.has(name)) next.delete(name)
  else next.add(name)
  expanded.value = next
}

// Ponytail: 用 useResource 取代手写 onMounted+watch+loading+error 三件套。
// 这是 senior-engineer audit 里 #1 的样板重构。
const { data: events, loading, error, reload: load } = useResource<EventOut[]>(
  () => eventsApi.list({
    cluster: cluster.activeCluster,
    namespace: cluster.activeNamespace,
    limit: 500,
  }),
  {
    // cluster/namespace 任一变化就重拉
    watch: () => [cluster.activeCluster, cluster.activeNamespace],
    skip: () => !cluster.activeCluster,
  },
)

const filtered = computed(() => {
  if (typeFilter.value === 'all') return events.value ?? []
  return (events.value ?? []).filter(e => e.type === typeFilter.value)
})

const countByType = computed<Record<string, number>>(() => {
  const c: Record<string, number> = { Warning: 0, Normal: 0 }
  for (const e of events.value ?? []) {
    if (e.type in c) c[e.type]++
  }
  return c
})

const totalEvents = computed(() => events.value?.length ?? 0)

// ponytail: 消息按行截断，不按字数截断。
// 之前是「160 个字符就砍掉」—— 160 对英文够用（两行），对中文只够一句
// 话，而且砍在句子中间。现在折叠时用 line-clamp-3 砍在第三行的行尾。
//
// 什么时候显示「展开」按钮？按字数猜不准：中文一行约 78 字，英文一行
// 约 150 字符，宽度还随视口变。所以直接量 —— 折叠状态下 scrollHeight
// 大于 clientHeight 就是真的被截断了。
const overflows = ref<Set<string>>(new Set())
const msgEls = new Map<string, HTMLElement>()

function setMsgEl(name: string) {
  return (el: Element | ComponentPublicInstance | null) => {
    if (el instanceof HTMLElement) msgEls.set(name, el)
    else msgEls.delete(name)
  }
}

function measureOverflow() {
  const next = new Set<string>()
  for (const [name, el] of msgEls) {
    if (el.scrollHeight > el.clientHeight + 1) next.add(name)
  }
  overflows.value = next
}

onMounted(() => nextTick(measureOverflow))
watch(filtered, () => nextTick(measureOverflow))
// 视口变了，三行的容量也变了，截断状态要重新量。
useEventListener(window, 'resize', () => nextTick(measureOverflow))
</script>

<template>
  <PageHeader
    :title="`${t('route.events')} · ${cluster.activeCluster || ''}`"
    :subtitle="t('events.subtitle', {
      namespace: isAllNamespaces(cluster.activeNamespace)
        ? t('namespace.all')
        : cluster.activeNamespace,
      filtered: filtered.length,
      total: totalEvents,
    })"
  >
    <template #actions>
      <Button variant="outline" size="sm" @click="load" :loading="loading" :aria-label="t('events.refresh')">
        <template #icon>
          <RefreshCw :size="14" :stroke-width="1.75" />
        </template>
      </Button>
    </template>
    <template #extra>
      <div class="flex flex-wrap items-center gap-1.5 mt-3" role="tablist" :aria-label="t('events.filterByType')">
        <button
          v-for="tab in ['all', 'Warning', 'Normal'] as const"
          :key="tab"
          type="button"
          role="tab"
          :aria-selected="typeFilter === tab"
          @click="typeFilter = tab"
          :class="cn(
            'inline-flex items-center gap-2 h-8 px-3 rounded-md border text-xs font-medium transition-colors ease-app dur-fast',
            // ponytail: 三个 tab 的选中态统一。Warning 之前选中时是琥珀色
            // 填充，Normal 选中时是黑色 —— 用户最该点的过滤器反而比最不该点
            // 的弱。而且琥珀在这个产品里已经定义为「需要处理」，让一个控件
            // 染上它会污染语义。Warning 的身份由常驻的三角图标承担。
            typeFilter === tab
              ? 'bg-foreground text-background border-foreground'
              : 'bg-background text-muted-foreground border-border hover:bg-muted/40',
          )"
        >
          <AlertTriangle
            v-if="tab === 'Warning'"
            :size="12" :stroke-width="2" aria-hidden="true"
          />
          <AlertCircle
            v-else-if="tab === 'Normal'"
            :size="12" :stroke-width="2" aria-hidden="true"
          />
          <span>{{ tab === 'all' ? t('events.filterAll') : t(`eventType.${tab}`) }}</span>
          <span :class="cn(
            'tabular-nums text-2xs px-1.5 py-0.5 rounded-sm',
            typeFilter === tab ? 'bg-black/15' : 'bg-muted text-muted-foreground',
          )">{{ tab === 'all' ? totalEvents : countByType[tab] }}</span>
        </button>
        <span v-if="events && events.length > 0" class="text-xs text-muted-foreground ml-auto">
          {{ t('events.showingLatest', { count: events.length }) }}
        </span>
      </div>
    </template>
  </PageHeader>

  <!-- ponytail: 顶部 namespace 提示，让用户立刻知道当前在看哪个 namespace，
       避免 default (0 events) 被误认为"事件丢了"。点 [所有 namespace] 一键切换。 -->
  <div
    v-if="!isAllNamespaces(cluster.activeNamespace)"
    class="mt-3 flex items-center gap-2 px-3 py-2 rounded-md border border-border bg-muted/40 text-xs text-muted-foreground"
  >
    <Layers :size="14" :stroke-width="1.75" class="shrink-0" aria-hidden="true" />
    <i18n-t keypath="events.nsCurrent" tag="span">
      <template #namespace>
        <span class="font-mono text-foreground">{{ cluster.activeNamespace }}</span>
      </template>
    </i18n-t>
    <button
      type="button"
      class="inline-flex items-center gap-1 px-2 py-0.5 rounded-sm bg-foreground text-background hover:opacity-90 transition-opacity ease-app dur-fast font-medium"
      @click="cluster.setNamespace('_all')"
    >
      {{ t('namespace.all') }}
    </button>
    <span>{{ t('events.nsAllHint') }}</span>
  </div>

  <LoadingState v-if="loading && totalEvents === 0" />
  <ErrorState v-else-if="error" :message="error" @retry="load" />
  <EmptyState
    v-else-if="filtered.length === 0"
    :title="typeFilter === 'all' ? t('events.emptyTitle') : t('events.emptyFilteredTitle', { type: t(`eventType.${typeFilter}`) })"
    :description="typeFilter !== 'all'
      ? t('events.emptyFilteredDescription', { type: t(`eventType.${typeFilter}`) })
      : t('events.emptyDescription')"
  >
    <template v-if="typeFilter !== 'all'" #action>
      <Button variant="outline" size="sm" @click="typeFilter = 'all'">
        {{ t('events.viewAll') }}
      </Button>
    </template>
  </EmptyState>

  <div v-else class="space-y-2">
    <!-- 卡片统一为 div：把"展开"按钮塞进 router-link 是非法嵌套交互，
         详情跳转改由 footer 的独立链接承载（Audit §8.3）。 -->
    <div
      v-for="ev in filtered"
      :key="ev.name"
      :class="cn(
        'group block rounded-card border transition-colors ease-app dur-fast overflow-hidden',
        // ponytail: 卡片边框回到中性。之前是 border-warning/40，整张卡在
        // 暗色下变成一块棕褐色，信号被稀释了。告警的身份由左竖条 + 图标 +
        // 芯片承担，边框不需要再染一次色。
        ev.type === 'Warning'
          ? 'border-border bg-warning/5 hover:bg-warning/10 border-l-[3px] border-l-warning'
          : 'border-border bg-card opacity-90 hover:opacity-100 border-l-[3px] border-l-transparent',
      )"
    >
      <div class="flex items-start gap-3 p-3">
        <component
          :is="ev.type === 'Warning' ? AlertTriangle : AlertCircle"
          :size="20"
          :stroke-width="1.75"
          :class="cn(
            'shrink-0 mt-0.5',
            ev.type === 'Warning' ? 'text-warning' : 'text-muted-foreground',
          )"
          aria-hidden="true"
        />
        <div class="flex-1 min-w-0">
          <div class="flex items-center gap-2 flex-wrap">
            <StatusChip
              :tone="ev.type === 'Warning' ? 'warning' : 'neutral'"
              :label="t(`eventType.${ev.type}`)"
            />
            <span class="inline-flex items-center rounded-sm px-2 py-0.5 bg-muted text-foreground font-mono text-xs border border-border">{{ ev.reason }}</span>
            <span class="text-xs text-muted-foreground">{{ ev.namespace }}</span>
            <span class="text-xs text-muted-foreground font-mono">{{ ev.involved_kind }}/{{ ev.involved_name }}</span>
          </div>
          <!-- ponytail: message 是用户来 events 页面真正要读的内容，必须是视觉主角 -->
          <p
            :ref="setMsgEl(ev.name)"
            :class="cn(
              'mt-2 text-base leading-snug',
              expanded.has(ev.name) ? '' : 'line-clamp-3',
              ev.type === 'Warning' ? 'text-foreground font-medium' : 'text-foreground/80',
            )"
          >
            {{ ev.message }}
          </p>
          <div class="text-xs text-muted-foreground mt-2 flex items-center gap-3">
            <span :title="ev.last_seen ?? undefined">{{ formatRel(ev.last_seen ?? null) }}</span>
            <span v-if="ev.count > 1" class="inline-flex items-center gap-1">
              <span class="opacity-60">×</span>
              <span class="tabular-nums font-medium">{{ ev.count }}</span>
              <span class="opacity-60">{{ t('events.times') }}</span>
            </span>
            <div class="ml-auto flex items-center gap-3">
              <button
                v-if="overflows.has(ev.name) || expanded.has(ev.name)"
                type="button"
                class="inline-flex items-center gap-1 text-xs text-muted-foreground hover:text-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-background rounded-sm"
                @click.stop="toggleExpand(ev.name)"
              >
                <component
                  :is="expanded.has(ev.name) ? ChevronDown : ChevronRight"
                  :size="12" :stroke-width="2" aria-hidden="true"
                />
                {{ expanded.has(ev.name) ? t('events.collapse') : t('events.expand') }}
              </button>
              <router-link
                v-if="ev.involved_kind === 'Pod'"
                :to="{ name: 'pod-detail', params: { namespace: ev.namespace, name: ev.involved_name } }"
                class="inline-flex items-center gap-1 text-xs text-muted-foreground hover:text-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-background rounded-sm"
              >
                {{ t('events.viewDetail') }}
                <ChevronRight :size="12" :stroke-width="2" aria-hidden="true" />
              </router-link>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>
