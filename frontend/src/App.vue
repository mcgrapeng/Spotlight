<script setup lang="ts">
import { onMounted } from 'vue'
import {
  NConfigProvider,
  NMessageProvider,
  NDialogProvider,
  NNotificationProvider,
  NLoadingBarProvider,
  darkTheme,
  type GlobalThemeOverrides,
} from 'naive-ui'
import AppLayout from '@/components/layout/AppLayout.vue'
import { useClusterStore } from '@/stores/cluster'

const cluster = useClusterStore()

const themeOverrides: GlobalThemeOverrides = {
  common: {
    primaryColor: '#6366f1',
    primaryColorHover: '#7c7ff5',
    primaryColorPressed: '#4f52d1',
    primaryColorSuppl: '#6366f1',
    bodyColor: '#0a0a0b',
    cardColor: '#131316',
    modalColor: '#131316',
    popoverColor: '#1c1c1f',
    tableHeaderColor: '#131316',
    borderColor: '#27272a',
    dividerColor: '#27272a',
    textColorBase: '#e4e4e7',
    textColor1: '#e4e4e7',
    textColor2: '#d4d4d8',
    textColor3: '#a1a1aa',
    placeholderColor: '#52525b',
    railColor: '#1c1c1f',
    fontFamily: "'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif",
    fontFamilyMono: "'JetBrains Mono', ui-monospace, monospace",
    borderRadius: '6px',
    borderRadiusSmall: '4px',
  },
  Card: {
    paddingMedium: '20px 24px',
    borderRadius: '10px',
  },
  DataTable: {
    thColor: '#131316',
    tdColor: '#131316',
    tdColorHover: '#1c1c1f',
    borderRadius: '8px',
  },
}

onMounted(async () => {
  cluster.restore()
  await cluster.loadClusters()
  await cluster.loadNamespaces()
})
</script>

<template>
  <NConfigProvider :theme="darkTheme" :theme-overrides="themeOverrides">
    <NLoadingBarProvider>
      <NMessageProvider>
        <NDialogProvider>
          <NNotificationProvider>
            <AppLayout />
          </NNotificationProvider>
        </NDialogProvider>
      </NMessageProvider>
    </NLoadingBarProvider>
  </NConfigProvider>
</template>
