import { FormValidationStatus } from "../../form/src/public-types.js";
import { ThemeCommonVars } from "../../_styles/common/light.js";
import { ExtractPublicPropTypes } from "../../_utils/naive/extract-public-props.js";
import { MaybeArray } from "../../_utils/vue/call.js";
import "../../_utils/index.js";
import { EmptyTheme } from "../../empty/styles/light.js";
import "../../empty/styles/index.js";
import { InternalSelectMenuTheme } from "../../_internal/select-menu/styles/light.js";
import "../../_internal/select-menu/styles/index.js";
import { ScrollbarProps } from "../../_internal/scrollbar/src/Scrollbar.js";
import { SelectBaseOption } from "../../select/src/interface.js";
import { PopoverTheme } from "../../popover/styles/light.js";
import "../../popover/styles/index.js";
import { InternalSelectionTheme } from "../../_internal/selection/styles/light.js";
import "../../_internal/selection/styles/index.js";
import { PopoverProps } from "../../popover/src/Popover.js";
import "../../popover/index.js";
import "../../_internal/index.js";
import { CheckboxTheme } from "../../checkbox/styles/light.js";
import "../../checkbox/styles/index.js";
import { CascaderTheme, CascaderThemeOverrides, CascaderThemeVars } from "../styles/light.js";
import "../styles/index.js";
import { CascaderSize, CascaderSpinProps } from "./public-types.js";
import { CascaderOption, ExpandTrigger, Filter, Key as Key$1, OnLoad, OnUpdateValue, Value, ValueAtom } from "./interface.js";
import "../../index.js";
import { ExtractThemeOverrides } from "../../_mixins/use-theme.js";
import "../../_mixins/index.js";
import { ScrollbarTheme } from "../../_internal/scrollbar/styles/light.js";
import "../../_internal/scrollbar/styles/index.js";
import { CSSProperties, HTMLAttributes, PropType, Ref, SlotsType, VNode, VNodeChild } from "vue";
import { CheckStrategy } from "treemate";
import { FollowerPlacement } from "vueuc";
//#region src/cascader/src/Cascader.d.ts
declare const cascaderProps: {
  readonly allowCheckingNotLoaded: BooleanConstructor;
  readonly to: {
    type: PropType<HTMLElement | string | boolean>;
    default: undefined;
  };
  readonly bordered: {
    readonly type: PropType<boolean | undefined>;
    readonly default: undefined;
  };
  readonly options: {
    readonly type: PropType<CascaderOption[]>;
    readonly default: () => never[];
  };
  readonly value: PropType<Value | null>;
  readonly defaultValue: {
    readonly type: PropType<Value | null>;
    readonly default: null;
  };
  readonly placeholder: StringConstructor;
  readonly multiple: BooleanConstructor;
  readonly size: PropType<CascaderSize>;
  readonly filterable: BooleanConstructor;
  readonly disabled: {
    readonly type: PropType<boolean | undefined>;
    readonly default: undefined;
  };
  readonly disabledField: {
    readonly type: StringConstructor;
    readonly default: "disabled";
  };
  readonly expandTrigger: {
    readonly type: PropType<ExpandTrigger>;
    readonly default: "click";
  };
  readonly clearable: BooleanConstructor;
  readonly clearFilterAfterSelect: {
    readonly type: BooleanConstructor;
    readonly default: true;
  };
  readonly remote: BooleanConstructor;
  readonly onLoad: PropType<OnLoad>;
  readonly separator: {
    readonly type: StringConstructor;
    readonly default: " / ";
  };
  readonly filter: PropType<Filter>;
  readonly placement: {
    readonly type: PropType<FollowerPlacement>;
    readonly default: "bottom-start";
  };
  readonly cascade: {
    readonly type: BooleanConstructor;
    readonly default: true;
  };
  readonly leafOnly: BooleanConstructor;
  readonly showPath: {
    readonly type: BooleanConstructor;
    readonly default: true;
  };
  readonly show: {
    readonly type: PropType<boolean | undefined>;
    readonly default: undefined;
  };
  readonly maxTagCount: PropType<number | "responsive">;
  readonly ellipsisTagPopoverProps: PropType<PopoverProps>;
  readonly menuProps: PropType<HTMLAttributes>;
  readonly filterMenuProps: PropType<HTMLAttributes>;
  readonly virtualScroll: {
    readonly type: BooleanConstructor;
    readonly default: true;
  };
  readonly checkStrategy: {
    readonly type: PropType<CheckStrategy>;
    readonly default: "all";
  };
  readonly valueField: {
    readonly type: StringConstructor;
    readonly default: "value";
  };
  readonly labelField: {
    readonly type: StringConstructor;
    readonly default: "label";
  };
  readonly childrenField: {
    readonly type: StringConstructor;
    readonly default: "children";
  };
  readonly renderLabel: PropType<(option: CascaderOption, checked: boolean) => VNodeChild>;
  readonly status: PropType<FormValidationStatus>;
  readonly 'onUpdate:value': PropType<MaybeArray<OnUpdateValue>>;
  readonly onUpdateValue: PropType<MaybeArray<OnUpdateValue>>;
  readonly 'onUpdate:show': PropType<MaybeArray<(show: boolean) => void>>;
  readonly onUpdateShow: PropType<MaybeArray<(show: boolean) => void>>;
  readonly onBlur: PropType<(e: FocusEvent) => void>;
  readonly onFocus: PropType<(e: FocusEvent) => void>;
  readonly getColumnStyle: PropType<(detail: {
    level: number;
  }) => string | CSSProperties>;
  readonly spinProps: PropType<CascaderSpinProps>;
  readonly renderPrefix: PropType<(props: {
    option: CascaderOption;
    checked: boolean;
    node: VNode | null;
  }) => VNodeChild>;
  readonly renderSuffix: PropType<(props: {
    option: CascaderOption;
    checked: boolean;
    node: VNode | null;
  }) => VNodeChild>;
  readonly scrollbarProps: PropType<ScrollbarProps>;
  readonly onChange: PropType<MaybeArray<OnUpdateValue> | undefined>;
  readonly theme: PropType<CascaderTheme>;
  readonly themeOverrides: PropType<CascaderThemeOverrides>;
  readonly builtinThemeOverrides: PropType<CascaderThemeOverrides>;
};
type CascaderProps = ExtractPublicPropTypes<typeof cascaderProps>;
interface CascaderSlots {
  action?: () => VNode[];
  arrow?: () => VNode[];
  empty?: () => VNode[];
  'not-found'?: () => VNode[];
}
declare const _default: import("vue").DefineComponent<import("vue").ExtractPropTypes<{
  readonly allowCheckingNotLoaded: BooleanConstructor;
  readonly to: {
    type: PropType<HTMLElement | string | boolean>;
    default: undefined;
  };
  readonly bordered: {
    readonly type: PropType<boolean | undefined>;
    readonly default: undefined;
  };
  readonly options: {
    readonly type: PropType<CascaderOption[]>;
    readonly default: () => never[];
  };
  readonly value: PropType<Value | null>;
  readonly defaultValue: {
    readonly type: PropType<Value | null>;
    readonly default: null;
  };
  readonly placeholder: StringConstructor;
  readonly multiple: BooleanConstructor;
  readonly size: PropType<CascaderSize>;
  readonly filterable: BooleanConstructor;
  readonly disabled: {
    readonly type: PropType<boolean | undefined>;
    readonly default: undefined;
  };
  readonly disabledField: {
    readonly type: StringConstructor;
    readonly default: "disabled";
  };
  readonly expandTrigger: {
    readonly type: PropType<ExpandTrigger>;
    readonly default: "click";
  };
  readonly clearable: BooleanConstructor;
  readonly clearFilterAfterSelect: {
    readonly type: BooleanConstructor;
    readonly default: true;
  };
  readonly remote: BooleanConstructor;
  readonly onLoad: PropType<OnLoad>;
  readonly separator: {
    readonly type: StringConstructor;
    readonly default: " / ";
  };
  readonly filter: PropType<Filter>;
  readonly placement: {
    readonly type: PropType<FollowerPlacement>;
    readonly default: "bottom-start";
  };
  readonly cascade: {
    readonly type: BooleanConstructor;
    readonly default: true;
  };
  readonly leafOnly: BooleanConstructor;
  readonly showPath: {
    readonly type: BooleanConstructor;
    readonly default: true;
  };
  readonly show: {
    readonly type: PropType<boolean | undefined>;
    readonly default: undefined;
  };
  readonly maxTagCount: PropType<number | "responsive">;
  readonly ellipsisTagPopoverProps: PropType<PopoverProps>;
  readonly menuProps: PropType<HTMLAttributes>;
  readonly filterMenuProps: PropType<HTMLAttributes>;
  readonly virtualScroll: {
    readonly type: BooleanConstructor;
    readonly default: true;
  };
  readonly checkStrategy: {
    readonly type: PropType<CheckStrategy>;
    readonly default: "all";
  };
  readonly valueField: {
    readonly type: StringConstructor;
    readonly default: "value";
  };
  readonly labelField: {
    readonly type: StringConstructor;
    readonly default: "label";
  };
  readonly childrenField: {
    readonly type: StringConstructor;
    readonly default: "children";
  };
  readonly renderLabel: PropType<(option: CascaderOption, checked: boolean) => VNodeChild>;
  readonly status: PropType<FormValidationStatus>;
  readonly 'onUpdate:value': PropType<MaybeArray<OnUpdateValue>>;
  readonly onUpdateValue: PropType<MaybeArray<OnUpdateValue>>;
  readonly 'onUpdate:show': PropType<MaybeArray<(show: boolean) => void>>;
  readonly onUpdateShow: PropType<MaybeArray<(show: boolean) => void>>;
  readonly onBlur: PropType<(e: FocusEvent) => void>;
  readonly onFocus: PropType<(e: FocusEvent) => void>;
  readonly getColumnStyle: PropType<(detail: {
    level: number;
  }) => string | CSSProperties>;
  readonly spinProps: PropType<CascaderSpinProps>;
  readonly renderPrefix: PropType<(props: {
    option: CascaderOption;
    checked: boolean;
    node: VNode | null;
  }) => VNodeChild>;
  readonly renderSuffix: PropType<(props: {
    option: CascaderOption;
    checked: boolean;
    node: VNode | null;
  }) => VNodeChild>;
  readonly scrollbarProps: PropType<ScrollbarProps>;
  readonly onChange: PropType<MaybeArray<OnUpdateValue> | undefined>;
  readonly theme: PropType<CascaderTheme>;
  readonly themeOverrides: PropType<CascaderThemeOverrides>;
  readonly builtinThemeOverrides: PropType<CascaderThemeOverrides>;
}>, {
  handleTriggerResize: () => void;
  mergedStatus: import("vue").ComputedRef<FormValidationStatus | undefined>;
  selectMenuFollowerRef: unknown;
  cascaderMenuFollowerRef: unknown;
  triggerInstRef: unknown;
  selectMenuInstRef: unknown;
  cascaderMenuInstRef: unknown;
  mergedBordered: import("vue").ComputedRef<boolean>;
  mergedClsPrefix: Ref<string, string>;
  namespace: import("vue").ComputedRef<string | undefined>;
  mergedValue: import("vue").ComputedRef<string | number | ValueAtom[] | ValueAtom[] | null>;
  mergedShow: import("vue").ComputedRef<boolean>;
  showSelectMenu: import("vue").ComputedRef<boolean>;
  pattern: Ref<string, string>;
  treeMate: import("vue").ComputedRef<import("treemate").TreeMate<CascaderOption, CascaderOption, CascaderOption>>;
  mergedSize: import("vue").ComputedRef<CascaderSize>;
  mergedDisabled: import("vue").ComputedRef<boolean>;
  localizedPlaceholder: import("vue").ComputedRef<string>;
  selectedOption: import("vue").ComputedRef<{
    label: any;
    value: import("treemate").Key;
  } | null>;
  selectedOptions: import("vue").ComputedRef<{
    label: any;
    value: import("treemate").Key;
  }[]>;
  adjustedTo: import("vue").ComputedRef<string | HTMLElement>;
  menuModel: import("vue").ComputedRef<import("treemate").TreeNode<CascaderOption, CascaderOption, CascaderOption>[][]>;
  handleMenuTabout: () => void;
  handleMenuFocus: (e: FocusEvent) => void;
  handleMenuBlur: (e: FocusEvent) => void;
  handleMenuKeydown: (e: KeyboardEvent) => void;
  handleMenuMousedown: (e: MouseEvent) => void;
  handleTriggerFocus: (e: FocusEvent) => void;
  handleTriggerBlur: (e: FocusEvent) => void;
  handleTriggerClick: () => void;
  handleClear: (e: MouseEvent) => void;
  handleDeleteOption: (option: SelectBaseOption) => void;
  handlePatternInput: (e: InputEvent) => void;
  handleKeydown: (e: KeyboardEvent) => void;
  focused: Ref<boolean, boolean>;
  optionHeight: import("vue").ComputedRef<string>;
  mergedTheme: import("vue").ComputedRef<{
    common: ThemeCommonVars;
    self: CascaderThemeVars;
    peers: {
      InternalSelectMenu: InternalSelectMenuTheme;
      InternalSelection: InternalSelectionTheme;
      Scrollbar: ScrollbarTheme;
      Checkbox: CheckboxTheme;
      Empty: EmptyTheme;
    };
    peerOverrides: {
      InternalSelectMenu?: {
        peers?: {
          Scrollbar?: ExtractThemeOverrides<ScrollbarTheme> | undefined;
          Empty?: ExtractThemeOverrides<EmptyTheme> | undefined;
        } | undefined;
      } | undefined;
      InternalSelection?: {
        peers?: {
          Popover?: ExtractThemeOverrides<PopoverTheme> | undefined;
        } | undefined;
      } | undefined;
      Scrollbar?: {
        peers?: {
          [x: string]: any;
        } | undefined;
      } | undefined;
      Checkbox?: {
        peers?: {
          [x: string]: any;
        } | undefined;
      } | undefined;
      Empty?: {
        peers?: {
          [x: string]: any;
        } | undefined;
      } | undefined;
    };
  }>;
  cssVars: Ref<CSSProperties, CSSProperties> | undefined;
  themeClass: Ref<string, string> | undefined;
  onRender: (() => void) | undefined;
  focus: () => void;
  blur: () => void;
  getCheckedData: () => {
    keys: Key$1[];
    options: Array<CascaderOption | null>;
  };
  getIndeterminateData: () => {
    keys: Key$1[];
    options: Array<CascaderOption | null>;
  };
}, {}, {}, {}, import("vue").ComponentOptionsMixin, import("vue").ComponentOptionsMixin, {}, string, import("vue").PublicProps, Readonly<import("vue").ExtractPropTypes<{
  readonly allowCheckingNotLoaded: BooleanConstructor;
  readonly to: {
    type: PropType<HTMLElement | string | boolean>;
    default: undefined;
  };
  readonly bordered: {
    readonly type: PropType<boolean | undefined>;
    readonly default: undefined;
  };
  readonly options: {
    readonly type: PropType<CascaderOption[]>;
    readonly default: () => never[];
  };
  readonly value: PropType<Value | null>;
  readonly defaultValue: {
    readonly type: PropType<Value | null>;
    readonly default: null;
  };
  readonly placeholder: StringConstructor;
  readonly multiple: BooleanConstructor;
  readonly size: PropType<CascaderSize>;
  readonly filterable: BooleanConstructor;
  readonly disabled: {
    readonly type: PropType<boolean | undefined>;
    readonly default: undefined;
  };
  readonly disabledField: {
    readonly type: StringConstructor;
    readonly default: "disabled";
  };
  readonly expandTrigger: {
    readonly type: PropType<ExpandTrigger>;
    readonly default: "click";
  };
  readonly clearable: BooleanConstructor;
  readonly clearFilterAfterSelect: {
    readonly type: BooleanConstructor;
    readonly default: true;
  };
  readonly remote: BooleanConstructor;
  readonly onLoad: PropType<OnLoad>;
  readonly separator: {
    readonly type: StringConstructor;
    readonly default: " / ";
  };
  readonly filter: PropType<Filter>;
  readonly placement: {
    readonly type: PropType<FollowerPlacement>;
    readonly default: "bottom-start";
  };
  readonly cascade: {
    readonly type: BooleanConstructor;
    readonly default: true;
  };
  readonly leafOnly: BooleanConstructor;
  readonly showPath: {
    readonly type: BooleanConstructor;
    readonly default: true;
  };
  readonly show: {
    readonly type: PropType<boolean | undefined>;
    readonly default: undefined;
  };
  readonly maxTagCount: PropType<number | "responsive">;
  readonly ellipsisTagPopoverProps: PropType<PopoverProps>;
  readonly menuProps: PropType<HTMLAttributes>;
  readonly filterMenuProps: PropType<HTMLAttributes>;
  readonly virtualScroll: {
    readonly type: BooleanConstructor;
    readonly default: true;
  };
  readonly checkStrategy: {
    readonly type: PropType<CheckStrategy>;
    readonly default: "all";
  };
  readonly valueField: {
    readonly type: StringConstructor;
    readonly default: "value";
  };
  readonly labelField: {
    readonly type: StringConstructor;
    readonly default: "label";
  };
  readonly childrenField: {
    readonly type: StringConstructor;
    readonly default: "children";
  };
  readonly renderLabel: PropType<(option: CascaderOption, checked: boolean) => VNodeChild>;
  readonly status: PropType<FormValidationStatus>;
  readonly 'onUpdate:value': PropType<MaybeArray<OnUpdateValue>>;
  readonly onUpdateValue: PropType<MaybeArray<OnUpdateValue>>;
  readonly 'onUpdate:show': PropType<MaybeArray<(show: boolean) => void>>;
  readonly onUpdateShow: PropType<MaybeArray<(show: boolean) => void>>;
  readonly onBlur: PropType<(e: FocusEvent) => void>;
  readonly onFocus: PropType<(e: FocusEvent) => void>;
  readonly getColumnStyle: PropType<(detail: {
    level: number;
  }) => string | CSSProperties>;
  readonly spinProps: PropType<CascaderSpinProps>;
  readonly renderPrefix: PropType<(props: {
    option: CascaderOption;
    checked: boolean;
    node: VNode | null;
  }) => VNodeChild>;
  readonly renderSuffix: PropType<(props: {
    option: CascaderOption;
    checked: boolean;
    node: VNode | null;
  }) => VNodeChild>;
  readonly scrollbarProps: PropType<ScrollbarProps>;
  readonly onChange: PropType<MaybeArray<OnUpdateValue> | undefined>;
  readonly theme: PropType<CascaderTheme>;
  readonly themeOverrides: PropType<CascaderThemeOverrides>;
  readonly builtinThemeOverrides: PropType<CascaderThemeOverrides>;
}>> & Readonly<{}>, {
  readonly to: string | boolean | HTMLElement;
  readonly bordered: boolean | undefined;
  readonly show: boolean | undefined;
  readonly disabled: boolean | undefined;
  readonly clearable: boolean;
  readonly defaultValue: Value | null;
  readonly placement: FollowerPlacement;
  readonly options: CascaderOption[];
  readonly separator: string;
  readonly allowCheckingNotLoaded: boolean;
  readonly multiple: boolean;
  readonly filterable: boolean;
  readonly disabledField: string;
  readonly expandTrigger: ExpandTrigger;
  readonly clearFilterAfterSelect: boolean;
  readonly remote: boolean;
  readonly cascade: boolean;
  readonly leafOnly: boolean;
  readonly showPath: boolean;
  readonly virtualScroll: boolean;
  readonly checkStrategy: CheckStrategy;
  readonly valueField: string;
  readonly labelField: string;
  readonly childrenField: string;
}, SlotsType<CascaderSlots>, {}, {}, string, import("vue").ComponentProvideOptions, true, {}, any>;
//#endregion
export { CascaderProps, CascaderSlots, cascaderProps, _default as default };