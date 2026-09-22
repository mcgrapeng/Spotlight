import { OnUpdateValueImpl } from "./interface.js";
import { MenuTheme } from "../styles/light.js";
import "../styles/index.js";
import { MenuSetupProps } from "./Menu.js";
import { MergedTheme } from "../../_mixins/use-theme.js";
import { UseMenuChildProps } from "./use-menu-child-props.js";
import { ComputedRef, Ref } from "vue";
import { FollowerPlacement } from "vueuc";
import { Key } from "treemate";
//#region src/menu/src/use-menu-child.d.ts
interface MenuInjection {
  props: MenuSetupProps;
  mergedCollapsedRef: Ref<boolean>;
  invertedRef: Ref<boolean>;
  isHorizontalRef: Ref<boolean>;
  mergedClsPrefixRef: Ref<string>;
  mergedValueRef: Ref<Key | null>;
  mergedExpandedKeysRef: Ref<Key[]>;
  activePathRef: Ref<Key[]>;
  mergedThemeRef: Ref<MergedTheme<MenuTheme>>;
  doSelect: OnUpdateValueImpl;
  toggleExpand: (key: Key) => void;
}
interface SubmenuInjection {
  paddingLeftRef: Ref<number | undefined>;
  mergedDisabledRef: Ref<boolean>;
}
interface MenuOptionGroupInjection {
  paddingLeftRef: Ref<number | undefined>;
  mergedDisabledRef: Ref<boolean>;
}
interface UseMenuChild {
  dropdownPlacement: ComputedRef<FollowerPlacement>;
  activeIconSize: ComputedRef<number>;
  maxIconSize: ComputedRef<number>;
  paddingLeft: ComputedRef<number | undefined>;
  iconMarginRight: ComputedRef<number>;
  NMenu: MenuInjection;
  NSubmenu: SubmenuInjection | null;
  NMenuOptionGroup: MenuOptionGroupInjection | null;
}
declare function useMenuChild(props: UseMenuChildProps): UseMenuChild;
//#endregion
export { MenuInjection, MenuOptionGroupInjection, SubmenuInjection, UseMenuChild, useMenuChild };