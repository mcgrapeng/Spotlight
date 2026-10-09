<script setup lang="ts">
import { computed, ref } from 'vue'
import { useRouter } from 'vue-router'
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
const currentCluster = computed(() => cluster.clusters.find(c => c.name === cluster.activeCluster) ?? null)

const settingsItems = [
  {
    to: '/ai',
    icon: Sparkles,
    title: 'AI 模型',
    desc: '配置 OpenAI / Anthropic / 自定义端点，用于日志智能分析',
    tone: 'bg-warning/10 text-warning',
  },
]

const aboutItems = [
  { label: '应用', value: 'Spotlight · 集群驾驶舱' },
  { label: '模式', value: '仅亮色（设计固定）' },
  { label: '存储', value: '侧边栏折叠 + 当前集群 / namespace（localStorage）' },
]

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
      <h1 class="text-2xl font-bold tracking-tight">设置</h1>
      <p class="mt-1 text-sm text-muted-foreground">配置 Spotlight 集群驾驶舱</p>
    </header>

    <!-- 配置项：当前只有 AI 模型，点击进入 AISettingsView -->
    <section aria-labelledby="settings-config-heading">
      <h2 id="settings-config-heading" class="text-sm font-semibold text-muted-foreground tracking-wide mb-3">
        配置
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
        当前集群上下文
      </h2>
      <Card class="p-0">
        <CardContent class="p-4 space-y-3">
          <div class="flex items-start gap-3">
            <Server :size="16" :stroke-width="1.75" class="text-muted-foreground mt-0.5 shrink-0" aria-hidden="true" />
            <div class="min-w-0 flex-1">
              <div class="text-2xs text-muted-foreground tracking-wide">集群</div>
              <div class="mt-0.5 font-mono text-sm text-foreground truncate">
                {{ cluster.activeCluster ?? '未选择' }}
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
            切换集群 / namespace 用顶栏的 combobox。
          </p>
        </CardContent>
      </Card>
    </section>

    <!-- 账号：登出入口 (对应 Audit §11.2 缺失) -->
    <section aria-labelledby="settings-account-heading">
      <h2 id="settings-account-heading" class="text-sm font-semibold text-muted-foreground tracking-wide mb-3">
        账号
      </h2>
      <Card class="p-0">
        <CardContent class="p-0">
          <button
            type="button"
            class="flex w-full items-center gap-3 p-4 text-left transition-colors hover:bg-error/5 focus-visible:outline-none focus-visible:bg-error/5 group"
            aria-label="登出"
            @click="showLogoutConfirm = true"
          >
            <span class="inline-flex items-center justify-center size-9 rounded-md shrink-0 bg-error/10 text-error">
              <LogOut :size="16" :stroke-width="1.75" aria-hidden="true" />
            </span>
            <div class="flex-1 min-w-0">
              <div class="text-sm font-medium text-error">登出</div>
              <div class="mt-0.5 text-xs text-muted-foreground">清除本地会话，回到登录页</div>
            </div>
            <ChevronRight :size="16" :stroke-width="1.75" class="text-muted-foreground shrink-0 transition-transform group-hover:translate-x-0.5" aria-hidden="true" />
          </button>
        </CardContent>
      </Card>
    </section>

    <!-- 关于 -->
    <section aria-labelledby="settings-about-heading">
      <h2 id="settings-about-heading" class="text-sm font-semibold text-muted-foreground tracking-wide mb-3">
        关于
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
        <DialogTitle>确认登出？</DialogTitle>
        <p class="text-sm text-muted-foreground">
          登出后会回到登录页，本地会话将被清除。
        </p>
        <div class="mt-3 flex justify-end gap-2">
          <Button variant="outline" size="sm" @click="showLogoutConfirm = false">
            取消
          </Button>
          <Button variant="destructive" size="sm" @click="confirmLogout">
            <LogOut :size="14" :stroke-width="1.75" class="mr-1" />
            登出
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  </div>
</template>