<script setup lang="ts">
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetDescription,
} from '@/components/ui/sheet'
import { useI18n } from 'vue-i18n'
import AppSidebar from './AppSidebar.vue'

defineProps<{
  open: boolean
}>()

const { t } = useI18n()

const emit = defineEmits<{
  close: []
}>()

function onOpenChange(open: boolean) {
  if (!open) emit('close')
}
</script>

<template>
  <Sheet :open="open" @update:open="onOpenChange">
    <SheetContent
      side="left"
      class="w-[280px] p-0 sm:max-w-[280px]"
    >
      <SheetHeader class="sr-only">
        <SheetTitle>导航菜单</SheetTitle>
        <SheetDescription>{{ t('nav.main') }}</SheetDescription>
      </SheetHeader>
      <AppSidebar :collapsed="false" @navigate="emit('close')" />
    </SheetContent>
  </Sheet>
</template>
