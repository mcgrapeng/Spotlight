<script setup lang="ts">
import { onMounted, ref } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { Lock, Server, ArrowRight, Refresh } from '@vicons/tabler'
import { NIcon, NInput, NButton } from 'naive-ui'
import { useAuthStore } from '@/stores/auth'

const auth = useAuthStore()
const route = useRoute()
const router = useRouter()

const password = ref('')
const passwordRef = ref<InstanceType<typeof NInput> | null>(null)

async function submit() {
  if (!password.value) {
    passwordRef.value?.focus()
    return
  }
  const ok = await auth.login(password.value)
  if (ok) {
    const next = (route.query.next as string) || '/dashboard'
    router.replace(next)
  }
}

onMounted(async () => {
  await auth.refreshStatus()
  // If server doesn't require login, skip the page.
  if (!auth.required) {
    const next = (route.query.next as string) || '/dashboard'
    router.replace(next)
  }
})
</script>

<template>
  <div class="login-shell">
    <div class="login-card" role="dialog" aria-labelledby="login-title">
      <div class="flex items-center gap-3 mb-6">
        <div class="logo" aria-hidden="true">
          <NIcon :component="Lock" :size="18" color="#fff" />
        </div>
        <div>
          <h1 id="login-title" class="text-[15px] font-semibold text-zinc-100 tracking-tight">K8s Viewer</h1>
          <p class="text-[11.5px] text-zinc-500 mt-0.5">via Teleport · tsh</p>
        </div>
      </div>

      <p class="text-[12px] text-zinc-400 mb-5 leading-relaxed">
        后端尚未完成 Teleport 认证。输入密码自动执行
        <code class="kbd mx-0.5">tsh login</code>
        与
        <code class="kbd mx-0.5">tsh kube login</code>
        拉取短期证书。
      </p>

      <div v-if="auth.status" class="info-strip mb-5" role="status">
        <NIcon :component="Server" :size="14" class="text-indigo-400 shrink-0" />
        <span class="text-[12px] text-zinc-300 truncate">
          <code class="font-mono text-zinc-100">{{ auth.status.user }}</code>
          <span class="text-zinc-600 mx-1.5">@</span>
          <code class="font-mono text-zinc-100">{{ auth.status.proxy }}</code>
        </span>
        <code v-if="auth.status.cluster" class="chip chip--info ml-auto">{{ auth.status.cluster }}</code>
      </div>

      <form @submit.prevent="submit">
        <label class="block">
          <span class="section-title mb-1.5">密码</span>
          <NInput
            ref="passwordRef"
            v-model:value="password"
            type="password"
            placeholder="Teleport 用户密码"
            :disabled="auth.busy"
            show-password-on="click"
            @keydown.enter="submit"
            aria-label="Teleport 用户密码"
          />
        </label>

        <div v-if="auth.error" class="alert-critical mt-4" role="alert">
          <span class="text-[12.5px] text-red-200 truncate">{{ auth.error }}</span>
        </div>

        <div class="flex items-center justify-between mt-5">
          <button
            type="button"
            class="btn-ghost"
            @click="auth.refreshStatus()"
            :disabled="auth.busy"
            aria-label="重新检查状态"
          >
            <NIcon :component="Refresh" :size="13" />
          </button>
          <NButton
            type="primary"
            :loading="auth.busy"
            @click="submit"
          >
            登录
            <template #icon>
              <NIcon :component="ArrowRight" :size="13" />
            </template>
          </NButton>
        </div>
      </form>
    </div>
  </div>
</template>

<style scoped>
.login-shell {
  min-height: 100vh;
  display: grid;
  place-items: center;
  background: radial-gradient(circle at 50% -10%, rgba(91, 141, 239, 0.12), transparent 50%),
              var(--bg-0);
  padding: 24px;
}
.login-card {
  width: 100%;
  max-width: 420px;
  background: var(--bg-2);
  border: 1px solid var(--line-2);
  border-radius: 10px;
  padding: 32px;
  box-shadow: 0 12px 48px -16px rgba(0, 0, 0, 0.6);
}
.logo {
  display: flex; align-items: center; justify-content: center;
  width: 36px; height: 36px;
  background: linear-gradient(135deg, var(--accent), #7c5cff);
  border-radius: 8px;
  box-shadow: 0 6px 16px -6px rgba(91, 141, 239, 0.5);
}
.info-strip {
  display: flex; align-items: center; gap: 8px;
  padding: 8px 12px;
  background: var(--bg-1);
  border: 1px solid var(--line-1);
  border-radius: 6px;
}
</style>