import { normalizeVNode } from "../../vue-jsx-vapor/vdom.mjs";
import { createElementBlock, defineComponent, openBlock } from "vue";
//#region src/table/src/Tbody.tsx
var Tbody_default = defineComponent({
  name: "Tbody",
  render() {
    return openBlock(), createElementBlock("tbody", null, [normalizeVNode(() => this.$slots.default?.())]);
  }
});
//#endregion
export { Tbody_default as default };