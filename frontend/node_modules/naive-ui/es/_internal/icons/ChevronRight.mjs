import { createVNodeCache } from "../../vue-jsx-vapor/vdom.mjs";
import { createElementVNode, defineComponent } from "vue";
//#region src/_internal/icons/ChevronRight.tsx
var ChevronRight_default = defineComponent({
  name: "ChevronRight",
  render() {
    return (() => {
      const _cache = createVNodeCache("6ab04425f4fcb756");
      return _cache[0] || (_cache[0] = createElementVNode("svg", {
        viewBox: "0 0 16 16",
        fill: "none",
        xmlns: "http://www.w3.org/2000/svg"
      }, [createElementVNode("path", {
        d: "M5.64645 3.14645C5.45118 3.34171 5.45118 3.65829 5.64645 3.85355L9.79289 8L5.64645 12.1464C5.45118 12.3417 5.45118 12.6583 5.64645 12.8536C5.84171 13.0488 6.15829 13.0488 6.35355 12.8536L10.8536 8.35355C11.0488 8.15829 11.0488 7.84171 10.8536 7.64645L6.35355 3.14645C6.15829 2.95118 5.84171 2.95118 5.64645 3.14645Z",
        fill: "currentColor"
      })], -1));
    })();
  }
});
//#endregion
export { ChevronRight_default as default };