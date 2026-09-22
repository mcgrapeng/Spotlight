import { normalizeClass as normalizeClass$1, normalizeVNode } from "../../vue-jsx-vapor/vdom.mjs";
import { getWCAGContrast } from "./utils.mjs";
import { colorPickerInjectionKey } from "./context.mjs";
import { toHslaString } from "seemly";
import { Fragment, createElementBlock, createElementVNode, defineComponent, inject, normalizeStyle, openBlock } from "vue";
//#region src/color-picker/src/ColorPickerTrigger.tsx
const _hoisted_1 = ["onClick"];
var ColorPickerTrigger_default = defineComponent({
  name: "ColorPickerTrigger",
  slots: Object,
  props: {
    clsPrefix: {
      type: String,
      required: true
    },
    value: {
      type: String,
      default: null
    },
    hsla: {
      type: Array,
      default: null
    },
    disabled: Boolean,
    onClick: Function
  },
  setup(props) {
    const {
      colorPickerSlots,
      renderLabelRef
    } = inject(colorPickerInjectionKey, null);
    return () => {
      const {
        hsla,
        value,
        clsPrefix,
        onClick,
        disabled
      } = props;
      const renderLabel = colorPickerSlots.label || renderLabelRef.value;
      return openBlock(), createElementBlock("div", {
        class: normalizeClass$1([`${clsPrefix}-color-picker`, disabled && `${clsPrefix}-color-picker--disabled`]),
        onClick: disabled ? void 0 : onClick
      }, [createElementVNode("div", {
        class: normalizeClass$1(`${clsPrefix}-color-picker__fill`)
      }, [createElementVNode("div", {
        class: normalizeClass$1(`${clsPrefix}-color-picker-checkboard`)
      }, null, 2), createElementVNode("div", {
        style: normalizeStyle({
          position: "absolute",
          left: 0,
          right: 0,
          top: 0,
          bottom: 0,
          backgroundColor: hsla ? toHslaString(hsla) : ""
        })
      }, null, 4), value && hsla ? (openBlock(), createElementBlock("div", {
        key: 0,
        class: normalizeClass$1(`${clsPrefix}-color-picker__value`),
        style: normalizeStyle({
          color: getWCAGContrast(hsla) ? "white" : "black"
        })
      }, [renderLabel ? (openBlock(), createElementBlock(Fragment, {
        key: 0
      }, [normalizeVNode(() => renderLabel(value))], 64)) : (openBlock(), createElementBlock(Fragment, {
        key: 1
      }, [normalizeVNode(() => value)], 64))], 6)) : normalizeVNode(() => null)], 2)], 10, _hoisted_1);
    };
  }
});
//#endregion
export { ColorPickerTrigger_default as default };