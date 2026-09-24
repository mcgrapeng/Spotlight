<script setup lang="ts">
import { ref } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { LogIn, ShieldCheck } from '@lucide/vue'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Card, CardContent } from '@/components/ui/card'
import { useAuthStore } from '@/stores/auth'

const auth = useAuthStore()
const route = useRoute()
const router = useRouter()

const password = ref('')

function redirectAfterLogin() {
  const next = (route.query.next as string) || '/dashboard'
  router.replace(next)
}

async function submit() {
  if (!password.value || auth.busy) return
  const ok = await auth.login(password.value)
  if (ok) {
    password.value = ''
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
            class="inline-flex h-12 w-12 rounded-lg bg-foreground text-background items-center justify-center mb-3"
            aria-hidden="true"
          >
            <ShieldCheck :size="22" :stroke-width="1.75" />
          </div>
          <h1 class="text-2xl font-bold tracking-tight">K8s Viewer</h1>
          <p class="text-sm text-muted-foreground mt-1">集群可视化平台</p>
        </div>

        <form class="space-y-3" @submit.prevent="submit">
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
          <p v-if="auth.error" class="text-sm text-error" role="alert">
            {{ auth.error }}
          </p>
          <Button type="submit" class="w-full" :disabled="auth.busy">
            <LogIn :size="14" :stroke-width="1.75" class="mr-1.5" />
            {{ auth.busy ? '登录中…' : '登录' }}
          </Button>
        </form>
      </CardContent>
      <!-- ponytail: the one allowed decorative-gradient usage -->
      <div class="h-1 gradient-glow-border" />
    </Card>
  </div>
</template>
