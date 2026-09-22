import { ThemeCommonVars } from "../../_styles/common/light.js";
import { MaybeArray } from "../../_utils/vue/call.js";
import "../../_utils/index.js";
import { PopoverTheme } from "../../popover/styles/light.js";
import "../../popover/styles/index.js";
import { TooltipTheme } from "../../tooltip/styles/light.js";
import "../../tooltip/styles/index.js";
import { DropdownTheme } from "../../dropdown/styles/light.js";
import "../../dropdown/styles/index.js";
import { Key as Key$1, MenuGroupOption, MenuIgnoredOption, MenuMixedOption, MenuNodeProps, MenuOption, OnUpdateKeys, OnUpdateValue } from "./interface.js";
import { DropdownProps } from "../../dropdown/src/Dropdown.js";
import "../../dropdown/index.js";
import { MenuTheme, MenuThemeOverrides, MenuThemeVars } from "../styles/light.js";
import "../styles/index.js";
import "../../index.js";
import { ExtractThemeOverrides } from "../../_mixins/use-theme.js";
import "../../_mixins/index.js";
import { CSSProperties, ExtractPropTypes, PropType, Ref, VNodeChild } from "vue";
import { FollowerPlacement } from "vueuc";
import { Key } from "treemate";
//#region src/menu/src/Menu.d.ts
declare const menuProps: {
  readonly options: {
    readonly type: PropType<MenuMixedOption[]>;
    readonly default: () => never[];
  };
  readonly collapsed: {
    readonly type: PropType<boolean | undefined>;
    readonly default: undefined;
  };
  readonly collapsedWidth: {
    readonly type: NumberConstructor;
    readonly default: 48;
  };
  readonly iconSize: {
    readonly type: NumberConstructor;
    readonly default: 20;
  };
  readonly collapsedIconSize: {
    readonly type: NumberConstructor;
    readonly default: 24;
  };
  readonly rootIndent: NumberConstructor;
  readonly indent: {
    readonly type: NumberConstructor;
    readonly default: 32;
  };
  readonly labelField: {
    readonly type: StringConstructor;
    readonly default: "label";
  };
  readonly keyField: {
    readonly type: StringConstructor;
    readonly default: "key";
  };
  readonly childrenField: {
    readonly type: StringConstructor;
    readonly default: "children";
  };
  readonly disabledField: {
    readonly type: StringConstructor;
    readonly default: "disabled";
  };
  readonly defaultExpandAll: BooleanConstructor;
  readonly defaultExpandedKeys: PropType<Key[]>;
  readonly expandedKeys: PropType<Key[]>;
  readonly value: PropType<Key | null>;
  readonly defaultValue: {
    readonly type: PropType<Key | null>;
    readonly default: null;
  };
  readonly mode: {
    readonly type: PropType<"vertical" | "horizontal">;
    readonly default: "vertical";
  };
  readonly watchProps: {
    readonly type: PropType<Array<"defaultExpandedKeys" | "defaultValue">>;
    readonly default: undefined;
  };
  readonly disabled: BooleanConstructor;
  readonly show: {
    readonly type: BooleanConstructor;
    readonly default: true;
  };
  readonly inverted: BooleanConstructor;
  readonly 'onUpdate:expandedKeys': PropType<MaybeArray<OnUpdateKeys>>;
  readonly onUpdateExpandedKeys: PropType<MaybeArray<OnUpdateKeys>>;
  readonly onUpdateValue: PropType<MaybeArray<OnUpdateValue>>;
  readonly 'onUpdate:value': PropType<MaybeArray<OnUpdateValue>>;
  readonly expandIcon: PropType<(option: MenuOption) => VNodeChild>;
  readonly renderIcon: PropType<(option: MenuOption) => VNodeChild>;
  readonly renderLabel: PropType<(option: MenuOption | MenuGroupOption) => VNodeChild>;
  readonly renderExtra: PropType<(option: MenuOption | MenuGroupOption) => VNodeChild>;
  readonly dropdownProps: PropType<DropdownProps>;
  readonly accordion: BooleanConstructor;
  readonly nodeProps: PropType<MenuNodeProps>;
  readonly dropdownPlacement: {
    readonly type: PropType<FollowerPlacement>;
    readonly default: "bottom";
  };
  readonly responsive: BooleanConstructor;
  readonly items: PropType<Array<MenuOption | MenuGroupOption>>;
  readonly onOpenNamesChange: PropType<MaybeArray<OnUpdateKeys>>;
  readonly onSelect: PropType<MaybeArray<OnUpdateValue>>;
  readonly onExpandedNamesChange: PropType<MaybeArray<OnUpdateKeys>>;
  readonly expandedNames: PropType<Key[]>;
  readonly defaultExpandedNames: PropType<Key[]>;
  readonly theme: PropType<MenuTheme>;
  readonly themeOverrides: PropType<MenuThemeOverrides>;
  readonly builtinThemeOverrides: PropType<MenuThemeOverrides>;
};
type MenuSetupProps = ExtractPropTypes<typeof menuProps>;
type MenuProps = Partial<MenuSetupProps>;
declare const _default: import("vue").DefineComponent<ExtractPropTypes<{
  readonly options: {
    readonly type: PropType<MenuMixedOption[]>;
    readonly default: () => never[];
  };
  readonly collapsed: {
    readonly type: PropType<boolean | undefined>;
    readonly default: undefined;
  };
  readonly collapsedWidth: {
    readonly type: NumberConstructor;
    readonly default: 48;
  };
  readonly iconSize: {
    readonly type: NumberConstructor;
    readonly default: 20;
  };
  readonly collapsedIconSize: {
    readonly type: NumberConstructor;
    readonly default: 24;
  };
  readonly rootIndent: NumberConstructor;
  readonly indent: {
    readonly type: NumberConstructor;
    readonly default: 32;
  };
  readonly labelField: {
    readonly type: StringConstructor;
    readonly default: "label";
  };
  readonly keyField: {
    readonly type: StringConstructor;
    readonly default: "key";
  };
  readonly childrenField: {
    readonly type: StringConstructor;
    readonly default: "children";
  };
  readonly disabledField: {
    readonly type: StringConstructor;
    readonly default: "disabled";
  };
  readonly defaultExpandAll: BooleanConstructor;
  readonly defaultExpandedKeys: PropType<Key[]>;
  readonly expandedKeys: PropType<Key[]>;
  readonly value: PropType<Key | null>;
  readonly defaultValue: {
    readonly type: PropType<Key | null>;
    readonly default: null;
  };
  readonly mode: {
    readonly type: PropType<"vertical" | "horizontal">;
    readonly default: "vertical";
  };
  readonly watchProps: {
    readonly type: PropType<Array<"defaultExpandedKeys" | "defaultValue">>;
    readonly default: undefined;
  };
  readonly disabled: BooleanConstructor;
  readonly show: {
    readonly type: BooleanConstructor;
    readonly default: true;
  };
  readonly inverted: BooleanConstructor;
  readonly 'onUpdate:expandedKeys': PropType<MaybeArray<OnUpdateKeys>>;
  readonly onUpdateExpandedKeys: PropType<MaybeArray<OnUpdateKeys>>;
  readonly onUpdateValue: PropType<MaybeArray<OnUpdateValue>>;
  readonly 'onUpdate:value': PropType<MaybeArray<OnUpdateValue>>;
  readonly expandIcon: PropType<(option: MenuOption) => VNodeChild>;
  readonly renderIcon: PropType<(option: MenuOption) => VNodeChild>;
  readonly renderLabel: PropType<(option: MenuOption | MenuGroupOption) => VNodeChild>;
  readonly renderExtra: PropType<(option: MenuOption | MenuGroupOption) => VNodeChild>;
  readonly dropdownProps: PropType<DropdownProps>;
  readonly accordion: BooleanConstructor;
  readonly nodeProps: PropType<MenuNodeProps>;
  readonly dropdownPlacement: {
    readonly type: PropType<FollowerPlacement>;
    readonly default: "bottom";
  };
  readonly responsive: BooleanConstructor;
  readonly items: PropType<Array<MenuOption | MenuGroupOption>>;
  readonly onOpenNamesChange: PropType<MaybeArray<OnUpdateKeys>>;
  readonly onSelect: PropType<MaybeArray<OnUpdateValue>>;
  readonly onExpandedNamesChange: PropType<MaybeArray<OnUpdateKeys>>;
  readonly expandedNames: PropType<Key[]>;
  readonly defaultExpandedNames: PropType<Key[]>;
  readonly theme: PropType<MenuTheme>;
  readonly themeOverrides: PropType<MenuThemeOverrides>;
  readonly builtinThemeOverrides: PropType<MenuThemeOverrides>;
}>, {
  mergedClsPrefix: Ref<string, string>;
  controlledExpandedKeys: import("vue").ComputedRef<Key[] | undefined>;
  uncontrolledExpanededKeys: Ref<Key[], Key[]>;
  mergedExpandedKeys: import("vue").ComputedRef<Key[]>;
  uncontrolledValue: Ref<Key | null, Key | null>;
  mergedValue: import("vue").ComputedRef<Key | null>;
  activePath: import("vue").ComputedRef<Key[]>;
  tmNodes: import("vue").ComputedRef<import("treemate").TreeNode<MenuOption, MenuGroupOption, MenuIgnoredOption>[]>;
  mergedTheme: import("vue").ComputedRef<{
    common: ThemeCommonVars;
    self: MenuThemeVars;
    peers: {
      Tooltip: TooltipTheme;
      Dropdown: DropdownTheme;
    };
    peerOverrides: {
      Tooltip?: {
        peers?: {
          Popover?: ExtractThemeOverrides<PopoverTheme> | undefined;
        } | undefined;
      } | undefined;
      Dropdown?: {
        peers?: {
          Popover?: ExtractThemeOverrides<PopoverTheme> | undefined;
        } | undefined;
      } | undefined;
    };
  }>;
  mergedCollapsed: import("vue").ComputedRef<boolean>;
  cssVars: Ref<CSSProperties, CSSProperties> | undefined;
  themeClass: Ref<string, string> | undefined;
  overflowRef: unknown;
  counterRef: Ref<HTMLElement | null, HTMLElement | null>;
  updateCounter: () => void;
  onResize: () => void;
  onUpdateOverflow: (overflow: boolean) => void;
  onUpdateCount: (count: number) => void;
  renderCounter: () => VNodeChild;
  getCounter: () => HTMLElement | null;
  onRender: (() => void) | undefined;
  showOption: (key?: Key$1) => void;
  deriveResponsiveState: () => void;
}, {}, {}, {}, import("vue").ComponentOptionsMixin, import("vue").ComponentOptionsMixin, {}, string, import("vue").PublicProps, Readonly<ExtractPropTypes<{
  readonly options: {
    readonly type: PropType<MenuMixedOption[]>;
    readonly default: () => never[];
  };
  readonly collapsed: {
    readonly type: PropType<boolean | undefined>;
    readonly default: undefined;
  };
  readonly collapsedWidth: {
    readonly type: NumberConstructor;
    readonly default: 48;
  };
  readonly iconSize: {
    readonly type: NumberConstructor;
    readonly default: 20;
  };
  readonly collapsedIconSize: {
    readonly type: NumberConstructor;
    readonly default: 24;
  };
  readonly rootIndent: NumberConstructor;
  readonly indent: {
    readonly type: NumberConstructor;
    readonly default: 32;
  };
  readonly labelField: {
    readonly type: StringConstructor;
    readonly default: "label";
  };
  readonly keyField: {
    readonly type: StringConstructor;
    readonly default: "key";
  };
  readonly childrenField: {
    readonly type: StringConstructor;
    readonly default: "children";
  };
  readonly disabledField: {
    readonly type: StringConstructor;
    readonly default: "disabled";
  };
  readonly defaultExpandAll: BooleanConstructor;
  readonly defaultExpandedKeys: PropType<Key[]>;
  readonly expandedKeys: PropType<Key[]>;
  readonly value: PropType<Key | null>;
  readonly defaultValue: {
    readonly type: PropType<Key | null>;
    readonly default: null;
  };
  readonly mode: {
    readonly type: PropType<"vertical" | "horizontal">;
    readonly default: "vertical";
  };
  readonly watchProps: {
    readonly type: PropType<Array<"defaultExpandedKeys" | "defaultValue">>;
    readonly default: undefined;
  };
  readonly disabled: BooleanConstructor;
  readonly show: {
    readonly type: BooleanConstructor;
    readonly default: true;
  };
  readonly inverted: BooleanConstructor;
  readonly 'onUpdate:expandedKeys': PropType<MaybeArray<OnUpdateKeys>>;
  readonly onUpdateExpandedKeys: PropType<MaybeArray<OnUpdateKeys>>;
  readonly onUpdateValue: PropType<MaybeArray<OnUpdateValue>>;
  readonly 'onUpdate:value': PropType<MaybeArray<OnUpdateValue>>;
  readonly expandIcon: PropType<(option: MenuOption) => VNodeChild>;
  readonly renderIcon: PropType<(option: MenuOption) => VNodeChild>;
  readonly renderLabel: PropType<(option: MenuOption | MenuGroupOption) => VNodeChild>;
  readonly renderExtra: PropType<(option: MenuOption | MenuGroupOption) => VNodeChild>;
  readonly dropdownProps: PropType<DropdownProps>;
  readonly accordion: BooleanConstructor;
  readonly nodeProps: PropType<MenuNodeProps>;
  readonly dropdownPlacement: {
    readonly type: PropType<FollowerPlacement>;
    readonly default: "bottom";
  };
  readonly responsive: BooleanConstructor;
  readonly items: PropType<Array<MenuOption | MenuGroupOption>>;
  readonly onOpenNamesChange: PropType<MaybeArray<OnUpdateKeys>>;
  readonly onSelect: PropType<MaybeArray<OnUpdateValue>>;
  readonly onExpandedNamesChange: PropType<MaybeArray<OnUpdateKeys>>;
  readonly expandedNames: PropType<Key[]>;
  readonly defaultExpandedNames: PropType<Key[]>;
  readonly theme: PropType<MenuTheme>;
  readonly themeOverrides: PropType<MenuThemeOverrides>;
  readonly builtinThemeOverrides: PropType<MenuThemeOverrides>;
}>> & Readonly<{}>, {
  readonly iconSize: number;
  readonly defaultValue: Key | null;
  readonly disabled: boolean;
  readonly options: MenuMixedOption[];
  readonly mode: "vertical" | "horizontal";
  readonly responsive: boolean;
  readonly show: boolean;
  readonly disabledField: string;
  readonly labelField: string;
  readonly childrenField: string;
  readonly accordion: boolean;
  readonly collapsed: boolean | undefined;
  readonly defaultExpandAll: boolean;
  readonly indent: number;
  readonly inverted: boolean;
  readonly keyField: string;
  readonly collapsedWidth: number;
  readonly collapsedIconSize: number;
  readonly watchProps: ("defaultValue" | "defaultExpandedKeys")[];
  readonly dropdownPlacement: FollowerPlacement;
}, {}, {}, {}, string, import("vue").ComponentProvideOptions, true, {}, any>;
//#endregion
export { MenuProps, MenuSetupProps, _default as default, menuProps };