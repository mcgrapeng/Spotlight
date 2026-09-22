import { throwError } from "../_utils/naive/warn.mjs";
import { configProviderInjectionKey } from "../config-provider/src/context.mjs";
import { cssrAnchorMetaName } from "./common.mjs";
import index_cssr_default from "../_styles/global/index.cssr.mjs";
import { inject, onBeforeMount } from "vue";
import { useSsrAdapter } from "@css-render/vue3-ssr";
//#region src/_mixins/use-style.ts
function useStyle(mountId, style, clsPrefixRef) {
  if (!style) {
    if (process.env.NODE_ENV !== "production") throwError("use-style", "No style is specified.");
    return;
  }
  const ssrAdapter = useSsrAdapter();
  const NConfigProvider = inject(configProviderInjectionKey, null);
  const mountStyle = () => {
    const clsPrefix = clsPrefixRef.value;
    style.mount({
      id: clsPrefix === void 0 ? mountId : clsPrefix + mountId,
      head: true,
      anchorMetaName: cssrAnchorMetaName,
      props: {
        bPrefix: clsPrefix ? `.${clsPrefix}-` : void 0
      },
      ssr: ssrAdapter,
      parent: NConfigProvider?.styleMountTarget
    });
    if (!NConfigProvider?.preflightStyleDisabled) index_cssr_default.mount({
      id: "n-global",
      head: true,
      anchorMetaName: cssrAnchorMetaName,
      ssr: ssrAdapter,
      parent: NConfigProvider?.styleMountTarget
    });
  };
  if (ssrAdapter) mountStyle();else onBeforeMount(mountStyle);
}
//#endregion
export { useStyle as default };