import { computed } from "vue";
import { getHours, getMinutes, getSeconds } from "date-fns";
//#region src/date-picker/src/validation-utils.ts
function uniCalendarValidation(props, mergedValueRef) {
  const timePickerValidatorRef = computed(() => {
    const {
      isTimeDisabled
    } = props;
    const {
      value
    } = mergedValueRef;
    if (value === null || Array.isArray(value)) return void 0;
    return isTimeDisabled?.(value);
  });
  const isHourDisabledRef = computed(() => {
    return timePickerValidatorRef.value?.isHourDisabled;
  });
  const isMinuteDisabledRef = computed(() => {
    return timePickerValidatorRef.value?.isMinuteDisabled;
  });
  const isSecondDisabledRef = computed(() => {
    return timePickerValidatorRef.value?.isSecondDisabled;
  });
  const isDateInvalidRef = computed(() => {
    const {
      type,
      isDateDisabled
    } = props;
    const {
      value
    } = mergedValueRef;
    if (value === null || Array.isArray(value) || !["date", "datetime"].includes(type) || !isDateDisabled) return false;
    return isDateDisabled(value, {
      type: "input"
    });
  });
  const isTimeInvalidRef = computed(() => {
    const {
      type
    } = props;
    const {
      value
    } = mergedValueRef;
    if (value === null || !(type !== "datetime") || Array.isArray(value)) return false;
    const time = new Date(value);
    const hour = time.getHours();
    const minute = time.getMinutes();
    const second = time.getMinutes();
    return (isHourDisabledRef.value ? isHourDisabledRef.value(hour) : false) || (isMinuteDisabledRef.value ? isMinuteDisabledRef.value(minute, hour) : false) || (isSecondDisabledRef.value ? isSecondDisabledRef.value(second, minute, hour) : false);
  });
  const isDateTimeInvalidRef = computed(() => {
    return isDateInvalidRef.value || isTimeInvalidRef.value;
  });
  return {
    isValueInvalidRef: computed(() => {
      const {
        type
      } = props;
      if (type === "date") return isDateInvalidRef.value;
      if (type === "datetime") return isDateTimeInvalidRef.value;
      return false;
    }),
    isDateInvalidRef,
    isTimeInvalidRef,
    isDateTimeInvalidRef,
    isHourDisabledRef,
    isMinuteDisabledRef,
    isSecondDisabledRef
  };
}
function dualCalendarValidation(props, mergedValueRef) {
  const timePickerValidatorRef = computed(() => {
    const {
      isTimeDisabled
    } = props;
    const {
      value
    } = mergedValueRef;
    if (!Array.isArray(value) || !isTimeDisabled) return [void 0, void 0];
    return [isTimeDisabled?.(value[0], "start", value), isTimeDisabled?.(value[1], "end", value)];
  });
  const timeValidator = {
    isStartHourDisabledRef: computed(() => timePickerValidatorRef.value[0]?.isHourDisabled),
    isEndHourDisabledRef: computed(() => timePickerValidatorRef.value[1]?.isHourDisabled),
    isStartMinuteDisabledRef: computed(() => timePickerValidatorRef.value[0]?.isMinuteDisabled),
    isEndMinuteDisabledRef: computed(() => timePickerValidatorRef.value[1]?.isMinuteDisabled),
    isStartSecondDisabledRef: computed(() => timePickerValidatorRef.value[0]?.isSecondDisabled),
    isEndSecondDisabledRef: computed(() => timePickerValidatorRef.value[1]?.isSecondDisabled)
  };
  const isStartDateInvalidRef = computed(() => {
    const {
      type,
      isDateDisabled
    } = props;
    const {
      value
    } = mergedValueRef;
    if (value === null || !Array.isArray(value) || !["daterange", "datetimerange"].includes(type) || !isDateDisabled) return false;
    return isDateDisabled(value[0], "start", value);
  });
  const isEndDateInvalidRef = computed(() => {
    const {
      type,
      isDateDisabled
    } = props;
    const {
      value
    } = mergedValueRef;
    if (value === null || !Array.isArray(value) || !["daterange", "datetimerange"].includes(type) || !isDateDisabled) return false;
    return isDateDisabled(value[1], "end", value);
  });
  const isStartTimeInvalidRef = computed(() => {
    const {
      type
    } = props;
    const {
      value
    } = mergedValueRef;
    if (value === null || !Array.isArray(value) || type !== "datetimerange") return false;
    const startHours = getHours(value[0]);
    const startMinutes = getMinutes(value[0]);
    const startSeconds = getSeconds(value[0]);
    const {
      isStartHourDisabledRef,
      isStartMinuteDisabledRef,
      isStartSecondDisabledRef
    } = timeValidator;
    return (isStartHourDisabledRef.value ? isStartHourDisabledRef.value(startHours) : false) || (isStartMinuteDisabledRef.value ? isStartMinuteDisabledRef.value(startMinutes, startHours) : false) || (isStartSecondDisabledRef.value ? isStartSecondDisabledRef.value(startSeconds, startMinutes, startHours) : false);
  });
  const isEndTimeInvalidRef = computed(() => {
    const {
      type
    } = props;
    const {
      value
    } = mergedValueRef;
    if (value === null || !Array.isArray(value) || type !== "datetimerange") return false;
    const endHours = getHours(value[1]);
    const endMinutes = getMinutes(value[1]);
    const endSeconds = getSeconds(value[1]);
    const {
      isEndHourDisabledRef,
      isEndMinuteDisabledRef,
      isEndSecondDisabledRef
    } = timeValidator;
    return (isEndHourDisabledRef.value ? isEndHourDisabledRef.value(endHours) : false) || (isEndMinuteDisabledRef.value ? isEndMinuteDisabledRef.value(endMinutes, endHours) : false) || (isEndSecondDisabledRef.value ? isEndSecondDisabledRef.value(endSeconds, endMinutes, endHours) : false);
  });
  const isStartValueInvalidRef = computed(() => {
    return isStartDateInvalidRef.value || isStartTimeInvalidRef.value;
  });
  const isEndValueInvalidRef = computed(() => {
    return isEndDateInvalidRef.value || isEndTimeInvalidRef.value;
  });
  const isRangeInvalidRef = computed(() => {
    return isStartValueInvalidRef.value || isEndValueInvalidRef.value;
  });
  return {
    ...timeValidator,
    isStartDateInvalidRef,
    isEndDateInvalidRef,
    isStartTimeInvalidRef,
    isEndTimeInvalidRef,
    isStartValueInvalidRef,
    isEndValueInvalidRef,
    isRangeInvalidRef
  };
}
//#endregion
export { dualCalendarValidation, uniCalendarValidation };