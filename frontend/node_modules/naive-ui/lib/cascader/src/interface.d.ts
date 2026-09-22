import { NLocale } from "../../locales/common/enUS.js";
import { ScrollbarProps } from "../../_internal/scrollbar/src/Scrollbar.js";
import "../../_internal/index.js";
import { CascaderTheme } from "../styles/light.js";
import "../styles/index.js";
import { CascaderSpinProps } from "./public-types.js";
import "../../locales/index.js";
import { MergedTheme } from "../../_mixins/use-theme.js";
import "../../_mixins/index.js";
import { CSSProperties, Ref, Slots, VNode, VNodeChild } from "vue";
import { CheckStrategy, TreeNode } from "treemate";
//#region src/cascader/src/interface.d.ts
type ValueAtom = string | number;
type Value = ValueAtom | ValueAtom[];
type Key = ValueAtom;
interface CascaderOption {
  label?: string;
  value?: ValueAtom;
  disabled?: boolean;
  children?: CascaderOption[];
  [key: string]: unknown;
}
type ExpandTrigger = 'hover' | 'click';
type TmNode = TreeNode<CascaderOption>;
type Filter = (pattern: string, option: CascaderOption, path: CascaderOption[]) => boolean;
type OnLoad = (option: CascaderOption) => Promise<void>;
type OnUpdateValue = (value: string & number & string[] & number[] & Array<string | number> & (string | null) & (number | null) & (string[] | null) & (number[] | null) & (Array<string | number> | null), option: null & CascaderOption & CascaderOption[] & Array<CascaderOption | null>, path: null & CascaderOption[] & Array<CascaderOption[] | null>) => void;
type OnUpdateValueImpl = (value: Value | null, option: CascaderOption | null | Array<CascaderOption | null>, path: Array<CascaderOption[] | null> | CascaderOption[] | null) => void;
type MenuModel = TmNode[][];
interface CascaderInjection {
  slots: Slots;
  mergedClsPrefixRef: Ref<string>;
  mergedThemeRef: Ref<MergedTheme<CascaderTheme>>;
  mergedValueRef: Ref<Value | null>;
  checkedKeysRef: Ref<Key[]>;
  indeterminateKeysRef: Ref<Key[]>;
  hoverKeyPathRef: Ref<Key[]>;
  mergedCheckStrategyRef: Ref<CheckStrategy>;
  multipleRef: Ref<boolean>;
  keyboardKeyRef: Ref<Key | null>;
  hoverKeyRef: Ref<Key | null>;
  remoteRef: Ref<boolean>;
  loadingKeySetRef: Ref<Set<Key>>;
  expandTriggerRef: Ref<ExpandTrigger>;
  isMountedRef: Ref<boolean>;
  cascadeRef: Ref<boolean>;
  onLoadRef: Ref<((value: CascaderOption) => Promise<void>) | undefined>;
  localeRef: Ref<NLocale['Cascader']>;
  virtualScrollRef: Ref<boolean>;
  optionHeightRef: Ref<string>;
  labelFieldRef: Ref<string>;
  showCheckboxRef: Ref<boolean>;
  getColumnStyleRef: Ref<((detail: {
    level: number;
  }) => string | CSSProperties) | undefined>;
  renderPrefixRef: Ref<((info: {
    option: CascaderOption;
    checked: boolean;
    node: VNode | null;
  }) => VNodeChild) | undefined>;
  renderSuffixRef: Ref<((info: {
    option: CascaderOption;
    checked: boolean;
    node: VNode | null;
  }) => VNodeChild) | undefined>;
  syncCascaderMenuPosition: () => void;
  syncSelectMenuPosition: () => void;
  updateKeyboardKey: (value: Key | null) => void;
  updateHoverKey: (value: Key | null) => void;
  addLoadingKey: (value: Key) => void;
  deleteLoadingKey: (value: Key) => void;
  doCheck: (value: Key) => void;
  doUncheck: (value: Key) => void;
  closeMenu: (returnFocus?: boolean) => void;
  handleSelectMenuClickOutside: (e: MouseEvent) => void;
  handleCascaderMenuClickOutside: (e: MouseEvent) => void;
  renderLabelRef: Ref<((option: CascaderOption, checked: boolean) => VNodeChild) | undefined>;
  spinPropsRef: Ref<CascaderSpinProps | undefined>;
  scrollbarPropsRef: Ref<ScrollbarProps | undefined>;
  clearPattern: () => void;
}
interface CascaderSubmenuInstance {
  scroll: (index: number, elSize: number) => void;
}
interface CascaderMenuExposedMethods {
  scroll: (depth: number, index: number, elSize: number) => void;
  showErrorMessage: (label: string) => void;
}
type CascaderMenuInstance = {
  $el: HTMLElement;
} & CascaderMenuExposedMethods;
interface SelectMenuInstance {
  prev: () => void;
  next: () => void;
  enter: () => boolean;
}
declare const cascaderInjectionKey: import("vue").InjectionKey<CascaderInjection>;
interface CascaderInst {
  focus: () => void;
  blur: () => void;
  getCheckedData: () => {
    keys: Key[];
    options: Array<CascaderOption | null>;
  };
  getIndeterminateData: () => {
    keys: Key[];
    options: Array<CascaderOption | null>;
  };
}
//#endregion
export { CascaderInjection, CascaderInst, CascaderMenuExposedMethods, CascaderMenuInstance, CascaderOption, CascaderSubmenuInstance, ExpandTrigger, Filter, Key, MenuModel, OnLoad, OnUpdateValue, OnUpdateValueImpl, SelectMenuInstance, TmNode, Value, ValueAtom, cascaderInjectionKey };