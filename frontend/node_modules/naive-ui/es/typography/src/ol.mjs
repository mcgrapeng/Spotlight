import useConfig from "../../_mixins/use-config.mjs";
import { useThemeClass } from "../../_mixins/use-css-vars-class.mjs";
import useTheme from "../../_mixins/use-theme.mjs";
import { normalizeClass as normalizeClass$1, normalizeVNode } from "../../vue-jsx-vapor/vdom.mjs";
import typographyLight from "../styles/light.mjs";
import list_cssr_default from "./styles/list.cssr.mjs";
import { computed, createElementBlock, defineComponent, normalizeStyle, openBlock } from "vue";
//#region src/typography/src/ol.tsx
const olProps = {
  ...useTheme.props,
  alignText: Boolean
};
var ol_default = defineComponent({
  name: "Ol",
  props: olProps,
  setup(props) {
    const {
      mergedClsPrefixRef,
      inlineThemeDisabled
    } = useConfig(props);
    const themeRef = useTheme("Typography", "-xl", list_cssr_default, typographyLight, props, mergedClsPrefixRef);
    const cssVarsRef = computed(() => {
      const {
        common: {
          cubicBezierEaseInOut
        },
        self: {
          olPadding,
          ulPadding,
          liMargin,
          liTextColor,
          liLineHeight,
          liFontSize
        }
      } = themeRef.value;
      return {
        "--n-bezier": cubicBezierEaseInOut,
        "--n-font-size": liFontSize,
        "--n-line-height": liLineHeight,
        "--n-text-color": liTextColor,
        "--n-li-margin": liMargin,
        "--n-ol-padding": olPadding,
        "--n-ul-padding": ulPadding
      };
    });
    const themeClassHandle = inlineThemeDisabled ? useThemeClass("ol", void 0, cssVarsRef, props) : void 0;
    return {
      mergedClsPrefix: mergedClsPrefixRef,
      cssVars: inlineThemeDisabled ? void 0 : cssVarsRef,
      themeClass: themeClassHandle?.themeClass,
      onRender: themeClassHandle?.onRender
    };
  },
  render() {
    const {
      mergedClsPrefix
    } = this;
    this.onRender?.();
    return openBlock(), createElementBlock("ol", {
      class: normalizeClass$1([`${mergedClsPrefix}-ol`, this.themeClass, this.alignText && `${mergedClsPrefix}-ol--align-text`]),
      style: normalizeStyle(this.cssVars)
    }, [normalizeVNode(() => this.$slots.default?.())], 6);
  }
});
//#endregion
export { ol_default as default, olProps };