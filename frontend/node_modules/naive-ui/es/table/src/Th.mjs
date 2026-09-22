import { normalizeVNode } from "../../vue-jsx-vapor/vdom.mjs";
import { createElementBlock, defineComponent, openBlock } from "vue";
//#region src/table/src/Th.tsx
var Th_default = defineComponent({
  name: "Th",
  render() {
    return openBlock(), createElementBlock("th", null, [normalizeVNode(() => this.$slots.default?.())]);
  }
});
//#endregion
export { Th_default as default };