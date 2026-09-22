import { normalizeClass as normalizeClass$1 } from "../../vue-jsx-vapor/vdom.mjs";
import { createElementBlock, defineComponent, openBlock } from "vue";
//#region src/dropdown/src/DropdownDivider.tsx
var DropdownDivider_default = defineComponent({
  name: "DropdownDivider",
  props: {
    clsPrefix: {
      type: String,
      required: true
    }
  },
  render() {
    return openBlock(), createElementBlock("div", {
      class: normalizeClass$1(`${this.clsPrefix}-dropdown-divider`)
    }, null, 2);
  }
});
//#endregion
export { DropdownDivider_default as default };