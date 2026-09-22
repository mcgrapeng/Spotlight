import { normalizeClass as normalizeClass$1 } from "../../vue-jsx-vapor/vdom.mjs";
import { convertColor, getModeFromValue } from "./utils.mjs";
import { createElementBlock, createElementVNode, defineComponent, normalizeStyle, openBlock } from "vue";
//#region src/color-picker/src/ColorPreview.tsx
const _hoisted_1 = ["value", "onChange"];
var ColorPreview_default = defineComponent({
  name: "ColorPreview",
  props: {
    clsPrefix: {
      type: String,
      required: true
    },
    mode: {
      type: String,
      required: true
    },
    color: {
      type: String,
      default: null,
      validator: value => {
        const mode = getModeFromValue(value);
        return Boolean(!value || mode && mode !== "hsv");
      }
    },
    onUpdateColor: {
      type: Function,
      required: true
    }
  },
  setup(props) {
    function handleChange(e) {
      const value = e.target.value;
      props.onUpdateColor?.(convertColor(value.toUpperCase(), props.mode, "hex"));
      e.stopPropagation();
    }
    return {
      handleChange
    };
  },
  render() {
    const {
      clsPrefix
    } = this;
    return openBlock(), createElementBlock("div", {
      class: normalizeClass$1(`${clsPrefix}-color-picker-preview__preview`)
    }, [createElementVNode("span", {
      class: normalizeClass$1(`${clsPrefix}-color-picker-preview__fill`),
      style: normalizeStyle({
        background: this.color || "#000000"
      })
    }, null, 6), createElementVNode("input", {
      class: normalizeClass$1(`${clsPrefix}-color-picker-preview__input`),
      type: "color",
      value: this.color,
      onChange: this.handleChange
    }, null, 42, _hoisted_1)], 2);
  }
});
//#endregion
export { ColorPreview_default as default };