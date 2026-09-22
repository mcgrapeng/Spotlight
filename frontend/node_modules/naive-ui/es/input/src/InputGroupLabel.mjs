import { createKey } from "../../_utils/cssr/index.mjs";
import useConfig from "../../_mixins/use-config.mjs";
import { useThemeClass } from "../../_mixins/use-css-vars-class.mjs";
import useFormItem from "../../_mixins/use-form-item.mjs";
import useTheme from "../../_mixins/use-theme.mjs";
import { normalizeClass as normalizeClass$1, normalizeVNode } from "../../vue-jsx-vapor/vdom.mjs";
import inputLight from "../styles/light.mjs";
import input_group_label_cssr_default from "./styles/input-group-label.cssr.mjs";
import { computed, createElementBlock, defineComponent, normalizeStyle, openBlock } from "vue";
//#region src/input/src/InputGroupLabel.tsx
const inputGroupLabelProps = {
  ...useTheme.props,
  size: String,
  bordered: {
    type: Boolean,
    default: void 0
  }
};
var InputGroupLabel_default = defineComponent({
  name: "InputGroupLabel",
  props: inputGroupLabelProps,
  setup(props) {
    const {
      mergedBorderedRef,
      mergedClsPrefixRef,
      inlineThemeDisabled,
      mergedComponentPropsRef
    } = useConfig(props);
    const themeRef = useTheme("Input", "-input-group-label", input_group_label_cssr_default, inputLight, props, mergedClsPrefixRef);
    const {
      mergedSizeRef
    } = useFormItem(props, {
      mergedSize(NFormItem) {
        if (props.size !== void 0) return props.size;
        if (NFormItem) return NFormItem.mergedSize.value;
        const configSize = mergedComponentPropsRef?.value?.Input?.size;
        if (configSize) return configSize;
        return "medium";
      }
    });
    const cssVarsRef = computed(() => {
      const {
        value: size
      } = mergedSizeRef;
      const {
        common: {
          cubicBezierEaseInOut
        },
        self: {
          groupLabelColor,
          borderRadius,
          groupLabelTextColor,
          lineHeight,
          groupLabelBorder,
          [createKey("fontSize", size)]: fontSize,
          [createKey("height", size)]: height
        }
      } = themeRef.value;
      return {
        "--n-bezier": cubicBezierEaseInOut,
        "--n-group-label-color": groupLabelColor,
        "--n-group-label-border": groupLabelBorder,
        "--n-border-radius": borderRadius,
        "--n-group-label-text-color": groupLabelTextColor,
        "--n-font-size": fontSize,
        "--n-line-height": lineHeight,
        "--n-height": height
      };
    });
    const themeClassHandle = inlineThemeDisabled ? useThemeClass("input-group-label", computed(() => mergedSizeRef.value[0]), cssVarsRef, props) : void 0;
    return {
      mergedClsPrefix: mergedClsPrefixRef,
      mergedBordered: mergedBorderedRef,
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
      class: normalizeClass$1([`${mergedClsPrefix}-input-group-label`, this.themeClass]),
      style: normalizeStyle(this.cssVars)
    }, [normalizeVNode(() => this.$slots.default?.()), this.mergedBordered ? (openBlock(), createElementBlock("div", {
      key: 0,
      class: normalizeClass$1(`${mergedClsPrefix}-input-group-label__border`)
    }, null, 2)) : normalizeVNode(() => null)], 6);
  }
});
//#endregion
export { InputGroupLabel_default as default, inputGroupLabelProps };