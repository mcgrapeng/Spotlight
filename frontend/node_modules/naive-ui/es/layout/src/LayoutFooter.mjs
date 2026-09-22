import useConfig from "../../_mixins/use-config.mjs";
import { useThemeClass } from "../../_mixins/use-css-vars-class.mjs";
import useTheme from "../../_mixins/use-theme.mjs";
import { normalizeClass as normalizeClass$1, normalizeVNode } from "../../vue-jsx-vapor/vdom.mjs";
import layoutLight from "../styles/light.mjs";
import { positionProp } from "./interface.mjs";
import layout_footer_cssr_default from "./styles/layout-footer.cssr.mjs";
import { computed, createElementBlock, defineComponent, normalizeStyle, openBlock } from "vue";
//#region src/layout/src/LayoutFooter.tsx
const layoutFooterProps = {
  ...useTheme.props,
  inverted: Boolean,
  position: positionProp,
  bordered: Boolean
};
var LayoutFooter_default = defineComponent({
  name: "LayoutFooter",
  props: layoutFooterProps,
  setup(props) {
    const {
      mergedClsPrefixRef,
      inlineThemeDisabled
    } = useConfig(props);
    const themeRef = useTheme("Layout", "-layout-footer", layout_footer_cssr_default, layoutLight, props, mergedClsPrefixRef);
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
        vars["--n-color"] = self.footerColorInverted;
        vars["--n-text-color"] = self.textColorInverted;
        vars["--n-border-color"] = self.footerBorderColorInverted;
      } else {
        vars["--n-color"] = self.footerColor;
        vars["--n-text-color"] = self.textColor;
        vars["--n-border-color"] = self.footerBorderColor;
      }
      return vars;
    });
    const themeClassHandle = inlineThemeDisabled ? useThemeClass("layout-footer", computed(() => props.inverted ? "a" : "b"), cssVarsRef, props) : void 0;
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
      class: normalizeClass$1([`${mergedClsPrefix}-layout-footer`, this.themeClass, this.position && `${mergedClsPrefix}-layout-footer--${this.position}-positioned`, this.bordered && `${mergedClsPrefix}-layout-footer--bordered`]),
      style: normalizeStyle(this.cssVars)
    }, [normalizeVNode(() => this.$slots.default?.())], 6);
  }
});
//#endregion
export { LayoutFooter_default as default, layoutFooterProps };