import { FormValidationStatus } from "../../form/src/public-types.js";
import { ThemeCommonVars } from "../../_styles/common/light.js";
import { ExtractPublicPropTypes } from "../../_utils/naive/extract-public-props.js";
import { MaybeArray } from "../../_utils/vue/call.js";
import "../../_utils/index.js";
import { InputTheme } from "../../input/styles/light.js";
import "../../input/styles/index.js";
import { ButtonTheme } from "../../button/styles/light.js";
import "../../button/styles/index.js";
import { TimePickerTheme, TimePickerThemeOverrides, TimePickerThemeVars } from "../styles/light.js";
import "../styles/index.js";
import { IsHourDisabled, IsMinuteDisabled, IsSecondDisabled, ItemValue, OnUpdateFormattedValue, OnUpdateValue } from "./interface.js";
import { TimePickerSize } from "./public-types.js";
import "../../index.js";
import { ExtractThemeOverrides } from "../../_mixins/use-theme.js";
import "../../_mixins/index.js";
import { ScrollbarTheme } from "../../_internal/scrollbar/styles/light.js";
import "../../_internal/scrollbar/styles/index.js";
import { CSSProperties, PropType, Ref, VNode } from "vue";
import { FollowerPlacement } from "vueuc";
//#region src/time-picker/src/TimePicker.d.ts
declare const timePickerProps: {
  to: {
    type: PropType<HTMLElement | string | boolean>;
    default: undefined;
  };
  bordered: {
    type: PropType<boolean | undefined>;
    default: undefined;
  };
  actions: PropType<Array<"clear" | "now" | "confirm"> | null>;
  defaultValue: {
    type: PropType<number | null>;
    default: null;
  };
  defaultFormattedValue: StringConstructor;
  placeholder: StringConstructor;
  placement: {
    type: PropType<FollowerPlacement>;
    default: string;
  };
  value: PropType<number | null>;
  format: {
    type: StringConstructor;
    default: string;
  };
  valueFormat: StringConstructor;
  formattedValue: PropType<string | null>;
  isHourDisabled: PropType<IsHourDisabled>;
  size: PropType<TimePickerSize>;
  isMinuteDisabled: PropType<IsMinuteDisabled>;
  isSecondDisabled: PropType<IsSecondDisabled>;
  inputReadonly: BooleanConstructor;
  clearable: BooleanConstructor;
  status: PropType<FormValidationStatus>;
  'onUpdate:value': PropType<MaybeArray<OnUpdateValue>>;
  onUpdateValue: PropType<MaybeArray<OnUpdateValue>>;
  'onUpdate:show': PropType<MaybeArray<(show: boolean) => void>>;
  onUpdateShow: PropType<MaybeArray<(show: boolean) => void>>;
  onUpdateFormattedValue: PropType<MaybeArray<OnUpdateFormattedValue>>;
  'onUpdate:formattedValue': PropType<MaybeArray<OnUpdateFormattedValue>>;
  onBlur: PropType<MaybeArray<(e: FocusEvent) => void>>;
  onConfirm: PropType<MaybeArray<(value: number & null, formattedValue: string & null) => void>>;
  onClear: PropType<() => void>;
  onFocus: PropType<MaybeArray<(e: FocusEvent) => void>>;
  timeZone: StringConstructor;
  showIcon: {
    type: BooleanConstructor;
    default: boolean;
  };
  disabled: {
    type: PropType<boolean | undefined>;
    default: undefined;
  };
  show: {
    type: PropType<boolean | undefined>;
    default: undefined;
  };
  hours: {
    type: PropType<MaybeArray<number>>;
    validator: (value: MaybeArray<number>) => boolean;
  };
  minutes: {
    type: PropType<MaybeArray<number>>;
    validator: (value: MaybeArray<number>) => boolean;
  };
  seconds: {
    type: PropType<MaybeArray<number>>;
    validator: (value: MaybeArray<number>) => boolean;
  };
  use12Hours: BooleanConstructor;
  stateful: {
    type: BooleanConstructor;
    default: boolean;
  };
  onChange: PropType<MaybeArray<OnUpdateValue> | undefined>;
  theme: PropType<TimePickerTheme>;
  themeOverrides: PropType<TimePickerThemeOverrides>;
  builtinThemeOverrides: PropType<TimePickerThemeOverrides>;
};
type TimePickerProps = ExtractPublicPropTypes<typeof timePickerProps>;
interface TimePickerSlots {
  default?: () => VNode[];
  icon?: () => VNode[];
}
declare const _default: import("vue").DefineComponent<import("vue").ExtractPropTypes<{
  to: {
    type: PropType<HTMLElement | string | boolean>;
    default: undefined;
  };
  bordered: {
    type: PropType<boolean | undefined>;
    default: undefined;
  };
  actions: PropType<Array<"clear" | "now" | "confirm"> | null>;
  defaultValue: {
    type: PropType<number | null>;
    default: null;
  };
  defaultFormattedValue: StringConstructor;
  placeholder: StringConstructor;
  placement: {
    type: PropType<FollowerPlacement>;
    default: string;
  };
  value: PropType<number | null>;
  format: {
    type: StringConstructor;
    default: string;
  };
  valueFormat: StringConstructor;
  formattedValue: PropType<string | null>;
  isHourDisabled: PropType<IsHourDisabled>;
  size: PropType<TimePickerSize>;
  isMinuteDisabled: PropType<IsMinuteDisabled>;
  isSecondDisabled: PropType<IsSecondDisabled>;
  inputReadonly: BooleanConstructor;
  clearable: BooleanConstructor;
  status: PropType<FormValidationStatus>;
  'onUpdate:value': PropType<MaybeArray<OnUpdateValue>>;
  onUpdateValue: PropType<MaybeArray<OnUpdateValue>>;
  'onUpdate:show': PropType<MaybeArray<(show: boolean) => void>>;
  onUpdateShow: PropType<MaybeArray<(show: boolean) => void>>;
  onUpdateFormattedValue: PropType<MaybeArray<OnUpdateFormattedValue>>;
  'onUpdate:formattedValue': PropType<MaybeArray<OnUpdateFormattedValue>>;
  onBlur: PropType<MaybeArray<(e: FocusEvent) => void>>;
  onConfirm: PropType<MaybeArray<(value: number & null, formattedValue: string & null) => void>>;
  onClear: PropType<() => void>;
  onFocus: PropType<MaybeArray<(e: FocusEvent) => void>>;
  timeZone: StringConstructor;
  showIcon: {
    type: BooleanConstructor;
    default: boolean;
  };
  disabled: {
    type: PropType<boolean | undefined>;
    default: undefined;
  };
  show: {
    type: PropType<boolean | undefined>;
    default: undefined;
  };
  hours: {
    type: PropType<MaybeArray<number>>;
    validator: (value: MaybeArray<number>) => boolean;
  };
  minutes: {
    type: PropType<MaybeArray<number>>;
    validator: (value: MaybeArray<number>) => boolean;
  };
  seconds: {
    type: PropType<MaybeArray<number>>;
    validator: (value: MaybeArray<number>) => boolean;
  };
  use12Hours: BooleanConstructor;
  stateful: {
    type: BooleanConstructor;
    default: boolean;
  };
  onChange: PropType<MaybeArray<OnUpdateValue> | undefined>;
  theme: PropType<TimePickerTheme>;
  themeOverrides: PropType<TimePickerThemeOverrides>;
  builtinThemeOverrides: PropType<TimePickerThemeOverrides>;
}>, {
  focus: () => void;
  blur: () => void;
  mergedStatus: import("vue").ComputedRef<FormValidationStatus | undefined>;
  mergedBordered: import("vue").ComputedRef<boolean>;
  mergedClsPrefix: Ref<string, string>;
  namespace: import("vue").ComputedRef<string | undefined>;
  uncontrolledValue: Ref<number | null, number | null>;
  mergedValue: import("vue").ComputedRef<number | null>;
  isMounted: Readonly<Ref<boolean, boolean>>;
  inputInstRef: unknown;
  panelInstRef: unknown;
  adjustedTo: import("vue").ComputedRef<string | HTMLElement>;
  mergedShow: import("vue").ComputedRef<boolean>;
  localizedClear: import("vue").ComputedRef<string>;
  localizedNow: import("vue").ComputedRef<string>;
  localizedPlaceholder: import("vue").ComputedRef<string>;
  localizedNegativeText: import("vue").ComputedRef<string>;
  localizedPositiveText: import("vue").ComputedRef<string>;
  hourInFormat: import("vue").ComputedRef<boolean>;
  minuteInFormat: import("vue").ComputedRef<boolean>;
  secondInFormat: import("vue").ComputedRef<boolean>;
  mergedAttrSize: import("vue").ComputedRef<number>;
  displayTimeString: Ref<string, string>;
  mergedSize: import("vue").ComputedRef<TimePickerSize>;
  mergedDisabled: import("vue").ComputedRef<boolean>;
  isValueInvalid: import("vue").ComputedRef<boolean>;
  isHourInvalid: import("vue").ComputedRef<boolean>;
  isMinuteInvalid: import("vue").ComputedRef<boolean>;
  isSecondInvalid: import("vue").ComputedRef<boolean>;
  transitionDisabled: Ref<boolean, boolean>;
  hourValue: import("vue").ComputedRef<number | null>;
  minuteValue: import("vue").ComputedRef<number | null>;
  secondValue: import("vue").ComputedRef<number | null>;
  amPmValue: import("vue").ComputedRef<"am" | "pm" | null>;
  handleInputKeydown: (e: KeyboardEvent) => void;
  handleTimeInputFocus: (e: FocusEvent) => void;
  handleTimeInputBlur: (e: FocusEvent) => void;
  handleNowClick: () => void;
  handleConfirmClick: () => void;
  handleTimeInputUpdateValue: (v: string) => void;
  handleMenuFocusOut: (e: FocusEvent) => void;
  handleCancelClick: () => void;
  handleClickOutside: (e: MouseEvent) => void;
  handleTimeInputActivate: () => void;
  handleTimeInputDeactivate: () => void;
  handleHourClick: (hour: ItemValue) => void;
  handleMinuteClick: (minute: ItemValue) => void;
  handleSecondClick: (second: ItemValue) => void;
  handleAmPmClick: (amPm: ItemValue) => void;
  handleTimeInputClear: (e: MouseEvent) => void;
  handleFocusDetectorFocus: () => void;
  handleMenuKeydown: (e: KeyboardEvent) => void;
  handleTriggerClick: (e: MouseEvent) => void;
  mergedTheme: import("vue").ComputedRef<{
    common: ThemeCommonVars;
    self: TimePickerThemeVars;
    peers: {
      Scrollbar: ScrollbarTheme;
      Button: ButtonTheme;
      Input: InputTheme;
    };
    peerOverrides: {
      Scrollbar?: {
        peers?: {
          [x: string]: any;
        } | undefined;
      } | undefined;
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
  triggerCssVars: Ref<CSSProperties, CSSProperties> | undefined;
  triggerThemeClass: Ref<string, string> | undefined;
  triggerOnRender: (() => void) | undefined;
  cssVars: Ref<CSSProperties, CSSProperties> | undefined;
  themeClass: Ref<string, string> | undefined;
  onRender: (() => void) | undefined;
  clearSelectedValue: () => void;
}, {}, {}, {}, import("vue").ComponentOptionsMixin, import("vue").ComponentOptionsMixin, {}, string, import("vue").PublicProps, Readonly<import("vue").ExtractPropTypes<{
  to: {
    type: PropType<HTMLElement | string | boolean>;
    default: undefined;
  };
  bordered: {
    type: PropType<boolean | undefined>;
    default: undefined;
  };
  actions: PropType<Array<"clear" | "now" | "confirm"> | null>;
  defaultValue: {
    type: PropType<number | null>;
    default: null;
  };
  defaultFormattedValue: StringConstructor;
  placeholder: StringConstructor;
  placement: {
    type: PropType<FollowerPlacement>;
    default: string;
  };
  value: PropType<number | null>;
  format: {
    type: StringConstructor;
    default: string;
  };
  valueFormat: StringConstructor;
  formattedValue: PropType<string | null>;
  isHourDisabled: PropType<IsHourDisabled>;
  size: PropType<TimePickerSize>;
  isMinuteDisabled: PropType<IsMinuteDisabled>;
  isSecondDisabled: PropType<IsSecondDisabled>;
  inputReadonly: BooleanConstructor;
  clearable: BooleanConstructor;
  status: PropType<FormValidationStatus>;
  'onUpdate:value': PropType<MaybeArray<OnUpdateValue>>;
  onUpdateValue: PropType<MaybeArray<OnUpdateValue>>;
  'onUpdate:show': PropType<MaybeArray<(show: boolean) => void>>;
  onUpdateShow: PropType<MaybeArray<(show: boolean) => void>>;
  onUpdateFormattedValue: PropType<MaybeArray<OnUpdateFormattedValue>>;
  'onUpdate:formattedValue': PropType<MaybeArray<OnUpdateFormattedValue>>;
  onBlur: PropType<MaybeArray<(e: FocusEvent) => void>>;
  onConfirm: PropType<MaybeArray<(value: number & null, formattedValue: string & null) => void>>;
  onClear: PropType<() => void>;
  onFocus: PropType<MaybeArray<(e: FocusEvent) => void>>;
  timeZone: StringConstructor;
  showIcon: {
    type: BooleanConstructor;
    default: boolean;
  };
  disabled: {
    type: PropType<boolean | undefined>;
    default: undefined;
  };
  show: {
    type: PropType<boolean | undefined>;
    default: undefined;
  };
  hours: {
    type: PropType<MaybeArray<number>>;
    validator: (value: MaybeArray<number>) => boolean;
  };
  minutes: {
    type: PropType<MaybeArray<number>>;
    validator: (value: MaybeArray<number>) => boolean;
  };
  seconds: {
    type: PropType<MaybeArray<number>>;
    validator: (value: MaybeArray<number>) => boolean;
  };
  use12Hours: BooleanConstructor;
  stateful: {
    type: BooleanConstructor;
    default: boolean;
  };
  onChange: PropType<MaybeArray<OnUpdateValue> | undefined>;
  theme: PropType<TimePickerTheme>;
  themeOverrides: PropType<TimePickerThemeOverrides>;
  builtinThemeOverrides: PropType<TimePickerThemeOverrides>;
}>> & Readonly<{}>, {
  to: string | boolean | HTMLElement;
  showIcon: boolean;
  bordered: boolean | undefined;
  clearable: boolean;
  defaultValue: number | null;
  disabled: boolean | undefined;
  placement: FollowerPlacement;
  show: boolean | undefined;
  format: string;
  inputReadonly: boolean;
  use12Hours: boolean;
  stateful: boolean;
}, {}, {}, {}, string, import("vue").ComponentProvideOptions, true, {}, any>;
//#endregion
export { TimePickerProps, TimePickerSlots, _default as default, timePickerProps };