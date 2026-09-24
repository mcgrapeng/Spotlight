<script setup lang="ts">
import { computed, ref } from 'vue'
import { Check, ChevronsUpDown, Server } from '@lucide/vue'
import { cn } from '@/lib/utils'
import { Popover, PopoverTrigger, PopoverContent } from '@/components/ui/popover'
import { Command, CommandInput, CommandList, CommandEmpty, CommandItem, CommandGroup } from '@/components/ui/command'
import { useClusterStore } from '@/stores/cluster'

const cluster = useClusterStore()
const open = ref(false)

const value = computed(() => cluster.activeCluster ?? '')
const label = computed(() => {
  const cur = cluster.currentCluster
  if (cur) return cur.name
  return value.value || '选择集群'
})

const options = computed(() =>
  cluster.clusters.map((c) => ({
    value: c.name,
    label: c.name,
    hint: c.is_current ? 'current' : null,
  })),
)

async function selectCluster(name: string) {
  if (name === value.value) {
    open.value = false
    return
  }
  await cluster.setCluster(name)
  open.value = false
}
</script>

<template>
  <Popover v-model:open="open">
    <PopoverTrigger as-child>
      <button
        type="button"
        role="combobox"
        :aria-expanded="open"
        aria-label="选择集群"
        :class="cn(
          'inline-flex items-center gap-2 h-9 px-3 rounded-md border border-input bg-background text-sm',
          'hover:bg-accent hover:text-accent-foreground transition-colors',
          'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2',
          'min-w-[180px] justify-between',
        )"
      >
        <Server :size="14" :stroke-width="1.75" class="shrink-0 text-muted-foreground" aria-hidden="true" />
        <span class="truncate">{{ label }}</span>
        <ChevronsUpDown :size="14" :stroke-width="1.75" class="shrink-0 opacity-50" aria-hidden="true" />
      </button>
    </PopoverTrigger>
    <PopoverContent class="w-[260px] p-0" align="start">
      <Command v-model="value">
        <CommandInput placeholder="搜索集群…" />
        <CommandList>
          <CommandEmpty>没有匹配的集群</CommandEmpty>
          <CommandGroup>
            <CommandItem
              v-for="opt in options"
              :key="opt.value"
              :value="opt.value"
              @select="selectCluster(opt.value)"
            >
              <Check
                :size="14"
                :stroke-width="2"
                :class="cn('shrink-0', value === opt.value ? 'opacity-100' : 'opacity-0')"
                aria-hidden="true"
              />
              <span class="truncate flex-1">{{ opt.label }}</span>
              <span
                v-if="opt.hint"
                class="text-2xs uppercase tracking-wide text-muted-foreground"
              >
                {{ opt.hint }}
              </span>
            </CommandItem>
          </CommandGroup>
        </CommandList>
      </Command>
    </PopoverContent>
  </Popover>
</template>
