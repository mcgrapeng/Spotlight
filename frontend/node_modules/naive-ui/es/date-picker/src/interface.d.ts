import { NLocale } from "../../locales/common/enUS.js";
import { NDateLocale } from "../../locales/date/enUS.js";
import { ScrollbarInst } from "../../_internal/scrollbar/src/Scrollbar.js";
import "../../_internal/index.js";
import { ButtonProps } from "../../button/src/Button.js";
import "../../button/index.js";
import { IsHourDisabled, IsMinuteDisabled, IsSecondDisabled } from "../../time-picker/src/interface.js";
import { TimePickerProps } from "../../time-picker/src/TimePicker.js";
import { DatePickerTheme } from "../styles/light.js";
import { DatePickerSlots } from "./DatePicker.js";
import { dualCalendarValidation, uniCalendarValidation } from "./validation-utils.js";
import "../../locales/index.js";
import { MergedTheme } from "../../_mixins/use-theme.js";
import "../../_mixins/index.js";
import { Ref, UnwrapNestedRefs } from "vue";
import { VirtualListInst } from "vueuc";
//#region src/date-picker/src/interface.d.ts
type Value = number | [number, number];
type DefaultTime = string | [string | undefined, string | undefined] | DatePickerGetDefaultTime | DatePickerGetRangeDefaultTime;
type FormattedValue = string | [string, string];
type NowButtonProps = Pick<ButtonProps, 'size' | 'onClick'>;
type ClearButtonProps = Pick<ButtonProps, 'size' | 'onClick'>;
type ConfirmButtonProps = Pick<ButtonProps, 'size' | 'onClick' | 'type' | 'disabled'>;
type Shortcuts = Record<string, number | (() => number)> | Record<string, [number, number] | readonly [number, number] | (() => [number, number] | readonly [number, number])>;
type OnUpdateValue = (value: number & (number | null) & [number, number] & ([number, number] | null), formattedValue: string & (string | null) & [string, string] & ([string, string] | null)) => void;
type OnConfirm = OnUpdateValue;
type OnConfirmImpl = OnUpdateValueImpl;
type OnUpdateFormattedValue = (value: string & (string | null) & [string, string] & ([string, string] | null), timestampValue: number & (number | null) & [number, number] & ([number, number] | null)) => void;
type OnUpdateFormattedValueImpl = (value: string | [string, string] | null, timestampValue: number | [number, number] | null) => void;
type OnUpdateValueImpl = (value: Value | null, formattedValue: string | [string, string] | null) => void;
type OnPanelUpdateValue = (value: number & (number | null) & [number, number] & ([number, number] | null), doUpdate: boolean) => void;
type OnPanelUpdateValueImpl = (value: Value | null, doUpdate: boolean) => void;
type OnClose = (disableUpdateOnClose: boolean) => void;
interface RangePanelChildComponentRefs {
  startYearScrollbarRef: Ref<ScrollbarInst | null>;
  endYearScrollbarRef: Ref<ScrollbarInst | null>;
  startMonthScrollbarRef: Ref<ScrollbarInst | null>;
  endMonthScrollbarRef: Ref<ScrollbarInst | null>;
  startYearVlRef: Ref<VirtualListInst | null>;
  endYearVlRef: Ref<VirtualListInst | null>;
}
interface PanelChildComponentRefs {
  monthScrollbarRef: Ref<ScrollbarInst | null>;
  yearScrollbarRef: Ref<ScrollbarInst | null>;
  yearVlRef: Ref<VirtualListInst | null>;
}
interface PanelRef extends Partial<UnwrapNestedRefs<PanelChildComponentRefs & RangePanelChildComponentRefs>> {
  $el: HTMLElement;
}
type FirstDayOfWeek = 0 | 1 | 2 | 3 | 4 | 5 | 6;
type DatePickerInjection = {
  mergedClsPrefixRef: Ref<string>;
  mergedThemeRef: Ref<MergedTheme<DatePickerTheme>>;
  timePickerSizeRef: Ref<'small' | 'medium' | 'large'>;
  timePickerPropsRef: Ref<undefined | TimePickerProps | [TimePickerProps, TimePickerProps]>;
  localeRef: Ref<NLocale['DatePicker']>;
  dateLocaleRef: Ref<NDateLocale>;
  isDateDisabledRef: Ref<IsDateDisabled | undefined>;
  rangesRef: Ref<Record<string, [number, number]> | undefined>;
  closeOnSelectRef: Ref<boolean>;
  updateValueOnCloseRef: Ref<boolean>;
  firstDayOfWeekRef: Ref<FirstDayOfWeek | undefined>;
  monthFormatRef: Ref<string>;
  yearFormatRef: Ref<string>;
  quarterFormatRef: Ref<string>;
  datePickerSlots: DatePickerSlots;
  yearRangeRef: Ref<[number, number]>;
} & ReturnType<typeof uniCalendarValidation> & ReturnType<typeof dualCalendarValidation>;
declare const datePickerInjectionKey: import("vue").InjectionKey<DatePickerInjection>;
type IsDateDisabled = IsSingleDateDisabled | IsRangeDateDisabled;
type IsSingleDateDisabledDetail = {
  type: 'date';
  year: number;
  month: number;
  date: number;
} | {
  type: 'month';
  year: number;
  month: number;
} | {
  type: 'year';
  year: number;
} | {
  type: 'quarter';
  year: number;
  quarter: number;
} | {
  type: 'input';
};
type IsSingleDateDisabled = (timestamp: number, detail: IsSingleDateDisabledDetail) => boolean;
type IsRangeDateDisabled = (timestamp: number, position: 'start' | 'end', value: [number, number] | null) => boolean;
interface TimeValidator {
  isHourDisabled?: IsHourDisabled;
  isMinuteDisabled?: IsMinuteDisabled;
  isSecondDisabled?: IsSecondDisabled;
}
type IsTimeDisabled = IsSingleTimeDisabled | IsRangeTimeDisabled;
type IsSingleTimeDisabled = (date: number) => TimeValidator;
type IsRangeTimeDisabled = (date: number, position: 'start' | 'end', value: [number, number]) => TimeValidator;
type DatePickerGetDefaultTime = (timestamp: number) => string;
type DatePickerGetRangeDefaultTime = (timestamp: number, position: 'start' | 'end', value: [number, number] | null) => string;
//#endregion
export { ClearButtonProps, ConfirmButtonProps, DatePickerGetDefaultTime, DatePickerGetRangeDefaultTime, DatePickerInjection, DefaultTime, FirstDayOfWeek, FormattedValue, IsDateDisabled, IsRangeDateDisabled, IsRangeTimeDisabled, IsSingleDateDisabled, IsSingleDateDisabledDetail, IsSingleTimeDisabled, IsTimeDisabled, NowButtonProps, OnClose, OnConfirm, OnConfirmImpl, OnPanelUpdateValue, OnPanelUpdateValueImpl, OnUpdateFormattedValue, OnUpdateFormattedValueImpl, OnUpdateValue, OnUpdateValueImpl, PanelChildComponentRefs, PanelRef, RangePanelChildComponentRefs, Shortcuts, TimeValidator, Value, datePickerInjectionKey };