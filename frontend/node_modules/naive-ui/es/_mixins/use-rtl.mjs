import { configProviderInjectionKey } from "../config-provider/src/context.mjs";
import { cssrAnchorMetaName } from "./common.mjs";
import { computed, inject, onBeforeMount, watchEffect } from "vue";
import { exists } from "css-render";
import { useSsrAdapter } from "@css-render/vue3-ssr";
//#region src/_mixins/use-rtl.ts
function useRtl(mountId, rtlStateRef, clsPrefixRef) {
  if (!rtlStateRef) return void 0;
  const ssrAdapter = useSsrAdapter();
  const componentRtlStateRef = computed(() => {
    const {
      value: rtlState
    } = rtlStateRef;
    if (!rtlState) return;
    const componentRtlState = rtlState[mountId];
    if (!componentRtlState) return;
    return componentRtlState;
  });
  const NConfigProvider = inject(configProviderInjectionKey, null);
  const mountStyle = () => {
    watchEffect(() => {
      const {
        value: clsPrefix
      } = clsPrefixRef;
      const id = `${clsPrefix}${mountId}Rtl`;
      if (exists(id, ssrAdapter)) return;
      const {
        value: componentRtlState
      } = componentRtlStateRef;
      if (!componentRtlState) return;
      componentRtlState.style.mount({
        id,
        head: true,
        anchorMetaName: cssrAnchorMetaName,
        props: {
          bPrefix: clsPrefix ? `.${clsPrefix}-` : void 0
        },
        ssr: ssrAdapter,
        parent: NConfigProvider?.styleMountTarget
      });
    });
  };
  if (ssrAdapter) mountStyle();else onBeforeMount(mountStyle);
  return componentRtlStateRef;
}
//#endregion
export { useRtl };