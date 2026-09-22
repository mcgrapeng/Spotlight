import { configProviderInjectionKey } from "../config-provider/src/context.mjs";
import { computed, inject, shallowRef } from "vue";
//#region src/_mixins/use-config.ts
const defaultClsPrefix = "n";
function useConfig(props = {}, options = {
  defaultBordered: true
}) {
  const NConfigProvider = inject(configProviderInjectionKey, null);
  return {
    inlineThemeDisabled: NConfigProvider?.inlineThemeDisabled,
    mergedRtlRef: NConfigProvider?.mergedRtlRef,
    mergedComponentPropsRef: NConfigProvider?.mergedComponentPropsRef,
    mergedBreakpointsRef: NConfigProvider?.mergedBreakpointsRef,
    mergedBorderedRef: computed(() => {
      const {
        bordered
      } = props;
      if (bordered !== void 0) return bordered;
      return NConfigProvider?.mergedBorderedRef.value ?? options.defaultBordered ?? true;
    }),
    mergedClsPrefixRef: NConfigProvider ? NConfigProvider.mergedClsPrefixRef : shallowRef("n"),
    namespaceRef: computed(() => NConfigProvider?.mergedNamespaceRef.value)
  };
}
function useMergedClsPrefix() {
  const NConfigProvider = inject(configProviderInjectionKey, null);
  return NConfigProvider ? NConfigProvider.mergedClsPrefixRef : shallowRef("n");
}
//#endregion
export { useConfig as default, defaultClsPrefix, useMergedClsPrefix };