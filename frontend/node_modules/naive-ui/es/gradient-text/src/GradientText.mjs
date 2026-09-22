import { useHoudini } from "../../_utils/composable/use-houdini.mjs";
import { formatLength } from "../../_utils/css/format-length.mjs";
import { createKey } from "../../_utils/cssr/index.mjs";
import useConfig from "../../_mixins/use-config.mjs";
import { useThemeClass } from "../../_mixins/use-css-vars-class.mjs";
import useTheme from "../../_mixins/use-theme.mjs";
import { normalizeClass as normalizeClass$1, normalizeVNode } from "../../vue-jsx-vapor/vdom.mjs";
import gradientTextLight from "../styles/light.mjs";
import index_cssr_default from "./styles/index.cssr.mjs";
import { computed, createElementBlock, defineComponent, normalizeStyle, openBlock } from "vue";
//#region src/gradient-text/src/GradientText.tsx
const gradientTextProps = {
  ...useTheme.props,
  size: [String, Number],
  fontSize: [String, Number],
  type: {
    type: String,
    default: "primary"
  },
  color: [Object, String],
  gradient: [Object, String]
};
var GradientText_default = defineComponent({
  name: "GradientText",
  props: gradientTextProps,
  setup(props) {
    useHoudini();
    const {
      mergedClsPrefixRef,
      inlineThemeDisabled
    } = useConfig(props);
    const compatibleTypeRef = computed(() => {
      const {
        type
      } = props;
      if (type === "danger") return "error";
      return type;
    });
    const styleFontSizeRef = computed(() => {
      let fontSize = props.size || props.fontSize;
      if (fontSize) fontSize = formatLength(fontSize);
      return fontSize || void 0;
    });
    const styleBgImageRef = computed(() => {
      const gradient = props.color || props.gradient;
      if (typeof gradient === "string") return gradient;else if (gradient) return `linear-gradient(${gradient.deg || 0}deg, ${gradient.from} 0%, ${gradient.to} 100%)`;
    });
    const themeRef = useTheme("GradientText", "-gradient-text", index_cssr_default, gradientTextLight, props, mergedClsPrefixRef);
    const cssVarsRef = computed(() => {
      const {
        value: type
      } = compatibleTypeRef;
      const {
        common: {
          cubicBezierEaseInOut
        },
        self: {
          rotate,
          [createKey("colorStart", type)]: colorStart,
          [createKey("colorEnd", type)]: colorEnd,
          fontWeight
        }
      } = themeRef.value;
      return {
        "--n-bezier": cubicBezierEaseInOut,
        "--n-rotate": rotate,
        "--n-color-start": colorStart,
        "--n-color-end": colorEnd,
        "--n-font-weight": fontWeight
      };
    });
    const themeClassHandle = inlineThemeDisabled ? useThemeClass("gradient-text", computed(() => compatibleTypeRef.value[0]), cssVarsRef, props) : void 0;
    return {
      mergedClsPrefix: mergedClsPrefixRef,
      compatibleType: compatibleTypeRef,
      styleFontSize: styleFontSizeRef,
      styleBgImage: styleBgImageRef,
      cssVars: inlineThemeDisabled ? void 0 : cssVarsRef,
      themeClass: themeClassHandle?.themeClass,
      onRender: themeClassHandle?.onRender
    };
  },
  render() {
    const {
      mergedClsPrefix,
      onRender
    } = this;
    onRender?.();
    return openBlock(), createElementBlock("span", {
      class: normalizeClass$1([`${mergedClsPrefix}-gradient-text`, `${mergedClsPrefix}-gradient-text--${this.compatibleType}-type`, this.themeClass]),
      style: normalizeStyle([{
        fontSize: this.styleFontSize,
        backgroundImage: this.styleBgImage
      }, this.cssVars])
    }, [normalizeVNode(() => this.$slots.default?.())], 6);
  }
});
//#endregion
export { GradientText_default as default, gradientTextProps };