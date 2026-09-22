import useConfig from "../../_mixins/use-config.mjs";
import { useThemeClass } from "../../_mixins/use-css-vars-class.mjs";
import useTheme from "../../_mixins/use-theme.mjs";
import { normalizeClass as normalizeClass$1, normalizeVNode } from "../../vue-jsx-vapor/vdom.mjs";
import dividerLight from "../styles/light.mjs";
import index_cssr_default from "./styles/index.cssr.mjs";
import { Fragment, computed, createElementBlock, createElementVNode, defineComponent, normalizeStyle, openBlock } from "vue";
//#region src/divider/src/Divider.tsx
const dividerProps = {
  ...useTheme.props,
  titlePlacement: {
    type: String,
    default: "center"
  },
  dashed: Boolean,
  vertical: Boolean
};
var Divider_default = defineComponent({
  name: "Divider",
  props: dividerProps,
  setup(props) {
    const {
      mergedClsPrefixRef,
      inlineThemeDisabled
    } = useConfig(props);
    const themeRef = useTheme("Divider", "-divider", index_cssr_default, dividerLight, props, mergedClsPrefixRef);
    const cssVarsRef = computed(() => {
      const {
        common: {
          cubicBezierEaseInOut
        },
        self: {
          color,
          textColor,
          fontWeight
        }
      } = themeRef.value;
      return {
        "--n-bezier": cubicBezierEaseInOut,
        "--n-color": color,
        "--n-text-color": textColor,
        "--n-font-weight": fontWeight
      };
    });
    const themeClassHandle = inlineThemeDisabled ? useThemeClass("divider", void 0, cssVarsRef, props) : void 0;
    return {
      mergedClsPrefix: mergedClsPrefixRef,
      cssVars: inlineThemeDisabled ? void 0 : cssVarsRef,
      themeClass: themeClassHandle?.themeClass,
      onRender: themeClassHandle?.onRender
    };
  },
  render() {
    const {
      $slots,
      titlePlacement,
      vertical,
      dashed,
      cssVars,
      mergedClsPrefix
    } = this;
    this.onRender?.();
    return openBlock(), createElementBlock("div", {
      role: "separator",
      class: normalizeClass$1([`${mergedClsPrefix}-divider`, this.themeClass, {
        [`${mergedClsPrefix}-divider--vertical`]: vertical,
        [`${mergedClsPrefix}-divider--no-title`]: !$slots.default,
        [`${mergedClsPrefix}-divider--dashed`]: dashed,
        [`${mergedClsPrefix}-divider--title-position-${titlePlacement}`]: $slots.default && titlePlacement
      }]),
      style: normalizeStyle(cssVars)
    }, [!vertical ? (openBlock(), createElementBlock("div", {
      key: 0,
      class: normalizeClass$1(`${mergedClsPrefix}-divider__line ${mergedClsPrefix}-divider__line--left`)
    }, null, 2)) : normalizeVNode(() => null), !vertical && $slots.default ? (openBlock(), createElementBlock(Fragment, {
      key: 2
    }, [createElementVNode("div", {
      class: normalizeClass$1(`${mergedClsPrefix}-divider__title`)
    }, [normalizeVNode(() => this.$slots.default?.())], 2), createElementVNode("div", {
      class: normalizeClass$1(`${mergedClsPrefix}-divider__line ${mergedClsPrefix}-divider__line--right`)
    }, null, 2)], 64)) : normalizeVNode(() => null)], 6);
  }
});
//#endregion
export { Divider_default as default, dividerProps };