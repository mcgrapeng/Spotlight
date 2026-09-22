import { ThemeCommonVars } from "../../_styles/common/light.js";
import { MaybeArray } from "../../_utils/vue/call.js";
import "../../_utils/index.js";
import { InputTheme } from "../../input/styles/light.js";
import "../../input/styles/index.js";
import { ButtonTheme } from "../../button/styles/light.js";
import "../../button/styles/index.js";
import { TimePickerThemeVars } from "../styles/light.js";
import "../styles/index.js";
import { IsHourDisabled, IsMinuteDisabled, IsSecondDisabled, Item, ItemValue } from "./interface.js";
import "../../index.js";
import { ExtractThemeOverrides } from "../../_mixins/use-theme.js";
import "../../_mixins/index.js";
import { ScrollbarTheme } from "../../_internal/scrollbar/styles/light.js";
import "../../_internal/scrollbar/styles/index.js";
import { PropType } from "vue";
//#region src/time-picker/src/Panel.d.ts
declare const _default: import("vue").DefineComponent<import("vue").ExtractPropTypes<{
  actions: {
    type: PropType<Array<"clear" | "now" | "confirm"> | null>;
    default: () => string[];
  };
  showHour: {
    type: BooleanConstructor;
    default: boolean;
  };
  showMinute: {
    type: BooleanConstructor;
    default: boolean;
  };
  showSecond: {
    type: BooleanConstructor;
    default: boolean;
  };
  showPeriod: {
    type: BooleanConstructor;
    default: boolean;
  };
  isHourInvalid: BooleanConstructor;
  isMinuteInvalid: BooleanConstructor;
  isSecondInvalid: BooleanConstructor;
  isAmPmInvalid: BooleanConstructor;
  isValueInvalid: BooleanConstructor;
  hourValue: {
    type: PropType<number | null>;
    default: null;
  };
  minuteValue: {
    type: PropType<number | null>;
    default: null;
  };
  secondValue: {
    type: PropType<number | null>;
    default: null;
  };
  amPmValue: {
    type: PropType<"am" | "pm" | null>;
    default: null;
  };
  isHourDisabled: PropType<IsHourDisabled>;
  isMinuteDisabled: PropType<IsMinuteDisabled>;
  isSecondDisabled: PropType<IsSecondDisabled>;
  onHourClick: {
    type: PropType<(value: ItemValue) => void>;
    required: boolean;
  };
  onMinuteClick: {
    type: PropType<(value: ItemValue) => void>;
    required: boolean;
  };
  onSecondClick: {
    type: PropType<(value: ItemValue) => void>;
    required: boolean;
  };
  onAmPmClick: {
    type: PropType<(value: ItemValue) => void>;
    required: boolean;
  };
  onNowClick: PropType<() => void>;
  clearText: StringConstructor;
  nowText: StringConstructor;
  confirmText: StringConstructor;
  transitionDisabled: BooleanConstructor;
  onClearClick: PropType<() => void>;
  onConfirmClick: PropType<() => void>;
  onFocusin: PropType<(e: FocusEvent) => void>;
  onFocusout: PropType<(e: FocusEvent) => void>;
  onFocusDetectorFocus: PropType<() => void>;
  onKeydown: PropType<(e: KeyboardEvent) => void>;
  hours: PropType<MaybeArray<number>>;
  minutes: PropType<MaybeArray<number>>;
  seconds: PropType<MaybeArray<number>>;
  use12Hours: BooleanConstructor;
}>, {
  mergedTheme: import("vue").Ref<{
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
  }, {
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
  mergedClsPrefix: import("vue").Ref<string, string>;
  hours: import("vue").ComputedRef<Item[]>;
  minutes: import("vue").ComputedRef<Item[]>;
  seconds: import("vue").ComputedRef<Item[]>;
  amPm: import("vue").ComputedRef<Item[]>;
  hourScrollRef: import("vue").Ref<null, null>;
  minuteScrollRef: import("vue").Ref<null, null>;
  secondScrollRef: import("vue").Ref<null, null>;
  amPmScrollRef: import("vue").Ref<null, null>;
}, {}, {}, {}, import("vue").ComponentOptionsMixin, import("vue").ComponentOptionsMixin, {}, string, import("vue").PublicProps, Readonly<import("vue").ExtractPropTypes<{
  actions: {
    type: PropType<Array<"clear" | "now" | "confirm"> | null>;
    default: () => string[];
  };
  showHour: {
    type: BooleanConstructor;
    default: boolean;
  };
  showMinute: {
    type: BooleanConstructor;
    default: boolean;
  };
  showSecond: {
    type: BooleanConstructor;
    default: boolean;
  };
  showPeriod: {
    type: BooleanConstructor;
    default: boolean;
  };
  isHourInvalid: BooleanConstructor;
  isMinuteInvalid: BooleanConstructor;
  isSecondInvalid: BooleanConstructor;
  isAmPmInvalid: BooleanConstructor;
  isValueInvalid: BooleanConstructor;
  hourValue: {
    type: PropType<number | null>;
    default: null;
  };
  minuteValue: {
    type: PropType<number | null>;
    default: null;
  };
  secondValue: {
    type: PropType<number | null>;
    default: null;
  };
  amPmValue: {
    type: PropType<"am" | "pm" | null>;
    default: null;
  };
  isHourDisabled: PropType<IsHourDisabled>;
  isMinuteDisabled: PropType<IsMinuteDisabled>;
  isSecondDisabled: PropType<IsSecondDisabled>;
  onHourClick: {
    type: PropType<(value: ItemValue) => void>;
    required: boolean;
  };
  onMinuteClick: {
    type: PropType<(value: ItemValue) => void>;
    required: boolean;
  };
  onSecondClick: {
    type: PropType<(value: ItemValue) => void>;
    required: boolean;
  };
  onAmPmClick: {
    type: PropType<(value: ItemValue) => void>;
    required: boolean;
  };
  onNowClick: PropType<() => void>;
  clearText: StringConstructor;
  nowText: StringConstructor;
  confirmText: StringConstructor;
  transitionDisabled: BooleanConstructor;
  onClearClick: PropType<() => void>;
  onConfirmClick: PropType<() => void>;
  onFocusin: PropType<(e: FocusEvent) => void>;
  onFocusout: PropType<(e: FocusEvent) => void>;
  onFocusDetectorFocus: PropType<() => void>;
  onKeydown: PropType<(e: KeyboardEvent) => void>;
  hours: PropType<MaybeArray<number>>;
  minutes: PropType<MaybeArray<number>>;
  seconds: PropType<MaybeArray<number>>;
  use12Hours: BooleanConstructor;
}>> & Readonly<{}>, {
  transitionDisabled: boolean;
  actions: ("clear" | "now" | "confirm")[] | null;
  use12Hours: boolean;
  isValueInvalid: boolean;
  showHour: boolean;
  showMinute: boolean;
  showSecond: boolean;
  showPeriod: boolean;
  isHourInvalid: boolean;
  isMinuteInvalid: boolean;
  isSecondInvalid: boolean;
  isAmPmInvalid: boolean;
  hourValue: number | null;
  minuteValue: number | null;
  secondValue: number | null;
  amPmValue: "am" | "pm" | null;
}, {}, {}, {}, string, import("vue").ComponentProvideOptions, true, {}, any>;
//#endregion
export { _default as default };