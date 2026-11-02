<script setup lang="ts">
import { computed, onUnmounted, ref, watch } from 'vue'
import { useI18n } from 'vue-i18n'
import { useRoute } from 'vue-router'
import { toast } from 'vue-sonner'
import { Bot, Send, AlertTriangle, ChevronDown, ChevronRight, Copy, Check } from '@lucide/vue'
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetDescription,
} from '@/components/ui/sheet'
import { Button } from '@/components/ui/button'
import { Textarea } from '@/components/ui/input'
import { useAiStore } from '@/stores/ai'
import MarkdownAnswer from './MarkdownAnswer.vue'
import { useClusterStore } from '@/stores/cluster'
import { aiApi, podsApi } from '@/api/endpoints'
import { formatNumber } from '@/lib/utils'

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
const showRawContext = ref(false)
const copied = ref(false)
const elapsedMs = ref<number | null>(null)
const answerModel = ref('')

const provider = ref<{ id: number; name: string; model: string } | null>(null)

const canSubmit = computed(() => {
  if (loading.value || !provider.value) return false
  if (ai.mode === 'ask') {
    // The context IS the question's grounding. Submitting before it has
    // loaded would ask the model with nothing to read.
    return question.value.trim().length > 0 && !loadingContext.value && context.value !== ''
  }
  return !!(ai.pod?.logContent)
})

/**
 * A compact snapshot of the cluster.
 *
 * Machine-facing, so the raw form stays in English: the model reads it, not
 * the reader. It is a summary rather than raw logs on purpose — the whole
 * value of a cluster-level question is that nobody has to read 287 pods
 * to answer it.
 *
 * The reader gets the human version: the panel used to paste the raw
 * markdown into a <pre> that filled 40% of the sheet, all of it addressed
 * to the model. What the reader needs is "which cluster, which namespace,
 * how big, how many broken" — that is now the first thing on the panel,
 * and the raw snapshot is one click away.
 */
interface ClusterSnapshot {
  cluster: string
  namespace: string
  view: string
  total: number
  running: number
  failed: number
  nodesReady: number
  nodesTotal: number
  warningEvents: number
}

const snapshot = ref<ClusterSnapshot | null>(null)

async function buildContext(): Promise<{ raw: string; summary: ClusterSnapshot }> {
  if (!cluster.activeCluster) throw new Error(t('ai.askNoActiveCluster'))
  // ponytail: 快照按命名空间取，和顶栏的选择器一致。
  //
  // 之前这里取的是全集群的统计，却把「命名空间」写成了当前选择的那个 ——
  // 于是「命名空间 kube-system · 287 个 Pod」里那 287 个是全集群的数。
  // 给模型看的那份上下文也一样：模型拿到「Namespace: kube-system」和一份
  // 全集群的 pod 清单，答案从一开始就建立在错的前提上。
  const stats = await podsApi.stats(cluster.activeCluster, cluster.activeNamespace)
  const ns = cluster.activeNamespace === '_all' ? 'all' : cluster.activeNamespace
  const lines: string[] = [
    `# Cluster: ${cluster.activeCluster || 'default'}`,
    `# Namespace: ${ns}`,
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
  return {
    raw: lines.join('\n'),
    summary: {
      cluster: cluster.activeCluster || 'default',
      // ponytail: 给人看的那一句不能用 API 层的哨兵。
      //
      // 机器上下文（上面那份 markdown）用 "all" 是对的 —— 模型读的是
      // "Namespace: all"。但这一份 summary 是画在面板上给人看的，
      // 之前它把同一个 ns 拿来用，于是中文界面上写着「命名空间 all」。
      // utils/namespace.ts 里那条规矩早就写好了：哨兵值永远不该出现在
      // 界面上。Events 页和 Settings 页修过，AI 面板漏了。
      namespace: cluster.activeNamespace === '_all'
        ? t('namespace.all')
        : (cluster.activeNamespace ?? ns),
      view: String(route.name ?? 'unknown'),
      total: stats.total_pods,
      running: stats.running,
      failed: stats.failed,
      nodesReady: stats.nodes_ready,
      nodesTotal: stats.nodes_total,
      warningEvents: stats.warning_events,
    },
  }
}

// A sequence token: the panel can be opened again before the previous
// load resolves, and a stale answer must not overwrite a newer one.
let providerSeq = 0
let contextSeq = 0
let answerSeq = 0
/**
 * The in-flight stream, so closing the panel (or opening a new question)
 * actually stops the request instead of letting the provider keep billing
 * for an answer nobody will read.
 */
let answerAbort: AbortController | null = null
const ASK_TIMEOUT_MS = 90_000

async function loadProvider(): Promise<void> {
  const mine = ++providerSeq
  try {
    const providers = await aiApi.listProviders()
    if (mine !== providerSeq) return
    provider.value = providers.find((p) => p.enabled) ?? null
    noProvider.value = !provider.value
  } catch {
    if (mine !== providerSeq) return
    provider.value = null
    noProvider.value = true
  }
}

async function loadContext(): Promise<void> {
  const mine = ++contextSeq
  loadingContext.value = true
  try {
    const { raw, summary } = await buildContext()
    if (mine !== contextSeq) return
    context.value = raw
    snapshot.value = summary
  } catch (e: any) {
    if (mine !== contextSeq) return
    error.value = e?.message ?? t('ai.askContextFailed')
  } finally {
    if (mine === contextSeq) loadingContext.value = false
  }
}

// The panel is opened by the command palette, by the pod detail page, or by
// the keyboard. Each of those arrives with a different mode, and the mode
// decides what has to be loaded before the reader can ask anything.
// Every open is a fresh request: the panel resets, reloads the provider
// and — in ask mode — the cluster snapshot. Watching the request counter
// rather than `open` means asking from a different mode while the panel
// is already up also reloads.
watch(
  () => ai.requestId,
  () => {
    // ponytail: 以前这里只清了界面，没动正在跑的流。于是「问一个问题 →
    // 关掉面板 → 再打开」之后，上一条流的后续片段会落进新面板里 ——
    // 一个用户没问过的问题，答案自己长了出来。answerSeq 递增作废旧流，
    // abort 直接把它掐掉。
    answerSeq++
    answerAbort?.abort()
    answerAbort = null
    result.value = ''
    error.value = ''
    question.value = ''
    context.value = ''
    snapshot.value = null
    provider.value = null
    noProvider.value = false
    showRawContext.value = false
    copied.value = false
    elapsedMs.value = null
    answerModel.value = ''
    void loadProvider()
    if (ai.mode === 'ask') void loadContext()
  },
)

async function submit(): Promise<void> {
  if (!provider.value) {
    noProvider.value = true
    return
  }
  const mine = ++answerSeq
  answerAbort?.abort()
  const controller = new AbortController()
  answerAbort = controller
  const timer = setTimeout(() => controller.abort(), ASK_TIMEOUT_MS)
  loading.value = true
  error.value = ''
  result.value = ''
  elapsedMs.value = null
  const started = Date.now()
  try {
    if (ai.mode === 'analyze' && ai.pod) {
      const out = await aiApi.analyze(
        cluster.activeCluster,
        ai.pod.namespace,
        ai.pod.name,
        provider.value.id,
        ai.pod.logContent.split('\n').slice(-200),
        t('ai.analyzePrompt'),
      )
      if (mine !== answerSeq) return
      result.value = out.answer
      answerModel.value = out.model
      elapsedMs.value = out.latency_ms
    } else {
      // Streamed: the answer is rendered as the model writes it. A cluster
      // question takes tens of seconds, and a spinner for that long is
      // indistinguishable from a hang.
      await aiApi.askStream(
        provider.value.id,
        question.value.trim(),
        context.value,
        (text) => {
          if (mine !== answerSeq) return
          result.value += text
        },
        controller.signal,
      )
      if (mine !== answerSeq) return
      answerModel.value = provider.value.model
      elapsedMs.value = Date.now() - started
    }
  } catch (e: any) {
    if (mine !== answerSeq) return
    if (e?.name === 'AbortError') {
      error.value = t('ai.askTimeout')
    } else {
      error.value = e?.code === 'ECONNABORTED'
        ? t('ai.askTimeout')
        : e?.response?.data?.detail ?? e?.message ?? t('ai.analyzeFailed')
    }
  } finally {
    clearTimeout(timer)
    if (mine === answerSeq) {
      loading.value = false
      answerAbort = null
    }
  }
}

onUnmounted(() => {
  answerAbort?.abort()
})

async function copyAnswer() {
  try {
    await navigator.clipboard.writeText(result.value)
    copied.value = true
    toast.success(t('toast.aiAnswerCopied'))
    setTimeout(() => { copied.value = false }, 2000)
  } catch {
    toast.error(t('toast.aiAnswerCopyFailed'))
  }
}

const contextSummary = computed(() => {
  const s = snapshot.value
  if (!s) return ''
  return t('ai.askContextSummary', {
    cluster: s.cluster,
    namespace: s.namespace,
    total: formatNumber(s.total),
    running: formatNumber(s.running),
    failed: formatNumber(s.failed),
    nodesReady: s.nodesReady,
    nodesTotal: s.nodesTotal,
    warnings: formatNumber(s.warningEvents),
  })
})

const answerMeta = computed(() => {
  if (!answerModel.value && elapsedMs.value === null) return ''
  const seconds = elapsedMs.value !== null ? (elapsedMs.value / 1000).toFixed(1) : '—'
  return t('ai.answerMeta', { model: answerModel.value || '—', seconds })
})
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
            {{ t('ai.noProvider') }}
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
            <p v-if="loadingContext" class="text-xs text-muted-foreground">
              {{ t('ai.askContextLoading') }}
            </p>
            <template v-else>
              <!-- ponytail: 人话摘要。原来的面板把整份机器快照（英文
                   markdown，给模型看的）直接糊在面板上，占掉四成高度，
                   读者一句都用不上。先给一句「哪个集群、多少 Pod、多少
                   告警」，原始快照收进一个折叠里。 -->
              <p class="text-sm text-foreground">{{ contextSummary }}</p>
              <button
                type="button"
                class="mt-1.5 inline-flex items-center gap-1 text-xs text-muted-foreground hover:text-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-background rounded-sm"
                :aria-expanded="showRawContext"
                @click="showRawContext = !showRawContext"
              >
                <ChevronDown v-if="showRawContext" :size="12" :stroke-width="2" aria-hidden="true" />
                <ChevronRight v-else :size="12" :stroke-width="2" aria-hidden="true" />
                {{ showRawContext ? t('ai.askContextHide') : t('ai.askContextShow') }}
              </button>
              <pre
                v-if="showRawContext"
                class="mt-2 text-xs font-mono bg-muted p-3 rounded-md overflow-auto max-h-[200px] whitespace-pre-wrap"
              >{{ context }}</pre>
            </template>
          </div>
          <div>
            <label for="ai-question" class="text-xs font-semibold text-muted-foreground mb-2 block uppercase tracking-wide">
              {{ t('ai.askQuestionLabel') }}
            </label>
            <!-- ponytail: 多行。回车换行，⌘/Ctrl+回车提交 ——
                 凌晨三点要打的多半是带从句的问题，一行输入框装不下。
                 Esc 留给 Sheet（关面板），面板关掉时在飞的请求会被 abort。 -->
            <Textarea
              id="ai-question"
              v-model="question"
              :rows="3"
              :placeholder="t('ai.askQuestionPlaceholder')"
              :aria-label="t('ai.askQuestionLabel')"
              @keydown.enter.exact.prevent
              @keydown.meta.enter.prevent="submit"
              @keydown.ctrl.enter.prevent="submit"
            />
            <p class="mt-1 text-xs text-muted-foreground">{{ t('ai.askSubmitHint') }}</p>
          </div>
        </template>

        <div v-if="result">
          <h4 class="text-xs font-semibold text-muted-foreground mb-2 uppercase tracking-wide">{{ t('ai.answerLabel') }}</h4>
          <!--
            ponytail: 答案按 markdown 排版，但绝不走 v-html。
            LLM 的输出是不可信文本，所以这里渲染的是 @/utils/markdown 解析出来
            的树，由 MarkdownAnswer 变成元素 —— 整条路径上没有 HTML 字符串，
            注入是结构上不可能，而不是「大概没事」。
            之前是 {{ result }} 直接放在 whitespace-pre-wrap 的 div 里，模型写的
            **粗体**、- 列表、# 标题全是字符。这是产品最有说服力的那个功能，
            而答案却是整个界面上唯一像终端 dump 的地方。
          -->
          <div aria-live="polite" :aria-busy="loading">
            <MarkdownAnswer :text="result" />
            <span v-if="loading" class="animate-pulse" aria-hidden="true">▍</span>
          </div>
          <div v-if="!loading" class="mt-2 flex items-center gap-3">
            <span v-if="answerMeta" class="text-xs text-muted-foreground tabular-nums">{{ answerMeta }}</span>
            <Button
              variant="ghost"
              size="xs"
              class="ml-auto"
              :aria-label="t('ai.answerCopy')"
              @click="copyAnswer"
            >
              <Check v-if="copied" :size="12" :stroke-width="2" />
              <Copy v-else :size="12" :stroke-width="2" />
              {{ copied ? t('ai.answerCopied') : t('ai.answerCopy') }}
            </Button>
          </div>
        </div>

        <div v-if="error" class="text-sm text-error" role="alert">{{ error }}</div>

        <div v-if="loading && !result" class="flex items-center justify-center py-8 text-muted-foreground">
          <Bot :size="16" :stroke-width="1.75" class="mr-2 animate-pulse" />
          {{ t('ai.analyzing') }}
        </div>
      </div>

      <div class="border-t border-border p-3">
        <Button class="w-full" :loading="loading" :disabled="!canSubmit" @click="submit">
          <template #icon>
            <Send :size="14" :stroke-width="1.75" />
          </template>
          {{ ai.mode === 'analyze' ? t('ai.analyze') : t('ai.askSubmit') }}
        </Button>
      </div>
    </SheetContent>
  </Sheet>
</template>
