import { createKey } from "../../_utils/cssr/index.mjs";
import useConfig from "../../_mixins/use-config.mjs";
import { useThemeClass } from "../../_mixins/use-css-vars-class.mjs";
import useTheme from "../../_mixins/use-theme.mjs";
import typographyLight from "../styles/light.mjs";
import header_cssr_default from "./styles/header.cssr.mjs";
import { computed, defineComponent, h } from "vue";
//#region src/typography/src/create-header.ts
const headerProps = {
  ...useTheme.props,
  type: {
    type: String,
    default: "default"
  },
  prefix: String,
  alignText: Boolean
};
var create_header_default = level => defineComponent({
  name: `H${level}`,
  props: headerProps,
  setup(props) {
    const {
      mergedClsPrefixRef,
      inlineThemeDisabled
    } = useConfig(props);
    const themeRef = useTheme("Typography", "-h", header_cssr_default, typographyLight, props, mergedClsPrefixRef);
    const cssVarsRef = computed(() => {
      const {
        type
      } = props;
      const {
        common: {
          cubicBezierEaseInOut
        },
        self: {
          headerFontWeight,
          headerTextColor,
          [createKey("headerPrefixWidth", level)]: prefixWidth,
          [createKey("headerFontSize", level)]: fontSize,
          [createKey("headerMargin", level)]: margin,
          [createKey("headerBarWidth", level)]: barWidth,
          [createKey("headerBarColor", type)]: barColor
        }
      } = themeRef.value;
      return {
        "--n-bezier": cubicBezierEaseInOut,
        "--n-font-size": fontSize,
        "--n-margin": margin,
        "--n-bar-color": barColor,
        "--n-bar-width": barWidth,
        "--n-font-weight": headerFontWeight,
        "--n-text-color": headerTextColor,
        "--n-prefix-width": prefixWidth
      };
    });
    const themeClassHandle = inlineThemeDisabled ? useThemeClass(`h${level}`, computed(() => props.type[0]), cssVarsRef, props) : void 0;
    return {
      mergedClsPrefix: mergedClsPrefixRef,
      cssVars: inlineThemeDisabled ? void 0 : cssVarsRef,
      themeClass: themeClassHandle?.themeClass,
      onRender: themeClassHandle?.onRender
    };
  },
  render() {
    const {
      prefix,
      alignText,
      mergedClsPrefix,
      cssVars,
      $slots
    } = this;
    this.onRender?.();
    return h(`h${level}`, {
      class: [`${mergedClsPrefix}-h`, `${mergedClsPrefix}-h${level}`, this.themeClass, {
        [`${mergedClsPrefix}-h--prefix-bar`]: prefix,
        [`${mergedClsPrefix}-h--align-text`]: alignText
      }],
      style: cssVars
    }, $slots);
  }
});
//#endregion
export { create_header_default as default, headerProps };