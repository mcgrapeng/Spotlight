<script setup lang="ts">
import { computed } from 'vue'
import { Sparkles, Server, Layers, ChevronRight, Info } from '@lucide/vue'
import { Card, CardContent } from '@/components/ui/card'
import { cn } from '@/lib/utils'
import { useClusterStore } from '@/stores/cluster'

const cluster = useClusterStore()
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
  { label: '应用', value: 'Fathom · 集群驾驶舱' },
  { label: '模式', value: '仅亮色（设计固定）' },
  { label: '存储', value: '侧边栏折叠 + 当前集群 / namespace（localStorage）' },
]
</script>

<template>
  <div class="space-y-5">
    <header class="border-b border-border pb-4">
      <h1 class="text-2xl font-bold tracking-tight">设置</h1>
      <p class="mt-1 text-sm text-muted-foreground">配置 Fathom 集群驾驶舱</p>
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
              'flex items-center gap-3 p-4 transition-colors hover:bg-muted/40',
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
  </div>
</template>