import { drawerBodyInjectionKey } from "../../drawer/src/interface.mjs";
import { modalBodyInjectionKey } from "../../modal/src/interface.mjs";
import { popoverBodyInjectionKey } from "../../popover/src/interface.mjs";
import { normalizeClass as normalizeClass$1, normalizeVNode } from "../../vue-jsx-vapor/vdom.mjs";
import { XScrollbar } from "../../_internal/scrollbar/src/Scrollbar.mjs";
import { renderArrow } from "../../popover/src/PopoverBody.mjs";
import { dropdownInjectionKey, dropdownMenuInjectionKey } from "./context.mjs";
import DropdownDivider_default from "./DropdownDivider.mjs";
import { isDividerNode, isGroupNode, isRenderNode, isSubmenuNode } from "./utils.mjs";
import DropdownOption_default from "./DropdownOption.mjs";
import DropdownGroup_default from "./DropdownGroup.mjs";
import DropdownRenderOption_default from "./DropdownRenderOption.mjs";
import { Fragment, computed, createBlock, createElementBlock, defineComponent, inject, openBlock, provide, ref } from "vue";
//#region src/dropdown/src/DropdownMenu.tsx
var DropdownMenu_default = defineComponent({
  name: "DropdownMenu",
  props: {
    scrollable: Boolean,
    showArrow: Boolean,
    arrowStyle: [String, Object],
    clsPrefix: {
      type: String,
      required: true
    },
    tmNodes: {
      type: Array,
      default: () => []
    },
    parentKey: {
      type: [String, Number],
      default: null
    }
  },
  setup(props) {
    const {
      renderIconRef,
      childrenFieldRef
    } = inject(dropdownInjectionKey);
    provide(dropdownMenuInjectionKey, {
      showIconRef: computed(() => {
        const renderIcon = renderIconRef.value;
        return props.tmNodes.some(tmNode => {
          if (tmNode.isGroup) return tmNode.children?.some(({
            rawNode: rawChild
          }) => renderIcon ? renderIcon(rawChild) : rawChild.icon);
          const {
            rawNode
          } = tmNode;
          return renderIcon ? renderIcon(rawNode) : rawNode.icon;
        });
      }),
      hasSubmenuRef: computed(() => {
        const {
          value: childrenField
        } = childrenFieldRef;
        return props.tmNodes.some(tmNode => {
          if (tmNode.isGroup) return tmNode.children?.some(({
            rawNode: rawChild
          }) => isSubmenuNode(rawChild, childrenField));
          const {
            rawNode
          } = tmNode;
          return isSubmenuNode(rawNode, childrenField);
        });
      })
    });
    const bodyRef = ref(null);
    provide(modalBodyInjectionKey, null);
    provide(drawerBodyInjectionKey, null);
    provide(popoverBodyInjectionKey, bodyRef);
    return {
      bodyRef
    };
  },
  render() {
    const {
      parentKey,
      clsPrefix,
      scrollable
    } = this;
    const menuOptionsNode = this.tmNodes.map(tmNode => {
      const {
        rawNode
      } = tmNode;
      if (rawNode.show === false) return null;
      if (isRenderNode(rawNode)) return openBlock(), createBlock(DropdownRenderOption_default, {
        tmNode,
        key: tmNode.key
      }, null, 8, ["tmNode"]);
      if (isDividerNode(rawNode)) return openBlock(), createBlock(DropdownDivider_default, {
        clsPrefix,
        key: tmNode.key
      }, null, 8, ["clsPrefix"]);
      if (isGroupNode(rawNode)) return openBlock(), createBlock(DropdownGroup_default, {
        clsPrefix,
        tmNode,
        parentKey,
        key: tmNode.key
      }, null, 8, ["clsPrefix", "tmNode", "parentKey"]);
      return openBlock(), createBlock(DropdownOption_default, {
        clsPrefix,
        tmNode,
        parentKey,
        key: tmNode.key,
        props: rawNode.props,
        scrollable
      }, null, 8, ["clsPrefix", "tmNode", "parentKey", "props", "scrollable"]);
    });
    return openBlock(), createElementBlock("div", {
      class: normalizeClass$1([`${clsPrefix}-dropdown-menu`, scrollable && `${clsPrefix}-dropdown-menu--scrollable`]),
      ref: "bodyRef"
    }, [scrollable ? (openBlock(), createBlock(XScrollbar, {
      key: 0,
      contentClass: `${clsPrefix}-dropdown-menu__content`
    }, {
      default: () => menuOptionsNode
    }, 1032, ["contentClass"])) : (openBlock(), createElementBlock(Fragment, {
      key: 1
    }, [normalizeVNode(() => menuOptionsNode)], 64)), this.showArrow ? (openBlock(), createElementBlock(Fragment, {
      key: 2
    }, [normalizeVNode(() => renderArrow({
      clsPrefix,
      arrowStyle: this.arrowStyle,
      arrowClass: void 0,
      arrowWrapperClass: void 0,
      arrowWrapperStyle: void 0
    }))], 64)) : normalizeVNode(() => null)], 2);
  }
});
//#endregion
export { DropdownMenu_default as default };