import { normalizeClass as normalizeClass$1 } from "../../vue-jsx-vapor/vdom.mjs";
import { normalizeHue } from "./utils.mjs";
import { createElementBlock, createElementVNode, defineComponent, normalizeStyle, openBlock, ref } from "vue";
import { off, on } from "evtd";
//#region src/color-picker/src/HueSlider.tsx
const _hoisted_1 = ["onMousedown"];
const HANDLE_SIZE = "12px";
const HANDLE_SIZE_NUM = 12;
const RADIUS = "6px";
const RADIUS_NUM = 6;
const GRADIENT = "linear-gradient(90deg,red,#ff0 16.66%,#0f0 33.33%,#0ff 50%,#00f 66.66%,#f0f 83.33%,red)";
var HueSlider_default = defineComponent({
  name: "HueSlider",
  props: {
    clsPrefix: {
      type: String,
      required: true
    },
    hue: {
      type: Number,
      required: true
    },
    onUpdateHue: {
      type: Function,
      required: true
    },
    onComplete: Function
  },
  setup(props) {
    const railRef = ref(null);
    function handleMouseDown(e) {
      if (!railRef.value) return;
      on("mousemove", document, handleMouseMove);
      on("mouseup", document, handleMouseUp);
      handleMouseMove(e);
    }
    function handleMouseMove(e) {
      const {
        value: railEl
      } = railRef;
      if (!railEl) return;
      const {
        width,
        left
      } = railEl.getBoundingClientRect();
      const newHue = normalizeHue((e.clientX - left - RADIUS_NUM) / (width - HANDLE_SIZE_NUM) * 360);
      props.onUpdateHue(newHue);
    }
    function handleMouseUp() {
      off("mousemove", document, handleMouseMove);
      off("mouseup", document, handleMouseUp);
      props.onComplete?.();
    }
    return {
      railRef,
      handleMouseDown
    };
  },
  render() {
    const {
      clsPrefix
    } = this;
    return openBlock(), createElementBlock("div", {
      class: normalizeClass$1(`${clsPrefix}-color-picker-slider`),
      style: normalizeStyle({
        height: HANDLE_SIZE,
        borderRadius: RADIUS
      })
    }, [createElementVNode("div", {
      ref: "railRef",
      style: normalizeStyle({
        boxShadow: "inset 0 0 2px 0 rgba(0, 0, 0, .24)",
        boxSizing: "border-box",
        backgroundImage: GRADIENT,
        height: HANDLE_SIZE,
        borderRadius: RADIUS,
        position: "relative"
      }),
      onMousedown: this.handleMouseDown
    }, [createElementVNode("div", {
      style: normalizeStyle({
        position: "absolute",
        left: RADIUS,
        right: RADIUS,
        top: 0,
        bottom: 0
      })
    }, [createElementVNode("div", {
      class: normalizeClass$1(`${clsPrefix}-color-picker-handle`),
      style: normalizeStyle({
        left: `calc((${this.hue}%) / 359 * 100 - ${RADIUS})`,
        borderRadius: RADIUS,
        width: HANDLE_SIZE,
        height: HANDLE_SIZE
      })
    }, [createElementVNode("div", {
      class: normalizeClass$1(`${clsPrefix}-color-picker-handle__fill`),
      style: normalizeStyle({
        backgroundColor: `hsl(${this.hue}, 100%, 50%)`,
        borderRadius: RADIUS,
        width: HANDLE_SIZE,
        height: HANDLE_SIZE
      })
    }, null, 6)], 6)], 4)], 44, _hoisted_1)], 6);
  }
});
//#endregion
export { HueSlider_default as default };