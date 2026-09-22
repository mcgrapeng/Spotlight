import useConfig from "../../_mixins/use-config.mjs";
import { useThemeClass } from "../../_mixins/use-css-vars-class.mjs";
import useTheme from "../../_mixins/use-theme.mjs";
import { normalizeClass as normalizeClass$1, normalizeVNode } from "../../vue-jsx-vapor/vdom.mjs";
import typographyLight from "../styles/light.mjs";
import a_cssr_default from "./styles/a.cssr.mjs";
import { computed, createElementBlock, defineComponent, normalizeStyle, openBlock } from "vue";
//#region src/typography/src/a.tsx
const aProps = {
  ...useTheme.props
};
var a_default = defineComponent({
  name: "A",
  props: aProps,
  setup(props) {
    const {
      mergedClsPrefixRef,
      inlineThemeDisabled
    } = useConfig(props);
    const themeRef = useTheme("Typography", "-a", a_cssr_default, typographyLight, props, mergedClsPrefixRef);
    const cssVarsRef = computed(() => {
      const {
        common: {
          cubicBezierEaseInOut
        },
        self: {
          aTextColor
        }
      } = themeRef.value;
      return {
        "--n-text-color": aTextColor,
        "--n-bezier": cubicBezierEaseInOut
      };
    });
    const themeClassHandle = inlineThemeDisabled ? useThemeClass("a", void 0, cssVarsRef, props) : void 0;
    return {
      mergedClsPrefix: mergedClsPrefixRef,
      cssVars: inlineThemeDisabled ? void 0 : cssVarsRef,
      themeClass: themeClassHandle?.themeClass,
      onRender: themeClassHandle?.onRender
    };
  },
  render() {
    this.onRender?.();
    return openBlock(), createElementBlock("a", {
      class: normalizeClass$1([`${this.mergedClsPrefix}-a`, this.themeClass]),
      style: normalizeStyle(this.cssVars)
    }, [normalizeVNode(() => this.$slots.default?.())], 6);
  }
});
//#endregion
export { aProps, a_default as default };