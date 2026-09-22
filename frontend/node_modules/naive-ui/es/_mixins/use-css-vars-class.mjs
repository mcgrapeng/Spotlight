import { c } from "../_utils/cssr/index.mjs";
import { throwError } from "../_utils/naive/warn.mjs";
import { configProviderInjectionKey } from "../config-provider/src/context.mjs";
import { inject, ref, watchEffect } from "vue";
import { hash } from "css-render";
import { useSsrAdapter } from "@css-render/vue3-ssr";
//#region src/_mixins/use-css-vars-class.ts
function useThemeClass(componentName, hashRef, cssVarsRef, props) {
  if (!cssVarsRef) throwError("useThemeClass", "cssVarsRef is not passed");
  const NConfigProvider = inject(configProviderInjectionKey, null);
  const mergedThemeHashRef = NConfigProvider?.mergedThemeHashRef;
  const styleMountTarget = NConfigProvider?.styleMountTarget;
  const themeClassRef = ref("");
  const ssrAdapter = useSsrAdapter();
  let renderCallback;
  const hashClassPrefix = `__${componentName}`;
  const mountStyle = () => {
    let finalThemeHash = hashClassPrefix;
    const hashValue = hashRef ? hashRef.value : void 0;
    const themeHash = mergedThemeHashRef?.value;
    if (themeHash) finalThemeHash += `-${themeHash}`;
    if (hashValue) finalThemeHash += `-${hashValue}`;
    const {
      themeOverrides,
      builtinThemeOverrides
    } = props;
    if (themeOverrides) finalThemeHash += `-${hash(JSON.stringify(themeOverrides))}`;
    if (builtinThemeOverrides) finalThemeHash += `-${hash(JSON.stringify(builtinThemeOverrides))}`;
    themeClassRef.value = finalThemeHash;
    renderCallback = () => {
      const cssVars = cssVarsRef.value;
      let style = "";
      for (const key in cssVars) style += `${key}: ${cssVars[key]};`;
      c(`.${finalThemeHash}`, style).mount({
        id: finalThemeHash,
        ssr: ssrAdapter,
        parent: styleMountTarget
      });
      renderCallback = void 0;
    };
  };
  watchEffect(() => {
    mountStyle();
  });
  return {
    themeClass: themeClassRef,
    onRender: () => {
      renderCallback?.();
    }
  };
}
//#endregion
export { useThemeClass };