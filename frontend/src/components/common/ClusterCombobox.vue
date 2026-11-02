<script setup lang="ts">
import { computed } from 'vue'
import { useI18n } from 'vue-i18n'
import { Server } from '@lucide/vue'
import { cn } from '@/lib/utils'
import AppSelect from '@/components/ui/AppSelect.vue'
import { useClusterStore } from '@/stores/cluster'

// ponytail: 这一层只负责「选项从哪来 + 选完做什么」，控件本身是 AppSelect。
// 之前这里是 ClusterCombobox / NamespaceCombobox / AppSelect 三份几乎一样的
// markup（307 行），trigger 的 class 串都一模一样，只有宽度和 disabled 不同。
const { t } = useI18n()
const cluster = useClusterStore()

// ponytail: 让调用方决定宽度（移动端要 flex-1 min-w-0 撑满第二行）。
const props = defineProps<{ class?: string }>()

const value = computed(() => cluster.activeCluster ?? '')
const label = computed(() => {
  const cur = cluster.currentCluster
  if (cur) return cur.name
  return value.value || t('cluster.select')
})

const options = computed(() =>
  cluster.clusters.map((c) => ({
    value: c.name,
    label: c.name,
    hint: c.is_current ? t('cluster.hintCurrent') : null,
  })),
)

async function selectCluster(name: string) {
  if (name === value.value) return
  await cluster.setCluster(name)
}
</script>

<template>
  <AppSelect
    :model-value="value"
    :options="options"
    :placeholder="label"
    :aria-label="t('cluster.select')"
    :search-placeholder="t('cluster.search')"
    :empty-text="t('cluster.empty')"
    popover-width="260px"
    :leading-icon="Server"
    :class="cn(props.class, 'md:min-w-[180px]')"
    @update:model-value="selectCluster"
  />
</template>
