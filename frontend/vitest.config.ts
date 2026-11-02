import { defineConfig } from 'vitest/config'
import vue from '@vitejs/plugin-vue'
import { fileURLToPath, URL } from 'node:url'

export default defineConfig({
  plugins: [vue()],
  resolve: {
    alias: { '@': fileURLToPath(new URL('./src', import.meta.url)) },
  },
  test: {
    environment: 'happy-dom',
    globals: true,
    include: ['src/**/*.{test,spec}.{ts,js}'],
    exclude: ['node_modules', 'dist'],
    setupFiles: ['./vitest.setup.ts'],
    coverage: {
      provider: 'v8',
      // Water level re-baselined on 2026-11 when vitest 2 → 4 changed the
      // v8 accounting for .vue files (stricter: compiled render functions
      // now attributed per-method). Same tests, finer ruler — the old scale
      // read 79, this one reads 70. Evaluated only on `vitest run --coverage`
      // over the FULL suite (what CI runs). Raise when new tests land;
      // never lower to make a run pass. Floors sit ~1 point under the
      // measured level: the gate catches deleted tests, and a tight margin
      // just produces noise reds that train people to ignore them.
      thresholds: {
        statements: 68,
        lines: 71,
        branches: 57,
        functions: 55,
      },
    },
  },
})