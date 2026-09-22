import { MenuGroupOption, MenuIgnoredOption, MenuMixedOption, MenuOption } from "./interface.js";
import { MenuSetupProps } from "./Menu.js";
import { VNode } from "vue";
import { TreeNode } from "treemate";
//#region src/menu/src/utils.d.ts
declare function isIgnoredNode(rawNode: MenuMixedOption): rawNode is MenuIgnoredOption;
declare function isDividerNode(rawNode: MenuMixedOption): rawNode is MenuIgnoredOption;
declare function itemRenderer(tmNode: TreeNode<MenuOption, MenuGroupOption, MenuIgnoredOption>, menuProps: MenuSetupProps): VNode | null;
//#endregion
export { isDividerNode, isIgnoredNode, itemRenderer };