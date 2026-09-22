import { normalizeVNode } from "../../vue-jsx-vapor/vdom.mjs";
import { createElementBlock, defineComponent, openBlock } from "vue";
//#region src/table/src/Td.tsx
var Td_default = defineComponent({
  name: "Td",
  render() {
    return openBlock(), createElementBlock("td", null, [normalizeVNode(() => this.$slots.default?.())]);
  }
});
//#endregion
export { Td_default as default };