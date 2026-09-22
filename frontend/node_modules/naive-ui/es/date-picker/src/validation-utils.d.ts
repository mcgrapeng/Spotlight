import { IsHourDisabled, IsMinuteDisabled, IsSecondDisabled } from "../../time-picker/src/interface.js";
import { DatePickerSetupProps } from "./DatePicker.js";
import { Ref } from "vue";
//#region src/date-picker/src/validation-utils.d.ts
declare function uniCalendarValidation(props: DatePickerSetupProps, mergedValueRef: Ref<number | [number, number] | null>): {
  isValueInvalidRef: import("vue").ComputedRef<boolean>;
  isDateInvalidRef: import("vue").ComputedRef<boolean>;
  isTimeInvalidRef: import("vue").ComputedRef<boolean>;
  isDateTimeInvalidRef: import("vue").ComputedRef<boolean>;
  isHourDisabledRef: import("vue").ComputedRef<IsHourDisabled | undefined>;
  isMinuteDisabledRef: import("vue").ComputedRef<IsMinuteDisabled | undefined>;
  isSecondDisabledRef: import("vue").ComputedRef<IsSecondDisabled | undefined>;
};
declare function dualCalendarValidation(props: DatePickerSetupProps, mergedValueRef: Ref<number | [number, number] | null>): {
  isStartDateInvalidRef: import("vue").ComputedRef<boolean>;
  isEndDateInvalidRef: import("vue").ComputedRef<boolean>;
  isStartTimeInvalidRef: import("vue").ComputedRef<boolean>;
  isEndTimeInvalidRef: import("vue").ComputedRef<boolean>;
  isStartValueInvalidRef: import("vue").ComputedRef<boolean>;
  isEndValueInvalidRef: import("vue").ComputedRef<boolean>;
  isRangeInvalidRef: import("vue").ComputedRef<boolean>;
  isStartHourDisabledRef: import("vue").ComputedRef<IsHourDisabled | undefined>;
  isEndHourDisabledRef: import("vue").ComputedRef<IsHourDisabled | undefined>;
  isStartMinuteDisabledRef: import("vue").ComputedRef<IsMinuteDisabled | undefined>;
  isEndMinuteDisabledRef: import("vue").ComputedRef<IsMinuteDisabled | undefined>;
  isStartSecondDisabledRef: import("vue").ComputedRef<IsSecondDisabled | undefined>;
  isEndSecondDisabledRef: import("vue").ComputedRef<IsSecondDisabled | undefined>;
};
//#endregion
export { dualCalendarValidation, uniCalendarValidation };