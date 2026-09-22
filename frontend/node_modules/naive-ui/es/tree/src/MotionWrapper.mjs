import { normalizeClass as normalizeClass$1, normalizeVNode } from "../../vue-jsx-vapor/vdom.mjs";
import FadeInExpandTransition_default from "../../_internal/fade-in-expand-transition/src/FadeInExpandTransition.mjs";
import TreeNode from "./TreeNode.mjs";
import { pxfy } from "seemly";
import { createBlock, createElementBlock, defineComponent, normalizeStyle, openBlock } from "vue";
//#region src/tree/src/MotionWrapper.tsx
var MotionWrapper_default = defineComponent({
  name: "TreeMotionWrapper",
  props: {
    clsPrefix: {
      type: String,
      required: true
    },
    height: Number,
    nodes: {
      type: Array,
      required: true
    },
    mode: {
      type: String,
      required: true
    },
    onAfterEnter: {
      type: Function,
      required: true
    }
  },
  render() {
    const {
      clsPrefix
    } = this;
    return openBlock(), createBlock(FadeInExpandTransition_default, {
      onAfterEnter: this.onAfterEnter,
      appear: true,
      reverse: this.mode === "collapse"
    }, {
      default: () => (openBlock(), createElementBlock("div", {
        class: normalizeClass$1([`${clsPrefix}-tree-motion-wrapper`, `${clsPrefix}-tree-motion-wrapper--${this.mode}`]),
        style: normalizeStyle({
          height: pxfy(this.height)
        })
      }, [normalizeVNode(() => this.nodes.map(node => (openBlock(), createBlock(TreeNode, {
        clsPrefix,
        tmNode: node
      }, null, 8, ["clsPrefix", "tmNode"]))))], 6))
    }, 1032, ["onAfterEnter", "reverse"]);
  }
});
//#endregion
export { MotionWrapper_default as default };