import { warn } from "../_utils/naive/warn.mjs";
import { configProviderInjectionKey } from "../config-provider/src/context.mjs";
import { computed, inject, watchEffect } from "vue";
//#region src/_mixins/use-hljs.ts
function useHljs(props, shouldHighlightRef) {
  const NConfigProvider = inject(configProviderInjectionKey, null);
  if (process.env.NODE_ENV !== "production") {
    const warnHljs = () => {
      if (!props.hljs && !NConfigProvider?.mergedHljsRef.value) warn("code", "hljs is not set.");
    };
    if (!shouldHighlightRef) warnHljs();else watchEffect(() => {
      if (shouldHighlightRef.value) warnHljs();
    });
  }
  return computed(() => {
    return props.hljs || NConfigProvider?.mergedHljsRef.value;
  });
}
//#endregion
export { useHljs as default };