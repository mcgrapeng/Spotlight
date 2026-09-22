import useConfig from "../../_mixins/use-config.mjs";
import { useThemeClass } from "../../_mixins/use-css-vars-class.mjs";
import useTheme from "../../_mixins/use-theme.mjs";
import { normalizeClass as normalizeClass$1, normalizeVNode } from "../../vue-jsx-vapor/vdom.mjs";
import layoutLight from "../styles/light.mjs";
import { positionProp } from "./interface.mjs";
import layout_header_cssr_default from "./styles/layout-header.cssr.mjs";
import { computed, createElementBlock, defineComponent, normalizeStyle, openBlock } from "vue";
//#region src/layout/src/LayoutHeader.tsx
const headerProps = {
  position: positionProp,
  inverted: Boolean,
  bordered: Boolean
};
var LayoutHeader_default = defineComponent({
  name: "LayoutHeader",
  props: {
    ...useTheme.props,
    ...headerProps
  },
  setup(props) {
    const {
      mergedClsPrefixRef,
      inlineThemeDisabled
    } = useConfig(props);
    const themeRef = useTheme("Layout", "-layout-header", layout_header_cssr_default, layoutLight, props, mergedClsPrefixRef);
    const cssVarsRef = computed(() => {
      const {
        common: {
          cubicBezierEaseInOut
        },
        self
      } = themeRef.value;
      const vars = {
        "--n-bezier": cubicBezierEaseInOut
      };
      if (props.inverted) {
        vars["--n-color"] = self.headerColorInverted;
        vars["--n-text-color"] = self.textColorInverted;
        vars["--n-border-color"] = self.headerBorderColorInverted;
      } else {
        vars["--n-color"] = self.headerColor;
        vars["--n-text-color"] = self.textColor;
        vars["--n-border-color"] = self.headerBorderColor;
      }
      return vars;
    });
    const themeClassHandle = inlineThemeDisabled ? useThemeClass("layout-header", computed(() => props.inverted ? "a" : "b"), cssVarsRef, props) : void 0;
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
    return openBlock(), createElementBlock("div", {
      class: normalizeClass$1([`${mergedClsPrefix}-layout-header`, this.themeClass, this.position && `${mergedClsPrefix}-layout-header--${this.position}-positioned`, this.bordered && `${mergedClsPrefix}-layout-header--bordered`]),
      style: normalizeStyle(this.cssVars)
    }, [normalizeVNode(() => this.$slots.default?.())], 6);
  }
});
//#endregion
export { LayoutHeader_default as default, headerProps };