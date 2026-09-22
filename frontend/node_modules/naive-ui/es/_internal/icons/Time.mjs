import { createVNodeCache } from "../../vue-jsx-vapor/vdom.mjs";
import { replaceable } from "./replaceable.mjs";
import { createElementVNode } from "vue";
//#region src/_internal/icons/Time.tsx
var Time_default = replaceable("time", () => (() => {
  const _cache = createVNodeCache("98bfb85003a52fbd");
  return _cache[0] || (_cache[0] = createElementVNode("svg", {
    xmlns: "http://www.w3.org/2000/svg",
    viewBox: "0 0 512 512"
  }, [createElementVNode("path", {
    d: "M256,64C150,64,64,150,64,256s86,192,192,192,192-86,192-192S362,64,256,64Z",
    style: "\n        fill: none;\n        stroke: currentColor;\n        stroke-miterlimit: 10;\n        stroke-width: 32px;\n      "
  }), createElementVNode("polyline", {
    points: "256 128 256 272 352 272",
    style: "\n        fill: none;\n        stroke: currentColor;\n        stroke-linecap: round;\n        stroke-linejoin: round;\n        stroke-width: 32px;\n      "
  })], -1));
})());
//#endregion
export { Time_default as default };