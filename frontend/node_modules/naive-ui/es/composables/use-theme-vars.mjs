import { configProviderInjectionKey } from "../config-provider/src/context.mjs";
import derived from "../_styles/common/light.mjs";
import { computed, inject } from "vue";
//#region src/composables/use-theme-vars.ts
function useThemeVars() {
  const configProviderInjection = inject(configProviderInjectionKey, null);
  return computed(() => {
    if (configProviderInjection === null) return derived;
    const {
      mergedThemeRef: {
        value: mergedTheme
      },
      mergedThemeOverridesRef: {
        value: mergedThemeOverrides
      }
    } = configProviderInjection;
    const currentThemeVars = mergedTheme?.common || derived;
    if (mergedThemeOverrides?.common) return Object.assign({}, currentThemeVars, mergedThemeOverrides.common);else return currentThemeVars;
  });
}
//#endregion
export { useThemeVars };