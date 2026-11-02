<script setup lang="ts">
import type { TabsListProps } from "reka-ui"
import type { HTMLAttributes } from "vue"
import { reactiveOmit } from "@vueuse/core"
import { TabsList } from "reka-ui"
import { cn } from '@/lib/utils'

const props = defineProps<TabsListProps & { class?: HTMLAttributes["class"] }>()

const delegatedProps = reactiveOmit(props, "class")
</script>

<template>
  <TabsList
    v-bind="delegatedProps"
    :class="cn(
      // ponytail: 页签用下划线，筛选器用药丸。
      //
      // 这一套规则来自一次视觉审计：全站原来有三套 tabs 视觉语言
      // （分段灰底、下划线、描边药丸），同一个概念在不同页面长得不一样。
      // 现在按角色分：页签是「我在这个页面的哪个部分」→ 下划线；筛选器
      // 是「我要看哪些」→ 药丸。
      //
      // 这里只有 Pod 详情在用（日志 / 事件 / 详情），它是页面级的分区，
      // 所以是下划线。
      'inline-flex items-center justify-center gap-1 border-b border-border text-muted-foreground',
      props.class,
    )"
  >
    <slot />
  </TabsList>
</template>
