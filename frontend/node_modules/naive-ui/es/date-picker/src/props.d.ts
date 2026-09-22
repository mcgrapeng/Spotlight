import { FormValidationStatus } from "../../form/src/public-types.js";
import { MaybeArray } from "../../_utils/vue/call.js";
import "../../_utils/index.js";
import { TimePickerProps } from "../../time-picker/src/TimePicker.js";
import { DatePickerTheme, DatePickerThemeOverrides } from "../styles/light.js";
import { DatePickerType } from "./config.js";
import "../styles/index.js";
import "../../time-picker/index.js";
import { DatePickerSize } from "./public-types.js";
import { DefaultTime, FirstDayOfWeek, FormattedValue, IsDateDisabled, IsTimeDisabled, OnConfirm, OnUpdateFormattedValue, OnUpdateValue, Shortcuts, Value } from "./interface.js";
import { PropType } from "vue";
import { FollowerPlacement } from "vueuc";
//#region src/date-picker/src/props.d.ts
declare const datePickerProps: {
  readonly to: {
    type: PropType<HTMLElement | string | boolean>;
    default: undefined;
  };
  readonly bordered: {
    readonly type: PropType<boolean | undefined>;
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
  readonly defaultValue: PropType<Value | null>;
  readonly defaultFormattedValue: PropType<FormattedValue | null>;
  readonly defaultTime: PropType<DefaultTime>;
  readonly disabled: {
    readonly type: PropType<boolean | undefined>;
    readonly default: undefined;
  };
  readonly placement: {
    readonly type: PropType<FollowerPlacement>;
    readonly default: "bottom-start";
  };
  readonly value: PropType<Value | null>;
  readonly formattedValue: PropType<FormattedValue | null>;
  readonly size: PropType<DatePickerSize>;
  readonly type: {
    readonly type: PropType<DatePickerType>;
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
  readonly actions: PropType<Array<"clear" | "confirm" | "now"> | null>;
  readonly shortcuts: PropType<Shortcuts>;
  readonly isDateDisabled: PropType<IsDateDisabled>;
  readonly isTimeDisabled: PropType<IsTimeDisabled>;
  readonly show: {
    readonly type: PropType<boolean | undefined>;
    readonly default: undefined;
  };
  readonly panel: BooleanConstructor;
  readonly ranges: PropType<Record<string, [number, number]>>;
  readonly firstDayOfWeek: PropType<FirstDayOfWeek>;
  readonly inputReadonly: BooleanConstructor;
  readonly closeOnSelect: BooleanConstructor;
  readonly status: PropType<FormValidationStatus>;
  readonly timePickerProps: PropType<TimePickerProps | [TimePickerProps, TimePickerProps]>;
  readonly onClear: PropType<() => void>;
  readonly onConfirm: PropType<OnConfirm>;
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
    readonly type: PropType<[number, number]>;
    readonly default: () => [number, number];
  };
  readonly 'onUpdate:show': PropType<MaybeArray<(show: boolean) => void>>;
  readonly onUpdateShow: PropType<MaybeArray<(show: boolean) => void>>;
  readonly 'onUpdate:formattedValue': PropType<MaybeArray<OnUpdateFormattedValue>>;
  readonly onUpdateFormattedValue: PropType<MaybeArray<OnUpdateFormattedValue>>;
  readonly 'onUpdate:value': PropType<MaybeArray<OnUpdateValue>>;
  readonly onUpdateValue: PropType<MaybeArray<OnUpdateValue>>;
  readonly onFocus: PropType<(e: FocusEvent) => void>;
  readonly onBlur: PropType<(e: FocusEvent) => void>;
  readonly onNextMonth: PropType<() => void>;
  readonly onPrevMonth: PropType<() => void>;
  readonly onNextYear: PropType<() => void>;
  readonly onPrevYear: PropType<() => void>;
  readonly onChange: PropType<MaybeArray<OnUpdateValue>>;
  readonly theme: PropType<DatePickerTheme>;
  readonly themeOverrides: PropType<DatePickerThemeOverrides>;
  readonly builtinThemeOverrides: PropType<DatePickerThemeOverrides>;
};
//#endregion
export { datePickerProps };