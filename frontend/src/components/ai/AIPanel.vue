<script setup lang="ts">
import { computed, ref, watch } from 'vue'
import { useI18n } from 'vue-i18n'
import { useRoute } from 'vue-router'
import { Bot, Send, X, AlertTriangle } from '@lucide/vue'
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetDescription,
} from '@/components/ui/sheet'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { useAiStore } from '@/stores/ai'
import { useClusterStore } from '@/stores/cluster'
import { aiApi, podsApi } from '@/api/endpoints'

/**
 * The AI panel.
 *
 * Two modes, one component, one result view:
 *
 *   ask     — a cluster-level question ("which pod is restarting in a
 *             loop?"). The panel assembles a compact context snapshot and
 *             the model answers from it. This is the question an on-call
 *             engineer has BEFORE they know which pod to open.
 *   analyze — a pod's log excerpt, answered with the log-analysis prompt.
 *             The pod detail page opens this same panel.
 *
 * The old LogAnalyzerDrawer was the second mode with its own chrome and its
 * own result markup; it is gone.
 */
const { t } = useI18n()
const route = useRoute()
const cluster = useClusterStore()
const ai = useAiStore()

const question = ref('')
const context = ref('')
const result = ref('')
const error = ref('')
const loading = ref(false)
const loadingContext = ref(false)
const noProvider = ref(false)

const provider = ref<{ id: number; name: string; model: string } | null>(null)

const canSubmit = computed(() =>
  ai.mode === 'ask'
    ? question.value.trim().length > 0 && !loading.value
    : !!(ai.pod?.logContent) && !loading.value,
)

/**
 * A compact snapshot of the cluster.
 *
 * Machine-facing, so it stays in English: the model reads it, not the
 * reader. It is a summary rather than raw logs on purpose — the whole
 * value of a cluster-level question is that nobody has to read 287 pods
 * to answer it.
 */
async function buildContext(): Promise<string> {
  const stats = await podsApi.stats(cluster.activeCluster)
  const lines: string[] = [
    `# Cluster: ${cluster.activeCluster || 'default'}`,
    `# Namespace: ${cluster.activeNamespace === '_all' ? 'all' : cluster.activeNamespace}`,
    `# View: ${String(route.name ?? 'unknown')}`,
    '',
    '## Pod phases',
    `total=${stats.total_pods} running=${stats.running} pending=${stats.pending} failed=${stats.failed} succeeded=${stats.succeeded}`,
    '',
    '## Nodes',
    `ready=${stats.nodes_ready}/${stats.nodes_total}`,
    '',
    '## Warning events',
    String(stats.warning_events),
  ]
  const noisy = (stats.restart_top ?? []).slice(0, 5)
  if (noisy.length) {
    lines.push('', '## Pods restarting most')
    for (const p of noisy) lines.push(`- ${p.pod} restarts=${p.restarts}`)
  }
  const warns = (stats.recent_warns ?? []).slice(0, 5)
  if (warns.length) {
    lines.push('', '## Recent warning events')
    for (const w of warns) lines.push(`- [${w.reason}] ${w.involved_kind}/${w.involved_name}: ${w.message}`)
  }
  return lines.join('\n')
}

async function loadProvider(): Promise<void> {
  try {
    const providers = await aiApi.listProviders()
    provider.value = providers.find((p) => p.enabled) ?? null
    noProvider.value = !provider.value
  } catch {
    provider.value = null
    noProvider.value = true
  }
}

async function loadContext(): Promise<void> {
  loadingContext.value = true
  try {
    context.value = await buildContext()
  } catch (e: any) {
    error.value = e?.message ?? t('ai.askContextFailed')
  } finally {
    loadingContext.value = false
  }
}

// The panel is opened by the command palette, by the pod detail page, or by
// the keyboard. Each of those arrives with a different mode, and the mode
// decides what has to be loaded before the reader can ask anything.
watch(
  () => ai.open,
  (isOpen) => {
    if (!isOpen) return
    result.value = ''
    error.value = ''
    question.value = ''
    void loadProvider()
    if (ai.mode === 'ask') void loadContext()
  },
)

async function submit(): Promise<void> {
  if (!provider.value) {
    noProvider.value = true
    return
  }
  loading.value = true
  error.value = ''
  try {
    if (ai.mode === 'analyze' && ai.pod) {
      const out = await aiApi.analyze(
        cluster.activeCluster,
        ai.pod.namespace,
        ai.pod.name,
        provider.value.id,
        ai.pod.logContent.split('\n').slice(-200),
        t('pod.aiPrompt'),
      )
      result.value = out.answer
    } else {
      const out = await aiApi.ask(provider.value.id, question.value.trim(), context.value)
      result.value = out.answer
    }
  } catch (e: any) {
    error.value = e?.response?.data?.detail ?? e?.message ?? t('pod.aiFailed')
  } finally {
    loading.value = false
  }
}
</script>

<template>
  <Sheet :open="ai.open" @update:open="(v) => (ai.open = v)">
    <SheetContent side="right" class="w-full sm:w-[520px] p-0 gap-0">
      <SheetHeader class="px-4 py-3 border-b border-border">
        <SheetTitle class="flex items-center gap-2">
          <Bot :size="18" :stroke-width="1.75" />
          {{ ai.mode === 'analyze' ? t('ai.logAnalysisTitle') : t('ai.askTitle') }}
        </SheetTitle>
        <SheetDescription>
          {{ ai.mode === 'analyze' ? t('ai.logAnalysisDescription') : t('ai.askDescription') }}
        </SheetDescription>
      </SheetHeader>

      <div class="flex-1 overflow-auto p-4 space-y-4">
        <!-- No model configured: the panel cannot do anything without one. -->
        <div
          v-if="noProvider"
          class="flex items-start gap-2 rounded-md border border-warning-border bg-warning-bg px-3 py-2 text-xs text-warning"
          role="alert"
        >
          <AlertTriangle :size="14" :stroke-width="1.75" class="mt-px shrink-0" />
          <span>
            {{ t('pod.aiNoProvider') }}
            <router-link to="/ai" class="underline underline-offset-2">{{ t('ai.askConfigure') }}</router-link>
          </span>
        </div>

        <template v-if="ai.mode === 'analyze' && ai.pod">
          <div>
            <h4 class="text-xs font-semibold text-muted-foreground mb-2 uppercase tracking-wide">
              {{ t('ai.logExcerpt', { count: ai.pod.logContent.length }) }}
            </h4>
            <pre class="text-xs font-mono bg-muted p-3 rounded-md overflow-auto max-h-[240px] whitespace-pre-wrap">{{ ai.pod.logContent }}</pre>
          </div>
        </template>

        <template v-else>
          <div>
            <h4 class="text-xs font-semibold text-muted-foreground mb-2 uppercase tracking-wide">
              {{ t('ai.askContextLabel') }}
            </h4>
            <pre v-if="loadingContext" class="text-xs font-mono bg-muted p-3 rounded-md text-muted-foreground">{{ t('ai.askContextLoading') }}</pre>
            <pre v-else class="text-xs font-mono bg-muted p-3 rounded-md overflow-auto max-h-[200px] whitespace-pre-wrap">{{ context }}</pre>
          </div>
          <div>
            <label for="ai-question" class="text-xs font-semibold text-muted-foreground mb-2 block uppercase tracking-wide">
              {{ t('ai.askQuestionLabel') }}
            </label>
            <Input
              id="ai-question"
              v-model="question"
              :placeholder="t('ai.askQuestionPlaceholder')"
              :aria-label="t('ai.askQuestionLabel')"
              @keydown.enter.exact.prevent="submit"
            />
          </div>
        </template>

        <div v-if="result">
          <h4 class="text-xs font-semibold text-muted-foreground mb-2 uppercase tracking-wide">{{ t('ai.answerLabel') }}</h4>
          <!-- text-only render: LLM output is untrusted — never v-html -->
          <div class="text-sm whitespace-pre-wrap">{{ result }}</div>
        </div>

        <div v-if="error" class="text-sm text-error" role="alert">{{ error }}</div>

        <div v-if="loading" class="flex items-center justify-center py-8 text-muted-foreground">
          <Bot :size="16" :stroke-width="1.75" class="mr-2 animate-pulse" />
          {{ t('ai.analyzing') }}
        </div>
      </div>

      <div class="border-t border-border p-3 flex gap-2">
        <Button class="flex-1" :disabled="!canSubmit" @click="submit">
          <Send :size="14" :stroke-width="1.75" class="mr-1" />
          {{ ai.mode === 'analyze' ? t('ai.analyze') : t('ai.askSubmit') }}
        </Button>
        <Button variant="outline" :aria-label="t('ai.close')" @click="ai.close()">
          <X :size="14" :stroke-width="1.75" />
        </Button>
      </div>
    </SheetContent>
  </Sheet>
</template>
