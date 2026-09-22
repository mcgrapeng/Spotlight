import { createVNodeCache } from "../../vue-jsx-vapor/vdom.mjs";
import { replaceable } from "./replaceable.mjs";
import { createElementVNode } from "vue";
//#region src/_internal/icons/Retry.tsx
var Retry_default = replaceable("retry", () => (() => {
  const _cache = createVNodeCache("32d3a81cd807b3fd");
  return _cache[0] || (_cache[0] = createElementVNode("svg", {
    xmlns: "http://www.w3.org/2000/svg",
    viewBox: "0 0 512 512"
  }, [createElementVNode("path", {
    d: "M320,146s24.36-12-64-12A160,160,0,1,0,416,294",
    style: "fill: none; stroke: currentcolor; stroke-linecap: round; stroke-miterlimit: 10; stroke-width: 32px;"
  }), createElementVNode("polyline", {
    points: "256 58 336 138 256 218",
    style: "fill: none; stroke: currentcolor; stroke-linecap: round; stroke-linejoin: round; stroke-width: 32px;"
  })], -1));
})());
//#endregion
export { Retry_default as default };