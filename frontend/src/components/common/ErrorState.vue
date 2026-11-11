<script setup lang="ts">
import { computed } from 'vue'
import { useI18n } from 'vue-i18n'
import { AlertCircle } from '@lucide/vue'
import { Button } from '@/components/ui/button'

const { t } = useI18n()
const props = withDefaults(defineProps<{
  title?: string
  message?: string
  /**
   * 给不给「重试」。
   *
   * 有些错误重试永远不会成功 —— 被删掉的 Pod、没权限的列表。给一个注定
   * 失败的按钮比不给更糟：它把读者留在这个死胡同里。
   */
  retryable?: boolean
}>(), {
  message: '',
  retryable: true,
})

// ponytail: 同 EmptyState —— computed 而非 withDefaults default，切语言时不会留旧文案。
const heading = computed(() => props.title ?? t('state.error'))

defineEmits<{
  retry: []
}>()
</script>

<template>
  <div class="flex flex-col items-center justify-center py-16 px-4 text-center">
    <div class="rounded-full bg-error-bg p-4 mb-4">
      <AlertCircle :size="32" class="text-error" :stroke-width="1.5" />
    </div>
    <!-- h2 不是 h3：同 EmptyState —— 页面 h1 下面不该跳级。 -->
    <h2 class="text-base font-semibold text-foreground mb-1">{{ heading }}</h2>
    <p v-if="message && message !== heading" class="text-sm text-muted-foreground max-w-md mb-4">{{ message }}</p>
    <slot name="actions" />
    <Button v-if="retryable" size="sm" @click="$emit('retry')">{{ t('state.retry') }}</Button>
  </div>
</template>
