<script setup lang="ts">
import { computed } from 'vue'
import { useI18n } from 'vue-i18n'
import { Layers } from '@lucide/vue'
import { cn } from '@/lib/utils'
import AppSelect from '@/components/ui/AppSelect.vue'
import { useClusterStore } from '@/stores/cluster'

// ponytail: 见 ClusterCombobox —— 这一层只负责选项和选中行为，控件是 AppSelect。
const { t } = useI18n()
const cluster = useClusterStore()

// ponytail: 见 ClusterCombobox —— 调用方控制宽度。
const props = defineProps<{ class?: string }>()

const value = computed(() => cluster.activeNamespace)
const disabled = computed(() => cluster.namespaces.length === 0)

const label = computed(() => {
  if (value.value === '_all') return t('namespace.all')
  return value.value || t('namespace.all')
})

// ponytail: 让 namespace 关闭后用户能直接看到 namespace 是否 Active / Terminating
// (Audit §12.7)
const options = computed(() => [
  { value: '_all', label: t('namespace.all'), hint: null as string | null },
  ...cluster.namespaces.map((n) => ({
    value: n.name,
    label: n.name,
    hint: n.status === 'Active' ? null : n.status,
  })),
])

function selectNamespace(name: string) {
  cluster.setNamespace(name)
}
</script>

<template>
  <AppSelect
    :model-value="value"
    :options="options"
    :placeholder="label"
    :disabled="disabled"
    :aria-label="t('namespace.select')"
    :search-placeholder="t('namespace.search')"
    :empty-text="t('namespace.empty')"
    popover-width="260px"
    :leading-icon="Layers"
    :class="cn(props.class, 'md:min-w-[160px]')"
    @update:model-value="selectNamespace"
  />
</template>
