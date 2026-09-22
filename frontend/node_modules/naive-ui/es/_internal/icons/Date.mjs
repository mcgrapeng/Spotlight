import { createVNodeCache } from "../../vue-jsx-vapor/vdom.mjs";
import { replaceable } from "./replaceable.mjs";
import { createElementVNode } from "vue";
//#region src/_internal/icons/Date.tsx
var Date_default = replaceable("date", () => (() => {
  const _cache = createVNodeCache("f7691c9cefac87a2");
  return _cache[0] || (_cache[0] = createElementVNode("svg", {
    width: "28px",
    height: "28px",
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
    d: "M21.75,3 C23.5449254,3 25,4.45507456 25,6.25 L25,21.75 C25,23.5449254 23.5449254,25 21.75,25 L6.25,25 C4.45507456,25 3,23.5449254 3,21.75 L3,6.25 C3,4.45507456 4.45507456,3 6.25,3 L21.75,3 Z M23.5,9.503 L4.5,9.503 L4.5,21.75 C4.5,22.7164983 5.28350169,23.5 6.25,23.5 L21.75,23.5 C22.7164983,23.5 23.5,22.7164983 23.5,21.75 L23.5,9.503 Z M21.75,4.5 L6.25,4.5 C5.28350169,4.5 4.5,5.28350169 4.5,6.25 L4.5,8.003 L23.5,8.003 L23.5,6.25 C23.5,5.28350169 22.7164983,4.5 21.75,4.5 Z"
  })])])], -1));
})());
//#endregion
export { Date_default as default };