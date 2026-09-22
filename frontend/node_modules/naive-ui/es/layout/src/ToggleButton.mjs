import { normalizeClass as normalizeClass$1 } from "../../vue-jsx-vapor/vdom.mjs";
import Icon_default from "../../_internal/icon/src/Icon.mjs";
import ChevronRight_default from "../../_internal/icons/ChevronRight.mjs";
import { createBlock, createElementBlock, defineComponent, openBlock } from "vue";
//#region src/layout/src/ToggleButton.tsx
const _hoisted_1 = ["onClick"];
var ToggleButton_default = defineComponent({
  name: "LayoutToggleButton",
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
      class: normalizeClass$1(`${clsPrefix}-layout-toggle-button`),
      onClick: this.onClick
    }, [(openBlock(), createBlock(Icon_default, {
      clsPrefix
    }, {
      default: () => (openBlock(), createBlock(ChevronRight_default))
    }, 1032, ["clsPrefix"]))], 10, _hoisted_1);
  }
});
//#endregion
export { ToggleButton_default as default };