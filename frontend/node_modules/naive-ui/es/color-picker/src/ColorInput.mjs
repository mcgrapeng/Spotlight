import { normalizeClass as normalizeClass$1, normalizeVNode } from "../../vue-jsx-vapor/vdom.mjs";
import InputGroup_default from "../../input/src/InputGroup.mjs";
import ColorInputUnit_default from "./ColorInputUnit.mjs";
import { toHexString, toHexaString, toHslString, toHslaString, toHsvString, toHsvaString, toRgbString, toRgbaString } from "seemly";
import { createBlock, createElementBlock, createElementVNode, createVNode, defineComponent, normalizeStyle, openBlock } from "vue";
//#region src/color-picker/src/ColorInput.tsx
const _hoisted_1 = ["onClick"];
var ColorInput_default = defineComponent({
  name: "ColorInput",
  props: {
    clsPrefix: {
      type: String,
      required: true
    },
    mode: {
      type: String,
      required: true
    },
    modes: {
      type: Array,
      required: true
    },
    showAlpha: {
      type: Boolean,
      required: true
    },
    value: {
      type: String,
      default: null
    },
    valueArr: {
      type: Array,
      default: null
    },
    onUpdateValue: {
      type: Function,
      required: true
    },
    onUpdateMode: {
      type: Function,
      required: true
    }
  },
  setup(props) {
    return {
      handleUnitUpdateValue(index, value) {
        const {
          showAlpha
        } = props;
        if (props.mode === "hex") {
          props.onUpdateValue((showAlpha ? toHexaString : toHexString)(value));
          return;
        }
        let nextValueArr;
        if (props.valueArr === null) nextValueArr = [0, 0, 0, 0];else nextValueArr = Array.from(props.valueArr);
        switch (props.mode) {
          case "hsv":
            nextValueArr[index] = value;
            props.onUpdateValue((showAlpha ? toHsvaString : toHsvString)(nextValueArr));
            break;
          case "rgb":
            nextValueArr[index] = value;
            props.onUpdateValue((showAlpha ? toRgbaString : toRgbString)(nextValueArr));
            break;
          case "hsl":
            nextValueArr[index] = value;
            props.onUpdateValue((showAlpha ? toHslaString : toHslString)(nextValueArr));
        }
      }
    };
  },
  render() {
    const {
      clsPrefix,
      modes
    } = this;
    return openBlock(), createElementBlock("div", {
      class: normalizeClass$1(`${clsPrefix}-color-picker-input`)
    }, [createElementVNode("div", {
      class: normalizeClass$1(`${clsPrefix}-color-picker-input__mode`),
      onClick: this.onUpdateMode,
      style: normalizeStyle({
        cursor: modes.length === 1 ? "" : "pointer"
      })
    }, [normalizeVNode(() => this.mode.toUpperCase() + (this.showAlpha ? "A" : ""))], 14, _hoisted_1), createVNode(InputGroup_default, null, {
      default: () => {
        const {
          mode,
          valueArr,
          showAlpha
        } = this;
        if (mode === "hex") {
          let hexValue = null;
          try {
            hexValue = valueArr === null ? null : (showAlpha ? toHexaString : toHexString)(valueArr);
          } catch {}
          return openBlock(), createBlock(ColorInputUnit_default, {
            key: 1,
            label: "HEX",
            showAlpha,
            value: hexValue,
            onUpdateValue: unitValue => {
              this.handleUnitUpdateValue(0, unitValue);
            }
          }, null, 8, ["showAlpha", "value", "onUpdateValue"]);
        }
        return (mode + (showAlpha ? "a" : "")).split("").map((v, i) => (openBlock(), createBlock(ColorInputUnit_default, {
          label: v.toUpperCase(),
          value: valueArr === null ? null : valueArr[i],
          onUpdateValue: unitValue => {
            this.handleUnitUpdateValue(i, unitValue);
          }
        }, null, 8, ["label", "value", "onUpdateValue"])));
      }
    }, 1024)], 2);
  }
});
//#endregion
export { ColorInput_default as default };