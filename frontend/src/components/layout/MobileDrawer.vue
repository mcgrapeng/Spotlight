<script setup lang="ts">
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetDescription,
} from '@/components/ui/sheet'
import AppSidebar from './AppSidebar.vue'

defineProps<{
  open: boolean
}>()

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
      class="w-[280px] p-0 sm:max-w-[280px] [&>button]:hidden"
    >
      <SheetHeader class="sr-only">
        <SheetTitle>导航菜单</SheetTitle>
        <SheetDescription>主导航</SheetDescription>
      </SheetHeader>
      <AppSidebar :collapsed="false" @navigate="emit('close')" />
    </SheetContent>
  </Sheet>
</template>
