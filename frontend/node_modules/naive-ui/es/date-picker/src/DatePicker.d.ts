import { FormValidationStatus } from "../../form/src/public-types.js";
import { ThemeCommonVars } from "../../_styles/common/light.js";
import { MaybeArray } from "../../_utils/vue/call.js";
import "../../_utils/index.js";
import { InputTheme } from "../../input/styles/light.js";
import "../../input/styles/index.js";
import { ButtonTheme } from "../../button/styles/light.js";
import "../../button/styles/index.js";
import { TimePickerTheme } from "../../time-picker/styles/light.js";
import "../../time-picker/styles/index.js";
import { TimePickerProps } from "../../time-picker/src/TimePicker.js";
import { DatePickerTheme, DatePickerThemeOverrides, DatePickerThemeVars } from "../styles/light.js";
import { DatePickerType } from "./config.js";
import "../styles/index.js";
import { datePickerProps } from "./props.js";
import { DatePickerSize } from "./public-types.js";
import { DefaultTime, FirstDayOfWeek, FormattedValue, IsDateDisabled, IsTimeDisabled, OnConfirm, OnUpdateFormattedValue, OnUpdateValue, Shortcuts, Value } from "./interface.js";
import "../../index.js";
import { ExtractThemeOverrides } from "../../_mixins/use-theme.js";
import "../../_mixins/index.js";
import { ScrollbarTheme } from "../../_internal/scrollbar/styles/light.js";
import "../../_internal/scrollbar/styles/index.js";
import { CSSProperties, ExtractPropTypes, Ref, SlotsType, VNode } from "vue";
//#region src/date-picker/src/DatePicker.d.ts
type DatePickerSetupProps = ExtractPropTypes<typeof datePickerProps>;
interface DatePickerSlots {
  'date-icon'?: () => VNode[];
  footer?: () => VNode[];
  'next-month'?: () => VNode[];
  'next-year'?: () => VNode[];
  'prev-month'?: () => VNode[];
  'prev-year'?: () => VNode[];
  separator?: () => VNode[];
  confirm?: (props: {
    onConfirm: () => void;
    disabled: boolean;
    text: string;
  }) => VNode[];
  clear?: (props: {
    onClear: () => void;
    text: string;
  }) => VNode[];
  now?: (props: {
    onNow: () => void;
    text: string;
  }) => VNode[];
}
declare const _default: import("vue").DefineComponent<ExtractPropTypes<{
  readonly to: {
    type: import("vue").PropType<HTMLElement | string | boolean>;
    default: undefined;
  };
  readonly bordered: {
    readonly type: import("vue").PropType<boolean | undefined>;
    readonly default: undefined;
  };
  readonly clearable: BooleanConstructor;
  readonly fastYearSelect: BooleanConstructor;
  readonly fastMonthSelect: BooleanConstructor;
  readonly updateValueOnClose: BooleanConstructor;
  readonly calendarDayFormat: StringConstructor;
  readonly calendarHeaderYearFormat: StringConstructor;
  readonly calendarHeaderMonthFormat: StringConstructor;
  readonly calendarHeaderMonthYearSeparator: {
    readonly type: StringConstructor;
    readonly default: " ";
  };
  readonly calendarHeaderMonthBeforeYear: {
    readonly type: BooleanConstructor;
    readonly default: undefined;
  };
  readonly defaultValue: import("vue").PropType<Value | null>;
  readonly defaultFormattedValue: import("vue").PropType<FormattedValue | null>;
  readonly defaultTime: import("vue").PropType<DefaultTime>;
  readonly disabled: {
    readonly type: import("vue").PropType<boolean | undefined>;
    readonly default: undefined;
  };
  readonly placement: {
    readonly type: import("vue").PropType<import("vueuc").FollowerPlacement>;
    readonly default: "bottom-start";
  };
  readonly value: import("vue").PropType<Value | null>;
  readonly formattedValue: import("vue").PropType<FormattedValue | null>;
  readonly size: import("vue").PropType<DatePickerSize>;
  readonly type: {
    readonly type: import("vue").PropType<DatePickerType>;
    readonly default: "date";
  };
  readonly valueFormat: StringConstructor;
  readonly separator: StringConstructor;
  readonly placeholder: StringConstructor;
  readonly startPlaceholder: StringConstructor;
  readonly endPlaceholder: StringConstructor;
  readonly format: StringConstructor;
  readonly dateFormat: StringConstructor;
  readonly timePickerFormat: StringConstructor;
  readonly actions: import("vue").PropType<Array<"clear" | "confirm" | "now"> | null>;
  readonly shortcuts: import("vue").PropType<Shortcuts>;
  readonly isDateDisabled: import("vue").PropType<IsDateDisabled>;
  readonly isTimeDisabled: import("vue").PropType<IsTimeDisabled>;
  readonly show: {
    readonly type: import("vue").PropType<boolean | undefined>;
    readonly default: undefined;
  };
  readonly panel: BooleanConstructor;
  readonly ranges: import("vue").PropType<Record<string, [number, number]>>;
  readonly firstDayOfWeek: import("vue").PropType<FirstDayOfWeek>;
  readonly inputReadonly: BooleanConstructor;
  readonly closeOnSelect: BooleanConstructor;
  readonly status: import("vue").PropType<FormValidationStatus>;
  readonly timePickerProps: import("vue").PropType<TimePickerProps | [TimePickerProps, TimePickerProps]>;
  readonly onClear: import("vue").PropType<() => void>;
  readonly onConfirm: import("vue").PropType<OnConfirm>;
  readonly defaultCalendarStartTime: NumberConstructor;
  readonly defaultCalendarEndTime: NumberConstructor;
  readonly bindCalendarMonths: BooleanConstructor;
  readonly monthFormat: {
    readonly type: StringConstructor;
    readonly default: "M";
  };
  readonly yearFormat: {
    readonly type: StringConstructor;
    readonly default: "y";
  };
  readonly quarterFormat: {
    readonly type: StringConstructor;
    readonly default: "'Q'Q";
  };
  readonly yearRange: {
    readonly type: import("vue").PropType<[number, number]>;
    readonly default: () => [number, number];
  };
  readonly 'onUpdate:show': import("vue").PropType<MaybeArray<(show: boolean) => void>>;
  readonly onUpdateShow: import("vue").PropType<MaybeArray<(show: boolean) => void>>;
  readonly 'onUpdate:formattedValue': import("vue").PropType<MaybeArray<OnUpdateFormattedValue>>;
  readonly onUpdateFormattedValue: import("vue").PropType<MaybeArray<OnUpdateFormattedValue>>;
  readonly 'onUpdate:value': import("vue").PropType<MaybeArray<OnUpdateValue>>;
  readonly onUpdateValue: import("vue").PropType<MaybeArray<OnUpdateValue>>;
  readonly onFocus: import("vue").PropType<(e: FocusEvent) => void>;
  readonly onBlur: import("vue").PropType<(e: FocusEvent) => void>;
  readonly onNextMonth: import("vue").PropType<() => void>;
  readonly onPrevMonth: import("vue").PropType<() => void>;
  readonly onNextYear: import("vue").PropType<() => void>;
  readonly onPrevYear: import("vue").PropType<() => void>;
  readonly onChange: import("vue").PropType<MaybeArray<OnUpdateValue>>;
  readonly theme: import("vue").PropType<DatePickerTheme>;
  readonly themeOverrides: import("vue").PropType<DatePickerThemeOverrides>;
  readonly builtinThemeOverrides: import("vue").PropType<DatePickerThemeOverrides>;
}>, {
  mergedStatus: import("vue").ComputedRef<FormValidationStatus | undefined>;
  mergedClsPrefix: Ref<string, string>;
  mergedBordered: import("vue").ComputedRef<boolean>;
  namespace: import("vue").ComputedRef<string | undefined>;
  uncontrolledValue: Ref<Value | null, Value | null>;
  pendingValue: Ref<Value | null, Value | null>;
  panelInstRef: unknown;
  triggerElRef: Ref<HTMLElement | null, HTMLElement | null>;
  inputInstRef: unknown;
  isMounted: Readonly<Ref<boolean, boolean>>;
  displayTime: Ref<string, string>;
  displayStartTime: Ref<string, string>;
  displayEndTime: Ref<string, string>;
  mergedShow: import("vue").ComputedRef<boolean>;
  adjustedTo: import("vue").ComputedRef<string | HTMLElement>;
  isRange: import("vue").ComputedRef<boolean>;
  localizedStartPlaceholder: import("vue").ComputedRef<string>;
  localizedEndPlaceholder: import("vue").ComputedRef<string>;
  mergedSize: import("vue").ComputedRef<DatePickerSize>;
  mergedDisabled: import("vue").ComputedRef<boolean>;
  localizedPlacehoder: import("vue").ComputedRef<string>;
  isValueInvalid: import("vue").ComputedRef<boolean>;
  isStartValueInvalid: import("vue").ComputedRef<boolean>;
  isEndValueInvalid: import("vue").ComputedRef<boolean>;
  handleInputKeydown: (e: KeyboardEvent) => void;
  handleClickOutside: (e: MouseEvent) => void;
  handleKeydown: (e: KeyboardEvent) => void;
  handleClear: () => void;
  handlePanelClear: () => void;
  handleTriggerClick: (e: MouseEvent) => void;
  handleInputActivate: () => void;
  handleInputDeactivate: () => void;
  handleInputFocus: (e: FocusEvent) => void;
  handleInputBlur: (e: FocusEvent) => void;
  handlePanelTabOut: () => void;
  handlePanelClose: (disableUpdateOnClose: boolean) => void;
  handleRangeUpdateValue: (v: [string, string], { source }: {
    source: 0 | 1 | "clear";
  }) => void;
  handleSingleUpdateValue: (v: string) => void;
  handlePanelUpdateValue: (value: Value | null, doUpdate: boolean) => void;
  handlePanelConfirm: () => void;
  mergedTheme: import("vue").ComputedRef<{
    common: ThemeCommonVars;
    self: DatePickerThemeVars;
    peers: {
      Input: InputTheme;
      Button: ButtonTheme;
      TimePicker: TimePickerTheme;
      Scrollbar: ScrollbarTheme;
    };
    peerOverrides: {
      Input?: {
        peers?: {
          Scrollbar?: ExtractThemeOverrides<ScrollbarTheme> | undefined;
        } | undefined;
      } | undefined;
      Button?: {
        peers?: {
          [x: string]: any;
        } | undefined;
      } | undefined;
      TimePicker?: {
        peers?: {
          Scrollbar?: ExtractThemeOverrides<ScrollbarTheme> | undefined;
          Button?: ExtractThemeOverrides<ButtonTheme> | undefined;
          Input?: ExtractThemeOverrides<InputTheme> | undefined;
        } | undefined;
      } | undefined;
      Scrollbar?: {
        peers?: {
          [x: string]: any;
        } | undefined;
      } | undefined;
    };
  }>;
  actions: import("vue").ComputedRef<string[] | undefined>;
  triggerCssVars: Ref<CSSProperties, CSSProperties> | undefined;
  triggerThemeClass: Ref<string, string> | undefined;
  triggerOnRender: (() => void) | undefined;
  cssVars: Ref<CSSProperties, CSSProperties> | undefined;
  themeClass: Ref<string, string> | undefined;
  onRender: (() => void) | undefined;
  onNextMonth: (() => void) | undefined;
  onPrevMonth: (() => void) | undefined;
  onNextYear: (() => void) | undefined;
  onPrevYear: (() => void) | undefined;
  focus: () => void;
  blur: () => void;
}, {}, {}, {}, import("vue").ComponentOptionsMixin, import("vue").ComponentOptionsMixin, {}, string, import("vue").PublicProps, Readonly<ExtractPropTypes<{
  readonly to: {
    type: import("vue").PropType<HTMLElement | string | boolean>;
    default: undefined;
  };
  readonly bordered: {
    readonly type: import("vue").PropType<boolean | undefined>;
    readonly default: undefined;
  };
  readonly clearable: BooleanConstructor;
  readonly fastYearSelect: BooleanConstructor;
  readonly fastMonthSelect: BooleanConstructor;
  readonly updateValueOnClose: BooleanConstructor;
  readonly calendarDayFormat: StringConstructor;
  readonly calendarHeaderYearFormat: StringConstructor;
  readonly calendarHeaderMonthFormat: StringConstructor;
  readonly calendarHeaderMonthYearSeparator: {
    readonly type: StringConstructor;
    readonly default: " ";
  };
  readonly calendarHeaderMonthBeforeYear: {
    readonly type: BooleanConstructor;
    readonly default: undefined;
  };
  readonly defaultValue: import("vue").PropType<Value | null>;
  readonly defaultFormattedValue: import("vue").PropType<FormattedValue | null>;
  readonly defaultTime: import("vue").PropType<DefaultTime>;
  readonly disabled: {
    readonly type: import("vue").PropType<boolean | undefined>;
    readonly default: undefined;
  };
  readonly placement: {
    readonly type: import("vue").PropType<import("vueuc").FollowerPlacement>;
    readonly default: "bottom-start";
  };
  readonly value: import("vue").PropType<Value | null>;
  readonly formattedValue: import("vue").PropType<FormattedValue | null>;
  readonly size: import("vue").PropType<DatePickerSize>;
  readonly type: {
    readonly type: import("vue").PropType<DatePickerType>;
    readonly default: "date";
  };
  readonly valueFormat: StringConstructor;
  readonly separator: StringConstructor;
  readonly placeholder: StringConstructor;
  readonly startPlaceholder: StringConstructor;
  readonly endPlaceholder: StringConstructor;
  readonly format: StringConstructor;
  readonly dateFormat: StringConstructor;
  readonly timePickerFormat: StringConstructor;
  readonly actions: import("vue").PropType<Array<"clear" | "confirm" | "now"> | null>;
  readonly shortcuts: import("vue").PropType<Shortcuts>;
  readonly isDateDisabled: import("vue").PropType<IsDateDisabled>;
  readonly isTimeDisabled: import("vue").PropType<IsTimeDisabled>;
  readonly show: {
    readonly type: import("vue").PropType<boolean | undefined>;
    readonly default: undefined;
  };
  readonly panel: BooleanConstructor;
  readonly ranges: import("vue").PropType<Record<string, [number, number]>>;
  readonly firstDayOfWeek: import("vue").PropType<FirstDayOfWeek>;
  readonly inputReadonly: BooleanConstructor;
  readonly closeOnSelect: BooleanConstructor;
  readonly status: import("vue").PropType<FormValidationStatus>;
  readonly timePickerProps: import("vue").PropType<TimePickerProps | [TimePickerProps, TimePickerProps]>;
  readonly onClear: import("vue").PropType<() => void>;
  readonly onConfirm: import("vue").PropType<OnConfirm>;
  readonly defaultCalendarStartTime: NumberConstructor;
  readonly defaultCalendarEndTime: NumberConstructor;
  readonly bindCalendarMonths: BooleanConstructor;
  readonly monthFormat: {
    readonly type: StringConstructor;
    readonly default: "M";
  };
  readonly yearFormat: {
    readonly type: StringConstructor;
    readonly default: "y";
  };
  readonly quarterFormat: {
    readonly type: StringConstructor;
    readonly default: "'Q'Q";
  };
  readonly yearRange: {
    readonly type: import("vue").PropType<[number, number]>;
    readonly default: () => [number, number];
  };
  readonly 'onUpdate:show': import("vue").PropType<MaybeArray<(show: boolean) => void>>;
  readonly onUpdateShow: import("vue").PropType<MaybeArray<(show: boolean) => void>>;
  readonly 'onUpdate:formattedValue': import("vue").PropType<MaybeArray<OnUpdateFormattedValue>>;
  readonly onUpdateFormattedValue: import("vue").PropType<MaybeArray<OnUpdateFormattedValue>>;
  readonly 'onUpdate:value': import("vue").PropType<MaybeArray<OnUpdateValue>>;
  readonly onUpdateValue: import("vue").PropType<MaybeArray<OnUpdateValue>>;
  readonly onFocus: import("vue").PropType<(e: FocusEvent) => void>;
  readonly onBlur: import("vue").PropType<(e: FocusEvent) => void>;
  readonly onNextMonth: import("vue").PropType<() => void>;
  readonly onPrevMonth: import("vue").PropType<() => void>;
  readonly onNextYear: import("vue").PropType<() => void>;
  readonly onPrevYear: import("vue").PropType<() => void>;
  readonly onChange: import("vue").PropType<MaybeArray<OnUpdateValue>>;
  readonly theme: import("vue").PropType<DatePickerTheme>;
  readonly themeOverrides: import("vue").PropType<DatePickerThemeOverrides>;
  readonly builtinThemeOverrides: import("vue").PropType<DatePickerThemeOverrides>;
}>> & Readonly<{}>, {
  readonly to: string | boolean | HTMLElement;
  readonly type: DatePickerType;
  readonly bordered: boolean | undefined;
  readonly clearable: boolean;
  readonly disabled: boolean | undefined;
  readonly placement: import("vueuc").FollowerPlacement;
  readonly show: boolean | undefined;
  readonly inputReadonly: boolean;
  readonly fastYearSelect: boolean;
  readonly fastMonthSelect: boolean;
  readonly updateValueOnClose: boolean;
  readonly calendarHeaderMonthYearSeparator: string;
  readonly calendarHeaderMonthBeforeYear: boolean;
  readonly panel: boolean;
  readonly closeOnSelect: boolean;
  readonly bindCalendarMonths: boolean;
  readonly monthFormat: string;
  readonly yearFormat: string;
  readonly quarterFormat: string;
  readonly yearRange: [number, number];
}, SlotsType<DatePickerSlots>, {}, {}, string, import("vue").ComponentProvideOptions, true, {}, any>;
//#endregion
export { DatePickerSetupProps, DatePickerSlots, _default as default };