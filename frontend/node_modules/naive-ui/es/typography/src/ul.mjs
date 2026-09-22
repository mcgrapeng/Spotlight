import useConfig from "../../_mixins/use-config.mjs";
import { useThemeClass } from "../../_mixins/use-css-vars-class.mjs";
import useTheme from "../../_mixins/use-theme.mjs";
import { normalizeClass as normalizeClass$1, normalizeVNode } from "../../vue-jsx-vapor/vdom.mjs";
import typographyLight from "../styles/light.mjs";
import list_cssr_default from "./styles/list.cssr.mjs";
import { computed, createElementBlock, defineComponent, normalizeStyle, openBlock } from "vue";
//#region src/typography/src/ul.tsx
const ulProps = {
  ...useTheme.props,
  alignText: Boolean
};
var ul_default = defineComponent({
  name: "Ul",
  props: ulProps,
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
    const themeClassHandle = inlineThemeDisabled ? useThemeClass("ul", void 0, cssVarsRef, props) : void 0;
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
    return openBlock(), createElementBlock("ul", {
      class: normalizeClass$1([`${mergedClsPrefix}-ul`, this.themeClass, this.alignText && `${mergedClsPrefix}-ul--align-text`]),
      style: normalizeStyle(this.cssVars)
    }, [normalizeVNode(() => this.$slots.default?.())], 6);
  }
});
//#endregion
export { ul_default as default, ulProps };