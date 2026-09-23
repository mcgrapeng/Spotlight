<script setup lang="ts">
import { computed, ref, watch, nextTick } from 'vue'
import { useRouter } from 'vue-router'
import {
  NModal, NIcon, NInput, NScrollbar,
} from 'naive-ui'
import { Search, Dashboard, Box, Server, AlertTriangle, Star, Robot, Keyboard } from '@vicons/tabler'

const router = useRouter()
const show = ref(false)
const query = ref('')
const inputRef = ref<InstanceType<typeof NInput> | null>(null)

const items = computed(() => {
  const q = query.value.trim().toLowerCase()
  const base = [
    { section: '导航', items: [
      { key: 'g d', icon: Dashboard, label: '总览', to: { name: 'dashboard' } },
      { key: 'g p', icon: Box, label: 'Pods', to: { name: 'pods' } },
      { key: 'g n', icon: Server, label: 'Nodes', to: { name: 'nodes' } },
      { key: 'g e', icon: AlertTriangle, label: 'Events', to: { name: 'events' } },
      { key: 'g f', icon: Star, label: '收藏夹', to: { name: 'favorites' } },
      { key: 'g a', icon: Robot, label: 'AI 模型', to: { name: 'ai' } },
    ]},
  ]
  const list = base.flatMap((g) => g.items)
    .filter((i) => !q || i.label.toLowerCase().includes(q))
  return list
})

function open() {
  show.value = true
  query.value = ''
  nextTick(() => inputRef.value?.focus())
}
function close() { show.value = false }

function go(to: any) { router.push(to); close() }

watch(show, (v) => { if (!v) query.value = '' })

defineExpose({ open, close })

const visible = computed(() => show.value)
</script>

<template>
  <NModal
    :show="visible"
    @update:show="(v: boolean) => (show = v)"
    :close-on-esc="true"
    :mask-closable="true"
    preset="card"
    style="max-width: 540px; margin-top: 18vh"
    :bordered="false"
  >
    <div class="overflow-hidden">
      <div class="px-4 py-3 flex items-center gap-3 border-b border-zinc-800">
        <NIcon :component="Search" :size="16" class="text-zinc-400" />
        <NInput
          ref="inputRef"
          v-model:value="query"
          placeholder="搜索命令、页面、资源…"
          aria-label="命令面板搜索"
          size="large"
          :bordered="false"
          :input-props="{ autocomplete: 'off', spellcheck: false }"
        />
        <span class="kbd text-[10px]">ESC</span>
      </div>
      <NScrollbar style="max-height: 50vh">
        <ul v-if="items.length" role="listbox" class="p-2">
          <li v-for="it in items" :key="it.label" role="option" :aria-selected="false">
            <button
              class="w-full flex items-center gap-3 px-3 py-2 rounded-md hover:bg-zinc-800 transition-colors text-left focus-visible:outline-none focus-visible:bg-zinc-800 focus-visible:ring-2 focus-visible:ring-indigo-500/40"
              @click="go(it.to)"
            >
              <div class="w-7 h-7 rounded-md bg-zinc-800 flex items-center justify-center shrink-0">
                <NIcon :component="it.icon" :size="14" class="text-zinc-300" />
              </div>
              <span class="flex-1 text-zinc-100 text-[13.5px]">{{ it.label }}</span>
              <span class="kbd">{{ it.key }}</span>
            </button>
          </li>
        </ul>
        <div v-else class="py-10 text-center">
          <NIcon :component="Keyboard" :size="28" class="text-zinc-600 mx-auto mb-2" />
          <p class="text-zinc-500 text-[13px]">没有匹配的命令</p>
        </div>
      </NScrollbar>
      <footer class="px-4 py-2.5 border-t border-zinc-800 flex items-center gap-3 text-[11px] text-zinc-500">
        <span class="flex items-center gap-1"><span class="kbd">↑↓</span> 导航</span>
        <span class="flex items-center gap-1"><span class="kbd">↵</span> 选择</span>
        <span class="ml-auto">K8s Viewer</span>
      </footer>
    </div>
  </NModal>
</template>
