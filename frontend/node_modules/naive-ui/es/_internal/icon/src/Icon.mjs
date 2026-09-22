import useStyle from "../../../_mixins/use-style.mjs";
import { normalizeClass as normalizeClass$1, normalizeVNode } from "../../../vue-jsx-vapor/vdom.mjs";
import index_cssr_default from "./styles/index.cssr.mjs";
import { createElementBlock, defineComponent, openBlock, toRef } from "vue";
//#region src/_internal/icon/src/Icon.tsx
const _hoisted_1 = ["onClick", "onMousedown", "onMouseup", "role", "aria-label", "aria-hidden", "aria-disabled"];
var Icon_default = defineComponent({
  name: "BaseIcon",
  props: {
    role: String,
    ariaLabel: String,
    ariaDisabled: {
      type: Boolean,
      default: void 0
    },
    ariaHidden: {
      type: Boolean,
      default: void 0
    },
    clsPrefix: {
      type: String,
      required: true
    },
    onClick: Function,
    onMousedown: Function,
    onMouseup: Function
  },
  setup(props) {
    useStyle("-base-icon", index_cssr_default, toRef(props, "clsPrefix"));
  },
  render() {
    return openBlock(), createElementBlock("i", {
      class: normalizeClass$1(`${this.clsPrefix}-base-icon`),
      onClick: this.onClick,
      onMousedown: this.onMousedown,
      onMouseup: this.onMouseup,
      role: this.role,
      "aria-label": this.ariaLabel,
      "aria-hidden": this.ariaHidden,
      "aria-disabled": this.ariaDisabled
    }, [normalizeVNode(() => this.$slots.default?.())], 42, _hoisted_1);
  }
});
//#endregion
export { Icon_default as default };