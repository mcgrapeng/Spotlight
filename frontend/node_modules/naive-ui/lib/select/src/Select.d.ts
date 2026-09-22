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
import { OnUpdateValue, SelectFallbackOption, SelectFilter, SelectGroupOption, SelectIgnoredOption, SelectMixedOption, SelectOption, Value, ValueAtom } from "./interface.js";
import { NodeProps, RenderLabel, RenderOption } from "../../_internal/select-menu/src/interface.js";
import { PopoverTheme } from "../../popover/styles/light.js";
import "../../popover/styles/index.js";
import { InternalSelectionTheme } from "../../_internal/selection/styles/light.js";
import "../../_internal/selection/styles/index.js";
import { PopoverProps } from "../../popover/src/Popover.js";
import "../../popover/index.js";
import { RenderTag } from "../../_internal/selection/src/interface.js";
import "../../_internal/index.js";
import { SelectTheme, SelectThemeOverrides, SelectThemeVars } from "../styles/light.js";
import "../styles/index.js";
import { SelectSize } from "./public-types.js";
import "../../index.js";
import { ExtractThemeOverrides } from "../../_mixins/use-theme.js";
import "../../_mixins/index.js";
import { ScrollbarTheme } from "../../_internal/scrollbar/styles/light.js";
import "../../_internal/scrollbar/styles/index.js";
import { CSSProperties, HTMLAttributes, InputHTMLAttributes, PropType, Ref, SlotsType, VNode } from "vue";
import { TreeNode } from "treemate";
import { FollowerPlacement } from "vueuc";
//#region src/select/src/Select.d.ts
declare const selectProps: {
  readonly to: {
    type: PropType<HTMLElement | string | boolean>;
    default: undefined;
  };
  readonly bordered: {
    readonly type: PropType<boolean | undefined>;
    readonly default: undefined;
  };
  readonly clearable: BooleanConstructor;
  readonly clearCreatedOptionsOnClear: {
    readonly type: BooleanConstructor;
    readonly default: true;
  };
  readonly clearFilterAfterSelect: {
    readonly type: BooleanConstructor;
    readonly default: true;
  };
  readonly options: {
    readonly type: PropType<SelectMixedOption[]>;
    readonly default: () => never[];
  };
  readonly defaultValue: {
    readonly type: PropType<Value | null>;
    readonly default: null;
  };
  readonly keyboard: {
    readonly type: BooleanConstructor;
    readonly default: true;
  };
  readonly value: PropType<Value | null>;
  readonly placeholder: StringConstructor;
  readonly menuProps: PropType<HTMLAttributes>;
  readonly multiple: BooleanConstructor;
  readonly size: PropType<SelectSize>;
  readonly menuSize: {
    readonly type: PropType<SelectSize>;
  };
  readonly filterable: BooleanConstructor;
  readonly disabled: {
    readonly type: PropType<boolean | undefined>;
    readonly default: undefined;
  };
  readonly remote: BooleanConstructor;
  readonly loading: BooleanConstructor;
  readonly filter: PropType<SelectFilter>;
  readonly placement: {
    readonly type: PropType<FollowerPlacement>;
    readonly default: "bottom-start";
  };
  readonly widthMode: {
    readonly type: StringConstructor;
    readonly default: "trigger";
  };
  readonly tag: BooleanConstructor;
  readonly onCreate: PropType<(label: string) => SelectOption>;
  readonly fallbackOption: {
    readonly type: PropType<SelectFallbackOption | false | undefined>;
    readonly default: undefined;
  };
  readonly show: {
    readonly type: PropType<boolean | undefined>;
    readonly default: undefined;
  };
  readonly showArrow: {
    readonly type: BooleanConstructor;
    readonly default: true;
  };
  readonly maxTagCount: PropType<number | "responsive">;
  readonly ellipsisTagPopoverProps: PropType<PopoverProps>;
  readonly consistentMenuWidth: {
    readonly type: BooleanConstructor;
    readonly default: true;
  };
  readonly virtualScroll: {
    readonly type: BooleanConstructor;
    readonly default: true;
  };
  readonly labelField: {
    readonly type: StringConstructor;
    readonly default: "label";
  };
  readonly valueField: {
    readonly type: StringConstructor;
    readonly default: "value";
  };
  readonly childrenField: {
    readonly type: StringConstructor;
    readonly default: "children";
  };
  readonly renderLabel: PropType<RenderLabel>;
  readonly renderOption: PropType<RenderOption>;
  readonly renderTag: PropType<RenderTag>;
  readonly 'onUpdate:value': PropType<MaybeArray<OnUpdateValue> | undefined>;
  readonly inputProps: PropType<InputHTMLAttributes>;
  readonly nodeProps: PropType<NodeProps>;
  readonly ignoreComposition: {
    readonly type: BooleanConstructor;
    readonly default: true;
  };
  readonly showOnFocus: BooleanConstructor;
  readonly onUpdateValue: PropType<MaybeArray<OnUpdateValue> | undefined>;
  readonly onBlur: PropType<MaybeArray<(e: FocusEvent) => void> | undefined>;
  readonly onClear: PropType<MaybeArray<() => void> | undefined>;
  readonly onFocus: PropType<MaybeArray<(e: FocusEvent) => void> | undefined>;
  readonly onScroll: PropType<MaybeArray<(e: Event) => void> | undefined>;
  readonly onSearch: PropType<MaybeArray<(value: string) => void> | undefined>;
  readonly onUpdateShow: PropType<MaybeArray<(value: boolean) => void>>;
  readonly 'onUpdate:show': PropType<MaybeArray<(value: boolean) => void>>;
  readonly displayDirective: {
    readonly type: PropType<"if" | "show">;
    readonly default: "show";
  };
  readonly resetMenuOnOptionsChange: {
    readonly type: BooleanConstructor;
    readonly default: true;
  };
  readonly status: PropType<FormValidationStatus>;
  readonly showCheckmark: {
    readonly type: BooleanConstructor;
    readonly default: true;
  };
  readonly scrollbarProps: PropType<ScrollbarProps>;
  /** deprecated */
  readonly onChange: PropType<MaybeArray<OnUpdateValue>>;
  readonly items: PropType<SelectMixedOption[]>;
  readonly theme: PropType<SelectTheme>;
  readonly themeOverrides: PropType<SelectThemeOverrides>;
  readonly builtinThemeOverrides: PropType<SelectThemeOverrides>;
};
type SelectProps = ExtractPublicPropTypes<typeof selectProps>;
interface SelectSlots {
  default?: () => VNode[];
  header?: () => VNode[];
  action?: () => VNode[];
  empty?: () => VNode[];
  arrow?: () => VNode[];
}
declare const _default: import("vue").DefineComponent<import("vue").ExtractPropTypes<{
  readonly to: {
    type: PropType<HTMLElement | string | boolean>;
    default: undefined;
  };
  readonly bordered: {
    readonly type: PropType<boolean | undefined>;
    readonly default: undefined;
  };
  readonly clearable: BooleanConstructor;
  readonly clearCreatedOptionsOnClear: {
    readonly type: BooleanConstructor;
    readonly default: true;
  };
  readonly clearFilterAfterSelect: {
    readonly type: BooleanConstructor;
    readonly default: true;
  };
  readonly options: {
    readonly type: PropType<SelectMixedOption[]>;
    readonly default: () => never[];
  };
  readonly defaultValue: {
    readonly type: PropType<Value | null>;
    readonly default: null;
  };
  readonly keyboard: {
    readonly type: BooleanConstructor;
    readonly default: true;
  };
  readonly value: PropType<Value | null>;
  readonly placeholder: StringConstructor;
  readonly menuProps: PropType<HTMLAttributes>;
  readonly multiple: BooleanConstructor;
  readonly size: PropType<SelectSize>;
  readonly menuSize: {
    readonly type: PropType<SelectSize>;
  };
  readonly filterable: BooleanConstructor;
  readonly disabled: {
    readonly type: PropType<boolean | undefined>;
    readonly default: undefined;
  };
  readonly remote: BooleanConstructor;
  readonly loading: BooleanConstructor;
  readonly filter: PropType<SelectFilter>;
  readonly placement: {
    readonly type: PropType<FollowerPlacement>;
    readonly default: "bottom-start";
  };
  readonly widthMode: {
    readonly type: StringConstructor;
    readonly default: "trigger";
  };
  readonly tag: BooleanConstructor;
  readonly onCreate: PropType<(label: string) => SelectOption>;
  readonly fallbackOption: {
    readonly type: PropType<SelectFallbackOption | false | undefined>;
    readonly default: undefined;
  };
  readonly show: {
    readonly type: PropType<boolean | undefined>;
    readonly default: undefined;
  };
  readonly showArrow: {
    readonly type: BooleanConstructor;
    readonly default: true;
  };
  readonly maxTagCount: PropType<number | "responsive">;
  readonly ellipsisTagPopoverProps: PropType<PopoverProps>;
  readonly consistentMenuWidth: {
    readonly type: BooleanConstructor;
    readonly default: true;
  };
  readonly virtualScroll: {
    readonly type: BooleanConstructor;
    readonly default: true;
  };
  readonly labelField: {
    readonly type: StringConstructor;
    readonly default: "label";
  };
  readonly valueField: {
    readonly type: StringConstructor;
    readonly default: "value";
  };
  readonly childrenField: {
    readonly type: StringConstructor;
    readonly default: "children";
  };
  readonly renderLabel: PropType<RenderLabel>;
  readonly renderOption: PropType<RenderOption>;
  readonly renderTag: PropType<RenderTag>;
  readonly 'onUpdate:value': PropType<MaybeArray<OnUpdateValue> | undefined>;
  readonly inputProps: PropType<InputHTMLAttributes>;
  readonly nodeProps: PropType<NodeProps>;
  readonly ignoreComposition: {
    readonly type: BooleanConstructor;
    readonly default: true;
  };
  readonly showOnFocus: BooleanConstructor;
  readonly onUpdateValue: PropType<MaybeArray<OnUpdateValue> | undefined>;
  readonly onBlur: PropType<MaybeArray<(e: FocusEvent) => void> | undefined>;
  readonly onClear: PropType<MaybeArray<() => void> | undefined>;
  readonly onFocus: PropType<MaybeArray<(e: FocusEvent) => void> | undefined>;
  readonly onScroll: PropType<MaybeArray<(e: Event) => void> | undefined>;
  readonly onSearch: PropType<MaybeArray<(value: string) => void> | undefined>;
  readonly onUpdateShow: PropType<MaybeArray<(value: boolean) => void>>;
  readonly 'onUpdate:show': PropType<MaybeArray<(value: boolean) => void>>;
  readonly displayDirective: {
    readonly type: PropType<"if" | "show">;
    readonly default: "show";
  };
  readonly resetMenuOnOptionsChange: {
    readonly type: BooleanConstructor;
    readonly default: true;
  };
  readonly status: PropType<FormValidationStatus>;
  readonly showCheckmark: {
    readonly type: BooleanConstructor;
    readonly default: true;
  };
  readonly scrollbarProps: PropType<ScrollbarProps>;
  /** deprecated */
  readonly onChange: PropType<MaybeArray<OnUpdateValue>>;
  readonly items: PropType<SelectMixedOption[]>;
  readonly theme: PropType<SelectTheme>;
  readonly themeOverrides: PropType<SelectThemeOverrides>;
  readonly builtinThemeOverrides: PropType<SelectThemeOverrides>;
}>, {
  mergedStatus: import("vue").ComputedRef<FormValidationStatus | undefined>;
  mergedClsPrefix: Ref<string, string>;
  mergedBordered: import("vue").ComputedRef<boolean>;
  namespace: import("vue").ComputedRef<string | undefined>;
  treeMate: import("vue").ComputedRef<import("treemate").TreeMate<SelectOption, SelectGroupOption, SelectIgnoredOption>>;
  isMounted: Readonly<Ref<boolean, boolean>>;
  triggerRef: unknown;
  menuRef: unknown;
  pattern: Ref<string, string>;
  uncontrolledShow: Ref<boolean, boolean>;
  mergedShow: import("vue").ComputedRef<boolean>;
  adjustedTo: import("vue").ComputedRef<string | HTMLElement>;
  uncontrolledValue: Ref<string[] | number[] | ValueAtom | ValueAtom[] | null, string | number | string[] | number[] | ValueAtom[] | ValueAtom[] | null>;
  mergedValue: import("vue").ComputedRef<string | number | string[] | number[] | ValueAtom[] | ValueAtom[] | null>;
  followerRef: unknown;
  localizedPlaceholder: import("vue").ComputedRef<string>;
  selectedOption: import("vue").ComputedRef<SelectOption | null>;
  selectedOptions: import("vue").ComputedRef<SelectOption[] | null>;
  mergedSize: import("vue").ComputedRef<SelectSize>;
  mergedDisabled: import("vue").ComputedRef<boolean>;
  focused: Ref<boolean, boolean>;
  activeWithoutMenuOpen: Ref<boolean, boolean>;
  inlineThemeDisabled: boolean | undefined;
  onTriggerInputFocus: () => void;
  onTriggerInputBlur: () => void;
  handleTriggerOrMenuResize: () => void;
  handleMenuFocus: () => void;
  handleMenuBlur: (e: FocusEvent) => void;
  handleMenuTabOut: () => void;
  handleTriggerClick: () => void;
  handleToggle: (tmNode: TreeNode<SelectOption>) => void;
  handleDeleteOption: (option: SelectOption) => void;
  handlePatternInput: (e: InputEvent) => void;
  handleClear: (e: MouseEvent) => void;
  handleTriggerBlur: (e: FocusEvent) => void;
  handleTriggerFocus: (e: FocusEvent) => void;
  handleKeydown: (e: KeyboardEvent) => void;
  handleMenuAfterLeave: () => void;
  handleMenuClickOutside: (e: MouseEvent) => void;
  handleMenuScroll: (e: Event) => void;
  handleMenuKeydown: (e: KeyboardEvent) => void;
  handleMenuMousedown: (e: MouseEvent) => void;
  mergedTheme: import("vue").ComputedRef<{
    common: ThemeCommonVars;
    self: SelectThemeVars;
    peers: {
      InternalSelection: InternalSelectionTheme;
      InternalSelectMenu: InternalSelectMenuTheme;
    };
    peerOverrides: {
      InternalSelection?: {
        peers?: {
          Popover?: ExtractThemeOverrides<PopoverTheme> | undefined;
        } | undefined;
      } | undefined;
      InternalSelectMenu?: {
        peers?: {
          Scrollbar?: ExtractThemeOverrides<ScrollbarTheme> | undefined;
          Empty?: ExtractThemeOverrides<EmptyTheme> | undefined;
        } | undefined;
      } | undefined;
    };
  }>;
  cssVars: Ref<CSSProperties, CSSProperties> | undefined;
  themeClass: Ref<string, string> | undefined;
  onRender: (() => void) | undefined;
  focus: () => void;
  blur: () => void;
  focusInput: () => void;
  blurInput: () => void;
}, {}, {}, {}, import("vue").ComponentOptionsMixin, import("vue").ComponentOptionsMixin, {}, string, import("vue").PublicProps, Readonly<import("vue").ExtractPropTypes<{
  readonly to: {
    type: PropType<HTMLElement | string | boolean>;
    default: undefined;
  };
  readonly bordered: {
    readonly type: PropType<boolean | undefined>;
    readonly default: undefined;
  };
  readonly clearable: BooleanConstructor;
  readonly clearCreatedOptionsOnClear: {
    readonly type: BooleanConstructor;
    readonly default: true;
  };
  readonly clearFilterAfterSelect: {
    readonly type: BooleanConstructor;
    readonly default: true;
  };
  readonly options: {
    readonly type: PropType<SelectMixedOption[]>;
    readonly default: () => never[];
  };
  readonly defaultValue: {
    readonly type: PropType<Value | null>;
    readonly default: null;
  };
  readonly keyboard: {
    readonly type: BooleanConstructor;
    readonly default: true;
  };
  readonly value: PropType<Value | null>;
  readonly placeholder: StringConstructor;
  readonly menuProps: PropType<HTMLAttributes>;
  readonly multiple: BooleanConstructor;
  readonly size: PropType<SelectSize>;
  readonly menuSize: {
    readonly type: PropType<SelectSize>;
  };
  readonly filterable: BooleanConstructor;
  readonly disabled: {
    readonly type: PropType<boolean | undefined>;
    readonly default: undefined;
  };
  readonly remote: BooleanConstructor;
  readonly loading: BooleanConstructor;
  readonly filter: PropType<SelectFilter>;
  readonly placement: {
    readonly type: PropType<FollowerPlacement>;
    readonly default: "bottom-start";
  };
  readonly widthMode: {
    readonly type: StringConstructor;
    readonly default: "trigger";
  };
  readonly tag: BooleanConstructor;
  readonly onCreate: PropType<(label: string) => SelectOption>;
  readonly fallbackOption: {
    readonly type: PropType<SelectFallbackOption | false | undefined>;
    readonly default: undefined;
  };
  readonly show: {
    readonly type: PropType<boolean | undefined>;
    readonly default: undefined;
  };
  readonly showArrow: {
    readonly type: BooleanConstructor;
    readonly default: true;
  };
  readonly maxTagCount: PropType<number | "responsive">;
  readonly ellipsisTagPopoverProps: PropType<PopoverProps>;
  readonly consistentMenuWidth: {
    readonly type: BooleanConstructor;
    readonly default: true;
  };
  readonly virtualScroll: {
    readonly type: BooleanConstructor;
    readonly default: true;
  };
  readonly labelField: {
    readonly type: StringConstructor;
    readonly default: "label";
  };
  readonly valueField: {
    readonly type: StringConstructor;
    readonly default: "value";
  };
  readonly childrenField: {
    readonly type: StringConstructor;
    readonly default: "children";
  };
  readonly renderLabel: PropType<RenderLabel>;
  readonly renderOption: PropType<RenderOption>;
  readonly renderTag: PropType<RenderTag>;
  readonly 'onUpdate:value': PropType<MaybeArray<OnUpdateValue> | undefined>;
  readonly inputProps: PropType<InputHTMLAttributes>;
  readonly nodeProps: PropType<NodeProps>;
  readonly ignoreComposition: {
    readonly type: BooleanConstructor;
    readonly default: true;
  };
  readonly showOnFocus: BooleanConstructor;
  readonly onUpdateValue: PropType<MaybeArray<OnUpdateValue> | undefined>;
  readonly onBlur: PropType<MaybeArray<(e: FocusEvent) => void> | undefined>;
  readonly onClear: PropType<MaybeArray<() => void> | undefined>;
  readonly onFocus: PropType<MaybeArray<(e: FocusEvent) => void> | undefined>;
  readonly onScroll: PropType<MaybeArray<(e: Event) => void> | undefined>;
  readonly onSearch: PropType<MaybeArray<(value: string) => void> | undefined>;
  readonly onUpdateShow: PropType<MaybeArray<(value: boolean) => void>>;
  readonly 'onUpdate:show': PropType<MaybeArray<(value: boolean) => void>>;
  readonly displayDirective: {
    readonly type: PropType<"if" | "show">;
    readonly default: "show";
  };
  readonly resetMenuOnOptionsChange: {
    readonly type: BooleanConstructor;
    readonly default: true;
  };
  readonly status: PropType<FormValidationStatus>;
  readonly showCheckmark: {
    readonly type: BooleanConstructor;
    readonly default: true;
  };
  readonly scrollbarProps: PropType<ScrollbarProps>;
  /** deprecated */
  readonly onChange: PropType<MaybeArray<OnUpdateValue>>;
  readonly items: PropType<SelectMixedOption[]>;
  readonly theme: PropType<SelectTheme>;
  readonly themeOverrides: PropType<SelectThemeOverrides>;
  readonly builtinThemeOverrides: PropType<SelectThemeOverrides>;
}>> & Readonly<{}>, {
  readonly to: string | boolean | HTMLElement;
  readonly loading: boolean;
  readonly bordered: boolean | undefined;
  readonly show: boolean | undefined;
  readonly disabled: boolean | undefined;
  readonly keyboard: boolean;
  readonly tag: boolean;
  readonly clearable: boolean;
  readonly defaultValue: Value | null;
  readonly placement: FollowerPlacement;
  readonly options: SelectMixedOption[];
  readonly showArrow: boolean;
  readonly displayDirective: "show" | "if";
  readonly multiple: boolean;
  readonly filterable: boolean;
  readonly clearFilterAfterSelect: boolean;
  readonly remote: boolean;
  readonly virtualScroll: boolean;
  readonly valueField: string;
  readonly labelField: string;
  readonly childrenField: string;
  readonly clearCreatedOptionsOnClear: boolean;
  readonly widthMode: string;
  readonly fallbackOption: false | SelectFallbackOption | undefined;
  readonly consistentMenuWidth: boolean;
  readonly ignoreComposition: boolean;
  readonly showOnFocus: boolean;
  readonly resetMenuOnOptionsChange: boolean;
  readonly showCheckmark: boolean;
}, SlotsType<SelectSlots>, {}, {}, string, import("vue").ComponentProvideOptions, true, {}, any>;
//#endregion
export { SelectProps, SelectSlots, _default as default, selectProps };