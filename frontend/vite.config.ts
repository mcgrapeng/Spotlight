import { defineConfig, loadEnv } from 'vite'
import vue from '@vitejs/plugin-vue'
import { fileURLToPath, URL } from 'node:url'

export default defineConfig(({ mode }) => {
  const env = loadEnv(mode, process.cwd(), '')
  return {
    plugins: [vue()],
    resolve: {
      alias: { '@': fileURLToPath(new URL('./src', import.meta.url)) },
    },
    server: {
      port: Number(env.VITE_PORT) || 5173,
      host: env.VITE_HOST || '127.0.0.1',
      proxy: {
        '/api': { target: env.VITE_API_PROXY || 'http://127.0.0.1:8000', changeOrigin: true },
        '/healthz': { target: env.VITE_API_PROXY || 'http://127.0.0.1:8000', changeOrigin: true },
      },
    },
    build: { target: 'es2022' },
  }
})
