import useConfig from "../../_mixins/use-config.mjs";
import { useThemeClass } from "../../_mixins/use-css-vars-class.mjs";
import useTheme from "../../_mixins/use-theme.mjs";
import { normalizeClass as normalizeClass$1 } from "../../vue-jsx-vapor/vdom.mjs";
import typographyLight from "../styles/light.mjs";
import hr_cssr_default from "./styles/hr.cssr.mjs";
import { computed, createElementBlock, defineComponent, normalizeStyle, openBlock } from "vue";
//#region src/typography/src/hr.tsx
var hr_default = defineComponent({
  name: "Hr",
  props: {
    ...useTheme.props
  },
  setup(props) {
    const {
      mergedClsPrefixRef,
      inlineThemeDisabled
    } = useConfig(props);
    const themeRef = useTheme("Typography", "-hr", hr_cssr_default, typographyLight, props, mergedClsPrefixRef);
    const cssVarsRef = computed(() => {
      const {
        common: {
          cubicBezierEaseInOut
        },
        self: {
          hrColor
        }
      } = themeRef.value;
      return {
        "--n-bezier": cubicBezierEaseInOut,
        "--n-color": hrColor
      };
    });
    const themeClassHandle = inlineThemeDisabled ? useThemeClass("hr", void 0, cssVarsRef, props) : void 0;
    return {
      mergedClsPrefix: mergedClsPrefixRef,
      cssVars: inlineThemeDisabled ? void 0 : cssVarsRef,
      themeClass: themeClassHandle?.themeClass,
      onRender: themeClassHandle?.onRender
    };
  },
  render() {
    this.onRender?.();
    return openBlock(), createElementBlock("hr", {
      class: normalizeClass$1([`${this.mergedClsPrefix}-hr`, this.themeClass]),
      style: normalizeStyle(this.cssVars)
    }, null, 6);
  }
});
//#endregion
export { hr_default as default };