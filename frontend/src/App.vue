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
    primaryColor: '#5b8def',
    primaryColorHover: '#7ba0f4',
    primaryColorPressed: '#4a78d8',
    primaryColorSuppl: '#5b8def',
    bodyColor: '#09090b',
    cardColor: '#141519',
    modalColor: '#141519',
    popoverColor: '#1c1d23',
    tableColor: '#141519',
    tableHeaderColor: '#0e0f12',
    inputColor: '#0e0f12',
    inputColorDisabled: '#0e0f12',
    actionColor: '#0e0f12',
    tagColor: '#1c1d23',
    buttonColor2: '#1c1d23',
    buttonColor2Hover: '#25272f',
    buttonColor2Pressed: '#141519',
    borderColor: '#26282f',
    dividerColor: '#1a1c22',
    textColorBase: '#fafafa',
    textColor1: '#fafafa',
    textColor2: '#d4d4d8',
    textColor3: '#8b8d94',
    placeholderColor: '#5e6068',
    placeholderColorDisabled: '#3f3f46',
    iconColor: '#8b8d94',
    iconColorHover: '#fafafa',
    iconColorPressed: '#5b8def',
    railColor: '#0e0f12',
    fontFamily: "'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif",
    fontFamilyMono: "'JetBrains Mono', ui-monospace, monospace",
    borderRadius: '5px',
    borderRadiusSmall: '4px',
    heightSmall: '26px',
    heightMedium: '30px',
    heightLarge: '34px',
    fontSize: '13px',
  },
  Card: { paddingMedium: '0px', borderRadius: '6px' },
  DataTable: {
    thColor: '#0e0f12', tdColor: '#141519', tdColorHover: '#1c1d23', tdColorStriped: '#101116',
    borderRadius: '6px', thPaddingMedium: '8px 14px', tdPaddingMedium: '10px 14px',
    fontSizeMedium: '12.5px', thFontWeight: '600', borderColor: '#1a1c22',
  },
  Tag: { borderRadius: '3px', fontWeightStrong: '500' },
  Button: {
    borderRadiusMedium: '5px', borderRadiusSmall: '4px',
    textPaddingMedium: '0 12px', textPaddingSmall: '0 8px', textPaddingLarge: '0 16px',
    fontWeight: '500',
  },
  Input: { borderRadius: '5px', color: '#0e0f12', colorFocus: '#0e0f12', border: '1px solid #26282f', borderHover: '1px solid #3a3d46', borderFocus: '1px solid #5b8def' },
  Select: { peers: { InternalSelection: { color: '#0e0f12', colorActive: '#0e0f12', borderHover: '1px solid #3a3d46', borderActive: '1px solid #5b8def', borderFocus: '1px solid #5b8def' } } },
  Menu: {
    color: '#0e0f12', itemColorHover: '#1c1d23', itemColorActive: '#25272f',
    itemTextColor: '#d4d4d8', itemTextColorHover: '#fafafa',
    itemTextColorActive: '#fafafa', itemTextColorActiveHover: '#fafafa',
    borderRadius: '4px', itemHeight: '30px',
  },
  Drawer: { color: '#0e0f12', headerBorderBottom: '1px solid #1a1c22', footerBorderTop: '1px solid #1a1c22' },
  Modal: { color: '#141519' },
  Tabs: { tabFontWeightActive: '600', barColor: '#1a1c22' },
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
