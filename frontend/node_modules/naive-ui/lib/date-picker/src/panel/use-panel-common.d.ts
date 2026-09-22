import { ThemeCommonVars } from "../../../_styles/common/light.js";
import { InputTheme } from "../../../input/styles/light.js";
import "../../../input/styles/index.js";
import { ButtonTheme } from "../../../button/styles/light.js";
import "../../../button/styles/index.js";
import { TimePickerTheme } from "../../../time-picker/styles/light.js";
import "../../../time-picker/styles/index.js";
import { TimePickerProps } from "../../../time-picker/src/TimePicker.js";
import { DatePickerThemeVars } from "../../styles/light.js";
import "../../styles/index.js";
import { DefaultTime, OnClose, OnPanelUpdateValue, Shortcuts, Value } from "../interface.js";
import "../../../index.js";
import { ExtractThemeOverrides } from "../../../_mixins/use-theme.js";
import "../../../_mixins/index.js";
import { ScrollbarTheme } from "../../../_internal/scrollbar/styles/light.js";
import "../../../_internal/scrollbar/styles/index.js";
import { ExtractPropTypes, PropType } from "vue";
//#region src/date-picker/src/panel/use-panel-common.d.ts
declare const usePanelCommonProps: {
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
  readonly actions: PropType<string[]>;
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
type UsePanelCommonProps = ExtractPropTypes<typeof usePanelCommonProps>;
declare function usePanelCommon(props: UsePanelCommonProps): {
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
  timePickerSize: import("vue").Ref<"small" | "medium" | "large", "small" | "medium" | "large">;
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
};
//#endregion
export { UsePanelCommonProps, usePanelCommon, usePanelCommonProps };