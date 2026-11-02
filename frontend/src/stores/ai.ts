/**
 * State for the AI panel.
 *
 * One panel serves two questions: "which pod is broken" (a cluster-level
 * question, answered from a context snapshot) and "why is this pod broken"
 * (answered from its log excerpt). The pod detail page opens the same panel
 * the rest of the app uses, so there is one result view and one way in.
 */
import { defineStore } from 'pinia'
import { ref } from 'vue'

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
  /**
   * Bumped on every open. The panel watches this instead of `open`, because
   * asking for a cluster question while the panel is already open on a pod
   * changes the mode without changing `open` — and the panel has to
   * reload its context for the new mode.
   */
  const requestId = ref(0)

  /** Open the panel for a cluster-level question. */
  function openAsk() {
    mode.value = 'ask'
    pod.value = null
    requestId.value++
    open.value = true
  }

  /** Open the panel on a pod's log excerpt. */
  function openAnalyze(request: AiPodRequest) {
    mode.value = 'analyze'
    pod.value = request
    requestId.value++
    open.value = true
  }

  function close() {
    open.value = false
    // The excerpt can be hundreds of lines; it does not outlive the panel.
    pod.value = null
  }

  return { open, mode, pod, requestId, openAsk, openAnalyze, close }
})
