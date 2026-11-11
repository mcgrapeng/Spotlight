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
    // 5 秒的默认预算在这台机器上不够：旁边一有别的活（一个虚拟机进程
    // 占 90% CPU，或者 e2e 的浏览器），连一个 nextTick 都排不上，vitest
    // 会在 await 之间把用例切断 —— 报的是超时，不是断言失败，而且每次
    // 断的是不同的那一条。
    //
    // 无负载时最重的那条要 ~450ms。30s 是给「机器正忙」留的余量，不是
    // 给代码留的：代码真要是慢，这么久也该重写而不是等。
    testTimeout: 30000,
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