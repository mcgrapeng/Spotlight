<script setup lang="ts">
import { computed, ref } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { KeyRound, LogIn, Loader2, Server, ShieldCheck } from '@lucide/vue'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Card, CardContent } from '@/components/ui/card'
import LogoMark from '@/components/common/LogoMark.vue'
import { useAuthStore } from '@/stores/auth'

const auth = useAuthStore()
const route = useRoute()
const router = useRouter()

const password = ref('')
const otp = ref('')
const cluster = ref('')

// MFA / OTP is optional. The user clicks "需要 MFA 一次性码" to reveal the
// field — keeps the form uncluttered for clusters without MFA, while still
// supporting clusters that enforce it.
const showOtp = ref(false)

const step = computed<'auth' | 'pick'>('auth')
const availableClusters = computed(() => auth.pendingClusters)
const singleCluster = computed(() =>
  availableClusters.value.length === 1 ? availableClusters.value[0] : null,
)
if (singleCluster.value) cluster.value = singleCluster.value

function redirectAfterLogin() {
  const next = (route.query.next as string) || '/dashboard'
  router.replace(next)
}

async function submitAuth() {
  if (!password.value || auth.busy) return
  const r = await auth.login(password.value, otp.value.trim())
  if (!r) return
  if (r.kube_clusters.length === 1) {
    const ok = await auth.kubeLogin(r.kube_clusters[0])
    if (ok) {
      password.value = ''
      otp.value = ''
      redirectAfterLogin()
    }
    return
  }
}

async function submitPick() {
  if (!cluster.value || auth.busy) return
  const ok = await auth.kubeLogin(cluster.value.trim())
  if (ok) {
    password.value = ''
    otp.value = ''
    cluster.value = ''
    redirectAfterLogin()
  }
}
</script>

<template>
  <div class="min-h-[80vh] flex items-center justify-center px-4">
    <Card class="w-full max-w-sm p-0 overflow-hidden">
      <CardContent class="p-8">
        <div class="text-center mb-6">
          <div
            class="inline-flex h-12 w-12 rounded-lg items-center justify-center mb-3 text-foreground"
            aria-hidden="true"
          >
            <LogoMark :size="36" />
          </div>
          <h1 class="text-2xl font-bold tracking-tight">Spotlight</h1>
          <p class="text-sm text-muted-foreground mt-1">集群驾驶舱</p>
        </div>

        <!-- Step 1: Teleport auth -->
        <form
          v-if="availableClusters.length === 0"
          class="space-y-3"
          @submit.prevent="submitAuth"
        >
          <div>
            <label class="text-sm font-medium mb-1.5 block" for="login-pass">
              密码
            </label>
            <Input
              id="login-pass"
              v-model="password"
              type="password"
              placeholder="Teleport 用户密码"
              autocomplete="current-password"
              :disabled="auth.busy"
              required
            />
          </div>

          <!-- MFA / OTP toggle -->
          <div v-if="!showOtp">
            <button
              type="button"
              class="inline-flex items-center gap-1.5 text-xs text-muted-foreground hover:text-foreground"
              :disabled="auth.busy"
              @click="showOtp = true"
            >
              <ShieldCheck :size="13" :stroke-width="1.75" />
              需要 MFA 一次性码?
            </button>
          </div>
          <div v-else>
            <label class="text-sm font-medium mb-1.5 block" for="login-otp">
              MFA 一次性码
              <span class="text-xs font-normal text-muted-foreground ml-1">(6 位 TOTP)</span>
            </label>
            <div class="relative">
              <KeyRound
                :size="13"
                :stroke-width="1.75"
                class="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground pointer-events-none"
                aria-hidden="true"
              />
              <Input
                id="login-otp"
                v-model="otp"
                type="text"
                inputmode="numeric"
                autocomplete="one-time-code"
                placeholder="例如 123456"
                pattern="[0-9]*"
                maxlength="9"
                class="pl-8"
                :disabled="auth.busy"
              />
            </div>
          </div>

          <p v-if="auth.error" class="text-sm text-error" role="alert">
            {{ auth.error }}
          </p>
          <Button type="submit" class="w-full" :disabled="auth.busy">
            <Loader2 v-if="auth.busy" :size="14" :stroke-width="1.75" class="mr-1.5 animate-spin" />
            <LogIn v-else :size="14" :stroke-width="1.75" class="mr-1.5" />
            {{ auth.busy ? '登录中…' : '登录' }}
          </Button>
        </form>

        <!-- Step 2: pick a kube cluster -->
        <form
          v-else
          class="space-y-3"
          @submit.prevent="submitPick"
        >
          <div class="rounded-md border border-border bg-muted/40 px-3 py-2 text-xs text-muted-foreground">
            已通过 <span class="font-mono">{{ auth.pendingProxy }}</span> 验证身份
          </div>
          <div>
            <label class="text-sm font-medium mb-1.5 block" for="login-cluster">
              K8s 集群
              <span class="text-xs font-normal text-muted-foreground ml-1">
                (共 {{ availableClusters.length }} 个)
              </span>
            </label>
            <div class="relative">
              <Server
                :size="14"
                :stroke-width="1.75"
                class="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground pointer-events-none"
                aria-hidden="true"
              />
              <select
                id="login-cluster"
                v-model="cluster"
                :disabled="auth.busy"
                class="w-full h-9 pl-9 pr-3 rounded-md border border-input bg-background text-sm shadow-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring disabled:opacity-50"
                required
              >
                <option value="" disabled>选择要管理的集群</option>
                <option v-for="c in availableClusters" :key="c" :value="c">{{ c }}</option>
              </select>
            </div>
          </div>
          <p v-if="auth.error" class="text-sm text-error" role="alert">
            {{ auth.error }}
          </p>
          <Button type="submit" class="w-full" :disabled="auth.busy || !cluster">
            <Loader2 v-if="auth.busy" :size="14" :stroke-width="1.75" class="mr-1.5 animate-spin" />
            <LogIn v-else :size="14" :stroke-width="1.75" class="mr-1.5" />
            {{ auth.busy ? '连接中…' : '连接' }}
          </Button>
          <button
            type="button"
            class="text-xs text-muted-foreground hover:text-foreground"
            :disabled="auth.busy"
            @click="auth.logout(); password=''; otp=''"
          >
            重新登录
          </button>
        </form>
      </CardContent>
      <!-- ponytail: the one allowed decorative-gradient usage -->
      <div class="h-1 gradient-glow-border" />
    </Card>
  </div>
</template>