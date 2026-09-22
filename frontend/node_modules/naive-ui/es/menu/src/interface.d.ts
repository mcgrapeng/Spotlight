import { HTMLAttributes, VNodeChild } from "vue";
import { TreeNode } from "treemate";
//#region src/menu/src/interface.d.ts
type Key = string | number;
interface MenuOptionSharedPart {
  key?: Key;
  disabled?: boolean;
  icon?: () => VNodeChild;
  children?: Array<MenuOption | MenuGroupOption | MenuDividerOption>;
  extra?: string | (() => VNodeChild);
  props?: HTMLAttributes;
  show?: boolean;
  [key: string]: unknown;
  /** @deprecated */
  titleExtra?: string | (() => VNodeChild);
}
/**
 * @private
 */
type MenuIgnoredOption = MenuDividerOption | MenuRenderOption;
interface MenuDividerOption {
  type: 'divider';
  key?: Key;
  props?: HTMLAttributes;
  [key: string]: unknown;
}
interface MenuRenderOption {
  type: 'render';
  key?: Key;
  props?: HTMLAttributes;
  render?: () => VNodeChild;
  [key: string]: unknown;
}
interface MenuGroupOptionBase extends MenuOptionSharedPart {
  type: 'group';
  children: Array<MenuOption | MenuDividerOption>;
}
type MenuOption = (MenuOptionSharedPart & {
  /** @deprecated */
  title?: string | (() => VNodeChild);
}) | (MenuOptionSharedPart & {
  label?: string | (() => VNodeChild);
});
type MenuGroupOption = (MenuGroupOptionBase & {
  /** @deprecated */
  title?: string | (() => VNodeChild);
}) | (MenuGroupOptionBase & {
  label?: string | (() => VNodeChild);
});
type MenuMixedOption = MenuDividerOption | MenuOption | MenuGroupOption;
type TmNode = TreeNode<MenuOption, MenuGroupOption, MenuIgnoredOption>;
type OnUpdateValue = (value: string & number & (string | number), item: MenuOption) => void;
type OnUpdateKeys = (keys: string[] & number[] & Array<string | number>) => void;
type OnUpdateValueImpl = (value: string | number | (string | number), item: MenuOption) => void;
type OnUpdateKeysImpl = (keys: string[] | number[] | Array<string | number>) => void;
type MenuNodeProps = (option: MenuOption | MenuGroupOption) => HTMLAttributes & Record<string, string | number | undefined>;
interface MenuInst {
  showOption: (key?: Key) => void;
  deriveResponsiveState: () => void;
}
//#endregion
export { Key, MenuDividerOption, MenuGroupOption, MenuGroupOptionBase, MenuIgnoredOption, MenuInst, MenuMixedOption, MenuNodeProps, MenuOption, MenuOptionSharedPart, MenuRenderOption, OnUpdateKeys, OnUpdateKeysImpl, OnUpdateValue, OnUpdateValueImpl, TmNode };