import { warn } from "../../_utils/naive/warn.mjs";
import { configProviderInjectionKey } from "../../config-provider/src/context.mjs";
import derived from "../../_styles/common/light.mjs";
import { defineComponent, inject, onBeforeMount, onUnmounted, watchEffect } from "vue";
import { merge } from "lodash-es";
//#region src/global-style/src/GlobalStyle.ts
var GlobalStyle_default = defineComponent({
  name: "GlobalStyle",
  setup() {
    if (typeof document === "undefined") return;
    const NConfigProvider = inject(configProviderInjectionKey, null);
    const {
      body
    } = document;
    const {
      style
    } = body;
    let styleApplied = false;
    let firstApply = true;
    onBeforeMount(() => {
      watchEffect(() => {
        const {
          textColor2,
          fontSize,
          fontFamily,
          bodyColor,
          cubicBezierEaseInOut,
          lineHeight
        } = NConfigProvider ? merge({}, NConfigProvider.mergedThemeRef.value?.common || derived, NConfigProvider.mergedThemeOverridesRef.value?.common) : derived;
        if (styleApplied || !body.hasAttribute("n-styled")) {
          style.setProperty("-webkit-text-size-adjust", "100%");
          style.setProperty("-webkit-tap-highlight-color", "transparent");
          style.padding = "0";
          style.margin = "0";
          style.backgroundColor = bodyColor;
          style.color = textColor2;
          style.fontSize = fontSize;
          style.fontFamily = fontFamily;
          style.lineHeight = lineHeight;
          const transition = `color .3s ${cubicBezierEaseInOut}, background-color .3s ${cubicBezierEaseInOut}`;
          if (firstApply) setTimeout(() => {
            style.transition = transition;
          }, 0);else style.transition = transition;
          body.setAttribute("n-styled", "");
          styleApplied = true;
          firstApply = false;
        } else if (process.env.NODE_ENV !== "production") warn("global-style", "More than one n-global-style exist in the document.body. Only the first mounted one will work.");
      });
    });
    onUnmounted(() => {
      if (styleApplied) body.removeAttribute("n-styled");
    });
  },
  render() {
    return null;
  }
});
//#endregion
export { GlobalStyle_default as default };