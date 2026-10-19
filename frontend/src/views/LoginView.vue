<script setup lang="ts">
import { computed, reactive, ref } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { useI18n } from 'vue-i18n'
import { KeyRound, LogIn, Loader2, RefreshCw, Server } from '@lucide/vue'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Card, CardContent } from '@/components/ui/card'
import AppSelect from '@/components/ui/AppSelect.vue'
import LogoMark from '@/components/common/LogoMark.vue'
import { useAuthStore } from '@/stores/auth'
import type { ProviderField } from '@/api/endpoints'

const auth = useAuthStore()
const route = useRoute()
const router = useRouter()
const { t } = useI18n()

const username = ref('')
// One reactive bag per field, named by f.name — empty string default so the
// final payload `fields` is always shaped exactly like the provider wants.
const fieldValues = reactive<Record<string, string>>({})
const cluster = ref('')

const availableClusters = computed(() => auth.pendingClusters)
const fields = computed<ProviderField[]>(() => auth.status?.provider?.fields ?? [])

function inputTypeFor(f: ProviderField): string {
  if (f.type === 'password') return 'password'
  // 'otp' and 'text' both render as <input type="text">; the difference is
  // picked up by inputmode/autocomplete attrs below.
  return 'text'
}

function autoCompleteFor(f: ProviderField): string {
  if (f.type === 'password') return 'current-password'
  if (f.type === 'otp') return 'one-time-code'
  return 'off'
}

function clearForm() {
  username.value = ''
  for (const f of fields.value) fieldValues[f.name] = ''
  cluster.value = ''
}

function redirectAfterLogin() {
  // `next` is attacker-controlled (it comes from the URL). Only a same-origin
  // absolute path is allowed: a protocol-relative "//evil.com" survives
  // vue-router's resolver and pushState sends the browser to that origin,
  // right after a real, successful login, which makes for convincing phishing.
  // The lookahead also rejects backslashes because the WHATWG URL parser
  // treats "\" as "/" in a path — "/\evil.com" resolves cross-origin too.
  // It fails closed either way (pushState throws), but there is no reason to
  // lean on the throw.
  const raw = route.query.next
  const next = typeof raw === 'string' && /^\/(?![/\\])/.test(raw) ? raw : '/dashboard'
  router.replace(next)
}

async function submitAuth() {
  if (!username.value.trim() || auth.busy) return
  // Snapshot only the fields the provider asked for — empty strings are
  // intentional so optional fields like `otp` arrive as `""`, not undefined.
  const payload: Record<string, string> = {}
  for (const f of fields.value) payload[f.name] = (fieldValues[f.name] ?? '').trim()
  const r = await auth.login(username.value.trim(), payload)
  if (!r) return
  if (r.clusters_error) {
    // We do not know what this account can reach. Continuing would land the
    // user on the server's own kubeconfig — the admin cluster — while they
    // believe they are looking at their own. Stay here and let them retry.
    return
  }
  if (r.kube_clusters.length === 0) {
    // Token plugin or Teleport genuinely returning zero clusters — straight in.
    clearForm()
    redirectAfterLogin()
    return
  }
  if (r.kube_clusters.length === 1) {
    const ok = await auth.chooseCluster(r.kube_clusters[0])
    if (ok) {
      clearForm()
      redirectAfterLogin()
    }
  }
  // else: render the cluster-picker form (v-if on availableClusters.length > 1)
}

async function submitPick() {
  if (!cluster.value || auth.busy) return
  const ok = await auth.chooseCluster(cluster.value.trim())
  if (ok) {
    clearForm()
    redirectAfterLogin()
  }
}

/** Re-query the cluster list after a failed enumeration. On success fall
 *  through to the normal post-login handling. */
async function onRetryClusters() {
  const ok = await auth.retryClusters()
  if (!ok) return
  if (availableClusters.value.length === 0) {
    clearForm()
    redirectAfterLogin()
    return
  }
  if (availableClusters.value.length === 1) {
    const picked = await auth.chooseCluster(availableClusters.value[0])
    if (picked) {
      clearForm()
      redirectAfterLogin()
    }
  }
  // else: the picker renders on the next tick.
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
          <p class="text-sm text-muted-foreground mt-1">{{ t('nav.tagline') }}</p>
          <p
            v-if="auth.status?.session?.username"
            class="mt-2 text-2xs text-muted-foreground font-mono break-all"
          >
            {{ auth.status.session.username }}
          </p>
        </div>

        <!-- Step 1: plugin auth. Empty `fields` means the server accepts an
             API_TOKEN but has no login plugin — nothing to type here. -->
        <div v-if="availableClusters.length === 0 && fields.length === 0" class="space-y-3">
          <p class="text-sm text-muted-foreground">{{ t('login.bearerOnly') }}</p>
          <p class="text-2xs text-muted-foreground font-mono break-all bg-muted/40 border border-border rounded-md px-3 py-2">
            Authorization: Bearer &lt;API_TOKEN&gt;
          </p>
        </div>

        <!-- Cluster enumeration failed. We do not know what this account can reach,
             and proceeding would silently show the server's own kubeconfig,
             so offer a retry instead of letting them walk in there.

             This must come BEFORE the credential form: enumeration failure also
             yields zero clusters, so a later branch would match first and the
             login form would swallow it — the user would be invited to log in
             again, which is exactly the loop that looks like a wrong password. -->
        <div v-else-if="auth.clustersError" class="space-y-3">
          <p class="text-sm text-error" role="alert">{{ auth.clustersError }}</p>
          <p class="text-2xs text-muted-foreground">{{ t('login.clustersUnavailableHint') }}</p>
          <Button
            class="w-full"
            :disabled="auth.busy"
            @click="onRetryClusters"
          >
            <Loader2 v-if="auth.busy" :size="14" :stroke-width="1.75" class="mr-1.5 animate-spin" />
            <RefreshCw v-else :size="14" :stroke-width="1.75" class="mr-1.5" />
            {{ t('login.retryClusters') }}
          </Button>
        </div>

        <form
          v-else-if="availableClusters.length === 0"
          class="space-y-3"
          @submit.prevent="submitAuth"
        >
          <div>
            <label class="text-sm font-medium mb-1.5 block" for="login-user">
              {{ t('login.username') }}
            </label>
            <Input
              id="login-user"
              v-model="username"
              type="text"
              autocomplete="username"
              :placeholder="t('login.usernamePlaceholder')"
              :disabled="auth.busy"
              required
            />
          </div>

          <!-- Dynamic fields driven by provider.fields — token plugin shows
               ONE token field, teleport shows password + optional otp. -->
          <div v-for="f in fields" :key="f.name">
            <label class="text-sm font-medium mb-1.5 block" :for="`login-${f.name}`">
              {{ f.label }}
              <span
                v-if="!f.required"
                class="text-xs font-normal text-muted-foreground ml-1"
              >{{ t('login.optional') }}</span>
            </label>
            <div :class="f.type === 'otp' ? 'relative' : ''">
              <KeyRound
                v-if="f.type === 'otp'"
                :size="13"
                :stroke-width="1.75"
                class="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground pointer-events-none"
                aria-hidden="true"
              />
              <Input
                :id="`login-${f.name}`"
                v-model="fieldValues[f.name]"
                :type="inputTypeFor(f)"
                :inputmode="f.type === 'otp' ? 'numeric' : undefined"
                :autocomplete="autoCompleteFor(f)"
                :pattern="f.type === 'otp' ? '[0-9]*' : undefined"
                :maxlength="f.type === 'otp' ? 9 : undefined"
                :class="f.type === 'otp' ? 'pl-8' : ''"
                :disabled="auth.busy"
                :required="f.required"
                :placeholder="f.type === 'otp' ? t('login.otpPlaceholder') : ''"
              />
            </div>
          </div>

          <p v-if="auth.error" class="text-sm text-error" role="alert">
            {{ auth.error }}
          </p>
          <Button type="submit" class="w-full" :disabled="auth.busy">
            <Loader2 v-if="auth.busy" :size="14" :stroke-width="1.75" class="mr-1.5 animate-spin" />
            <LogIn v-else :size="14" :stroke-width="1.75" class="mr-1.5" />
            {{ auth.busy ? t('login.submitting') : t('login.submit') }}
          </Button>
        </form>

        <!-- Step 2: pick a kube cluster -->
        <form
          v-else-if="availableClusters.length > 0"
          class="space-y-3"
          @submit.prevent="submitPick"
        >
          <i18n-t
            keypath="login.verifiedAs"
            tag="div"
            class="rounded-md border border-border bg-muted/40 px-3 py-2 text-xs text-muted-foreground"
          >
            <template #user>
              <span class="font-mono">{{ auth.status?.session?.username ?? auth.status?.provider?.id ?? 'plugin' }}</span>
            </template>
          </i18n-t>
          <div>
            <label class="text-sm font-medium mb-1.5 block" for="login-cluster">
              {{ t('login.clusterLabel') }}
              <span class="text-xs font-normal text-muted-foreground ml-1">
                {{ t('login.clusterCount', { count: availableClusters.length }) }}
              </span>
            </label>
            <AppSelect
              id="login-cluster"
              v-model="cluster"
              :options="availableClusters.map((c) => ({ value: c, label: c }))"
              :disabled="auth.busy"
              :placeholder="t('login.clusterPlaceholder')"
              :leading-icon="Server"
              class="w-full"
            />
          </div>
          <p v-if="auth.error" class="text-sm text-error" role="alert">
            {{ auth.error }}
          </p>
          <Button type="submit" class="w-full" :disabled="auth.busy || !cluster">
            <Loader2 v-if="auth.busy" :size="14" :stroke-width="1.75" class="mr-1.5 animate-spin" />
            <LogIn v-else :size="14" :stroke-width="1.75" class="mr-1.5" />
            {{ auth.busy ? t('login.connecting') : t('login.connect') }}
          </Button>
          <button
            type="button"
            class="text-xs text-muted-foreground hover:text-foreground"
            :disabled="auth.busy"
            @click="auth.logout(); clearForm()"
          >
            {{ t('login.relogin') }}
          </button>
        </form>
      </CardContent>
      <!-- ponytail: the one allowed decorative-gradient usage -->
      <div class="h-1 gradient-glow-border" />
    </Card>
  </div>
</template>
