import { createVNodeCache } from "../../vue-jsx-vapor/vdom.mjs";
import { replaceable } from "./replaceable.mjs";
import { createElementVNode } from "vue";
//#region src/_internal/icons/Trash.tsx
var Trash_default = replaceable("trash", () => (() => {
  const _cache = createVNodeCache("4bd1b3f5f0c823a2");
  return _cache[0] || (_cache[0] = createElementVNode("svg", {
    xmlns: "http://www.w3.org/2000/svg",
    viewBox: "0 0 512 512"
  }, [createElementVNode("path", {
    d: "M432,144,403.33,419.74A32,32,0,0,1,371.55,448H140.46a32,32,0,0,1-31.78-28.26L80,144",
    style: "fill: none; stroke: currentcolor; stroke-linecap: round; stroke-linejoin: round; stroke-width: 32px;"
  }), createElementVNode("rect", {
    x: "32",
    y: "64",
    width: "448",
    height: "80",
    rx: "16",
    ry: "16",
    style: "fill: none; stroke: currentcolor; stroke-linecap: round; stroke-linejoin: round; stroke-width: 32px;"
  }), createElementVNode("line", {
    x1: "312",
    y1: "240",
    x2: "200",
    y2: "352",
    style: "fill: none; stroke: currentcolor; stroke-linecap: round; stroke-linejoin: round; stroke-width: 32px;"
  }), createElementVNode("line", {
    x1: "312",
    y1: "352",
    x2: "200",
    y2: "240",
    style: "fill: none; stroke: currentcolor; stroke-linecap: round; stroke-linejoin: round; stroke-width: 32px;"
  })], -1));
})());
//#endregion
export { Trash_default as default };