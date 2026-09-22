import { normalizeVNode } from "../../vue-jsx-vapor/vdom.mjs";
import { createElementBlock, defineComponent, openBlock } from "vue";
//#region src/table/src/Tr.tsx
var Tr_default = defineComponent({
  name: "Tr",
  render() {
    return openBlock(), createElementBlock("tr", null, [normalizeVNode(() => this.$slots.default?.())]);
  }
});
//#endregion
export { Tr_default as default };