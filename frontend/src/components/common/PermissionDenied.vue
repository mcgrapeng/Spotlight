<script setup lang="ts">
/**
 * 「没权限读」是一种状态，不是「加载失败」，也不是「这里是空的」。
 *
 * 三者必须分开：
 *   - 空    —— 关于集群的事实
 *   - 没权限 —— 关于这次读取的事实
 *   - 失败   —— 关于这次读取的事实
 *
 * 把权限边界说成集群状态，比报错危险得多：读者会以为集群是健康的，
 * 转头去做别的检查。
 *
 * 所以这个状态**没有重试按钮**——重试不会授予权限。
 */
import { ShieldAlert } from '@lucide/vue'
import { useI18n } from 'vue-i18n'

withDefaults(defineProps<{
  /** 缺哪个权限，例如 pods.read */
  permission?: string | null
  /** 看的是什么，例如「Pod 列表」 */
  subject?: string
  /**
   * 覆盖默认标题。
   *
   * 中文标题和拉丁文之间要留空格（「没有权限查看 Pod 列表」），两个中文
   * 词之间不要（「没有权限查看事件列表」）。这个差别没法用一个格式串
   * 套住，所以由各页面自己给标题——节点页本来就有更具体的一句
   * 「没有权限查看节点」。
   */
  title?: string
  /** 覆盖默认描述 */
  description?: string
  /** 覆盖默认提示 */
  hint?: string
}>(), {
  permission: null,
  subject: '',
})

const { t } = useI18n()
</script>

<template>
  <div class="flex flex-col items-center justify-center py-16 px-4 text-center">
    <div class="rounded-full bg-warning-bg p-4 mb-4">
      <ShieldAlert :size="32" class="text-warning" :stroke-width="1.5" aria-hidden="true" />
    </div>
    <h2 class="text-base font-semibold text-foreground mb-1">
      {{ title ?? (subject ? t('permission.titleWith', { subject }) : t('permission.title')) }}
    </h2>
    <p class="text-sm text-muted-foreground max-w-md mb-2">
      {{ description ?? t('permission.description') }}
    </p>
    <p class="text-xs text-muted-foreground max-w-md">
      {{ hint ?? (permission ? t('permission.hint', { permission }) : t('permission.hintGeneric')) }}
    </p>
  </div>
</template>
