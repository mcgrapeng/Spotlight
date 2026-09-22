import { normalizeClass as normalizeClass$1, normalizeSlot, normalizeVNode } from "../../vue-jsx-vapor/vdom.mjs";
import FadeInExpandTransition_default from "../../_internal/fade-in-expand-transition/src/FadeInExpandTransition.mjs";
import { createBlock, createElementBlock, createElementVNode, defineComponent, openBlock, toRef, vShow, withDirectives } from "vue";
import { useFalseUntilTruthy } from "vooks";
//#region src/collapse/src/CollapseItemContent.tsx
var CollapseItemContent_default = defineComponent({
  name: "CollapseItemContent",
  props: {
    displayDirective: {
      type: String,
      required: true
    },
    show: Boolean,
    clsPrefix: {
      type: String,
      required: true
    }
  },
  setup(props) {
    return {
      onceTrue: useFalseUntilTruthy(toRef(props, "show"))
    };
  },
  render() {
    return openBlock(), createBlock(FadeInExpandTransition_default, null, {
      _: 1,
      default: normalizeSlot(() => {
        const {
          show,
          displayDirective,
          onceTrue,
          clsPrefix
        } = this;
        const useVShow = displayDirective === "show" && onceTrue;
        const contentNode = (openBlock(), createElementBlock("div", {
          class: normalizeClass$1(`${clsPrefix}-collapse-item__content-wrapper`)
        }, [createElementVNode("div", {
          class: normalizeClass$1(`${clsPrefix}-collapse-item__content-inner`)
        }, [normalizeVNode(() => this.$slots.default?.())], 2)], 2));
        return useVShow ? withDirectives(contentNode, [[vShow, show]]) : show ? contentNode : null;
      })
    });
  }
});
//#endregion
export { CollapseItemContent_default as default };