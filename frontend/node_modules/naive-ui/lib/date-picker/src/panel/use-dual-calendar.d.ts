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
import { DefaultTime, IsDateDisabled, OnClose, OnPanelUpdateValue, Shortcuts, Value } from "../interface.js";
import { DateItem, MonthItem, QuarterItem, YearItem } from "../utils.js";
import "../../../index.js";
import { ExtractThemeOverrides } from "../../../_mixins/use-theme.js";
import "../../../_mixins/index.js";
import { ScrollbarTheme } from "../../../_internal/scrollbar/styles/light.js";
import "../../../_internal/scrollbar/styles/index.js";
import { ExtractPropTypes, PropType } from "vue";
//#region src/date-picker/src/panel/use-dual-calendar.d.ts
declare const useDualCalendarProps: {
  readonly defaultCalendarStartTime: NumberConstructor;
  readonly defaultCalendarEndTime: NumberConstructor;
  readonly bindCalendarMonths: BooleanConstructor;
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
declare function useDualCalendar(props: ExtractPropTypes<typeof useDualCalendarProps>, type: 'daterange' | 'datetimerange' | 'monthrange' | 'quarterrange' | 'yearrange'): {
  startYearVlRef: unknown;
  endYearVlRef: unknown;
  startMonthScrollbarRef: unknown;
  endMonthScrollbarRef: unknown;
  startYearScrollbarRef: unknown;
  endYearScrollbarRef: unknown;
  startDateDisplayString: import("vue").Ref<string, string>;
  endDateInput: import("vue").Ref<string, string>;
  timePickerSize: import("vue").Ref<"small" | "medium" | "large", "small" | "medium" | "large">;
  startTimeValue: import("vue").ComputedRef<number | null>;
  endTimeValue: import("vue").ComputedRef<number | null>;
  datePickerSlots: DatePickerSlots;
  shortcuts: import("vue").ComputedRef<Shortcuts | undefined>;
  startCalendarDateTime: import("vue").Ref<number, number>;
  endCalendarDateTime: import("vue").Ref<number, number>;
  justifyColumnsScrollState: {
    (value: [number, number], type: "start" | "end"): void;
    (): void;
  };
  handleFocusDetectorFocus: () => void;
  handleStartTimePickerChange: (value: number | null) => void;
  handleEndTimePickerChange: (value: number | null) => void;
  handleStartDateInput: (value: string) => void;
  handleStartDateInputBlur: () => void;
  handleEndDateInput: (value: string) => void;
  handleEndDateInputBlur: () => void;
  handleStartYearVlScroll: () => void;
  handleEndYearVlScroll: () => void;
  virtualListContainer: (type: "start" | "end") => HTMLElement | null;
  virtualListContent: (type: "start" | "end") => HTMLElement | null;
  onUpdateStartCalendarValue: (value: number) => void;
  onUpdateEndCalendarValue: (value: number) => void;
  isDateDisabled: import("vue").Ref<IsDateDisabled | undefined, IsDateDisabled | undefined>;
  isStartHourDisabled: import("vue").ComputedRef<IsHourDisabled | undefined>;
  isEndHourDisabled: import("vue").ComputedRef<IsHourDisabled | undefined>;
  isStartMinuteDisabled: import("vue").ComputedRef<IsMinuteDisabled | undefined>;
  isEndMinuteDisabled: import("vue").ComputedRef<IsMinuteDisabled | undefined>;
  isStartSecondDisabled: import("vue").ComputedRef<IsSecondDisabled | undefined>;
  isEndSecondDisabled: import("vue").ComputedRef<IsSecondDisabled | undefined>;
  isStartDateInvalid: import("vue").ComputedRef<boolean>;
  isEndDateInvalid: import("vue").ComputedRef<boolean>;
  isStartTimeInvalid: import("vue").ComputedRef<boolean>;
  isEndTimeInvalid: import("vue").ComputedRef<boolean>;
  isStartValueInvalid: import("vue").ComputedRef<boolean>;
  isEndValueInvalid: import("vue").ComputedRef<boolean>;
  isRangeInvalid: import("vue").ComputedRef<boolean>;
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
  startDatesElRef: import("vue").Ref<HTMLElement | null, HTMLElement | null>;
  endDatesElRef: import("vue").Ref<HTMLElement | null, HTMLElement | null>;
  handleDateClick: (dateItem: DateItem) => void;
  handleColItemClick: (dateItem: MonthItem | QuarterItem | YearItem, clickType: "start" | "end") => void;
  handleDateMouseEnter: (dateItem: DateItem) => void;
  handleConfirmClick: () => void;
  startCalendarPrevYear: () => void;
  startCalendarPrevMonth: () => void;
  startCalendarNextYear: () => void;
  startCalendarNextMonth: () => void;
  endCalendarPrevYear: () => void;
  endCalendarPrevMonth: () => void;
  endCalendarNextMonth: () => void;
  endCalendarNextYear: () => void;
  mergedIsDateDisabled: (ts: number) => boolean;
  changeStartEndTime: (startTime: number, endTime: number, source: "shortcutPreview" | "wipPreview" | "done" | "shortcutDone") => void;
  ranges: import("vue").Ref<Record<string, [number, number]> | undefined, Record<string, [number, number]> | undefined>;
  calendarMonthBeforeYear: import("vue").ComputedRef<boolean>;
  startCalendarMonth: import("vue").ComputedRef<string>;
  startCalendarYear: import("vue").ComputedRef<string>;
  endCalendarMonth: import("vue").ComputedRef<string>;
  endCalendarYear: import("vue").ComputedRef<string>;
  weekdays: import("vue").ComputedRef<string[]>;
  startDateArray: import("vue").ComputedRef<DateItem[]>;
  endDateArray: import("vue").ComputedRef<DateItem[]>;
  startYearArray: import("vue").ComputedRef<YearItem[]>;
  startMonthArray: import("vue").ComputedRef<MonthItem[]>;
  startQuarterArray: import("vue").ComputedRef<QuarterItem[]>;
  endYearArray: import("vue").ComputedRef<YearItem[]>;
  endMonthArray: import("vue").ComputedRef<MonthItem[]>;
  endQuarterArray: import("vue").ComputedRef<QuarterItem[]>;
  isSelecting: import("vue").Ref<boolean, boolean>;
  handleRangeShortcutMouseenter: (shortcut: Shortcuts[string]) => void;
  handleRangeShortcutClick: (shortcut: Shortcuts[string]) => void;
};
//#endregion
export { useDualCalendar, useDualCalendarProps };