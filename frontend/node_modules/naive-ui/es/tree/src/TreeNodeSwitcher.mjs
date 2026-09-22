import { normalizeClass as normalizeClass$1 } from "../../vue-jsx-vapor/vdom.mjs";
import Icon_default from "../../_internal/icon/src/Icon.mjs";
import IconSwitchTransition_default from "../../_internal/icon-switch-transition/src/IconSwitchTransition.mjs";
import Switcher_default from "../../_internal/icons/Switcher.mjs";
import Loading_default from "../../_internal/loading/src/Loading.mjs";
import { treeInjectionKey } from "./interface.mjs";
import { createBlock, createElementBlock, createElementVNode, createVNode, defineComponent, inject, mergeProps, normalizeStyle, openBlock } from "vue";
//#region src/tree/src/TreeNodeSwitcher.tsx
const _hoisted_1 = ["onClick"];
var TreeNodeSwitcher_default = defineComponent({
  name: "NTreeSwitcher",
  props: {
    clsPrefix: {
      type: String,
      required: true
    },
    indent: {
      type: Number,
      required: true
    },
    expanded: Boolean,
    selected: Boolean,
    hide: Boolean,
    loading: Boolean,
    onClick: Function,
    tmNode: {
      type: Object,
      required: true
    }
  },
  setup(props) {
    const {
      renderSwitcherIconRef,
      spinPropsRef
    } = inject(treeInjectionKey, null);
    return () => {
      const {
        clsPrefix,
        expanded,
        hide,
        indent,
        onClick
      } = props;
      return openBlock(), createElementBlock("span", {
        "data-switcher": true,
        class: normalizeClass$1([`${clsPrefix}-tree-node-switcher`, expanded && `${clsPrefix}-tree-node-switcher--expanded`, hide && `${clsPrefix}-tree-node-switcher--hide`]),
        style: normalizeStyle({
          width: `${indent}px`
        }),
        onClick
      }, [createElementVNode("div", {
        class: normalizeClass$1(`${clsPrefix}-tree-node-switcher__icon`)
      }, [createVNode(IconSwitchTransition_default, null, {
        default: () => {
          if (props.loading) return openBlock(), createBlock(Loading_default, mergeProps({
            clsPrefix,
            key: "loading",
            radius: 85,
            strokeWidth: 20
          }, spinPropsRef?.value), null, 16, ["clsPrefix"]);
          const {
            value: renderSwitcherIcon
          } = renderSwitcherIconRef;
          return renderSwitcherIcon ? renderSwitcherIcon({
            expanded: props.expanded,
            selected: props.selected,
            option: props.tmNode.rawNode
          }) : (openBlock(), createBlock(Icon_default, {
            clsPrefix,
            key: "switcher"
          }, {
            default: () => (openBlock(), createBlock(Switcher_default))
          }, 1032, ["clsPrefix"]));
        }
      }, 1024)], 2)], 14, _hoisted_1);
    };
  }
});
//#endregion
export { TreeNodeSwitcher_default as default };