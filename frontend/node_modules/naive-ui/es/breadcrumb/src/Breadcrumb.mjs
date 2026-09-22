import { createInjectionKey } from "../../_utils/vue/create-injection-key.mjs";
import useConfig from "../../_mixins/use-config.mjs";
import { useThemeClass } from "../../_mixins/use-css-vars-class.mjs";
import useTheme from "../../_mixins/use-theme.mjs";
import { normalizeClass as normalizeClass$1, normalizeVNode } from "../../vue-jsx-vapor/vdom.mjs";
import breadcrumbLight from "../styles/light.mjs";
import index_cssr_default from "./styles/index.cssr.mjs";
import { computed, createElementBlock, createElementVNode, defineComponent, normalizeStyle, openBlock, provide, toRef } from "vue";
//#region src/breadcrumb/src/Breadcrumb.tsx
const breadcrumbInjectionKey = createInjectionKey("n-breadcrumb");
const breadcrumbProps = {
  ...useTheme.props,
  separator: {
    type: String,
    default: "/"
  }
};
var Breadcrumb_default = defineComponent({
  name: "Breadcrumb",
  props: breadcrumbProps,
  setup(props) {
    const {
      mergedClsPrefixRef,
      inlineThemeDisabled
    } = useConfig(props);
    const themeRef = useTheme("Breadcrumb", "-breadcrumb", index_cssr_default, breadcrumbLight, props, mergedClsPrefixRef);
    provide(breadcrumbInjectionKey, {
      separatorRef: toRef(props, "separator"),
      mergedClsPrefixRef
    });
    const cssVarsRef = computed(() => {
      const {
        common: {
          cubicBezierEaseInOut
        },
        self: {
          separatorColor,
          itemTextColor,
          itemTextColorHover,
          itemTextColorPressed,
          itemTextColorActive,
          fontSize,
          fontWeightActive,
          itemBorderRadius,
          itemColorHover,
          itemColorPressed,
          itemLineHeight
        }
      } = themeRef.value;
      return {
        "--n-font-size": fontSize,
        "--n-bezier": cubicBezierEaseInOut,
        "--n-item-text-color": itemTextColor,
        "--n-item-text-color-hover": itemTextColorHover,
        "--n-item-text-color-pressed": itemTextColorPressed,
        "--n-item-text-color-active": itemTextColorActive,
        "--n-separator-color": separatorColor,
        "--n-item-color-hover": itemColorHover,
        "--n-item-color-pressed": itemColorPressed,
        "--n-item-border-radius": itemBorderRadius,
        "--n-font-weight-active": fontWeightActive,
        "--n-item-line-height": itemLineHeight
      };
    });
    const themeClassHandle = inlineThemeDisabled ? useThemeClass("breadcrumb", void 0, cssVarsRef, props) : void 0;
    return {
      mergedClsPrefix: mergedClsPrefixRef,
      cssVars: inlineThemeDisabled ? void 0 : cssVarsRef,
      themeClass: themeClassHandle?.themeClass,
      onRender: themeClassHandle?.onRender
    };
  },
  render() {
    this.onRender?.();
    return openBlock(), createElementBlock("nav", {
      class: normalizeClass$1([`${this.mergedClsPrefix}-breadcrumb`, this.themeClass]),
      style: normalizeStyle(this.cssVars),
      "aria-label": "Breadcrumb"
    }, [createElementVNode("ul", null, [normalizeVNode(() => this.$slots.default?.())])], 6);
  }
});
//#endregion
export { breadcrumbInjectionKey, breadcrumbProps, Breadcrumb_default as default };