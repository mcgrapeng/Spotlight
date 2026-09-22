import useStyle from "../../../_mixins/use-style.mjs";
import { normalizeClass as normalizeClass$1, normalizeSlot, normalizeVNode } from "../../../vue-jsx-vapor/vdom.mjs";
import index_cssr_default from "./styles/index.cssr.mjs";
import { Transition, createBlock, createElementBlock, defineComponent, onBeforeUnmount, openBlock, ref, toRef } from "vue";
//#region src/_internal/menu-mask/src/MenuMask.tsx
var MenuMask_default = defineComponent({
  name: "BaseMenuMask",
  props: {
    clsPrefix: {
      type: String,
      required: true
    }
  },
  setup(props) {
    useStyle("-base-menu-mask", index_cssr_default, toRef(props, "clsPrefix"));
    const messageRef = ref(null);
    let timerId = null;
    const uncontrolledShowRef = ref(false);
    onBeforeUnmount(() => {
      if (timerId !== null) window.clearTimeout(timerId);
    });
    return {
      message: messageRef,
      show: uncontrolledShowRef,
      showOnce(message, duration = 1500) {
        if (timerId) window.clearTimeout(timerId);
        uncontrolledShowRef.value = true;
        messageRef.value = message;
        timerId = window.setTimeout(() => {
          uncontrolledShowRef.value = false;
          messageRef.value = null;
        }, duration);
      }
    };
  },
  render() {
    return openBlock(), createBlock(Transition, {
      name: "fade-in-transition"
    }, {
      _: 1,
      default: normalizeSlot(() => this.show ? (openBlock(), createElementBlock("div", {
        key: 1,
        class: normalizeClass$1(`${this.clsPrefix}-base-menu-mask`)
      }, [normalizeVNode(() => this.message)], 2)) : null)
    });
  }
});
//#endregion
export { MenuMask_default as default };