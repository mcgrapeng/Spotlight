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
import PermissionDenied from '@/components/common/PermissionDenied.vue'
import StatusChip from '@/components/common/StatusChip.vue'
import ReasonChip from '@/components/common/ReasonChip.vue'
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

function toggleExpand(name: string) {
  const next = new Set(expanded.value)
  if (next.has(name)) next.delete(name)
  else next.add(name)
  expanded.value = next
}

/**
 * 事件能跳到哪里去。
 *
 * Pod 事件跳 Pod 详情页；Node 事件跳节点页（节点页没有单节点详情，
 * 但那是唯一能查到那个节点的地方）。其它种类（Job、Deployment…）
 * 在这个产品里没有对应页面 —— 那就不给它们一个假链接，让读者点进
 * 一个查不到东西的地方。
 */
function eventTarget(ev: EventOut): { name: string; params?: Record<string, string> } | null {
  if (ev.involved_kind === 'Pod') {
    return { name: 'pod-detail', params: { namespace: ev.namespace, name: ev.involved_name } }
  }
  if (ev.involved_kind === 'Node') return { name: 'nodes' }
  return null
}

// Ponytail: 用 useResource 取代手写 onMounted+watch+loading+error 三件套。
// 这是 senior-engineer audit 里 #1 的样板重构。
const { data: events, loading, error, errorStatus, errorPermission, reload: load } = useResource<EventOut[]>(
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

/**
 * 没权限读事件列表，是一种状态，不是「这里是空的」。
 *
 * 「0 / 0 个事件」是关于集群的**假事实**——它会让值班的人以为这个集群
 * 真的没有事件，转头去做别的检查。所以副标题也不能那么写。
 */
const permissionDenied = computed(() => errorStatus.value === 403)

const filtered = computed(() => {
  if (typeFilter.value === 'all') return events.value ?? []
  return (events.value ?? []).filter(e => e.type === typeFilter.value)
})

/** 每条事件的目标，预先算好 —— 模板里不要重复调用。 */
const eventTargets = computed(() => {
  const map = new Map<string, { name: string; params?: Record<string, string> }>()
  for (const e of filtered.value) {
    const t = eventTarget(e)
    if (t) map.set(e.name, t)
  }
  return map
})

const countByType = computed<Record<string, number>>(() => {
  const c: Record<string, number> = { Warning: 0, Normal: 0 }
  for (const e of events.value ?? []) {
    if (e.type in c) c[e.type]++
  }
  return c
})

const totalEvents = computed(() => events.value?.length ?? 0)

// ponytail: 用 computed + setter 让 typeFilter 跟 URL query 双向同步
// (Dashboard ?type=Warning 跳转场景)，避免双向 watch 写错循环。
// set 时正确删除 key 而不是写 undefined —— Vue Router 4 把 undefined
// 当成字符串 'undefined' 保留在 URL 上，会让 refresh 后读到错值。
const VALID_TYPES = new Set(['Warning', 'Normal'])

// ponytail: 没有显式选择时，有告警就先给告警。
//
// 真实集群上一次拉回来 500 条事件，其中 498 条 Normal（Pod 调度完了、
// Job 跑完了、镜像拉下来了），2 条 Warning。默认筛「全部」的话，那 2 条
// 告警排在第 400 行往下 —— 一页 25 行，读者翻到第二页才可能看见，
// 而他点进 Events 页的原因就是「有没有出事」。
//
// 规则要说清楚，所以它不是「总是默认 Warning」：没有告警的时候默认仍是
// 全部（一页空白比一页噪声更糟）；URL 里带了 ?type= 的永远听 URL 的
// （侧边栏徽标跳过来时带的就是这个参数）。
//
// 手动选「全部」会写成 ?type=all，而不是把参数删掉 —— 删掉的话这个
// 默认值又会把人按回 Warning，「全部」这一档就永远点不动了。
const hasWarnings = computed(() => countByType.value.Warning > 0)

const typeFilter = computed<'all' | 'Warning' | 'Normal'>({
  get() {
    const v = route.query.type as string | undefined
    if (v === 'all') return 'all'
    if (v && VALID_TYPES.has(v)) return v as 'Warning' | 'Normal'
    return hasWarnings.value ? 'Warning' : 'all'
  },
  set(v) {
    router.replace({ query: { ...route.query, type: v } })
  },
})

// ponytail: 消息按行截断，不按字数截断。
// 之前是「160 个字符就砍掉」—— 160 对英文够用（两行），对中文只够一句
// 话，而且砍在句子中间。现在折叠时用 line-clamp-3 砍在第三行的行尾。
//
// 什么时候显示「展开」按钮？按字数猜不准：中文一行约 78 字，英文一行
// 约 150 字符，宽度还随视口变。所以直接量 —— 折叠状态下 scrollHeight
// 大于 clientHeight 就是真的被截断了。
const overflows = ref<Set<string>>(new Set())
const msgEls = new Map<string, HTMLElement>()
let resizeFrame: number | null = null

function setMsgEl(name: string) {
  return (el: Element | ComponentPublicInstance | null) => {
    if (el instanceof HTMLElement) msgEls.set(name, el)
    else msgEls.delete(name)
  }
}

function measureOverflow() {
  const next = new Set<string>()
  for (const [name, el] of msgEls) {
    // An expanded message has no clamp, so it measures as "not
    // overflowing" — but it is exactly the ones that overflowed. Keep
    // them, or collapsing one would drop its own "expand" button and
    // strand the rest of the message.
    if (expanded.value.has(name)) {
      next.add(name)
      continue
    }
    if (el.scrollHeight > el.clientHeight + 1) next.add(name)
  }
  overflows.value = next
}

onMounted(() => nextTick(measureOverflow))
watch(filtered, () => nextTick(measureOverflow))
// The clamp comes back when a message collapses, so the button has to be
// re-measured then too.
watch(expanded, () => nextTick(measureOverflow))
// 视口变了，三行的容量也变了，截断状态要重新量。rAF 把一次拖拽窗口里的
// 几百次强制重排压成一帧一次。
useEventListener(window, 'resize', () => {
  if (resizeFrame) cancelAnimationFrame(resizeFrame)
  resizeFrame = requestAnimationFrame(() => nextTick(measureOverflow))
})
</script>

<template>
  <!--
    ponytail: 标题里那个 context 名去掉了。

    原来是「Events · kubernetes-admin@kubernetes」。整个应用只有这一页
    把 context 名写进标题 —— 别的页都没有，所以它既不是规则，也不是
    刻意的强调，就是漏了。而且它说的是同一个事实的第二遍：顶栏那个
    组合框就写着当前 context，距离 40 像素。

    顶栏是它的位置 —— 那里是「我现在连的是哪个集群」这个问题的答案，
    换集群的动作也在那里。标题只回答「这是哪一页」。
  -->
  <PageHeader
    :title="t('route.events')"
    :subtitle="permissionDenied
      ? t('events.subtitleDenied')
      : t('events.subtitle', {
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
      <!--
        这是三个过滤按钮，不是标签页。

        之前它们挂着 role="tablist" / role="tab" / aria-selected，可是
        下面没有 role="tabpanel"，也没有 aria-controls —— 读屏因此
        承诺了方向键导航和面板关联，而实际一个都没有。过滤按钮正确的
        角色是 aria-pressed 的切换按钮（日志面板的 severity 芯片一直
        这么写）。说谎的语义比没有语义更糟：读屏用户会以为能用方向键
        在三个过滤器之间跳。
      -->
      <!-- 没权限读的时候不显示这排筛选：每个数字都从一份没读到的数据
           算出来，「告警 Warning 0」读起来就是「没有告警」——那是假的。 -->
      <div
        v-if="!permissionDenied"
        class="flex flex-wrap items-center gap-1.5 mt-3"
        role="group"
        :aria-label="t('events.filterByType')"
      >
        <button
          v-for="tab in ['all', 'Warning', 'Normal'] as const"
          :key="tab"
          type="button"
          :aria-pressed="typeFilter === tab"
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
            // ponytail: 选中态的计数徽章用 bg-background/20。
            //
            // 之前是 bg-black/15 —— 而选中态的底是 bg-foreground（亮色下
            // 是 rgb(24,24,27) 的近黑）。15% 的黑落在近黑上，这枚徽章
            // 等于没有：数字还在（它是白字），但芯片的形状没了，看起来
            // 像根本没有徽章。亮色下改成 20% 的白，芯片就有了；暗色下
            // 选中态是近白底，黑 15% 同样成立。
            'tabular-nums text-xs px-1.5 py-0.5 rounded-sm',
            typeFilter === tab ? 'bg-background/20' : 'bg-muted text-muted-foreground',
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
  <!--
    权限不足是它自己的一种状态：没有重试按钮（重试不会授予权限），
    也不说「0 个事件」——那是关于集群的假事实。
  -->
  <PermissionDenied
    v-else-if="permissionDenied"
    :permission="errorPermission"
    :title="t('events.permissionTitle')"
  />
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
    <!--
      卡片统一为 div：把"展开"按钮塞进 router-link 是非法嵌套交互，
      详情跳转改由 footer 的独立链接承载（Audit §8.3）。

      现在整张卡可点了，做法是「拉长链接」：footer 那个 router-link
      用 ::after 铺满整张卡（它的定位祖先是这张 relative 的卡），
      展开按钮 z-10 浮在上面。于是「点卡片任意处 = 跳到那个 Pod」，
      而 DOM 里仍然只有一个链接、一个按钮 —— 嵌套交互的合法性不受影响。
      之前这条主路径只有右下角一个 12px 的"查看详情 ›"，约 60×16px。
    -->
    <div
      v-for="ev in filtered"
      :key="ev.name"
      :class="cn(
        'group relative block rounded-card border transition-colors ease-app dur-fast overflow-hidden',
        // ponytail: 卡片边框回到中性。之前是 border-warning/40，整张卡在
        // 暗色下变成一块棕褐色，信号被稀释了。告警的身份由图标 + 芯片承担，
        // 边框不需要再染一次色。
        //
        // 左边那条竖线从 3px 降到 1px：3px 撞上圆角就是「卡片上贴了根
        // 胶条」，而且 12px 的圆角和 3px 的彩色边在几何上也打架
        // （impeccable 的 craft-floor 明令禁止卡片上 >1px 的彩色边框）。
        // 1px 足够在扫视时标出「这条是告警」，剩下的由图标和芯片说话。
        ev.type === 'Warning'
          ? 'border-border bg-warning/5 hover:bg-warning/10 border-l-warning'
          : 'border-border bg-card opacity-90 hover:opacity-100',
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
              :label="t(`eventType.${ev.type}`, ev.type)"
            />
            <!--
              reason 芯片现在自己做一件事：点开术语解释。

              它原来还兼着一个身份：「这张卡可点」的暗示——悬停时边框亮成
              告警色。现在它自己就是一个可点的东西了，再让它暗示整卡可点，
              读者点下去发现是弹层而不是跳转，就是个假承诺。整卡可点的
              暗示交给卡片自己的悬停底色，和 footer 里那个「查看详情 ›」。

              text-foreground：reason 是这张卡上最关键的诊断信息，不能和
              旁边的 namespace 一样暗（芯片系统默认的 neutral 是
              muted-foreground）。字色靠 class 提亮，底色和描边仍走系统。

              context 写进无障碍名称：列表里几十张卡都可能是同一个
              reason，按钮名全一样的话读屏用户没法分辨是哪一条。
            -->
            <ReasonChip
              :term="ev.reason"
              :message="ev.message"
              :context="`${ev.involved_kind}/${ev.involved_name}`"
              size="xs"
              tone="neutral"
              class="font-mono text-foreground"
            />
            <span class="text-xs text-muted-foreground">{{ ev.namespace }}</span>
            <span class="text-xs text-muted-foreground font-mono">{{ ev.involved_kind }}/{{ ev.involved_name }}</span>
          </div>
          <!--
            message 是用户来 events 页真正要读的内容，必须是视觉主角，
            而且要能选中复制 —— 凌晨排查时经常要把上游原文整段粘走。

            所以它抬在整卡覆盖层之上（z-10）：正文上的鼠标按下是选字，
            不是跳转。点击别处（图标 / 芯片 / reason / 空白）才是跳转。
            这是网页本来的规矩：链接负责跳转，文字负责选中。
          -->
          <p
            :ref="setMsgEl(ev.name)"
            :class="cn(
              'relative z-10 mt-2 text-base leading-snug',
              expanded.has(ev.name) ? '' : 'line-clamp-3',
              ev.type === 'Warning' ? 'text-foreground font-medium' : 'text-foreground/80',
            )"
          >
            {{ ev.message }}
          </p>
          <div class="text-xs text-muted-foreground mt-2 flex items-center gap-3">
            <span :title="ev.last_seen ?? undefined">{{ formatRel(ev.last_seen ?? null) }}</span>
            <span v-if="ev.count > 1" class="inline-flex items-center gap-1">
              <!--
                次数这里原来是 opacity-60 的次要文字：暗色下 3.2:1，
                低于 AA 的 4.5:1。现在层级靠颜色承担（数字用 foreground，
                单位和乘号用 muted-foreground），不用透明度 —— 透明度
                会把对比度一起拉下去，而「重复了多少次」恰恰是需要
                被读到的那个数。
              -->
              <span aria-hidden="true">×</span>
              <span class="tabular-nums font-medium text-foreground">{{ ev.count }}</span>
              <span>{{ t('events.times') }}</span>
            </span>
            <div class="ml-auto flex items-center gap-3">
              <button
                v-if="overflows.has(ev.name) || expanded.has(ev.name)"
                type="button"
                class="relative z-10 inline-flex items-center gap-1 text-xs text-muted-foreground hover:text-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-background rounded-sm"
                @click.stop="toggleExpand(ev.name)"
              >
                <component
                  :is="expanded.has(ev.name) ? ChevronDown : ChevronRight"
                  :size="12" :stroke-width="2" aria-hidden="true"
                />
                {{ expanded.has(ev.name) ? t('events.collapse') : t('events.expand') }}
              </button>
              <!--
                这个链接用 ::after 铺满整张卡（定位祖先是 relative 的卡片），
                所以整张卡都是点击区 —— 这条路是事件页的主路径，之前只有
                右下角一个约 60×16px 的 12px 链接。

                链接本身不做 relative：那样 ::after 会以链接为定位祖先，
                铺不开。展开按钮 z-10 浮在 ::after 之上，两者互不抢点击。
              -->
              <router-link
                v-if="eventTargets.get(ev.name)"
                :to="eventTargets.get(ev.name)!"
                :aria-label="t('events.viewDetailOf', { name: `${ev.involved_kind}/${ev.involved_name}` })"
                class="inline-flex items-center gap-1 text-xs text-muted-foreground hover:text-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-background rounded-sm after:absolute after:inset-0 after:content-['']"
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
