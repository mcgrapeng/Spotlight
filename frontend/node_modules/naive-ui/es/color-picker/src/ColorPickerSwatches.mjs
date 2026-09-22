import { warn } from "../../_utils/naive/warn.mjs";
import { normalizeClass as normalizeClass$1, normalizeVNode } from "../../vue-jsx-vapor/vdom.mjs";
import { convertColor, getModeFromValue } from "./utils.mjs";
import { hsv2rgb, hsva, toRgbaString } from "seemly";
import { computed, createElementBlock, createElementVNode, defineComponent, normalizeStyle, openBlock } from "vue";
//#region src/color-picker/src/ColorPickerSwatches.tsx
const _hoisted_1 = ["onClick", "onKeydown"];
function normalizeColor(color, mode) {
  if (mode === "hsv") {
    const [h, s, v, a] = hsva(color);
    return toRgbaString([...hsv2rgb(h, s, v), a]);
  }
  return color;
}
function getHexFromName(color) {
  const ctx = document.createElement("canvas").getContext("2d");
  if (!ctx) return "#000000";
  ctx.fillStyle = color;
  return ctx.fillStyle;
}
var ColorPickerSwatches_default = defineComponent({
  name: "ColorPickerSwatches",
  props: {
    clsPrefix: {
      type: String,
      required: true
    },
    mode: {
      type: String,
      required: true
    },
    swatches: {
      type: Array,
      required: true
    },
    onUpdateColor: {
      type: Function,
      required: true
    }
  },
  setup(props) {
    const parsedSwatchesRef = computed(() => props.swatches.map(value => {
      const mode = getModeFromValue(value);
      return {
        value,
        mode,
        legalValue: normalizeColor(value, mode)
      };
    }));
    function normalizeOutput(parsed) {
      const {
        mode: modeProp
      } = props;
      let {
        value,
        mode: swatchColorMode
      } = parsed;
      if (!swatchColorMode) {
        swatchColorMode = "hex";
        if (/^[a-zA-Z]+$/.test(value)) value = getHexFromName(value);else {
          warn("color-picker", `color ${value} in swatches is invalid.`);
          value = "#000000";
        }
      }
      if (swatchColorMode === modeProp) return value;
      return convertColor(value, modeProp, swatchColorMode);
    }
    function handleSwatchSelect(parsed) {
      props.onUpdateColor(normalizeOutput(parsed));
    }
    function handleSwatchKeyDown(e, parsed) {
      if (e.key === "Enter") handleSwatchSelect(parsed);
    }
    return {
      parsedSwatchesRef,
      handleSwatchSelect,
      handleSwatchKeyDown
    };
  },
  render() {
    const {
      clsPrefix
    } = this;
    return openBlock(), createElementBlock("div", {
      class: normalizeClass$1(`${clsPrefix}-color-picker-swatches`)
    }, [normalizeVNode(() => this.parsedSwatchesRef.map(swatch => (openBlock(), createElementBlock("div", {
      class: normalizeClass$1(`${clsPrefix}-color-picker-swatch`),
      tabindex: 0,
      onClick: () => {
        this.handleSwatchSelect(swatch);
      },
      onKeydown: e => {
        this.handleSwatchKeyDown(e, swatch);
      }
    }, [createElementVNode("div", {
      class: normalizeClass$1(`${clsPrefix}-color-picker-swatch__fill`),
      style: normalizeStyle({
        background: swatch.legalValue
      })
    }, null, 6)], 42, _hoisted_1))))], 2);
  }
});
//#endregion
export { ColorPickerSwatches_default as default };