import { computed, ref } from 'vue'
import { aiApi } from '@/api/endpoints'
import type { AIProviderOut } from '@/api/types'

/**
 * AI providers composable.
 * Loads on mount, exposes reactive list + CRUD actions.
 */
export function useAIProviders() {
  const providers = ref<AIProviderOut[]>([])
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

  async function toggle(p: AIProviderOut) {
    const updated = await aiApi.updateProvider(p.id, {
      name: p.name, provider: p.provider, model: p.model,
      api_key: '',  // empty — backend keeps the existing key
      api_base: p.api_base, temperature: p.temperature, max_tokens: p.max_tokens,
      is_default: p.is_default, enabled: !p.enabled, extra: p.extra,
    })
    await load()
    return updated
  }

  const defaultProvider = computed(() =>
    providers.value.find((p) => p.is_default) ?? providers.value[0] ?? null,
  )

  return { providers, loading, error, defaultProvider, load, add, update, remove, setDefault, toggle }
}
