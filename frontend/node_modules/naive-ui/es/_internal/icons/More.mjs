import { createVNodeCache } from "../../vue-jsx-vapor/vdom.mjs";
import { createElementVNode, defineComponent } from "vue";
//#region src/_internal/icons/More.tsx
var More_default = defineComponent({
  name: "More",
  render() {
    return (() => {
      const _cache = createVNodeCache("e4a3e3d3803c676d");
      return _cache[0] || (_cache[0] = createElementVNode("svg", {
        viewBox: "0 0 16 16",
        version: "1.1",
        xmlns: "http://www.w3.org/2000/svg"
      }, [createElementVNode("g", {
        stroke: "none",
        "stroke-width": "1",
        fill: "none",
        "fill-rule": "evenodd"
      }, [createElementVNode("g", {
        fill: "currentColor",
        "fill-rule": "nonzero"
      }, [createElementVNode("path", {
        d: "M4,7 C4.55228,7 5,7.44772 5,8 C5,8.55229 4.55228,9 4,9 C3.44772,9 3,8.55229 3,8 C3,7.44772 3.44772,7 4,7 Z M8,7 C8.55229,7 9,7.44772 9,8 C9,8.55229 8.55229,9 8,9 C7.44772,9 7,8.55229 7,8 C7,7.44772 7.44772,7 8,7 Z M12,7 C12.5523,7 13,7.44772 13,8 C13,8.55229 12.5523,9 12,9 C11.4477,9 11,8.55229 11,8 C11,7.44772 11.4477,7 12,7 Z"
      })])])], -1));
    })();
  }
});
//#endregion
export { More_default as default };