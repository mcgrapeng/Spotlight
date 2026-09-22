import { FormValidationStatus } from "../../form/src/public-types.js";
import { ThemeCommonVars } from "../../_styles/common/light.js";
import { ExtractPublicPropTypes } from "../../_utils/naive/extract-public-props.js";
import { MaybeArray } from "../../_utils/vue/call.js";
import "../../_utils/index.js";
import { EmptyTheme } from "../../empty/styles/light.js";
import "../../empty/styles/index.js";
import { SelectBaseOption, SelectOption } from "../../select/src/interface.js";
import { PopoverTheme } from "../../popover/styles/light.js";
import "../../popover/styles/index.js";
import { InternalSelectionTheme } from "../../_internal/selection/styles/light.js";
import "../../_internal/selection/styles/index.js";
import { PopoverProps } from "../../popover/src/Popover.js";
import "../../popover/index.js";
import { CheckboxTheme } from "../../checkbox/styles/light.js";
import "../../checkbox/styles/index.js";
import { TreeTheme } from "../../tree/styles/light.js";
import "../../tree/styles/index.js";
import { GetChildren, Key as Key$1, RenderSwitcherIcon, TreeOption, TreeOverrideNodeClickBehavior } from "../../tree/src/interface.js";
import { OnUpdateIndeterminateKeys, onUpdateExpandedKeys } from "../../tree/src/Tree.js";
import { OnUpdateValue, TreeSelectNodeProps, TreeSelectOption, TreeSelectRenderLabel, TreeSelectRenderPrefix, TreeSelectRenderSuffix, TreeSelectRenderTag } from "./interface.js";
import { TreeSelectSize } from "./public-types.js";
import { TreeSelectTheme, TreeSelectThemeOverrides, TreeSelectThemeVars } from "../styles/light.js";
import "../styles/index.js";
import "../index.js";
import "../../index.js";
import { ExtractThemeOverrides } from "../../_mixins/use-theme.js";
import "../../_mixins/index.js";
import { ScrollbarTheme } from "../../_internal/scrollbar/styles/light.js";
import "../../_internal/scrollbar/styles/index.js";
import { CSSProperties, HTMLAttributes, PropType, Ref, SlotsType, VNode, VNodeChild } from "vue";
import { FollowerPlacement } from "vueuc";
import { CheckStrategy } from "treemate";
//#region src/tree-select/src/TreeSelect.d.ts
type OnLoad = (node: TreeSelectOption) => Promise<void>;
declare const treeSelectProps: {
  readonly renderLabel: PropType<TreeSelectRenderLabel>;
  readonly renderPrefix: PropType<TreeSelectRenderPrefix>;
  readonly renderSuffix: PropType<TreeSelectRenderSuffix>;
  readonly nodeProps: PropType<TreeSelectNodeProps>;
  readonly watchProps: PropType<Array<"defaultCheckedKeys" | "defaultSelectedKeys" | "defaultExpandedKeys">>;
  readonly getChildren: PropType<GetChildren>;
  readonly onBlur: PropType<(e: FocusEvent) => void>;
  readonly onFocus: PropType<(e: FocusEvent) => void>;
  readonly onLoad: PropType<OnLoad>;
  readonly onUpdateShow: PropType<MaybeArray<(show: boolean) => void>>;
  readonly onUpdateValue: PropType<MaybeArray<OnUpdateValue>>;
  readonly 'onUpdate:value': PropType<MaybeArray<OnUpdateValue>>;
  readonly 'onUpdate:show': PropType<MaybeArray<(show: boolean) => void>>;
  /**
   * @deprecated
   */
  readonly leafOnly: BooleanConstructor;
  readonly allowCheckingNotLoaded: BooleanConstructor;
  readonly filter: PropType<(pattern: string, node: TreeOption) => boolean>;
  readonly defaultExpandAll: BooleanConstructor;
  readonly expandedKeys: PropType<Key$1[]>;
  readonly keyField: {
    readonly type: StringConstructor;
    readonly default: "key";
  };
  readonly labelField: {
    readonly type: StringConstructor;
    readonly default: "label";
  };
  readonly childrenField: {
    readonly type: StringConstructor;
    readonly default: "children";
  };
  readonly disabledField: {
    readonly type: StringConstructor;
    readonly default: "disabled";
  };
  readonly defaultExpandedKeys: {
    readonly type: PropType<Key$1[]>;
    readonly default: () => never[];
  };
  readonly indent: {
    readonly type: NumberConstructor;
    readonly default: 24;
  };
  readonly indeterminateKeys: PropType<Key$1[]>;
  readonly renderSwitcherIcon: PropType<RenderSwitcherIcon>;
  readonly onUpdateIndeterminateKeys: PropType<MaybeArray<OnUpdateIndeterminateKeys>>;
  readonly 'onUpdate:indeterminateKeys': PropType<MaybeArray<OnUpdateIndeterminateKeys>>;
  readonly onUpdateExpandedKeys: PropType<MaybeArray<onUpdateExpandedKeys>>;
  readonly 'onUpdate:expandedKeys': PropType<MaybeArray<onUpdateExpandedKeys>>;
  readonly overrideDefaultNodeClickBehavior: PropType<TreeOverrideNodeClickBehavior>;
  readonly bordered: {
    readonly type: BooleanConstructor;
    readonly default: true;
  };
  readonly cascade: BooleanConstructor;
  readonly checkable: BooleanConstructor;
  readonly clearable: BooleanConstructor;
  readonly clearFilterAfterSelect: {
    readonly type: BooleanConstructor;
    readonly default: true;
  };
  readonly consistentMenuWidth: {
    readonly type: BooleanConstructor;
    readonly default: true;
  };
  readonly defaultShow: BooleanConstructor;
  readonly defaultValue: {
    readonly type: PropType<string | number | Array<string | number> | null>;
    readonly default: null;
  };
  readonly disabled: {
    readonly type: PropType<boolean | undefined>;
    readonly default: undefined;
  };
  readonly filterable: BooleanConstructor;
  readonly checkStrategy: {
    readonly type: PropType<CheckStrategy>;
    readonly default: "all";
  };
  readonly loading: BooleanConstructor;
  readonly maxTagCount: PropType<number | "responsive">;
  readonly multiple: BooleanConstructor;
  readonly showLine: BooleanConstructor;
  readonly showPath: BooleanConstructor;
  readonly separator: {
    readonly type: StringConstructor;
    readonly default: " / ";
  };
  readonly options: {
    readonly type: PropType<TreeSelectOption[]>;
    readonly default: () => never[];
  };
  readonly placeholder: StringConstructor;
  readonly placement: {
    readonly type: PropType<FollowerPlacement>;
    readonly default: "bottom-start";
  };
  readonly show: {
    readonly type: PropType<boolean | undefined>;
    readonly default: undefined;
  };
  readonly size: PropType<TreeSelectSize>;
  readonly value: PropType<string | number | Array<string | number> | null>;
  readonly to: {
    type: PropType<HTMLElement | string | boolean>;
    default: undefined;
  };
  readonly menuProps: PropType<HTMLAttributes>;
  readonly virtualScroll: {
    readonly type: BooleanConstructor;
    readonly default: true;
  };
  readonly status: PropType<FormValidationStatus>;
  readonly renderTag: PropType<TreeSelectRenderTag>;
  readonly ellipsisTagPopoverProps: PropType<PopoverProps>;
  readonly theme: PropType<TreeSelectTheme>;
  readonly themeOverrides: PropType<TreeSelectThemeOverrides>;
  readonly builtinThemeOverrides: PropType<TreeSelectThemeOverrides>;
};
type TreeSelectProps = ExtractPublicPropTypes<typeof treeSelectProps>;
interface TreeSelectSlots {
  header?: () => VNode[];
  action?: () => VNode[];
  arrow?: () => VNode[];
  empty?: () => VNode[];
}
declare const _default: import("vue").DefineComponent<import("vue").ExtractPropTypes<{
  readonly renderLabel: PropType<TreeSelectRenderLabel>;
  readonly renderPrefix: PropType<TreeSelectRenderPrefix>;
  readonly renderSuffix: PropType<TreeSelectRenderSuffix>;
  readonly nodeProps: PropType<TreeSelectNodeProps>;
  readonly watchProps: PropType<Array<"defaultCheckedKeys" | "defaultSelectedKeys" | "defaultExpandedKeys">>;
  readonly getChildren: PropType<GetChildren>;
  readonly onBlur: PropType<(e: FocusEvent) => void>;
  readonly onFocus: PropType<(e: FocusEvent) => void>;
  readonly onLoad: PropType<OnLoad>;
  readonly onUpdateShow: PropType<MaybeArray<(show: boolean) => void>>;
  readonly onUpdateValue: PropType<MaybeArray<OnUpdateValue>>;
  readonly 'onUpdate:value': PropType<MaybeArray<OnUpdateValue>>;
  readonly 'onUpdate:show': PropType<MaybeArray<(show: boolean) => void>>;
  /**
   * @deprecated
   */
  readonly leafOnly: BooleanConstructor;
  readonly allowCheckingNotLoaded: BooleanConstructor;
  readonly filter: PropType<(pattern: string, node: TreeOption) => boolean>;
  readonly defaultExpandAll: BooleanConstructor;
  readonly expandedKeys: PropType<Key$1[]>;
  readonly keyField: {
    readonly type: StringConstructor;
    readonly default: "key";
  };
  readonly labelField: {
    readonly type: StringConstructor;
    readonly default: "label";
  };
  readonly childrenField: {
    readonly type: StringConstructor;
    readonly default: "children";
  };
  readonly disabledField: {
    readonly type: StringConstructor;
    readonly default: "disabled";
  };
  readonly defaultExpandedKeys: {
    readonly type: PropType<Key$1[]>;
    readonly default: () => never[];
  };
  readonly indent: {
    readonly type: NumberConstructor;
    readonly default: 24;
  };
  readonly indeterminateKeys: PropType<Key$1[]>;
  readonly renderSwitcherIcon: PropType<RenderSwitcherIcon>;
  readonly onUpdateIndeterminateKeys: PropType<MaybeArray<OnUpdateIndeterminateKeys>>;
  readonly 'onUpdate:indeterminateKeys': PropType<MaybeArray<OnUpdateIndeterminateKeys>>;
  readonly onUpdateExpandedKeys: PropType<MaybeArray<onUpdateExpandedKeys>>;
  readonly 'onUpdate:expandedKeys': PropType<MaybeArray<onUpdateExpandedKeys>>;
  readonly overrideDefaultNodeClickBehavior: PropType<TreeOverrideNodeClickBehavior>;
  readonly bordered: {
    readonly type: BooleanConstructor;
    readonly default: true;
  };
  readonly cascade: BooleanConstructor;
  readonly checkable: BooleanConstructor;
  readonly clearable: BooleanConstructor;
  readonly clearFilterAfterSelect: {
    readonly type: BooleanConstructor;
    readonly default: true;
  };
  readonly consistentMenuWidth: {
    readonly type: BooleanConstructor;
    readonly default: true;
  };
  readonly defaultShow: BooleanConstructor;
  readonly defaultValue: {
    readonly type: PropType<string | number | Array<string | number> | null>;
    readonly default: null;
  };
  readonly disabled: {
    readonly type: PropType<boolean | undefined>;
    readonly default: undefined;
  };
  readonly filterable: BooleanConstructor;
  readonly checkStrategy: {
    readonly type: PropType<CheckStrategy>;
    readonly default: "all";
  };
  readonly loading: BooleanConstructor;
  readonly maxTagCount: PropType<number | "responsive">;
  readonly multiple: BooleanConstructor;
  readonly showLine: BooleanConstructor;
  readonly showPath: BooleanConstructor;
  readonly separator: {
    readonly type: StringConstructor;
    readonly default: " / ";
  };
  readonly options: {
    readonly type: PropType<TreeSelectOption[]>;
    readonly default: () => never[];
  };
  readonly placeholder: StringConstructor;
  readonly placement: {
    readonly type: PropType<FollowerPlacement>;
    readonly default: "bottom-start";
  };
  readonly show: {
    readonly type: PropType<boolean | undefined>;
    readonly default: undefined;
  };
  readonly size: PropType<TreeSelectSize>;
  readonly value: PropType<string | number | Array<string | number> | null>;
  readonly to: {
    type: PropType<HTMLElement | string | boolean>;
    default: undefined;
  };
  readonly menuProps: PropType<HTMLAttributes>;
  readonly virtualScroll: {
    readonly type: BooleanConstructor;
    readonly default: true;
  };
  readonly status: PropType<FormValidationStatus>;
  readonly renderTag: PropType<TreeSelectRenderTag>;
  readonly ellipsisTagPopoverProps: PropType<PopoverProps>;
  readonly theme: PropType<TreeSelectTheme>;
  readonly themeOverrides: PropType<TreeSelectThemeOverrides>;
  readonly builtinThemeOverrides: PropType<TreeSelectThemeOverrides>;
}>, {
  menuElRef: Ref<HTMLDivElement | null, HTMLDivElement | null>;
  mergedStatus: import("vue").ComputedRef<FormValidationStatus | undefined>;
  triggerInstRef: unknown;
  followerInstRef: unknown;
  treeInstRef: unknown;
  mergedClsPrefix: Ref<string, string>;
  mergedValue: import("vue").ComputedRef<string | number | (string | number)[] | null>;
  mergedShow: import("vue").ComputedRef<boolean>;
  namespace: import("vue").ComputedRef<string | undefined>;
  adjustedTo: import("vue").ComputedRef<string | HTMLElement>;
  isMounted: Readonly<Ref<boolean, boolean>>;
  focused: Ref<boolean, boolean>;
  menuPadding: import("vue").ComputedRef<string>;
  mergedPlaceholder: import("vue").ComputedRef<string>;
  mergedExpandedKeys: import("vue").ComputedRef<Key$1[] | undefined>;
  treeSelectedKeys: import("vue").ComputedRef<Key$1[]>;
  treeCheckedKeys: import("vue").ComputedRef<Key$1[]>;
  mergedSize: import("vue").ComputedRef<TreeSelectSize>;
  mergedDisabled: import("vue").ComputedRef<boolean>;
  selectedOption: import("vue").ComputedRef<SelectBaseOption<string | number, string | ((option: SelectBaseOption<string | number, string | /*elided*/ any>, selected: boolean) => VNodeChild)> | null>;
  selectedOptions: import("vue").ComputedRef<SelectBaseOption<string | number, string | ((option: SelectBaseOption<string | number, string | /*elided*/ any>, selected: boolean) => VNodeChild)>[] | null>;
  pattern: Ref<string, string>;
  pendingNodeKey: Ref<string | number | null, string | number | null>;
  mergedCascade: import("vue").ComputedRef<boolean>;
  mergedFilter: import("vue").ComputedRef<(pattern: string, node: TreeOption) => boolean>;
  selectionRenderTag: import("vue").ComputedRef<(({ option, handleClose }: {
    option: SelectOption;
    handleClose: () => void;
  }) => VNodeChild) | undefined>;
  handleTriggerOrMenuResize: () => void;
  doUpdateExpandedKeys: (keys: Key$1[], option: Array<TreeSelectOption | null>, meta: {
    node: TreeSelectOption;
    action: "expand" | "collapse";
  } | {
    node: null;
    action: "filter";
  }) => void;
  handleMenuLeave: () => void;
  handleTriggerClick: () => void;
  handleMenuClickoutside: (e: MouseEvent) => void;
  handleUpdateCheckedKeys: (keys: Key$1[], _: unknown, meta: {
    node: TreeOption | null;
    action: "check" | "uncheck";
  }) => void;
  handleUpdateIndeterminateKeys: (keys: Key$1[]) => void;
  handleTriggerFocus: (e: FocusEvent) => void;
  handleTriggerBlur: (e: FocusEvent) => void;
  handleMenuFocusin: (e: FocusEvent) => void;
  handleMenuFocusout: (e: FocusEvent) => void;
  handleClear: (e: MouseEvent) => void;
  handleDeleteOption: (option: SelectBaseOption) => void;
  handlePatternInput: (e: InputEvent) => void;
  handleKeydown: (e: KeyboardEvent) => void;
  handleTabOut: () => void;
  handleMenuMousedown: (e: MouseEvent) => void;
  mergedTheme: import("vue").ComputedRef<{
    common: ThemeCommonVars;
    self: TreeSelectThemeVars;
    peers: {
      Tree: TreeTheme;
      Empty: EmptyTheme;
      InternalSelection: InternalSelectionTheme;
    };
    peerOverrides: {
      Tree?: {
        peers?: {
          Checkbox?: ExtractThemeOverrides<CheckboxTheme> | undefined;
          Scrollbar?: ExtractThemeOverrides<ScrollbarTheme> | undefined;
          Empty?: ExtractThemeOverrides<EmptyTheme> | undefined;
        } | undefined;
      } | undefined;
      Empty?: {
        peers?: {
          [x: string]: any;
        } | undefined;
      } | undefined;
      InternalSelection?: {
        peers?: {
          Popover?: ExtractThemeOverrides<PopoverTheme> | undefined;
        } | undefined;
      } | undefined;
    };
  }>;
  mergedRenderEmpty: import("vue").ComputedRef<(() => VNodeChild) | undefined>;
  cssVars: Ref<CSSProperties, CSSProperties> | undefined;
  themeClass: Ref<string, string> | undefined;
  onRender: (() => void) | undefined;
  getCheckedData: () => {
    keys: Array<string | number>;
    options: Array<TreeSelectOption | null>;
  };
  getIndeterminateData: () => {
    keys: Array<string | number>;
    options: Array<TreeSelectOption | null>;
  };
  focus: () => void;
  focusInput: () => void;
  blur: () => void;
  blurInput: () => void;
}, {}, {}, {}, import("vue").ComponentOptionsMixin, import("vue").ComponentOptionsMixin, {}, string, import("vue").PublicProps, Readonly<import("vue").ExtractPropTypes<{
  readonly renderLabel: PropType<TreeSelectRenderLabel>;
  readonly renderPrefix: PropType<TreeSelectRenderPrefix>;
  readonly renderSuffix: PropType<TreeSelectRenderSuffix>;
  readonly nodeProps: PropType<TreeSelectNodeProps>;
  readonly watchProps: PropType<Array<"defaultCheckedKeys" | "defaultSelectedKeys" | "defaultExpandedKeys">>;
  readonly getChildren: PropType<GetChildren>;
  readonly onBlur: PropType<(e: FocusEvent) => void>;
  readonly onFocus: PropType<(e: FocusEvent) => void>;
  readonly onLoad: PropType<OnLoad>;
  readonly onUpdateShow: PropType<MaybeArray<(show: boolean) => void>>;
  readonly onUpdateValue: PropType<MaybeArray<OnUpdateValue>>;
  readonly 'onUpdate:value': PropType<MaybeArray<OnUpdateValue>>;
  readonly 'onUpdate:show': PropType<MaybeArray<(show: boolean) => void>>;
  /**
   * @deprecated
   */
  readonly leafOnly: BooleanConstructor;
  readonly allowCheckingNotLoaded: BooleanConstructor;
  readonly filter: PropType<(pattern: string, node: TreeOption) => boolean>;
  readonly defaultExpandAll: BooleanConstructor;
  readonly expandedKeys: PropType<Key$1[]>;
  readonly keyField: {
    readonly type: StringConstructor;
    readonly default: "key";
  };
  readonly labelField: {
    readonly type: StringConstructor;
    readonly default: "label";
  };
  readonly childrenField: {
    readonly type: StringConstructor;
    readonly default: "children";
  };
  readonly disabledField: {
    readonly type: StringConstructor;
    readonly default: "disabled";
  };
  readonly defaultExpandedKeys: {
    readonly type: PropType<Key$1[]>;
    readonly default: () => never[];
  };
  readonly indent: {
    readonly type: NumberConstructor;
    readonly default: 24;
  };
  readonly indeterminateKeys: PropType<Key$1[]>;
  readonly renderSwitcherIcon: PropType<RenderSwitcherIcon>;
  readonly onUpdateIndeterminateKeys: PropType<MaybeArray<OnUpdateIndeterminateKeys>>;
  readonly 'onUpdate:indeterminateKeys': PropType<MaybeArray<OnUpdateIndeterminateKeys>>;
  readonly onUpdateExpandedKeys: PropType<MaybeArray<onUpdateExpandedKeys>>;
  readonly 'onUpdate:expandedKeys': PropType<MaybeArray<onUpdateExpandedKeys>>;
  readonly overrideDefaultNodeClickBehavior: PropType<TreeOverrideNodeClickBehavior>;
  readonly bordered: {
    readonly type: BooleanConstructor;
    readonly default: true;
  };
  readonly cascade: BooleanConstructor;
  readonly checkable: BooleanConstructor;
  readonly clearable: BooleanConstructor;
  readonly clearFilterAfterSelect: {
    readonly type: BooleanConstructor;
    readonly default: true;
  };
  readonly consistentMenuWidth: {
    readonly type: BooleanConstructor;
    readonly default: true;
  };
  readonly defaultShow: BooleanConstructor;
  readonly defaultValue: {
    readonly type: PropType<string | number | Array<string | number> | null>;
    readonly default: null;
  };
  readonly disabled: {
    readonly type: PropType<boolean | undefined>;
    readonly default: undefined;
  };
  readonly filterable: BooleanConstructor;
  readonly checkStrategy: {
    readonly type: PropType<CheckStrategy>;
    readonly default: "all";
  };
  readonly loading: BooleanConstructor;
  readonly maxTagCount: PropType<number | "responsive">;
  readonly multiple: BooleanConstructor;
  readonly showLine: BooleanConstructor;
  readonly showPath: BooleanConstructor;
  readonly separator: {
    readonly type: StringConstructor;
    readonly default: " / ";
  };
  readonly options: {
    readonly type: PropType<TreeSelectOption[]>;
    readonly default: () => never[];
  };
  readonly placeholder: StringConstructor;
  readonly placement: {
    readonly type: PropType<FollowerPlacement>;
    readonly default: "bottom-start";
  };
  readonly show: {
    readonly type: PropType<boolean | undefined>;
    readonly default: undefined;
  };
  readonly size: PropType<TreeSelectSize>;
  readonly value: PropType<string | number | Array<string | number> | null>;
  readonly to: {
    type: PropType<HTMLElement | string | boolean>;
    default: undefined;
  };
  readonly menuProps: PropType<HTMLAttributes>;
  readonly virtualScroll: {
    readonly type: BooleanConstructor;
    readonly default: true;
  };
  readonly status: PropType<FormValidationStatus>;
  readonly renderTag: PropType<TreeSelectRenderTag>;
  readonly ellipsisTagPopoverProps: PropType<PopoverProps>;
  readonly theme: PropType<TreeSelectTheme>;
  readonly themeOverrides: PropType<TreeSelectThemeOverrides>;
  readonly builtinThemeOverrides: PropType<TreeSelectThemeOverrides>;
}>> & Readonly<{}>, {
  readonly to: string | boolean | HTMLElement;
  readonly bordered: boolean;
  readonly loading: boolean;
  readonly clearable: boolean;
  readonly defaultValue: string | number | (string | number)[] | null;
  readonly disabled: boolean | undefined;
  readonly placement: FollowerPlacement;
  readonly options: TreeSelectOption[];
  readonly show: boolean | undefined;
  readonly defaultShow: boolean;
  readonly allowCheckingNotLoaded: boolean;
  readonly multiple: boolean;
  readonly filterable: boolean;
  readonly disabledField: string;
  readonly clearFilterAfterSelect: boolean;
  readonly separator: string;
  readonly cascade: boolean;
  readonly leafOnly: boolean;
  readonly showPath: boolean;
  readonly virtualScroll: boolean;
  readonly checkStrategy: CheckStrategy;
  readonly labelField: string;
  readonly childrenField: string;
  readonly consistentMenuWidth: boolean;
  readonly defaultExpandAll: boolean;
  readonly indent: number;
  readonly keyField: string;
  readonly defaultExpandedKeys: Key$1[];
  readonly checkable: boolean;
  readonly showLine: boolean;
}, SlotsType<TreeSelectSlots>, {}, {}, string, import("vue").ComponentProvideOptions, true, {}, any>;
//#endregion
export { TreeSelectProps, TreeSelectSlots, _default as default, treeSelectProps };