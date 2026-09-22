import { createVNodeCache } from "../../vue-jsx-vapor/vdom.mjs";
import { replaceable } from "./replaceable.mjs";
import { createElementVNode } from "vue";
//#region src/_internal/icons/Info.tsx
var Info_default = replaceable("info", () => (() => {
  const _cache = createVNodeCache("1d7d3032c5ab60");
  return _cache[0] || (_cache[0] = createElementVNode("svg", {
    viewBox: "0 0 28 28",
    version: "1.1",
    xmlns: "http://www.w3.org/2000/svg"
  }, [createElementVNode("g", {
    stroke: "none",
    "stroke-width": "1",
    "fill-rule": "evenodd"
  }, [createElementVNode("g", {
    "fill-rule": "nonzero"
  }, [createElementVNode("path", {
    d: "M14,2 C20.6274,2 26,7.37258 26,14 C26,20.6274 20.6274,26 14,26 C7.37258,26 2,20.6274 2,14 C2,7.37258 7.37258,2 14,2 Z M14,11 C13.4477,11 13,11.4477 13,12 L13,12 L13,20 C13,20.5523 13.4477,21 14,21 C14.5523,21 15,20.5523 15,20 L15,20 L15,12 C15,11.4477 14.5523,11 14,11 Z M14,6.75 C13.3096,6.75 12.75,7.30964 12.75,8 C12.75,8.69036 13.3096,9.25 14,9.25 C14.6904,9.25 15.25,8.69036 15.25,8 C15.25,7.30964 14.6904,6.75 14,6.75 Z"
  })])])], -1));
})());
//#endregion
export { Info_default as default };