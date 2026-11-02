import { computed, ref, watch } from 'vue'
import { STORAGE_KEYS } from '@/storage-keys'

export type ThemeMode = 'light' | 'dark' | 'system'

const STORAGE_KEY = STORAGE_KEYS.appThemeMode

function readStored(): ThemeMode {
  if (typeof localStorage === 'undefined') return 'system'
  const v = localStorage.getItem(STORAGE_KEY)
  return v === 'light' || v === 'dark' || v === 'system' ? v : 'system'
}

function systemPrefersDark(): boolean {
  return typeof matchMedia !== 'undefined' && matchMedia('(prefers-color-scheme: dark)').matches
}

const mode = ref<ThemeMode>(readStored())
const systemDark = ref(systemPrefersDark())

function resolve(m: ThemeMode): 'light' | 'dark' {
  if (m === 'system') return systemDark.value ? 'dark' : 'light'
  return m
}

function apply() {
  const resolved = resolve(mode.value)
  if (typeof document === 'undefined') return
  document.documentElement.classList.toggle('dark', resolved === 'dark')
  document.documentElement.style.colorScheme = resolved
}

// Module-level wiring: one media-query listener and one persistence watcher
// for the whole app, not one per component that happens to call useTheme().
if (typeof matchMedia !== 'undefined') {
  const mq = matchMedia('(prefers-color-scheme: dark)')
  const onChange = (e: MediaQueryListEvent) => { systemDark.value = e.matches }
  if (typeof mq.addEventListener === 'function') mq.addEventListener('change', onChange)
}

watch(mode, (m) => {
  if (typeof localStorage !== 'undefined') localStorage.setItem(STORAGE_KEY, m)
  apply()
})

watch(systemDark, () => {
  if (mode.value === 'system') apply()
})

/**
 * Theme mode with a persisted choice.
 *
 * The choice is a tri-state (light / dark / system) rather than a boolean:
 * someone who never touches the switch should follow the OS, and someone who
 * does should not be overridden by it.
 */
export function useTheme() {
  const resolved = computed(() => resolve(mode.value))

  function setMode(m: ThemeMode) {
    mode.value = m
  }

  function toggle() {
    setMode(resolved.value === 'dark' ? 'light' : 'dark')
  }

  return { mode, resolved, setMode, toggle, apply }
}

/** Apply the stored theme before the first paint — a flash of the wrong theme is worse than no theme. */
export function initTheme() {
  apply()
}
