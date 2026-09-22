import { createVNodeCache } from "../../vue-jsx-vapor/vdom.mjs";
import { createElementVNode, defineComponent } from "vue";
//#region src/_internal/icons/ArrowUp.tsx
var ArrowUp_default = defineComponent({
  name: "ArrowUp",
  render() {
    return (() => {
      const _cache = createVNodeCache("eaa4b54c8a7c2c8");
      return _cache[0] || (_cache[0] = createElementVNode("svg", {
        xmlns: "http://www.w3.org/2000/svg",
        viewBox: "0 0 20 20"
      }, [createElementVNode("g", {
        fill: "none"
      }, [createElementVNode("path", {
        d: "M3.13 9.163a.5.5 0 1 0 .74.674L9.5 3.67V17.5a.5.5 0 0 0 1 0V3.672l5.63 6.165a.5.5 0 0 0 .738-.674l-6.315-6.916a.746.746 0 0 0-.632-.24a.746.746 0 0 0-.476.24L3.131 9.163z",
        fill: "currentColor"
      })])], -1));
    })();
  }
});
//#endregion
export { ArrowUp_default as default };