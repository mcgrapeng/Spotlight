import { createVNodeCache } from "../../vue-jsx-vapor/vdom.mjs";
import { createElementVNode, defineComponent } from "vue";
//#region src/_internal/icons/Switcher.tsx
var Switcher_default = defineComponent({
  name: "Switcher",
  render() {
    return (() => {
      const _cache = createVNodeCache("d16928020f032440");
      return _cache[0] || (_cache[0] = createElementVNode("svg", {
        xmlns: "http://www.w3.org/2000/svg",
        viewBox: "0 0 32 32"
      }, [createElementVNode("path", {
        d: "M12 8l10 8l-10 8z"
      })], -1));
    })();
  }
});
//#endregion
export { Switcher_default as default };