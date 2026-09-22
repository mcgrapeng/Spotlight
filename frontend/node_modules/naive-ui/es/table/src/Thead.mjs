import { normalizeVNode } from "../../vue-jsx-vapor/vdom.mjs";
import { createElementBlock, defineComponent, openBlock } from "vue";
//#region src/table/src/Thead.tsx
var Thead_default = defineComponent({
  name: "Thead",
  render() {
    return openBlock(), createElementBlock("thead", null, [normalizeVNode(() => this.$slots.default?.())]);
  }
});
//#endregion
export { Thead_default as default };