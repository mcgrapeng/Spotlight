<script setup lang="ts">
import { Menu } from '@lucide/vue'
import { useI18n } from 'vue-i18n'
import { cn } from '@/lib/utils'
import LogoMark from '@/components/common/LogoMark.vue'
import ClusterCombobox from '@/components/common/ClusterCombobox.vue'
import NamespaceCombobox from '@/components/common/NamespaceCombobox.vue'

const { t } = useI18n()

defineEmits<{
  'open-mobile-menu': []
}>()
</script>

<template>
  <div
    class="sticky top-0 z-40 border-b bg-background"
  >
    <!--
      ponytail: 移动端顶栏重排。
      原来是一行 flex：hamburger + logo + 集群(180px) + namespace(160px) + 语言切换器。
      390px 视口下这三个控件加起来 464px，实测 documentElement.scrollWidth = 433，
      语言切换器直接印在 namespace 选择器上 —— 用户看不到自己正在看哪个 namespace，
      而那是这个应用最核心的上下文信息。
      现在移动端用 grid 显式定位：第 1 行 = 菜单/logo，第 2 行 = 集群+namespace。
      md 以上切回 flex，md:contents 让 combobox 回到自然文档序（logo 之后）。
      主题 + 语言是「偏好」，已经移去侧边栏底部挨着设置，顶栏只留「范围」。
    -->
    <div class="grid grid-cols-[auto_1fr] items-center gap-x-2 gap-y-2 px-3 py-2 md:flex md:h-14 md:gap-3 md:px-5 md:py-0">
      <!-- mobile only: hamburger 触发 drawer；desktop 下让出最左给 logo -->
      <button
        type="button"
        class="md:hidden col-start-1 row-start-1 inline-flex items-center justify-center size-9 rounded-md text-muted-foreground hover:bg-accent hover:text-accent-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-background"
        :aria-label="t('nav.openMenu')"
        @click="$emit('open-mobile-menu')"
      >
        <Menu :size="20" :stroke-width="1.75" aria-hidden="true" />
      </button>

      <router-link
        to="/dashboard"
        :class="cn(
          'group col-start-2 row-start-1 flex items-center gap-2 mr-1 md:mr-2 rounded-md py-1 pr-1',
          'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-background',
        )"
        :aria-label="t('nav.home')"
      >
        <span class="inline-flex items-center justify-center size-7 md:size-8 text-foreground">
          <LogoMark :size="28" />
        </span>
        <span class="hidden sm:flex flex-col leading-none">
          <span class="text-sm font-semibold tracking-tight text-foreground">Spotlight</span>
          <span class="text-2xs font-medium tracking-wide text-muted-foreground mt-0.5">{{ t('nav.tagline') }}</span>
        </span>
      </router-link>

      <div class="col-start-1 col-end-3 row-start-2 flex items-center gap-2 md:contents">
        <ClusterCombobox class="min-w-0 flex-1 md:flex-none" />
        <NamespaceCombobox class="min-w-0 flex-1 md:flex-none" />
      </div>
    </div>
  </div>
</template>
