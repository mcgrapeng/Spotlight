<script setup lang="ts">
import { onMounted } from 'vue'
import {
  NConfigProvider, NMessageProvider, NDialogProvider, NNotificationProvider,
  NLoadingBarProvider, darkTheme, type GlobalThemeOverrides,
} from 'naive-ui'
import AppLayout from '@/components/layout/AppLayout.vue'
import { useClusterStore } from '@/stores/cluster'

const cluster = useClusterStore()

const overrides: GlobalThemeOverrides = {
  common: {
    primaryColor: '#6366f1',
    primaryColorHover: '#818cf8',
    primaryColorPressed: '#4f46e5',
    primaryColorSuppl: '#6366f1',
    bodyColor: '#0b0c0e',
    cardColor: '#16191f',
    modalColor: '#16191f',
    popoverColor: '#1c2027',
    tableColor: '#16191f',
    tableHeaderColor: '#1c2027',
    inputColor: '#16191f',
    inputColorDisabled: '#16191f',
    actionColor: '#1c2027',
    tagColor: '#1c2027',
    buttonColor2: '#1c2027',
    buttonColor2Hover: '#232830',
    buttonColor2Pressed: '#16191f',
    buttonBorder: '1px solid #262a32',
    buttonBorderHover: '1px solid #353a44',
    buttonBorderPressed: '1px solid #1f2329',
    borderColor: '#262a32',
    dividerColor: '#1f2329',
    textColorBase: '#f4f4f5',
    textColor1: '#f4f4f5',
    textColor2: '#d4d4d8',
    textColor3: '#a1a1aa',
    placeholderColor: '#52525b',
    placeholderColorDisabled: '#3f3f46',
    iconColor: '#a1a1aa',
    iconColorHover: '#f4f4f5',
    iconColorPressed: '#6366f1',
    railColor: '#16191f',
    fontFamily: "'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif",
    fontFamilyMono: "'JetBrains Mono', ui-monospace, monospace",
    borderRadius: '8px',
    borderRadiusSmall: '6px',
    heightSmall: '28px',
    heightMedium: '34px',
    heightLarge: '40px',
    fontSize: '13px',
  },
  Card: { paddingMedium: '0px', borderRadius: '10px' },
  DataTable: { thColor: '#1c2027', tdColor: '#16191f', tdColorHover: '#1c2027', tdColorStriped: '#181b21', borderRadius: '10px', thPaddingMedium: '10px 14px', tdPaddingMedium: '10px 14px' },
  Tag: { borderRadius: '6px' },
  Button: { borderRadiusMedium: '8px', borderRadiusSmall: '6px', textPaddingMedium: '0 14px', textPaddingSmall: '0 10px', textPaddingLarge: '0 18px' },
  Input: { borderRadius: '6px', color: '#16191f', colorFocus: '#16191f' },
  Select: { peers: { InternalSelection: { color: '#16191f', colorActive: '#16191f' } } },
  Menu: { color: '#111317', itemColorHover: '#1c2027', itemColorActive: '#1c2027', itemColorActiveHover: '#1c2027', itemTextColor: '#a1a1aa', itemTextColorHover: '#f4f4f5', itemTextColorActive: '#f4f4f5', itemTextColorActiveHover: '#f4f4f5', borderRadius: '6px' },
  Drawer: { color: '#111317', headerBorderBottom: '1px solid #1f2329', footerBorderTop: '1px solid #1f2329' },
  Modal: { color: '#16191f' },
  Tabs: { tabFontWeightActive: '600' },
}

onMounted(async () => {
  cluster.restore()
  await cluster.loadClusters()
  await cluster.loadNamespaces()
})
</script>

<template>
  <NConfigProvider :theme="darkTheme" :theme-overrides="overrides">
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
