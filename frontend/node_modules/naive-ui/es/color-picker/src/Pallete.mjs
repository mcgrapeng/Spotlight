import { normalizeClass as normalizeClass$1, normalizeVNode } from "../../vue-jsx-vapor/vdom.mjs";
import { computed, createElementBlock, createElementVNode, defineComponent, normalizeStyle, openBlock, ref } from "vue";
import { off, on } from "evtd";
//#region src/color-picker/src/Pallete.tsx
const _hoisted_1 = ["onMousedown"];
const HANDLE_SIZE = "12px";
const RADIUS = "6px";
var Pallete_default = defineComponent({
  name: "Pallete",
  props: {
    clsPrefix: {
      type: String,
      required: true
    },
    rgba: {
      type: Array,
      default: null
    },
    displayedHue: {
      type: Number,
      required: true
    },
    displayedSv: {
      type: Array,
      required: true
    },
    onUpdateSV: {
      type: Function,
      required: true
    },
    onComplete: Function
  },
  setup(props) {
    const palleteRef = ref(null);
    function handleMouseDown(e) {
      if (!palleteRef.value) return;
      on("mousemove", document, handleMouseMove);
      on("mouseup", document, handleMouseUp);
      handleMouseMove(e);
    }
    function handleMouseMove(e) {
      const {
        value: palleteEl
      } = palleteRef;
      if (!palleteEl) return;
      const {
        width,
        height,
        left,
        bottom
      } = palleteEl.getBoundingClientRect();
      const newV = (bottom - e.clientY) / height;
      const newS = (e.clientX - left) / width;
      const normalizedNewS = 100 * (newS > 1 ? 1 : newS < 0 ? 0 : newS);
      const normalizedNewV = 100 * (newV > 1 ? 1 : newV < 0 ? 0 : newV);
      props.onUpdateSV(normalizedNewS, normalizedNewV);
    }
    function handleMouseUp() {
      off("mousemove", document, handleMouseMove);
      off("mouseup", document, handleMouseUp);
      props.onComplete?.();
    }
    return {
      palleteRef,
      handleColor: computed(() => {
        const {
          rgba
        } = props;
        if (!rgba) return "";
        return `rgb(${rgba[0]}, ${rgba[1]}, ${rgba[2]})`;
      }),
      handleMouseDown
    };
  },
  render() {
    const {
      clsPrefix
    } = this;
    return openBlock(), createElementBlock("div", {
      class: normalizeClass$1(`${clsPrefix}-color-picker-pallete`),
      onMousedown: this.handleMouseDown,
      ref: "palleteRef"
    }, [createElementVNode("div", {
      class: normalizeClass$1(`${clsPrefix}-color-picker-pallete__layer`),
      style: normalizeStyle({
        backgroundImage: `linear-gradient(90deg, white, hsl(${this.displayedHue}, 100%, 50%))`
      })
    }, null, 6), createElementVNode("div", {
      class: normalizeClass$1(`${clsPrefix}-color-picker-pallete__layer ${clsPrefix}-color-picker-pallete__layer--shadowed`),
      style: {
        backgroundImage: "linear-gradient(180deg, rgba(0, 0, 0, 0%), rgba(0, 0, 0, 100%))"
      }
    }, null, 2), normalizeVNode(() => this.rgba && (openBlock(), createElementBlock("div", {
      class: normalizeClass$1(`${clsPrefix}-color-picker-handle`),
      style: normalizeStyle({
        width: HANDLE_SIZE,
        height: HANDLE_SIZE,
        borderRadius: RADIUS,
        left: `calc(${this.displayedSv[0]}% - ${RADIUS})`,
        bottom: `calc(${this.displayedSv[1]}% - ${RADIUS})`
      })
    }, [createElementVNode("div", {
      class: normalizeClass$1(`${clsPrefix}-color-picker-handle__fill`),
      style: normalizeStyle({
        backgroundColor: this.handleColor,
        borderRadius: RADIUS,
        width: HANDLE_SIZE,
        height: HANDLE_SIZE
      })
    }, null, 6)], 6)))], 42, _hoisted_1);
  }
});
//#endregion
export { Pallete_default as default };