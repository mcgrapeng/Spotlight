import { createInjectionKey } from "../../_utils/vue/create-injection-key.mjs";
import { formatLength } from "../../_utils/css/format-length.mjs";
import useConfig from "../../_mixins/use-config.mjs";
import { useThemeClass } from "../../_mixins/use-css-vars-class.mjs";
import useTheme from "../../_mixins/use-theme.mjs";
import { normalizeClass as normalizeClass$1, normalizeVNode } from "../../vue-jsx-vapor/vdom.mjs";
import themeLight from "../styles/light.mjs";
import index_cssr_default from "./styles/index.cssr.mjs";
import { computed, createElementBlock, defineComponent, normalizeStyle, openBlock, provide, toRef } from "vue";
//#region src/float-button-group/src/FloatButtonGroup.tsx
const floatButtonGroupProps = {
  ...useTheme.props,
  left: [Number, String],
  right: [Number, String],
  top: [Number, String],
  bottom: [Number, String],
  shape: {
    type: String,
    default: "circle"
  },
  position: {
    type: String,
    default: "fixed"
  }
};
const floatButtonGroupInjectionKey = createInjectionKey("n-float-button-group");
var FloatButtonGroup_default = defineComponent({
  name: "FloatButtonGroup",
  props: floatButtonGroupProps,
  setup(props) {
    const {
      mergedClsPrefixRef,
      inlineThemeDisabled
    } = useConfig(props);
    const themeRef = useTheme("FloatButtonGroup", "-float-button-group", index_cssr_default, themeLight, props, mergedClsPrefixRef);
    const cssVarsRef = computed(() => {
      const {
        self: {
          color,
          boxShadow,
          buttonBorderColor,
          borderRadiusSquare
        },
        common: {
          cubicBezierEaseInOut
        }
      } = themeRef.value;
      return {
        "--n-bezier": cubicBezierEaseInOut,
        "--n-box-shadow": boxShadow,
        "--n-color": color,
        "--n-button-border-color": buttonBorderColor,
        "--n-border-radius-square": borderRadiusSquare,
        position: props.position,
        left: formatLength(props.left) || "",
        right: formatLength(props.right) || "",
        top: formatLength(props.top) || "",
        bottom: formatLength(props.bottom) || ""
      };
    });
    provide(floatButtonGroupInjectionKey, {
      shapeRef: toRef(props, "shape")
    });
    const themeClassHandle = inlineThemeDisabled ? useThemeClass("float-button", void 0, cssVarsRef, props) : void 0;
    return {
      cssVars: inlineThemeDisabled ? void 0 : cssVarsRef,
      mergedClsPrefix: mergedClsPrefixRef,
      themeClass: themeClassHandle?.themeClass,
      onRender: themeClassHandle?.onRender
    };
  },
  render() {
    const {
      mergedClsPrefix,
      cssVars,
      shape
    } = this;
    return openBlock(), createElementBlock("div", {
      class: normalizeClass$1([`${mergedClsPrefix}-float-button-group`, `${mergedClsPrefix}-float-button-group--${shape}-shape`]),
      style: normalizeStyle(cssVars),
      role: "group"
    }, [normalizeVNode(() => this.$slots.default?.())], 6);
  }
});
//#endregion
export { FloatButtonGroup_default as default, floatButtonGroupInjectionKey, floatButtonGroupProps };