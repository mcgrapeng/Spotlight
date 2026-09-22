import { FormValidationStatus } from "../../form/src/public-types.js";
import { ThemeCommonVars } from "../../_styles/common/light.js";
import { ExtractPublicPropTypes } from "../../_utils/naive/extract-public-props.js";
import { MaybeArray } from "../../_utils/vue/call.js";
import "../../_utils/index.js";
import { InputTheme } from "../../input/styles/light.js";
import "../../input/styles/index.js";
import { ButtonTheme } from "../../button/styles/light.js";
import "../../button/styles/index.js";
import { InputNumberSize } from "./public-types.js";
import { InputNumberTheme, InputNumberThemeOverrides, InputNumberThemeVars } from "../styles/light.js";
import "../styles/index.js";
import { OnUpdateValue, Size } from "./interface.js";
import "../../index.js";
import { ExtractThemeOverrides } from "../../_mixins/use-theme.js";
import "../../_mixins/index.js";
import { ScrollbarTheme } from "../../_internal/scrollbar/styles/light.js";
import "../../_internal/scrollbar/styles/index.js";
import { RtlItem } from "../../config-provider/src/internal-interface.js";
import { InputHTMLAttributes, PropType, SlotsType, VNode } from "vue";
//#region src/input-number/src/InputNumber.d.ts
declare const inputNumberProps: {
  autofocus: BooleanConstructor;
  loading: {
    type: BooleanConstructor;
    default: undefined;
  };
  placeholder: StringConstructor;
  defaultValue: {
    type: PropType<number | null>;
    default: null;
  };
  value: PropType<number | null>;
  step: {
    type: (StringConstructor | NumberConstructor)[];
    default: number;
  };
  min: (StringConstructor | NumberConstructor)[];
  max: (StringConstructor | NumberConstructor)[];
  size: PropType<Size>;
  disabled: {
    type: PropType<boolean | undefined>;
    default: undefined;
  };
  validator: PropType<(value: number) => boolean>;
  bordered: {
    type: PropType<boolean | undefined>;
    default: undefined;
  };
  showButton: {
    type: BooleanConstructor;
    default: boolean;
  };
  buttonPlacement: {
    type: PropType<"right" | "both">;
    default: string;
  };
  inputProps: PropType<InputHTMLAttributes>;
  readonly: BooleanConstructor;
  clearable: BooleanConstructor;
  keyboard: {
    type: PropType<{
      ArrowUp?: boolean;
      ArrowDown?: boolean;
    }>;
    default: {};
  };
  updateValueOnInput: {
    type: BooleanConstructor;
    default: boolean;
  };
  round: {
    type: PropType<boolean | undefined>;
    default: undefined;
  };
  parse: PropType<(input: string) => number | null>;
  format: PropType<(value: number | null) => string>;
  precision: NumberConstructor;
  status: PropType<FormValidationStatus>;
  'onUpdate:value': PropType<MaybeArray<OnUpdateValue>>;
  onUpdateValue: PropType<MaybeArray<OnUpdateValue>>;
  onFocus: PropType<MaybeArray<(e: FocusEvent) => void>>;
  onBlur: PropType<MaybeArray<(e: FocusEvent) => void>>;
  onClear: PropType<MaybeArray<(e: MouseEvent) => void>>;
  onChange: PropType<MaybeArray<OnUpdateValue>>;
  theme: PropType<InputNumberTheme>;
  themeOverrides: PropType<InputNumberThemeOverrides>;
  builtinThemeOverrides: PropType<InputNumberThemeOverrides>;
};
type InputNumberProps = ExtractPublicPropTypes<typeof inputNumberProps>;
interface InputNumberSlots {
  'add-icon'?: () => VNode[];
  'minus-icon'?: () => VNode[];
  prefix?: () => VNode[];
  suffix?: () => VNode[];
}
declare const _default: import("vue").DefineComponent<import("vue").ExtractPropTypes<{
  autofocus: BooleanConstructor;
  loading: {
    type: BooleanConstructor;
    default: undefined;
  };
  placeholder: StringConstructor;
  defaultValue: {
    type: PropType<number | null>;
    default: null;
  };
  value: PropType<number | null>;
  step: {
    type: (StringConstructor | NumberConstructor)[];
    default: number;
  };
  min: (StringConstructor | NumberConstructor)[];
  max: (StringConstructor | NumberConstructor)[];
  size: PropType<Size>;
  disabled: {
    type: PropType<boolean | undefined>;
    default: undefined;
  };
  validator: PropType<(value: number) => boolean>;
  bordered: {
    type: PropType<boolean | undefined>;
    default: undefined;
  };
  showButton: {
    type: BooleanConstructor;
    default: boolean;
  };
  buttonPlacement: {
    type: PropType<"right" | "both">;
    default: string;
  };
  inputProps: PropType<InputHTMLAttributes>;
  readonly: BooleanConstructor;
  clearable: BooleanConstructor;
  keyboard: {
    type: PropType<{
      ArrowUp?: boolean;
      ArrowDown?: boolean;
    }>;
    default: {};
  };
  updateValueOnInput: {
    type: BooleanConstructor;
    default: boolean;
  };
  round: {
    type: PropType<boolean | undefined>;
    default: undefined;
  };
  parse: PropType<(input: string) => number | null>;
  format: PropType<(value: number | null) => string>;
  precision: NumberConstructor;
  status: PropType<FormValidationStatus>;
  'onUpdate:value': PropType<MaybeArray<OnUpdateValue>>;
  onUpdateValue: PropType<MaybeArray<OnUpdateValue>>;
  onFocus: PropType<MaybeArray<(e: FocusEvent) => void>>;
  onBlur: PropType<MaybeArray<(e: FocusEvent) => void>>;
  onClear: PropType<MaybeArray<(e: MouseEvent) => void>>;
  onChange: PropType<MaybeArray<OnUpdateValue>>;
  theme: PropType<InputNumberTheme>;
  themeOverrides: PropType<InputNumberThemeOverrides>;
  builtinThemeOverrides: PropType<InputNumberThemeOverrides>;
}>, {
  rtlEnabled: import("vue").Ref<RtlItem | undefined, RtlItem | undefined> | undefined;
  inputInstRef: unknown;
  minusButtonInstRef: unknown;
  addButtonInstRef: unknown;
  mergedClsPrefix: import("vue").Ref<string, string>;
  mergedBordered: import("vue").ComputedRef<boolean>;
  uncontrolledValue: import("vue").Ref<number | null, number | null>;
  mergedValue: import("vue").ComputedRef<number | null>;
  mergedPlaceholder: import("vue").ComputedRef<string>;
  displayedValueInvalid: import("vue").ComputedRef<boolean>;
  mergedSize: import("vue").ComputedRef<InputNumberSize>;
  mergedDisabled: import("vue").ComputedRef<boolean>;
  displayedValue: import("vue").Ref<string, string>;
  addable: import("vue").ComputedRef<boolean>;
  minusable: import("vue").ComputedRef<boolean>;
  mergedStatus: import("vue").ComputedRef<FormValidationStatus | undefined>;
  handleFocus: (e: FocusEvent) => void;
  handleBlur: (e: FocusEvent) => void;
  handleClear: (e: MouseEvent) => void;
  handleMouseDown: (e: MouseEvent) => void;
  handleAddClick: () => void;
  handleMinusClick: () => void;
  handleAddMousedown: () => void;
  handleMinusMousedown: () => void;
  handleKeyDown: (e: KeyboardEvent) => void;
  handleUpdateDisplayedValue: (value: string) => void;
  mergedTheme: import("vue").ComputedRef<{
    common: ThemeCommonVars;
    self: InputNumberThemeVars;
    peers: {
      Button: ButtonTheme;
      Input: InputTheme;
    };
    peerOverrides: {
      Button?: {
        peers?: {
          [x: string]: any;
        } | undefined;
      } | undefined;
      Input?: {
        peers?: {
          Scrollbar?: ExtractThemeOverrides<ScrollbarTheme> | undefined;
        } | undefined;
      } | undefined;
    };
  }>;
  inputThemeOverrides: {
    paddingSmall: string;
    paddingMedium: string;
    paddingLarge: string;
  };
  buttonThemeOverrides: import("vue").ComputedRef<{
    textColorTextDisabled: string;
    opacityDisabled: string;
  }>;
  focus: () => void;
  blur: () => void;
  select: () => void;
}, {}, {}, {}, import("vue").ComponentOptionsMixin, import("vue").ComponentOptionsMixin, {}, string, import("vue").PublicProps, Readonly<import("vue").ExtractPropTypes<{
  autofocus: BooleanConstructor;
  loading: {
    type: BooleanConstructor;
    default: undefined;
  };
  placeholder: StringConstructor;
  defaultValue: {
    type: PropType<number | null>;
    default: null;
  };
  value: PropType<number | null>;
  step: {
    type: (StringConstructor | NumberConstructor)[];
    default: number;
  };
  min: (StringConstructor | NumberConstructor)[];
  max: (StringConstructor | NumberConstructor)[];
  size: PropType<Size>;
  disabled: {
    type: PropType<boolean | undefined>;
    default: undefined;
  };
  validator: PropType<(value: number) => boolean>;
  bordered: {
    type: PropType<boolean | undefined>;
    default: undefined;
  };
  showButton: {
    type: BooleanConstructor;
    default: boolean;
  };
  buttonPlacement: {
    type: PropType<"right" | "both">;
    default: string;
  };
  inputProps: PropType<InputHTMLAttributes>;
  readonly: BooleanConstructor;
  clearable: BooleanConstructor;
  keyboard: {
    type: PropType<{
      ArrowUp?: boolean;
      ArrowDown?: boolean;
    }>;
    default: {};
  };
  updateValueOnInput: {
    type: BooleanConstructor;
    default: boolean;
  };
  round: {
    type: PropType<boolean | undefined>;
    default: undefined;
  };
  parse: PropType<(input: string) => number | null>;
  format: PropType<(value: number | null) => string>;
  precision: NumberConstructor;
  status: PropType<FormValidationStatus>;
  'onUpdate:value': PropType<MaybeArray<OnUpdateValue>>;
  onUpdateValue: PropType<MaybeArray<OnUpdateValue>>;
  onFocus: PropType<MaybeArray<(e: FocusEvent) => void>>;
  onBlur: PropType<MaybeArray<(e: FocusEvent) => void>>;
  onClear: PropType<MaybeArray<(e: MouseEvent) => void>>;
  onChange: PropType<MaybeArray<OnUpdateValue>>;
  theme: PropType<InputNumberTheme>;
  themeOverrides: PropType<InputNumberThemeOverrides>;
  builtinThemeOverrides: PropType<InputNumberThemeOverrides>;
}>> & Readonly<{}>, {
  bordered: boolean | undefined;
  loading: boolean;
  clearable: boolean;
  defaultValue: number | null;
  disabled: boolean | undefined;
  round: boolean | undefined;
  keyboard: {
    ArrowUp?: boolean;
    ArrowDown?: boolean;
  };
  readonly: boolean;
  autofocus: boolean;
  step: string | number;
  showButton: boolean;
  buttonPlacement: "right" | "both";
  updateValueOnInput: boolean;
}, SlotsType<InputNumberSlots>, {}, {}, string, import("vue").ComponentProvideOptions, true, {}, any>;
//#endregion
export { InputNumberProps, InputNumberSlots, _default as default, inputNumberProps };