import { normalizeVNode } from "../../vue-jsx-vapor/vdom.mjs";
import { createElementBlock, defineComponent, openBlock } from "vue";
//#region src/typography/src/li.tsx
var li_default = defineComponent({
  name: "Li",
  render() {
    return openBlock(), createElementBlock("li", null, [normalizeVNode(() => this.$slots.default?.())]);
  }
});
//#endregion
export { li_default as default };