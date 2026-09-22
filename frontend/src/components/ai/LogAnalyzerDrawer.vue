<script setup lang="ts">
import { computed, ref, watch } from 'vue'
import { NDrawer, NDrawerContent, NButton, NInput, NSpace, NSpin, NTag, NAlert, useMessage, NIcon } from 'naive-ui'
import { AlertCircle, Stars } from '@vicons/tabler'
import { aiApi } from '@/api/endpoints'
import { useAIProviders } from '@/composables/useAIProviders'
import { useClusterStore } from '@/stores/cluster'
import type { AIAnalysisResult, LogLine } from '@/domain/types'

const props = defineProps<{
  show: boolean
  namespace: string
  podName: string
  logLines: LogLine[]
  presetQuestion?: string
}>()

const emit = defineEmits<{ (e: 'update:show', v: boolean): void }>()

const cluster = useClusterStore()
const { providers, load } = useAIProviders()
const msg = useMessage()

// In single-active mode the user doesn't pick — the system has at most one
// enabled provider. We surface its name in the UI but don't ask the user to choose.
const activeProvider = computed(() => providers.value.find((p) => p.enabled) ?? null)
const question = ref(props.presetQuestion ?? '请分析这些日志的根因、异常点和建议')
const analyzing = ref(false)
const result = ref<AIAnalysisResult | null>(null)
const errorText = ref<string | null>(null)

watch(() => props.presetQuestion, (q) => { if (q) question.value = q })

async function refresh() { await load() }

async function run() {
  if (!activeProvider.value) {
    msg.error('未配置或未启用 AI 模型，请先在「AI 模型」中启用一个')
    return
  }
  if (!props.logLines.length) { msg.error('日志为空，无法分析'); return }
  analyzing.value = true
  result.value = null
  errorText.value = null
  try {
    const text = props.logLines.slice(-200).map((l) => l.content)
    const r = await aiApi.analyze(cluster.activeCluster, props.namespace, props.podName,
                                   activeProvider.value.id, text, question.value)
    result.value = r
  } catch (e: any) {
    errorText.value = e?.response?.data?.detail ?? e?.message ?? 'analysis failed'
  } finally {
    analyzing.value = false
  }
}

function close() { emit('update:show', false) }
</script>

<template>
  <NDrawer :show="show" :width="560" placement="right" @update:show="(v: boolean) => emit('update:show', v)" @after-enter="refresh">
    <NDrawerContent :title="`AI 分析 · ${podName}`" closable>
      <div class="space-y-4">
        <div v-if="activeProvider" class="active-status">
          <NIcon :component="Stars" :size="14" color="#fbbf24" />
          <span class="text-[12px] text-zinc-300">
            使用已启用模型
            <code class="font-mono text-zinc-100 ml-1">{{ activeProvider.name }}</code>
            <span class="text-zinc-500 ml-1">({{ activeProvider.provider }}/{{ activeProvider.model }})</span>
          </span>
        </div>
        <div v-else class="ai-callout">
          <NIcon :component="AlertCircle" :size="14" color="#fb7185" />
          <span class="text-[12px] text-zinc-300">
            尚未启用任何 AI 模型 ·
            <RouterLink :to="{ name: 'ai' }" class="text-indigo-400 underline">前往启用</RouterLink>
          </span>
        </div>
        <div>
          <p class="section-title mb-1">问题（可选）</p>
          <NInput v-model:value="question" type="textarea" :rows="3" />
        </div>
        <div class="flex items-center justify-between text-xs text-zinc-500">
          <span>将分析最近 {{ Math.min(props.logLines.length, 200) }} 行（最多 200）</span>
          <NSpace>
            <NButton @click="close">关闭</NButton>
            <NButton type="primary" :loading="analyzing" :disabled="!activeProvider" @click="run">运行分析</NButton>
          </NSpace>
        </div>

        <div v-if="errorText" class="mt-2">
          <NAlert type="error" :title="'分析失败'" closable @close="errorText = null">
            {{ errorText }}
          </NAlert>
        </div>

        <div v-if="result" class="rounded-md border border-zinc-800 bg-surface-1 p-4">
          <div class="flex items-center gap-2 mb-3 text-xs text-zinc-500">
            <NTag size="small" round type="info">{{ result.model }}</NTag>
            <span>{{ result.latency_ms }} ms</span>
            <span v-if="result.input_tokens != null">· {{ result.input_tokens }} in / {{ result.output_tokens ?? '?' }} out tokens</span>
          </div>
          <pre class="whitespace-pre-wrap text-sm text-zinc-100 font-sans leading-relaxed">{{ result.answer }}</pre>
        </div>
        <div v-else-if="analyzing" class="py-12 flex justify-center"><NSpin size="large" /></div>
      </div>
    </NDrawerContent>
  </NDrawer>
</template>

<style scoped>
.active-status, .ai-callout {
  display: flex; align-items: center; gap: 8px;
  padding: 8px 12px;
  border-radius: 6px;
}
.active-status {
  background: rgba(245, 158, 11, 0.06);
  border: 1px solid rgba(245, 158, 11, 0.25);
}
.ai-callout {
  background: rgba(244, 63, 94, 0.06);
  border: 1px solid rgba(244, 63, 94, 0.25);
}
</style>
