import { createVNodeCache } from "../../../vue-jsx-vapor/vdom.mjs";
import { createElementBlock, defineComponent, openBlock } from "vue";
//#region src/_internal/focus-detector/src/FocusDetector.tsx
var FocusDetector_default = defineComponent({
  props: {
    onFocus: Function,
    onBlur: Function
  },
  setup(props) {
    return () => (() => {
      const _cache = createVNodeCache("d16ead82505dc285");
      return openBlock(), createElementBlock("div", {
        style: "width: 0; height: 0",
        tabindex: 0,
        onFocus: _cache[0] || (_cache[0] = e => props.onFocus?.(e)),
        onBlur: _cache[1] || (_cache[1] = e => props.onBlur?.(e))
      }, null, 32);
    })();
  }
});
//#endregion
export { FocusDetector_default as default };