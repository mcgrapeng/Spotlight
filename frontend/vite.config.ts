import { defineConfig, loadEnv } from 'vite'
import vue from '@vitejs/plugin-vue'
import { fileURLToPath, URL } from 'node:url'

export default defineConfig(({ mode }) => {
  const env = loadEnv(mode, process.cwd(), '')
  const apiTarget = env.VITE_API_PROXY || 'http://127.0.0.1:8000'
  return {
    plugins: [vue()],
    resolve: {
      alias: { '@': fileURLToPath(new URL('./src', import.meta.url)) },
    },
    server: {
      // Single source of truth: VITE_PORT in frontend/.env.
      // Left undefined when unset, Vite picks its own default and, because
      // strictPort is false, walks up to the next free port when that is
      // busy. Read the port Vite prints at startup — don't assume 5173.
      port: Number(env.VITE_PORT) || undefined,
      strictPort: false,
      host: env.VITE_HOST || '127.0.0.1',
      proxy: {
        '/api': { target: apiTarget, changeOrigin: true },
        '/healthz': { target: apiTarget, changeOrigin: true },
      },
    },
    build: { target: 'es2022' },
  }
})
