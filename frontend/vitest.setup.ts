/**
 * Vitest setup — runs before each test file.
 *
 * `happy-dom` exposes `window.localStorage` but the global `localStorage`
 * reference is undefined in the JSDOM-like window. Provide a small stub so
 * plain `localStorage.clear()` calls work in stores that target the global.
 */
if (typeof globalThis !== 'undefined' && !(globalThis as any).localStorage) {
  const map = new Map<string, string>()
  const stub = {
    clear: () => map.clear(),
    getItem: (k: string) => (map.has(k) ? map.get(k)! : null),
    setItem: (k: string, v: string) => void map.set(k, v),
    removeItem: (k: string) => void map.delete(k),
    key: (i: number) => Array.from(map.keys())[i] ?? null,
    get length() { return map.size },
  }
  ;(globalThis as any).localStorage = stub
}