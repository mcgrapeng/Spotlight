/**
 * State for the AI panel.
 *
 * One panel serves two questions: "which pod is broken" (a cluster-level
 * question, answered from a context snapshot) and "why is this pod broken"
 * (answered from its log excerpt). The pod detail page opens the same panel
 * the rest of the app uses, so there is one result view and one way in.
 */
import { defineStore } from 'pinia'
import { computed, ref } from 'vue'

export type AiMode = 'ask' | 'analyze'

export interface AiPodRequest {
  namespace: string
  name: string
  logContent: string
}

export const useAiStore = defineStore('ai', () => {
  const open = ref(false)
  const mode = ref<AiMode>('ask')
  const pod = ref<AiPodRequest | null>(null)

  /** Open the panel for a cluster-level question. */
  function openAsk() {
    mode.value = 'ask'
    pod.value = null
    open.value = true
  }

  /** Open the panel on a pod's log excerpt. */
  function openAnalyze(request: AiPodRequest) {
    mode.value = 'analyze'
    pod.value = request
    open.value = true
  }

  function close() {
    open.value = false
  }

  const isAnalyze = computed(() => mode.value === 'analyze')

  return { open, mode, pod, isAnalyze, openAsk, openAnalyze, close }
})
