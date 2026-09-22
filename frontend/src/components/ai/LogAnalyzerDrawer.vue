<script setup lang="ts">
import { computed, ref } from 'vue'
import { NDrawer, NDrawerContent, NButton, NSelect, NInput, NSpace, NSpin, NTag, NAlert, useMessage } from 'naive-ui'
import { aiApi } from '@/api/endpoints'
import { useAIProviders } from '@/composables/useAIProviders'
import { useClusterStore } from '@/stores/cluster'
import type { AIAnalysisResult, LogLine } from '@/domain/types'

const props = defineProps<{
  show: boolean
  namespace: string
  podName: string
  logLines: LogLine[]
}>()

const emit = defineEmits<{ (e: 'update:show', v: boolean): void }>()

const cluster = useClusterStore()
const { providers, defaultProvider, load } = useAIProviders()
const msg = useMessage()

const providerId = ref<number | null>(null)
const question = ref('请分析这些日志的根因、异常点和建议')
const analyzing = ref(false)
const result = ref<AIAnalysisResult | null>(null)
const errorText = ref<string | null>(null)

const providerOptions = computed(() =>
  providers.value.map((p) => ({
    label: `${p.name}  (${p.provider}/${p.model})${p.is_default ? ' · default' : ''}`,
    value: p.id,
  })),
)

async function refresh() {
  await load()
  if (!providerId.value && defaultProvider.value) providerId.value = defaultProvider.value.id
}

async function run() {
  if (!providerId.value) { msg.error('请先选择一个 AI provider'); return }
  if (!props.logLines.length) { msg.error('日志为空，无法分析'); return }
  analyzing.value = true
  result.value = null
  errorText.value = null
  try {
    const text = props.logLines.slice(-200).map((l) => l.content)
    const r = await aiApi.analyze(cluster.activeCluster, props.namespace, props.podName,
                                   providerId.value, text, question.value)
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
        <div>
          <p class="section-title mb-1">Provider</p>
          <NSelect v-model:value="providerId" :options="providerOptions" placeholder="选择 provider" />
          <p v-if="!providers.length" class="text-xs text-zinc-500 mt-1">
            没有配置 provider · 去 <RouterLink :to="{ name: 'ai' }" class="text-indigo-400 underline">AI 模型</RouterLink> 添加
          </p>
        </div>
        <div>
          <p class="section-title mb-1">问题（可选）</p>
          <NInput v-model:value="question" type="textarea" :rows="3" />
        </div>
        <div class="flex items-center justify-between text-xs text-zinc-500">
          <span>将分析最近 {{ Math.min(props.logLines.length, 200) }} 行（最多 200）</span>
          <NSpace>
            <NButton @click="close">关闭</NButton>
            <NButton type="primary" :loading="analyzing" @click="run">运行分析</NButton>
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
