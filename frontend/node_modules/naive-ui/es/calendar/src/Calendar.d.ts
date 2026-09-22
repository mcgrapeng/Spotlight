import { NDateLocale } from "../../locales/date/enUS.js";
import { ThemeCommonVars } from "../../_styles/common/light.js";
import { ExtractPublicPropTypes } from "../../_utils/naive/extract-public-props.js";
import { MaybeArray } from "../../_utils/vue/call.js";
import "../../_utils/index.js";
import { ButtonTheme } from "../../button/styles/light.js";
import "../../button/styles/index.js";
import { DateItem } from "../../date-picker/src/utils.js";
import { CalendarTheme, CalendarThemeOverrides, CalendarThemeVars } from "../styles/light.js";
import "../styles/index.js";
import { CalendarDefaultSlotProps, CalendarHeaderSlotProps, DateItem as DateItem$1, OnPanelChange, OnUpdateValue } from "./interface.js";
import "../../index.js";
import { CSSProperties, PropType, Ref, SlotsType, VNode } from "vue";
//#region src/calendar/src/Calendar.d.ts
declare const calendarProps: {
  readonly isDateDisabled: PropType<(date: number) => boolean | undefined>;
  readonly value: NumberConstructor;
  readonly defaultValue: {
    readonly type: PropType<number | null>;
    readonly default: null;
  };
  readonly onPanelChange: PropType<OnPanelChange>;
  readonly 'onUpdate:value': PropType<MaybeArray<OnUpdateValue>>;
  readonly onUpdateValue: PropType<MaybeArray<OnUpdateValue>>;
  readonly theme: PropType<CalendarTheme>;
  readonly themeOverrides: PropType<CalendarThemeOverrides>;
  readonly builtinThemeOverrides: PropType<CalendarThemeOverrides>;
};
type CalendarProps = ExtractPublicPropTypes<typeof calendarProps>;
interface CalendarSlots {
  default?: (props: CalendarDefaultSlotProps) => VNode[];
  header?: (props: CalendarHeaderSlotProps) => VNode[];
}
declare const _default: import("vue").DefineComponent<import("vue").ExtractPropTypes<{
  readonly isDateDisabled: PropType<(date: number) => boolean | undefined>;
  readonly value: NumberConstructor;
  readonly defaultValue: {
    readonly type: PropType<number | null>;
    readonly default: null;
  };
  readonly onPanelChange: PropType<OnPanelChange>;
  readonly 'onUpdate:value': PropType<MaybeArray<OnUpdateValue>>;
  readonly onUpdateValue: PropType<MaybeArray<OnUpdateValue>>;
  readonly theme: PropType<CalendarTheme>;
  readonly themeOverrides: PropType<CalendarThemeOverrides>;
  readonly builtinThemeOverrides: PropType<CalendarThemeOverrides>;
}>, {
  mergedClsPrefix: Ref<string, string>;
  locale: Ref<{
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
  dateLocale: Ref<NDateLocale, NDateLocale>;
  now: number;
  mergedValue: import("vue").ComputedRef<number | null>;
  monthTs: Ref<number, number>;
  dateItems: import("vue").ComputedRef<DateItem[]>;
  doUpdateValue: (value: number, time: DateItem$1) => void;
  handleTodayClick: () => void;
  handlePrevClick: () => void;
  handleNextClick: () => void;
  mergedTheme: import("vue").ComputedRef<{
    common: ThemeCommonVars;
    self: CalendarThemeVars;
    peers: {
      Button: ButtonTheme;
    };
    peerOverrides: {
      Button?: {
        peers?: {
          [x: string]: any;
        } | undefined;
      } | undefined;
    };
  }>;
  cssVars: Ref<CSSProperties, CSSProperties> | undefined;
  themeClass: Ref<string, string> | undefined;
  onRender: (() => void) | undefined;
}, {}, {}, {}, import("vue").ComponentOptionsMixin, import("vue").ComponentOptionsMixin, {}, string, import("vue").PublicProps, Readonly<import("vue").ExtractPropTypes<{
  readonly isDateDisabled: PropType<(date: number) => boolean | undefined>;
  readonly value: NumberConstructor;
  readonly defaultValue: {
    readonly type: PropType<number | null>;
    readonly default: null;
  };
  readonly onPanelChange: PropType<OnPanelChange>;
  readonly 'onUpdate:value': PropType<MaybeArray<OnUpdateValue>>;
  readonly onUpdateValue: PropType<MaybeArray<OnUpdateValue>>;
  readonly theme: PropType<CalendarTheme>;
  readonly themeOverrides: PropType<CalendarThemeOverrides>;
  readonly builtinThemeOverrides: PropType<CalendarThemeOverrides>;
}>> & Readonly<{}>, {
  readonly defaultValue: number | null;
}, SlotsType<CalendarSlots>, {}, {}, string, import("vue").ComponentProvideOptions, true, {}, any>;
//#endregion
export { CalendarProps, CalendarSlots, calendarProps, _default as default };