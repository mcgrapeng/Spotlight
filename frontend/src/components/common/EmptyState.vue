<script setup lang="ts">
import { computed } from 'vue'
import { useI18n } from 'vue-i18n'
import { Inbox } from '@lucide/vue'

const { t } = useI18n()
const props = withDefaults(defineProps<{
  title?: string
  description?: string
  iconSize?: number
}>(), {
  description: '',
  iconSize: 32,
})

// ponytail: 默认文案走 computed 而非 withDefaults —— prop default 只在实例创建时
// 解析一次，mounted 后切语言会留下旧文案；`??` 则保留调用方显式传空串的语义。
const heading = computed(() => props.title ?? t('state.empty'))
</script>

<template>
  <div class="flex flex-col items-center justify-center py-16 px-4 text-center">
    <div class="rounded-full bg-muted p-4 mb-4">
      <slot name="icon">
        <Inbox :size="iconSize" class="text-muted-foreground" :stroke-width="1.5" />
      </slot>
    </div>
    <!-- h2 不是 h3：这一块在页面的 h1（PageHeader）之下就是顶级内容，
         用 h3 会让读屏的标题列表从 h1 直接跳到 h3（检测器 skipped-heading）。
         PodDetailView 早先修过同一类跳级，这里的级别跟它一致。 -->
    <h2 class="text-base font-semibold text-foreground mb-1">{{ heading }}</h2>
    <p v-if="description" class="text-sm text-muted-foreground max-w-md">{{ description }}</p>
    <div v-if="$slots.default" class="mt-4 w-full max-w-md">
      <slot />
    </div>
    <div v-if="$slots.action" class="mt-6">
      <slot name="action" />
    </div>
  </div>
</template>
