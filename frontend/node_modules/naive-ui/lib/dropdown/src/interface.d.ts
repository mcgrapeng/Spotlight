import { MenuDividerOption, MenuGroupOption, MenuIgnoredOption, MenuNodeProps, MenuOption, MenuRenderOption } from "../../menu/src/interface.js";
import { HTMLAttributes, VNode, VNodeChild } from "vue";
import { TreeNode } from "treemate";
//#region src/dropdown/src/interface.d.ts
type Key = string | number;
type DropdownOption = MenuOption;
type DropdownGroupOption = MenuGroupOption;
type DropdownDividerOption = MenuDividerOption;
type DropdownRenderOption = MenuRenderOption;
type DropdownMixedOption = DropdownOption | DropdownGroupOption | DropdownDividerOption | DropdownRenderOption;
type DropdownIgnoredOption = MenuIgnoredOption;
type DropdownIntersectionOption = DropdownOption & DropdownGroupOption;
type TmNode = TreeNode<DropdownOption, DropdownGroupOption, DropdownIgnoredOption>;
type OnUpdateValue = <T extends string & number & (string | number)>(value: T, option: DropdownOption) => void;
type OnUpdateKeys = <T extends string[] & number[] & Array<string | number>>(keys: T) => void;
type OnUpdateValueImpl = <T extends string | number | (string | number)>(value: T, option: DropdownOption) => void;
type OnUpdateKeysImpl = <T extends string[] | number[] | Array<string | number>>(keys: T) => void;
type RenderLabelImpl = (option: DropdownMixedOption) => VNodeChild;
type RenderLabel = (option: DropdownIntersectionOption) => VNodeChild;
type RenderIconImpl = (option: DropdownMixedOption) => VNodeChild;
type RenderIcon = (option: DropdownIntersectionOption) => VNodeChild;
type RenderOption = (info: {
  node: VNode;
  option: DropdownOption & DropdownGroupOption;
}) => VNodeChild;
type RenderOptionImpl = (info: {
  node: VNode;
  option: DropdownOption | DropdownGroupOption;
}) => VNodeChild;
type NodeProps = MenuNodeProps;
type DropdownMenuProps = (option: DropdownOption | undefined, options: Array<DropdownOption | DropdownGroupOption>) => HTMLAttributes & Record<string, string | number | undefined>;
//#endregion
export { DropdownDividerOption, DropdownGroupOption, DropdownIgnoredOption, DropdownIntersectionOption, DropdownMenuProps, DropdownMixedOption, DropdownOption, DropdownRenderOption, Key, NodeProps, OnUpdateKeys, OnUpdateKeysImpl, OnUpdateValue, OnUpdateValueImpl, RenderIcon, RenderIconImpl, RenderLabel, RenderLabelImpl, RenderOption, RenderOptionImpl, TmNode };