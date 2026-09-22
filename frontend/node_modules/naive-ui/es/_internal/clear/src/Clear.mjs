import { resolveSlot } from "../../../_utils/vue/resolve-slot.mjs";
import useStyle from "../../../_mixins/use-style.mjs";
import { normalizeClass as normalizeClass$1, normalizeVNode } from "../../../vue-jsx-vapor/vdom.mjs";
import Icon_default from "../../icon/src/Icon.mjs";
import IconSwitchTransition_default from "../../icon-switch-transition/src/IconSwitchTransition.mjs";
import Clear_default$1 from "../../icons/Clear.mjs";
import index_cssr_default from "./styles/index.cssr.mjs";
import { createBlock, createElementBlock, createVNode, defineComponent, openBlock, toRef } from "vue";
//#region src/_internal/clear/src/Clear.tsx
const _hoisted_1 = ["onClick", "onMousedown"];
var Clear_default = defineComponent({
  name: "BaseClear",
  props: {
    clsPrefix: {
      type: String,
      required: true
    },
    show: Boolean,
    onClear: Function
  },
  setup(props) {
    useStyle("-base-clear", index_cssr_default, toRef(props, "clsPrefix"));
    return {
      handleMouseDown(e) {
        e.preventDefault();
      }
    };
  },
  render() {
    const {
      clsPrefix
    } = this;
    return openBlock(), createElementBlock("div", {
      class: normalizeClass$1(`${clsPrefix}-base-clear`)
    }, [createVNode(IconSwitchTransition_default, null, {
      default: () => {
        return this.show ? (openBlock(), createElementBlock("div", {
          key: "dismiss",
          class: normalizeClass$1(`${clsPrefix}-base-clear__clear`),
          onClick: this.onClear,
          onMousedown: this.handleMouseDown,
          "data-clear": true
        }, [normalizeVNode(() => resolveSlot(this.$slots.icon, () => [(openBlock(), createBlock(Icon_default, {
          clsPrefix
        }, {
          default: () => (openBlock(), createBlock(Clear_default$1))
        }, 1032, ["clsPrefix"]))]))], 42, _hoisted_1)) : (openBlock(), createElementBlock("div", {
          key: "icon",
          class: normalizeClass$1(`${clsPrefix}-base-clear__placeholder`)
        }, [normalizeVNode(() => this.$slots.placeholder?.())], 2));
      }
    }, 1024)], 2);
  }
});
//#endregion
export { Clear_default as default };