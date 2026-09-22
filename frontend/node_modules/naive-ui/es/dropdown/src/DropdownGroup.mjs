import { warn } from "../../_utils/naive/warn.mjs";
import { normalizeVNode } from "../../vue-jsx-vapor/vdom.mjs";
import DropdownDivider_default from "./DropdownDivider.mjs";
import DropdownGroupHeader_default from "./DropdownGroupHeader.mjs";
import { isDividerNode } from "./utils.mjs";
import DropdownOption_default from "./DropdownOption.mjs";
import { Fragment, createBlock, createElementBlock, defineComponent, h, openBlock } from "vue";
//#region src/dropdown/src/DropdownGroup.tsx
var DropdownGroup_default = defineComponent({
  name: "NDropdownGroup",
  props: {
    clsPrefix: {
      type: String,
      required: true
    },
    tmNode: {
      type: Object,
      required: true
    },
    parentKey: {
      type: [String, Number],
      default: null
    }
  },
  render() {
    const {
      tmNode,
      parentKey,
      clsPrefix
    } = this;
    const {
      children
    } = tmNode;
    return openBlock(), createElementBlock(Fragment, null, [(openBlock(), createBlock(DropdownGroupHeader_default, {
      clsPrefix,
      tmNode,
      key: tmNode.key
    }, null, 8, ["clsPrefix", "tmNode"])), normalizeVNode(() => children?.map(child => {
      const {
        rawNode
      } = child;
      if (rawNode.show === false) return null;
      if (isDividerNode(rawNode)) return h(DropdownDivider_default, {
        clsPrefix,
        key: child.key
      });
      if (child.isGroup) {
        warn("dropdown", "`group` node is not allowed to be put in `group` node.");
        return null;
      }
      return openBlock(), createBlock(DropdownOption_default, {
        clsPrefix,
        tmNode: child,
        parentKey,
        key: child.key
      }, null, 8, ["clsPrefix", "tmNode", "parentKey"]);
    }))], 64);
  }
});
//#endregion
export { DropdownGroup_default as default };