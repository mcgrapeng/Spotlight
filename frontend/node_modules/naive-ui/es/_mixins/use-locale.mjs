import { configProviderInjectionKey } from "../config-provider/src/context.mjs";
import enUS from "../locales/common/enUS.mjs";
import dateEnUs from "../locales/date/enUS.mjs";
import { computed, inject } from "vue";
//#region src/_mixins/use-locale.ts
function useLocale(ns) {
  const {
    mergedLocaleRef,
    mergedDateLocaleRef
  } = inject(configProviderInjectionKey, null) || {};
  const localeRef = computed(() => {
    return mergedLocaleRef?.value?.[ns] ?? enUS[ns];
  });
  return {
    dateLocaleRef: computed(() => {
      return mergedDateLocaleRef?.value ?? dateEnUs;
    }),
    localeRef
  };
}
//#endregion
export { useLocale as default };