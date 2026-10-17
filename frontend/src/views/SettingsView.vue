<script setup lang="ts">
import { computed, ref } from 'vue'
import { useRouter } from 'vue-router'
import { useI18n } from 'vue-i18n'
import { Sparkles, Server, Layers, ChevronRight, Info, LogOut } from '@lucide/vue'
import { Card, CardContent } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Dialog, DialogContent, DialogTitle } from '@/components/ui/dialog'
import { cn } from '@/lib/utils'
import { useClusterStore } from '@/stores/cluster'
import { useAuthStore } from '@/stores/auth'

const router = useRouter()
const cluster = useClusterStore()
const auth = useAuthStore()
const { t } = useI18n()
const currentCluster = computed(() => cluster.clusters.find(c => c.name === cluster.activeCluster) ?? null)

// computed, not plain arrays: `t()` must be re-read on a locale switch.
const settingsItems = computed(() => [
  {
    to: '/ai',
    icon: Sparkles,
    title: t('route.ai'),
    desc: t('settings.aiDesc'),
    tone: 'bg-warning/10 text-warning',
  },
])

const aboutItems = computed(() => [
  { label: t('settings.aboutApp'), value: `Spotlight · ${t('nav.tagline')}` },
  { label: t('settings.aboutTheme'), value: t('settings.aboutThemeValue') },
  { label: t('settings.aboutStorage'), value: t('settings.aboutStorageValue') },
])

const showLogoutConfirm = ref(false)

function confirmLogout() {
  auth.logout()
  showLogoutConfirm.value = false
  // 跳到 /login；router.push 会被全局 beforeEach 拦截再次跳到 /login（required=true）
  router.replace({ name: 'login' })
}
</script>

<template>
  <div class="space-y-5">
    <header class="border-b border-border pb-4">
      <h1 class="text-2xl font-bold tracking-tight">{{ t('route.settings') }}</h1>
      <p class="mt-1 text-sm text-muted-foreground">{{ t('settings.subtitle') }}</p>
    </header>

    <!-- 配置项：当前只有 AI 模型，点击进入 AISettingsView -->
    <section aria-labelledby="settings-config-heading">
      <h2 id="settings-config-heading" class="text-sm font-semibold text-muted-foreground tracking-wide mb-3">
        {{ t('settings.configHeading') }}
      </h2>
      <Card class="p-0">
        <CardContent class="p-0">
          <router-link
            v-for="(item, idx) in settingsItems"
            :key="item.to"
            :to="item.to"
            :class="cn(
              'flex items-center gap-3 p-4 transition-colors hover:bg-muted/40 focus-visible:outline-none focus-visible:bg-muted/40',
              idx > 0 && 'border-t border-border',
            )"
          >
            <span :class="cn(
              'inline-flex items-center justify-center size-9 rounded-md shrink-0',
              item.tone,
            )">
              <component :is="item.icon" :size="16" :stroke-width="1.75" aria-hidden="true" />
            </span>
            <div class="flex-1 min-w-0">
              <div class="text-sm font-medium text-foreground">{{ item.title }}</div>
              <div class="mt-0.5 text-xs text-muted-foreground">{{ item.desc }}</div>
            </div>
            <ChevronRight :size="16" :stroke-width="1.75" class="text-muted-foreground shrink-0" aria-hidden="true" />
          </router-link>
        </CardContent>
      </Card>
    </section>

    <!-- 当前集群上下文：只读展示，让用户确认自己的上下文 -->
    <section aria-labelledby="settings-context-heading">
      <h2 id="settings-context-heading" class="text-sm font-semibold text-muted-foreground tracking-wide mb-3">
        {{ t('settings.contextHeading') }}
      </h2>
      <Card class="p-0">
        <CardContent class="p-4 space-y-3">
          <div class="flex items-start gap-3">
            <Server :size="16" :stroke-width="1.75" class="text-muted-foreground mt-0.5 shrink-0" aria-hidden="true" />
            <div class="min-w-0 flex-1">
              <div class="text-2xs text-muted-foreground tracking-wide">{{ t('settings.clusterLabel') }}</div>
              <div class="mt-0.5 font-mono text-sm text-foreground truncate">
                {{ cluster.activeCluster ?? t('settings.notSelected') }}
              </div>
              <div v-if="currentCluster" class="mt-0.5 text-2xs text-muted-foreground font-mono truncate">
                {{ currentCluster.cluster }} · user {{ currentCluster.user }}
              </div>
            </div>
          </div>
          <div class="flex items-start gap-3">
            <Layers :size="16" :stroke-width="1.75" class="text-muted-foreground mt-0.5 shrink-0" aria-hidden="true" />
            <div class="min-w-0 flex-1">
              <div class="text-2xs text-muted-foreground tracking-wide">Namespace</div>
              <div class="mt-0.5 font-mono text-sm text-foreground">
                {{ cluster.activeNamespace }}
              </div>
            </div>
          </div>
          <p class="text-2xs text-muted-foreground pt-2 border-t border-border">
            {{ t('settings.switchHint') }}
          </p>
        </CardContent>
      </Card>
    </section>

    <!-- 账号：登出入口 (对应 Audit §11.2 缺失) -->
    <section aria-labelledby="settings-account-heading">
      <h2 id="settings-account-heading" class="text-sm font-semibold text-muted-foreground tracking-wide mb-3">
        {{ t('settings.accountHeading') }}
      </h2>
      <Card class="p-0">
        <CardContent class="p-0">
          <button
            type="button"
            class="flex w-full items-center gap-3 p-4 text-left transition-colors hover:bg-error/5 focus-visible:outline-none focus-visible:bg-error/5 group"
            :aria-label="t('settings.logout')"
            @click="showLogoutConfirm = true"
          >
            <span class="inline-flex items-center justify-center size-9 rounded-md shrink-0 bg-error/10 text-error">
              <LogOut :size="16" :stroke-width="1.75" aria-hidden="true" />
            </span>
            <div class="flex-1 min-w-0">
              <div class="text-sm font-medium text-error">{{ t('settings.logout') }}</div>
              <div class="mt-0.5 text-xs text-muted-foreground">{{ t('settings.logoutDesc') }}</div>
            </div>
            <ChevronRight :size="16" :stroke-width="1.75" class="text-muted-foreground shrink-0 transition-transform group-hover:translate-x-0.5" aria-hidden="true" />
          </button>
        </CardContent>
      </Card>
    </section>

    <!-- 关于 -->
    <section aria-labelledby="settings-about-heading">
      <h2 id="settings-about-heading" class="text-sm font-semibold text-muted-foreground tracking-wide mb-3">
        {{ t('settings.aboutHeading') }}
      </h2>
      <Card class="p-0">
        <CardContent class="p-0">
          <div
            v-for="(item, idx) in aboutItems"
            :key="item.label"
            :class="cn(
              'flex items-center gap-3 px-4 py-3 text-sm',
              idx > 0 && 'border-t border-border',
            )"
          >
            <Info :size="14" :stroke-width="1.75" class="text-muted-foreground shrink-0" aria-hidden="true" />
            <span class="text-muted-foreground w-16 shrink-0">{{ item.label }}</span>
            <span class="text-foreground font-mono text-xs">{{ item.value }}</span>
          </div>
        </CardContent>
      </Card>
    </section>

    <!-- 登出确认 Dialog（reka Dialog：自带焦点陷阱 / Esc / 遮罩关闭） -->
    <Dialog :open="showLogoutConfirm" @update:open="(v) => (showLogoutConfirm = v)">
      <DialogContent class="sm:max-w-sm">
        <DialogTitle>{{ t('settings.logoutConfirmTitle') }}</DialogTitle>
        <p class="text-sm text-muted-foreground">
          {{ t('settings.logoutConfirmBody') }}
        </p>
        <div class="mt-3 flex justify-end gap-2">
          <Button variant="outline" size="sm" @click="showLogoutConfirm = false">
            {{ t('settings.cancel') }}
          </Button>
          <Button variant="destructive" size="sm" @click="confirmLogout">
            <LogOut :size="14" :stroke-width="1.75" class="mr-1" />
            {{ t('settings.logout') }}
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  </div>
</template>