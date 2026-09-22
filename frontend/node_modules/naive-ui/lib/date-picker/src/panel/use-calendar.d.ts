import { ThemeCommonVars } from "../../../_styles/common/light.js";
import { InputTheme } from "../../../input/styles/light.js";
import "../../../input/styles/index.js";
import { ButtonTheme } from "../../../button/styles/light.js";
import "../../../button/styles/index.js";
import { TimePickerTheme } from "../../../time-picker/styles/light.js";
import "../../../time-picker/styles/index.js";
import { IsHourDisabled, IsMinuteDisabled, IsSecondDisabled } from "../../../time-picker/src/interface.js";
import { TimePickerProps } from "../../../time-picker/src/TimePicker.js";
import { DatePickerThemeVars } from "../../styles/light.js";
import "../../styles/index.js";
import { DatePickerSlots } from "../DatePicker.js";
import { DefaultTime, IsDateDisabled, IsSingleDateDisabledDetail, OnClose, OnPanelUpdateValue, Shortcuts, Value } from "../interface.js";
import { DateItem, MonthItem, QuarterItem, YearItem } from "../utils.js";
import "../../../index.js";
import { ExtractThemeOverrides } from "../../../_mixins/use-theme.js";
import "../../../_mixins/index.js";
import { ScrollbarTheme } from "../../../_internal/scrollbar/styles/light.js";
import "../../../_internal/scrollbar/styles/index.js";
import { ExtractPropTypes, PropType } from "vue";
//#region src/date-picker/src/panel/use-calendar.d.ts
declare const useCalendarProps: {
  readonly defaultCalendarStartTime: NumberConstructor;
  readonly actions: {
    readonly type: PropType<string[]>;
    readonly default: () => string[];
  };
  readonly active: BooleanConstructor;
  readonly dateFormat: StringConstructor;
  readonly fastYearSelect: BooleanConstructor;
  readonly fastMonthSelect: BooleanConstructor;
  readonly calendarDayFormat: StringConstructor;
  readonly calendarHeaderYearFormat: StringConstructor;
  readonly calendarHeaderMonthFormat: StringConstructor;
  readonly calendarHeaderMonthYearSeparator: {
    readonly type: StringConstructor;
    readonly required: true;
  };
  readonly calendarHeaderMonthBeforeYear: {
    readonly type: BooleanConstructor;
    readonly default: undefined;
  };
  readonly timePickerFormat: {
    readonly type: StringConstructor;
    readonly value: "HH:mm:ss";
  };
  readonly value: {
    readonly type: PropType<Value | null>;
    readonly default: null;
  };
  readonly shortcuts: PropType<Shortcuts>;
  readonly defaultTime: PropType<DefaultTime>;
  readonly inputReadonly: BooleanConstructor;
  readonly onClear: FunctionConstructor;
  readonly onConfirm: PropType<(value: Value | null) => void>;
  readonly onClose: PropType<OnClose>;
  readonly onTabOut: FunctionConstructor;
  readonly onKeydown: FunctionConstructor;
  readonly onSelectYear: FunctionConstructor;
  readonly onSelectMonth: FunctionConstructor;
  readonly onUpdateValue: {
    readonly type: PropType<OnPanelUpdateValue>;
    readonly required: true;
  };
  readonly themeClass: StringConstructor;
  readonly onRender: PropType<(() => void) | undefined>;
  readonly panel: BooleanConstructor;
  readonly onNextMonth: PropType<() => void>;
  readonly onPrevMonth: PropType<() => void>;
  readonly onNextYear: PropType<() => void>;
  readonly onPrevYear: PropType<() => void>;
};
declare function useCalendar(props: ExtractPropTypes<typeof useCalendarProps>, type: 'date' | 'datetime' | 'month' | 'year' | 'quarter' | 'week'): {
  monthScrollbarRef: unknown;
  yearScrollbarRef: unknown;
  yearVlRef: unknown;
  handleDateClick: (dateItem: DateItem | MonthItem | YearItem | QuarterItem) => void;
  handleDateInputBlur: () => void;
  handleDateInput: (value: string) => void;
  handleDateMouseEnter: (dateItem: DateItem | MonthItem | YearItem | QuarterItem) => void;
  isWeekHovered: (dateItem: DateItem | MonthItem | YearItem | QuarterItem) => boolean;
  handleTimePickerChange: (value: number | null) => void;
  clearSelectedDateTime: () => void;
  virtualListContainer: () => HTMLElement | null;
  virtualListContent: () => HTMLElement | null;
  handleVirtualListScroll: () => void;
  timePickerSize: import("vue").Ref<"small" | "medium" | "large", "small" | "medium" | "large">;
  dateInputValue: import("vue").Ref<string, string>;
  datePickerSlots: DatePickerSlots;
  handleQuickMonthClick: (dateItem: MonthItem | YearItem | QuarterItem, updatePanelValue: (value: number) => void) => void;
  justifyColumnsScrollState: (value?: number) => void;
  calendarValue: import("vue").Ref<number, number>;
  onUpdateCalendarValue: (value: number) => void;
  mergedTheme: import("vue").Ref<{
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
  }, {
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
  mergedClsPrefix: import("vue").Ref<string, string>;
  dateFnsOptions: import("vue").ComputedRef<{
    locale: import("date-fns").Locale;
  }>;
  timePickerProps: import("vue").Ref<TimePickerProps | [TimePickerProps, TimePickerProps] | undefined, TimePickerProps | [TimePickerProps, TimePickerProps] | undefined>;
  selfRef: import("vue").Ref<HTMLElement | null, HTMLElement | null>;
  locale: import("vue").Ref<{
    yearFormat: string;
    monthFormat: string;
    dayFormat: string;
    yearTypeFormat: string;
    monthTypeFormat: string;
    dateFormat: string;
    dateTimeFormat: string;
    quarterFormat: string;
    weekFormat: string;
    clear: string;
    now: string;
    confirm: string;
    selectTime: string;
    selectDate: string;
    datePlaceholder: string;
    datetimePlaceholder: string;
    monthPlaceholder: string;
    yearPlaceholder: string;
    quarterPlaceholder: string;
    weekPlaceholder: string;
    startDatePlaceholder: string;
    endDatePlaceholder: string;
    startDatetimePlaceholder: string;
    endDatetimePlaceholder: string;
    startMonthPlaceholder: string;
    endMonthPlaceholder: string;
    monthBeforeYear: boolean;
    firstDayOfWeek: 0 | 1 | 2 | 3 | 4 | 5 | 6;
    today: string;
  }, {
    yearFormat: string;
    monthFormat: string;
    dayFormat: string;
    yearTypeFormat: string;
    monthTypeFormat: string;
    dateFormat: string;
    dateTimeFormat: string;
    quarterFormat: string;
    weekFormat: string;
    clear: string;
    now: string;
    confirm: string;
    selectTime: string;
    selectDate: string;
    datePlaceholder: string;
    datetimePlaceholder: string;
    monthPlaceholder: string;
    yearPlaceholder: string;
    quarterPlaceholder: string;
    weekPlaceholder: string;
    startDatePlaceholder: string;
    endDatePlaceholder: string;
    startDatetimePlaceholder: string;
    endDatetimePlaceholder: string;
    startMonthPlaceholder: string;
    endMonthPlaceholder: string;
    monthBeforeYear: boolean;
    firstDayOfWeek: 0 | 1 | 2 | 3 | 4 | 5 | 6;
    today: string;
  }>;
  doConfirm: () => void;
  doClose: (disableUpdateOnClose?: boolean) => void;
  doUpdateValue: (value: Value | null, doUpdate: boolean) => void;
  doTabOut: () => void;
  handleClearClick: () => void;
  handleFocusDetectorFocus: () => void;
  disableTransitionOneTick: () => void;
  handlePanelKeyDown: (e: KeyboardEvent) => void;
  handlePanelFocus: (e: FocusEvent) => void;
  cachePendingValue: () => void;
  clearPendingValue: () => void;
  restorePendingValue: () => void;
  getShortcutValue: (shortcut: Shortcuts[string]) => number | [number, number] | readonly [number, number];
  handleShortcutMouseleave: () => void;
  showMonthYearPanel: import("vue").Ref<boolean, boolean>;
  handleOpenQuickSelectMonthPanel: () => void;
  isValueInvalid: import("vue").ComputedRef<boolean>;
  isDateDisabled: import("vue").Ref<IsDateDisabled | undefined, IsDateDisabled | undefined>;
  isDateInvalid: import("vue").ComputedRef<boolean>;
  isTimeInvalid: import("vue").ComputedRef<boolean>;
  isDateTimeInvalid: import("vue").ComputedRef<boolean>;
  isHourDisabled: import("vue").ComputedRef<IsHourDisabled | undefined>;
  isMinuteDisabled: import("vue").ComputedRef<IsMinuteDisabled | undefined>;
  isSecondDisabled: import("vue").ComputedRef<IsSecondDisabled | undefined>;
  dateArray: import("vue").ComputedRef<DateItem[]>;
  monthArray: import("vue").ComputedRef<MonthItem[]>;
  yearArray: import("vue").ComputedRef<YearItem[]>;
  quarterArray: import("vue").ComputedRef<QuarterItem[]>;
  calendarYear: import("vue").ComputedRef<string>;
  calendarMonth: import("vue").ComputedRef<string>;
  weekdays: import("vue").ComputedRef<string[]>;
  calendarMonthBeforeYear: import("vue").ComputedRef<boolean>;
  mergedIsDateDisabled: (ts: number, detail: IsSingleDateDisabledDetail) => boolean;
  nextYear: () => void;
  prevYear: () => void;
  nextMonth: () => void;
  prevMonth: () => void;
  handleNowClick: () => void;
  handleConfirmClick: () => void;
  handleSingleShortcutMouseenter: (shortcut: Shortcuts[string]) => void;
  handleSingleShortcutClick: (shortcut: Shortcuts[string]) => void;
};
//#endregion
export { useCalendar, useCalendarProps };