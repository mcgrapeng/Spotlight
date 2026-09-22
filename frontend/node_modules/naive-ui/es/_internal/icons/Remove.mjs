import { createVNodeCache } from "../../vue-jsx-vapor/vdom.mjs";
import { createElementVNode, defineComponent } from "vue";
//#region src/_internal/icons/Remove.tsx
var Remove_default = defineComponent({
  name: "Remove",
  render() {
    return (() => {
      const _cache = createVNodeCache("a77472467b8adb0a");
      return _cache[0] || (_cache[0] = createElementVNode("svg", {
        xmlns: "http://www.w3.org/2000/svg",
        viewBox: "0 0 512 512"
      }, [createElementVNode("line", {
        x1: "400",
        y1: "256",
        x2: "112",
        y2: "256",
        style: "\n        fill: none;\n        stroke: currentColor;\n        stroke-linecap: round;\n        stroke-linejoin: round;\n        stroke-width: 32px;\n      "
      })], -1));
    })();
  }
});
//#endregion
export { Remove_default as default };