<script setup lang="ts">
/**
 * 一个 K8s reason 的芯片。收录了的词可以点开看解释。
 *
 * 为什么解释挂在芯片上而不是另加一个 ⓘ：Pod 详情页的标题区只剩 111px
 * 宽（判定芯片本身 127px），加一个图标就没地方放标题了——而标题是
 * 读者正在读的那个标识符。做成「芯片本身可点」不占额外宽度。
 *
 * 为什么不是每处都加：同一个词出现在几个地方，解释的入口得在同一个
 * 相对位置（WCAG 2.2 A 对重复出现的帮助机制的要求）。所以统一是
 * 「这个词的芯片」，解释挂在芯片上。
 *
 * 收录之外的词照常显示，不假装解释得了——猜一个解释比不解释更糟，
 * 读者会以为它说的是真的。
 */
import { computed } from 'vue'
import { useI18n } from 'vue-i18n'
import { cn } from '@/lib/utils'
import { chipClasses, type ChipTone } from '@/lib/chip'
import Popover from '@/components/ui/popover/Popover.vue'
import PopoverTrigger from '@/components/ui/popover/PopoverTrigger.vue'
import PopoverContent from '@/components/ui/popover/PopoverContent.vue'
import { hasExplanation } from '@/lib/k8sTerms'
import { eventExplanationKey } from '@/lib/eventExplain'

const props = withDefaults(defineProps<{
  /** K8s 的 reason 原样拼写 */
  term: string
  /**
   * 事件正文原文。句式词典（lib/eventExplain.ts）命中时，弹层里连这句
   * 话一起解释 —— 词典解释的是 reason 名词，只读账号分发给应用开发后
   * 真正要读的恰恰是正文那句话。
   */
  message?: string
  /**
   * 这个词属于谁。写进无障碍名称里，让同页同词的多个芯片可以被区分：
   * 列表里有 20 行都是 `OOMKilled`，按钮名全一样的话读屏用户没法分辨。
   */
  context?: string
  tone?: ChipTone
  size?: 'sm' | 'xs'
  class?: string
}>(), {
  tone: 'neutral',
  size: 'sm',
})

const { t } = useI18n()

/**
 * 解释从 i18n 取，界面语言跟着浏览器走。
 *
 * 之前文案硬编码在 lib 里，英文界面下弹出来的解释还是中文——对一个
 * 英文界面用户，那是完全无效的帮助。
 */
const termExplanation = computed(() => {
  if (!hasExplanation(props.term)) return null
  return {
    what: t(`term.explain.${props.term}.what`),
    next: t(`term.explain.${props.term}.next`),
  }
})

const messageExplanation = computed(() => {
  const key = eventExplanationKey(props.message)
  if (!key) return null
  return {
    what: t(`eventExplain.${key}.what`),
    next: t(`eventExplain.${key}.next`),
  }
})

/** 有一段能说清的就开弹层；一段都没有就退回纯文本芯片。 */
const explanation = computed(() =>
  termExplanation.value || messageExplanation.value
    ? { term: termExplanation.value, message: messageExplanation.value }
    : null,
)

/** 只有正文解释时，入口短语要说「这句话」——名实要对得上。 */
const explainLabel = computed(() =>
  termExplanation.value ? t('term.clickToExplain') : t('eventExplain.clickToExplain'),
)
const ariaLabel = computed(() =>
  [props.context, props.term, explainLabel.value].filter(Boolean).join('：'),
)
/**
 * 这枚芯片的 class。按钮**就是**芯片本身——不套一层 StatusChip。
 *
 * 套一层的话有两处麻烦：一是 `class` 只能落在其中一层（落在芯片上时
 * 颜色不生效于 trigger，落在 trigger 上时又不生效于芯片）；二是按钮
 * 的行盒会把芯片自己的外边距算进去，无声地多出一截宽度。
 *
 * 直接用 `chipClasses`——它就是 StatusChip 用的那一份，芯片系统仍然
 * 是唯一的事实源（chip.ts 自己的注释里也是这么说的：日志面板把它解析
 * 成 class 字符串，而不是渲染一个组件实例）。
 */
const chipClass = computed(() =>
  cn(
    chipClasses({ tone: props.tone, size: props.size }),
    props.class,
    // 悬停要有反应，否则读者不知道这个芯片能点。
    'group-hover:border-foreground/30',
  ),
)
</script>

<template>
  <Popover v-if="explanation">
    <!--
      @click.stop：点击被这颗芯片消费掉了——它打开的是解释弹层，不是
      外层行的导航。Pod 列表的行是 <tr @click="open(row)">，不拦住的话，
      点一下会同时弹层**并**跳到 Pod 详情，两件事一起来。
      （顺带一提：这个 button 的根是 fragment，事件不会透传到父组件，
      所以拦截只能发生在这一层。）

      弹层里**不放**可点的链接。放进去的话，弹层一打开焦点就落在那个
      链接上，读者按 Enter（习惯性的确认键）会直接跳走——他点芯片是为了
      读解释，结果解释没读到就被丢到另一个页面去了。弹层只放解释文字。
    -->
    <PopoverTrigger
      class="group relative z-10 cursor-pointer rounded-md focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-background"
      :class="chipClass"
      :title="`${term} — ${explainLabel}`"
      :aria-label="ariaLabel"
      @click.stop
    >
      {{ term }}
    </PopoverTrigger>
    <PopoverContent class="w-80">
      <template v-if="explanation.term">
        <p class="font-mono text-xs text-foreground">{{ term }}</p>
        <p class="mt-2 text-sm text-foreground">{{ explanation.term.what }}</p>
        <p class="mt-2 text-sm text-muted-foreground">{{ explanation.term.next }}</p>
      </template>
      <!--
        正文那句话的解释。正文本身在事件行里保持可选中复制（鼠标按下是
        选字不是跳转），所以解释入口统一在芯片上 —— 弹层里带出原句，这里
        是唯一解释它的地方。
      -->
      <template v-if="explanation.message">
        <p
          class="font-mono text-xs text-muted-foreground line-clamp-2"
          :class="explanation.term ? 'mt-3 pt-3 border-t border-border' : ''"
        >{{ message }}</p>
        <p class="mt-2 text-sm text-foreground">{{ explanation.message.what }}</p>
        <p class="mt-2 text-sm text-muted-foreground">{{ explanation.message.next }}</p>
      </template>
    </PopoverContent>
  </Popover>
  <span v-else :class="cn(chipClasses({ tone, size }), props.class)">{{ term }}</span>
</template>
