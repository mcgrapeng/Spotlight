import { normalizeClass as normalizeClass$1 } from "../../vue-jsx-vapor/vdom.mjs";
import { createElementBlock, createElementVNode, defineComponent, openBlock } from "vue";
//#region src/layout/src/ToggleBar.tsx
const _hoisted_1 = ["onClick"];
var ToggleBar_default = defineComponent({
  props: {
    clsPrefix: {
      type: String,
      required: true
    },
    onClick: Function
  },
  render() {
    const {
      clsPrefix
    } = this;
    return openBlock(), createElementBlock("div", {
      onClick: this.onClick,
      class: normalizeClass$1(`${clsPrefix}-layout-toggle-bar`)
    }, [createElementVNode("div", {
      class: normalizeClass$1(`${clsPrefix}-layout-toggle-bar__top`)
    }, null, 2), createElementVNode("div", {
      class: normalizeClass$1(`${clsPrefix}-layout-toggle-bar__bottom`)
    }, null, 2)], 10, _hoisted_1);
  }
});
//#endregion
export { ToggleBar_default as default };