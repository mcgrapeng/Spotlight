import { DropdownMixedOption, DropdownRenderOption } from "./interface.js";
//#region src/dropdown/src/utils.d.ts
declare function isSubmenuNode(rawNode: DropdownMixedOption, childrenField: string): boolean;
declare function isGroupNode(rawNode: DropdownMixedOption): boolean;
declare function isDividerNode(rawNode: DropdownMixedOption): boolean;
declare function isRenderNode(rawNode: DropdownMixedOption): rawNode is DropdownRenderOption;
//#endregion
export { isDividerNode, isGroupNode, isRenderNode, isSubmenuNode };