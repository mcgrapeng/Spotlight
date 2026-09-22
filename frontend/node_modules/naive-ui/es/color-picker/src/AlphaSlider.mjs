import { normalizeClass as normalizeClass$1, normalizeVNode } from "../../vue-jsx-vapor/vdom.mjs";
import { normalizeAlpha } from "./utils.mjs";
import { toRgbaString } from "seemly";
import { computed, createElementBlock, createElementVNode, defineComponent, normalizeStyle, openBlock, ref } from "vue";
import { off, on } from "evtd";
//#region src/color-picker/src/AlphaSlider.tsx
const _hoisted_1 = ["onMousedown"];
const HANDLE_SIZE = "12px";
const HANDLE_SIZE_NUM = 12;
const RADIUS = "6px";
var AlphaSlider_default = defineComponent({
  name: "AlphaSlider",
  props: {
    clsPrefix: {
      type: String,
      required: true
    },
    rgba: {
      type: Array,
      default: null
    },
    alpha: {
      type: Number,
      default: 0
    },
    onUpdateAlpha: {
      type: Function,
      required: true
    },
    onComplete: Function
  },
  setup(props) {
    const railRef = ref(null);
    function handleMouseDown(e) {
      if (!railRef.value || !props.rgba) return;
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
      const newAlpha = (e.clientX - left) / (width - HANDLE_SIZE_NUM);
      props.onUpdateAlpha(normalizeAlpha(newAlpha));
    }
    function handleMouseUp() {
      off("mousemove", document, handleMouseMove);
      off("mouseup", document, handleMouseUp);
      props.onComplete?.();
    }
    return {
      railRef,
      railBackgroundImage: computed(() => {
        const {
          rgba
        } = props;
        if (!rgba) return "";
        return `linear-gradient(to right, rgba(${rgba[0]}, ${rgba[1]}, ${rgba[2]}, 0) 0%, rgba(${rgba[0]}, ${rgba[1]}, ${rgba[2]}, 1) 100%)`;
      }),
      handleMouseDown
    };
  },
  render() {
    const {
      clsPrefix
    } = this;
    return openBlock(), createElementBlock("div", {
      class: normalizeClass$1(`${clsPrefix}-color-picker-slider`),
      ref: "railRef",
      style: normalizeStyle({
        height: HANDLE_SIZE,
        borderRadius: RADIUS
      }),
      onMousedown: this.handleMouseDown
    }, [createElementVNode("div", {
      style: normalizeStyle({
        borderRadius: RADIUS,
        position: "absolute",
        left: 0,
        right: 0,
        top: 0,
        bottom: 0,
        overflow: "hidden"
      })
    }, [createElementVNode("div", {
      class: normalizeClass$1(`${clsPrefix}-color-picker-checkboard`)
    }, null, 2), createElementVNode("div", {
      class: normalizeClass$1(`${clsPrefix}-color-picker-slider__image`),
      style: normalizeStyle({
        backgroundImage: this.railBackgroundImage
      })
    }, null, 6)], 4), normalizeVNode(() => this.rgba && (openBlock(), createElementBlock("div", {
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
        left: `calc(${this.alpha * 100}% - ${RADIUS})`,
        borderRadius: RADIUS,
        width: HANDLE_SIZE,
        height: HANDLE_SIZE
      })
    }, [createElementVNode("div", {
      class: normalizeClass$1(`${clsPrefix}-color-picker-handle__fill`),
      style: normalizeStyle({
        backgroundColor: toRgbaString(this.rgba),
        borderRadius: RADIUS,
        width: HANDLE_SIZE,
        height: HANDLE_SIZE
      })
    }, null, 6)], 6)], 4)))], 46, _hoisted_1);
  }
});
//#endregion
export { AlphaSlider_default as default };