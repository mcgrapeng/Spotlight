import { FormValidationStatus } from "../../form/src/public-types.js";
import { ThemeCommonVars } from "../../_styles/common/light.js";
import { ExtractPublicPropTypes } from "../../_utils/naive/extract-public-props.js";
import { MaybeArray } from "../../_utils/vue/call.js";
import "../../_utils/index.js";
import { EmptyTheme } from "../../empty/styles/light.js";
import "../../empty/styles/index.js";
import { InternalSelectMenuTheme } from "../../_internal/select-menu/styles/light.js";
import "../../_internal/select-menu/styles/index.js";
import { InputTheme } from "../../input/styles/light.js";
import "../../input/styles/index.js";
import { AutoCompleteTheme, AutoCompleteThemeOverrides, AutoCompleteThemeVars } from "../styles/light.js";
import "../styles/index.js";
import { ScrollbarProps } from "../../_internal/scrollbar/src/Scrollbar.js";
import { SelectBaseOption, SelectGroupOption, SelectIgnoredOption } from "../../select/src/interface.js";
import { RenderLabel, RenderOption } from "../../_internal/select-menu/src/interface.js";
import "../../_internal/index.js";
import { AutoCompleteDefaultSlotProps, AutoCompleteOptions, OnSelect, OnUpdateValue } from "./interface.js";
import { AutoCompleteSize } from "./public-types.js";
import "../../index.js";
import { ExtractThemeOverrides } from "../../_mixins/use-theme.js";
import "../../_mixins/index.js";
import { ScrollbarTheme } from "../../_internal/scrollbar/styles/light.js";
import "../../_internal/scrollbar/styles/index.js";
import { CSSProperties, HTMLAttributes, InputHTMLAttributes, PropType, Ref, SlotsType, VNode } from "vue";
import { FollowerPlacement } from "vueuc";
import { TreeNode } from "treemate";
//#region src/auto-complete/src/AutoComplete.d.ts
declare const autoCompleteProps: {
  readonly to: {
    type: PropType<HTMLElement | string | boolean>;
    default: undefined;
  };
  readonly menuProps: PropType<HTMLAttributes>;
  readonly append: BooleanConstructor;
  readonly bordered: {
    readonly type: PropType<boolean | undefined>;
    readonly default: undefined;
  };
  readonly clearable: {
    readonly type: BooleanConstructor;
    readonly default: undefined;
  };
  readonly defaultValue: {
    readonly type: PropType<string | null>;
    readonly default: null;
  };
  readonly loading: {
    readonly type: BooleanConstructor;
    readonly default: undefined;
  };
  readonly disabled: {
    readonly type: PropType<boolean | undefined>;
    readonly default: undefined;
  };
  readonly placeholder: StringConstructor;
  readonly placement: {
    readonly type: PropType<FollowerPlacement>;
    readonly default: "bottom-start";
  };
  readonly value: StringConstructor;
  readonly blurAfterSelect: BooleanConstructor;
  readonly clearAfterSelect: BooleanConstructor;
  readonly getShow: PropType<(inputValue: string) => boolean>;
  readonly showEmpty: BooleanConstructor;
  readonly inputProps: PropType<InputHTMLAttributes>;
  readonly renderOption: PropType<RenderOption>;
  readonly renderLabel: PropType<RenderLabel>;
  readonly size: PropType<AutoCompleteSize>;
  readonly options: {
    readonly type: PropType<AutoCompleteOptions>;
    readonly default: () => never[];
  };
  readonly zIndex: NumberConstructor;
  readonly status: PropType<FormValidationStatus>;
  readonly 'onUpdate:value': PropType<MaybeArray<OnUpdateValue>>;
  readonly onUpdateValue: PropType<MaybeArray<OnUpdateValue>>;
  readonly onSelect: PropType<MaybeArray<OnSelect>>;
  readonly onBlur: PropType<MaybeArray<(e: FocusEvent) => void>>;
  readonly onFocus: PropType<MaybeArray<(e: FocusEvent) => void>>;
  readonly scrollbarProps: PropType<ScrollbarProps>;
  readonly onInput: PropType<MaybeArray<OnUpdateValue> | undefined>;
  readonly theme: PropType<AutoCompleteTheme>;
  readonly themeOverrides: PropType<AutoCompleteThemeOverrides>;
  readonly builtinThemeOverrides: PropType<AutoCompleteThemeOverrides>;
};
type AutoCompleteProps = ExtractPublicPropTypes<typeof autoCompleteProps>;
interface AutoCompleteSlots {
  default?: (options: AutoCompleteDefaultSlotProps) => VNode[];
  empty?: () => VNode[];
  prefix?: () => VNode[];
  suffix?: () => VNode[];
}
declare const _default: import("vue").DefineComponent<import("vue").ExtractPropTypes<{
  readonly to: {
    type: PropType<HTMLElement | string | boolean>;
    default: undefined;
  };
  readonly menuProps: PropType<HTMLAttributes>;
  readonly append: BooleanConstructor;
  readonly bordered: {
    readonly type: PropType<boolean | undefined>;
    readonly default: undefined;
  };
  readonly clearable: {
    readonly type: BooleanConstructor;
    readonly default: undefined;
  };
  readonly defaultValue: {
    readonly type: PropType<string | null>;
    readonly default: null;
  };
  readonly loading: {
    readonly type: BooleanConstructor;
    readonly default: undefined;
  };
  readonly disabled: {
    readonly type: PropType<boolean | undefined>;
    readonly default: undefined;
  };
  readonly placeholder: StringConstructor;
  readonly placement: {
    readonly type: PropType<FollowerPlacement>;
    readonly default: "bottom-start";
  };
  readonly value: StringConstructor;
  readonly blurAfterSelect: BooleanConstructor;
  readonly clearAfterSelect: BooleanConstructor;
  readonly getShow: PropType<(inputValue: string) => boolean>;
  readonly showEmpty: BooleanConstructor;
  readonly inputProps: PropType<InputHTMLAttributes>;
  readonly renderOption: PropType<RenderOption>;
  readonly renderLabel: PropType<RenderLabel>;
  readonly size: PropType<AutoCompleteSize>;
  readonly options: {
    readonly type: PropType<AutoCompleteOptions>;
    readonly default: () => never[];
  };
  readonly zIndex: NumberConstructor;
  readonly status: PropType<FormValidationStatus>;
  readonly 'onUpdate:value': PropType<MaybeArray<OnUpdateValue>>;
  readonly onUpdateValue: PropType<MaybeArray<OnUpdateValue>>;
  readonly onSelect: PropType<MaybeArray<OnSelect>>;
  readonly onBlur: PropType<MaybeArray<(e: FocusEvent) => void>>;
  readonly onFocus: PropType<MaybeArray<(e: FocusEvent) => void>>;
  readonly scrollbarProps: PropType<ScrollbarProps>;
  readonly onInput: PropType<MaybeArray<OnUpdateValue> | undefined>;
  readonly theme: PropType<AutoCompleteTheme>;
  readonly themeOverrides: PropType<AutoCompleteThemeOverrides>;
  readonly builtinThemeOverrides: PropType<AutoCompleteThemeOverrides>;
}>, {
  focus: () => void;
  blur: () => void;
  inputInstRef: unknown;
  uncontrolledValue: Ref<string | null, string | null>;
  mergedValue: import("vue").ComputedRef<string | null>;
  isMounted: Readonly<Ref<boolean, boolean>>;
  adjustedTo: import("vue").ComputedRef<string | HTMLElement>;
  menuInstRef: unknown;
  triggerElRef: Ref<HTMLElement | null, HTMLElement | null>;
  treeMate: import("vue").ComputedRef<import("treemate").TreeMate<SelectBaseOption<string | number, string | ((option: SelectBaseOption<string | number, string | /*elided*/ any>, selected: boolean) => import("vue").VNodeChild)>, SelectGroupOption, SelectIgnoredOption>>;
  mergedSize: import("vue").ComputedRef<AutoCompleteSize>;
  mergedDisabled: import("vue").ComputedRef<boolean>;
  active: import("vue").ComputedRef<boolean>;
  mergedStatus: import("vue").ComputedRef<FormValidationStatus | undefined>;
  handleClear: () => void;
  handleFocus: (e: FocusEvent) => void;
  handleBlur: (e: FocusEvent) => void;
  handleInput: (value: string) => void;
  handleToggle: (option: TreeNode<SelectBaseOption>) => void;
  handleClickOutsideMenu: (e: MouseEvent) => void;
  handleCompositionStart: () => void;
  handleCompositionEnd: () => void;
  handleKeyDown: (e: KeyboardEvent) => void;
  mergedTheme: import("vue").ComputedRef<{
    common: ThemeCommonVars;
    self: AutoCompleteThemeVars;
    peers: {
      InternalSelectMenu: InternalSelectMenuTheme;
      Input: InputTheme;
    };
    peerOverrides: {
      InternalSelectMenu?: {
        peers?: {
          Scrollbar?: ExtractThemeOverrides<ScrollbarTheme> | undefined;
          Empty?: ExtractThemeOverrides<EmptyTheme> | undefined;
        } | undefined;
      } | undefined;
      Input?: {
        peers?: {
          Scrollbar?: ExtractThemeOverrides<ScrollbarTheme> | undefined;
        } | undefined;
      } | undefined;
    };
  }>;
  cssVars: Ref<CSSProperties, CSSProperties> | undefined;
  themeClass: Ref<string, string> | undefined;
  onRender: (() => void) | undefined;
  mergedBordered: import("vue").ComputedRef<boolean>;
  namespace: import("vue").ComputedRef<string | undefined>;
  mergedClsPrefix: Ref<string, string>;
}, {}, {}, {}, import("vue").ComponentOptionsMixin, import("vue").ComponentOptionsMixin, {}, string, import("vue").PublicProps, Readonly<import("vue").ExtractPropTypes<{
  readonly to: {
    type: PropType<HTMLElement | string | boolean>;
    default: undefined;
  };
  readonly menuProps: PropType<HTMLAttributes>;
  readonly append: BooleanConstructor;
  readonly bordered: {
    readonly type: PropType<boolean | undefined>;
    readonly default: undefined;
  };
  readonly clearable: {
    readonly type: BooleanConstructor;
    readonly default: undefined;
  };
  readonly defaultValue: {
    readonly type: PropType<string | null>;
    readonly default: null;
  };
  readonly loading: {
    readonly type: BooleanConstructor;
    readonly default: undefined;
  };
  readonly disabled: {
    readonly type: PropType<boolean | undefined>;
    readonly default: undefined;
  };
  readonly placeholder: StringConstructor;
  readonly placement: {
    readonly type: PropType<FollowerPlacement>;
    readonly default: "bottom-start";
  };
  readonly value: StringConstructor;
  readonly blurAfterSelect: BooleanConstructor;
  readonly clearAfterSelect: BooleanConstructor;
  readonly getShow: PropType<(inputValue: string) => boolean>;
  readonly showEmpty: BooleanConstructor;
  readonly inputProps: PropType<InputHTMLAttributes>;
  readonly renderOption: PropType<RenderOption>;
  readonly renderLabel: PropType<RenderLabel>;
  readonly size: PropType<AutoCompleteSize>;
  readonly options: {
    readonly type: PropType<AutoCompleteOptions>;
    readonly default: () => never[];
  };
  readonly zIndex: NumberConstructor;
  readonly status: PropType<FormValidationStatus>;
  readonly 'onUpdate:value': PropType<MaybeArray<OnUpdateValue>>;
  readonly onUpdateValue: PropType<MaybeArray<OnUpdateValue>>;
  readonly onSelect: PropType<MaybeArray<OnSelect>>;
  readonly onBlur: PropType<MaybeArray<(e: FocusEvent) => void>>;
  readonly onFocus: PropType<MaybeArray<(e: FocusEvent) => void>>;
  readonly scrollbarProps: PropType<ScrollbarProps>;
  readonly onInput: PropType<MaybeArray<OnUpdateValue> | undefined>;
  readonly theme: PropType<AutoCompleteTheme>;
  readonly themeOverrides: PropType<AutoCompleteThemeOverrides>;
  readonly builtinThemeOverrides: PropType<AutoCompleteThemeOverrides>;
}>> & Readonly<{}>, {
  readonly to: string | boolean | HTMLElement;
  readonly bordered: boolean | undefined;
  readonly loading: boolean;
  readonly append: boolean;
  readonly clearable: boolean;
  readonly defaultValue: string | null;
  readonly disabled: boolean | undefined;
  readonly placement: FollowerPlacement;
  readonly blurAfterSelect: boolean;
  readonly clearAfterSelect: boolean;
  readonly showEmpty: boolean;
  readonly options: AutoCompleteOptions;
}, SlotsType<AutoCompleteSlots>, {}, {}, string, import("vue").ComponentProvideOptions, true, {}, any>;
//#endregion
export { AutoCompleteProps, AutoCompleteSlots, autoCompleteProps, _default as default };