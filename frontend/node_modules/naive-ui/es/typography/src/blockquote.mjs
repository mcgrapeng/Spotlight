import useConfig from "../../_mixins/use-config.mjs";
import { useThemeClass } from "../../_mixins/use-css-vars-class.mjs";
import useTheme from "../../_mixins/use-theme.mjs";
import { normalizeClass as normalizeClass$1, normalizeVNode } from "../../vue-jsx-vapor/vdom.mjs";
import typographyLight from "../styles/light.mjs";
import blockquote_cssr_default from "./styles/blockquote.cssr.mjs";
import { computed, createElementBlock, defineComponent, normalizeStyle, openBlock } from "vue";
//#region src/typography/src/blockquote.tsx
const blockquoteProps = {
  ...useTheme.props,
  alignText: Boolean
};
var blockquote_default = defineComponent({
  name: "Blockquote",
  props: blockquoteProps,
  setup(props) {
    const {
      mergedClsPrefixRef,
      inlineThemeDisabled
    } = useConfig(props);
    const themeRef = useTheme("Typography", "-blockquote", blockquote_cssr_default, typographyLight, props, mergedClsPrefixRef);
    const cssVarsRef = computed(() => {
      const {
        common: {
          cubicBezierEaseInOut
        },
        self: {
          blockquoteTextColor,
          blockquotePrefixColor,
          blockquoteLineHeight,
          blockquoteFontSize
        }
      } = themeRef.value;
      return {
        "--n-bezier": cubicBezierEaseInOut,
        "--n-font-size": blockquoteFontSize,
        "--n-line-height": blockquoteLineHeight,
        "--n-prefix-color": blockquotePrefixColor,
        "--n-text-color": blockquoteTextColor
      };
    });
    const themeClassHandle = inlineThemeDisabled ? useThemeClass("blockquote", void 0, cssVarsRef, props) : void 0;
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
    return openBlock(), createElementBlock("blockquote", {
      class: normalizeClass$1([`${mergedClsPrefix}-blockquote`, this.themeClass, this.alignText && `${mergedClsPrefix}-blockquote--align-text`]),
      style: normalizeStyle(this.cssVars)
    }, [normalizeVNode(() => this.$slots.default?.())], 6);
  }
});
//#endregion
export { blockquoteProps, blockquote_default as default };