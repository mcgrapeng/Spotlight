import { keep } from "../../_utils/vue/keep.mjs";
import MenuDivider_default from "./MenuDivider.mjs";
import { NMenuOption, menuItemPropKeys } from "./MenuOption.mjs";
import { NMenuOptionGroup, menuItemGroupPropKeys } from "./MenuOptionGroup.mjs";
import { NSubmenu, submenuPropKeys } from "./Submenu.mjs";
import { createBlock, h, mergeProps, openBlock } from "vue";
//#region src/menu/src/utils.tsx
function isIgnoredNode(rawNode) {
  return rawNode.type === "divider" || rawNode.type === "render";
}
function isDividerNode(rawNode) {
  return rawNode.type === "divider";
}
function itemRenderer(tmNode, menuProps) {
  const {
    rawNode
  } = tmNode;
  const {
    show
  } = rawNode;
  if (show === false) return null;
  if (isIgnoredNode(rawNode)) {
    if (isDividerNode(rawNode)) return openBlock(), createBlock(MenuDivider_default, mergeProps({
      key: tmNode.key
    }, rawNode.props), null, 16);
    return null;
  }
  const {
    labelField
  } = menuProps;
  const {
    key,
    level,
    isGroup
  } = tmNode;
  const props = {
    ...rawNode,
    title: rawNode.title || rawNode[labelField],
    extra: rawNode.titleExtra || rawNode.extra,
    key,
    internalKey: key,
    level,
    root: level === 0,
    isGroup
  };
  if (tmNode.children) {
    if (tmNode.isGroup) return h(NMenuOptionGroup, keep(props, menuItemGroupPropKeys, {
      tmNode,
      tmNodes: tmNode.children,
      key
    }));
    return h(NSubmenu, keep(props, submenuPropKeys, {
      key,
      rawNodes: rawNode[menuProps.childrenField],
      tmNodes: tmNode.children,
      tmNode
    }));
  } else return h(NMenuOption, keep(props, menuItemPropKeys, {
    key,
    tmNode
  }));
}
//#endregion
export { isDividerNode, isIgnoredNode, itemRenderer };