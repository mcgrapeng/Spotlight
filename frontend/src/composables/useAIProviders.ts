import { computed, ref } from 'vue'
import { aiApi } from '@/api/endpoints'
import type { AIProvider } from '@/domain/types'

/**
 * AI providers composable.
 * Loads on mount, exposes reactive list + CRUD actions.
 */
export function useAIProviders() {
  const providers = ref<AIProvider[]>([])
  const loading = ref(false)
  const error = ref<string | null>(null)

  async function load() {
    loading.value = true
    error.value = null
    try {
      providers.value = await aiApi.listProviders()
    } catch (e: any) {
      error.value = e?.message ?? 'load failed'
    } finally {
      loading.value = false
    }
  }

  async function add(input: Parameters<typeof aiApi.addProvider>[0]) {
    const p = await aiApi.addProvider(input)
    await load()
    return p
  }

  async function update(id: number, input: Parameters<typeof aiApi.updateProvider>[1]) {
    const p = await aiApi.updateProvider(id, input)
    await load()
    return p
  }

  async function remove(id: number) {
    await aiApi.deleteProvider(id)
    await load()
  }

  async function setDefault(id: number) {
    const p = await aiApi.setDefault(id)
    await load()
    return p
  }

  const defaultProvider = computed(() =>
    providers.value.find((p) => p.is_default) ?? providers.value[0] ?? null,
  )

  return { providers, loading, error, defaultProvider, load, add, update, remove, setDefault }
}
