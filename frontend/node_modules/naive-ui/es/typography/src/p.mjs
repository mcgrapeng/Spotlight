import useConfig from "../../_mixins/use-config.mjs";
import { useThemeClass } from "../../_mixins/use-css-vars-class.mjs";
import useTheme from "../../_mixins/use-theme.mjs";
import { normalizeClass as normalizeClass$1, normalizeVNode } from "../../vue-jsx-vapor/vdom.mjs";
import typographyLight from "../styles/light.mjs";
import p_cssr_default from "./styles/p.cssr.mjs";
import { computed, createElementBlock, defineComponent, normalizeStyle, openBlock } from "vue";
//#region src/typography/src/p.tsx
const pProps = {
  ...useTheme.props,
  depth: [String, Number]
};
var p_default = defineComponent({
  name: "P",
  props: pProps,
  setup(props) {
    const {
      mergedClsPrefixRef,
      inlineThemeDisabled
    } = useConfig(props);
    const themeRef = useTheme("Typography", "-p", p_cssr_default, typographyLight, props, mergedClsPrefixRef);
    const cssVarsRef = computed(() => {
      const {
        depth
      } = props;
      const typeSafeDepth = depth || "1";
      const {
        common: {
          cubicBezierEaseInOut
        },
        self: {
          pFontSize,
          pLineHeight,
          pMargin,
          pTextColor,
          [`pTextColor${typeSafeDepth}Depth`]: depthTextColor
        }
      } = themeRef.value;
      return {
        "--n-bezier": cubicBezierEaseInOut,
        "--n-font-size": pFontSize,
        "--n-line-height": pLineHeight,
        "--n-margin": pMargin,
        "--n-text-color": depth === void 0 ? pTextColor : depthTextColor
      };
    });
    const themeClassHandle = inlineThemeDisabled ? useThemeClass("p", computed(() => `${props.depth || ""}`), cssVarsRef, props) : void 0;
    return {
      mergedClsPrefix: mergedClsPrefixRef,
      cssVars: inlineThemeDisabled ? void 0 : cssVarsRef,
      themeClass: themeClassHandle?.themeClass,
      onRender: themeClassHandle?.onRender
    };
  },
  render() {
    this.onRender?.();
    return openBlock(), createElementBlock("p", {
      class: normalizeClass$1([`${this.mergedClsPrefix}-p`, this.themeClass]),
      style: normalizeStyle(this.cssVars)
    }, [normalizeVNode(() => this.$slots.default?.())], 6);
  }
});
//#endregion
export { p_default as default, pProps };