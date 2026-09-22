import { dateArray, extractSingleDefaultTime, getDefaultTime, monthArray, quarterArray, strictParse, yearArray } from "../utils.mjs";
import { datePickerInjectionKey } from "../interface.mjs";
import "../config.mjs";
import { usePanelCommon, usePanelCommonProps } from "./use-panel-common.mjs";
import { computed, inject, ref, watch } from "vue";
import { addMonths, addYears, format, getDate, getMonth, getTime, getYear, isSameMonth, isValid, set, setMonth, setQuarter, setYear, startOfDay, startOfMonth, startOfQuarter, startOfSecond, startOfWeek, startOfYear } from "date-fns";
//#region src/date-picker/src/panel/use-calendar.ts
const useCalendarProps = {
  ...usePanelCommonProps,
  defaultCalendarStartTime: Number,
  actions: {
    type: Array,
    default: () => ["now", "clear", "confirm"]
  }
};
function useCalendar(props, type) {
  const panelCommon = usePanelCommon(props);
  const {
    isValueInvalidRef,
    isDateDisabledRef,
    isDateInvalidRef,
    isTimeInvalidRef,
    isDateTimeInvalidRef,
    isHourDisabledRef,
    isMinuteDisabledRef,
    isSecondDisabledRef,
    localeRef,
    firstDayOfWeekRef,
    datePickerSlots,
    yearFormatRef,
    monthFormatRef,
    quarterFormatRef,
    yearRangeRef
  } = inject(datePickerInjectionKey);
  const validation = {
    isValueInvalid: isValueInvalidRef,
    isDateDisabled: isDateDisabledRef,
    isDateInvalid: isDateInvalidRef,
    isTimeInvalid: isTimeInvalidRef,
    isDateTimeInvalid: isDateTimeInvalidRef,
    isHourDisabled: isHourDisabledRef,
    isMinuteDisabled: isMinuteDisabledRef,
    isSecondDisabled: isSecondDisabledRef
  };
  const mergedDateFormatRef = computed(() => props.dateFormat || localeRef.value.dateFormat);
  const mergedDayFormatRef = computed(() => props.calendarDayFormat || localeRef.value.dayFormat);
  const dateInputValueRef = ref(props.value === null || Array.isArray(props.value) ? "" : format(props.value, mergedDateFormatRef.value));
  const calendarValueRef = ref(props.value === null || Array.isArray(props.value) ? props.defaultCalendarStartTime ?? Date.now() : props.value);
  const yearVlRef = ref(null);
  const yearScrollbarRef = ref(null);
  const monthScrollbarRef = ref(null);
  const nowRef = ref(Date.now());
  const dateArrayRef = computed(() => {
    return dateArray(calendarValueRef.value, props.value, nowRef.value, firstDayOfWeekRef.value ?? localeRef.value.firstDayOfWeek, false, type === "week");
  });
  const monthArrayRef = computed(() => {
    const {
      value
    } = props;
    return monthArray(calendarValueRef.value, Array.isArray(value) ? null : value, nowRef.value, {
      monthFormat: monthFormatRef.value
    });
  });
  const yearArrayRef = computed(() => {
    const {
      value
    } = props;
    return yearArray(Array.isArray(value) ? null : value, nowRef.value, {
      yearFormat: yearFormatRef.value
    }, yearRangeRef);
  });
  const quarterArrayRef = computed(() => {
    const {
      value
    } = props;
    return quarterArray(calendarValueRef.value, Array.isArray(value) ? null : value, nowRef.value, {
      quarterFormat: quarterFormatRef.value
    });
  });
  const weekdaysRef = computed(() => {
    return dateArrayRef.value.slice(0, 7).map(dateItem => {
      const {
        ts
      } = dateItem;
      return format(ts, mergedDayFormatRef.value, panelCommon.dateFnsOptions.value);
    });
  });
  const calendarMonthRef = computed(() => {
    return format(calendarValueRef.value, props.calendarHeaderMonthFormat || localeRef.value.monthFormat, panelCommon.dateFnsOptions.value);
  });
  const calendarYearRef = computed(() => {
    return format(calendarValueRef.value, props.calendarHeaderYearFormat || localeRef.value.yearFormat, panelCommon.dateFnsOptions.value);
  });
  const calendarMonthBeforeYearRef = computed(() => {
    return props.calendarHeaderMonthBeforeYear ?? localeRef.value.monthBeforeYear;
  });
  watch(calendarValueRef, (value, oldValue) => {
    if (type === "date" || type === "datetime") {
      if (!isSameMonth(value, oldValue)) panelCommon.disableTransitionOneTick();
    }
  });
  watch(computed(() => props.value), value => {
    if (value !== null && !Array.isArray(value)) {
      dateInputValueRef.value = format(value, mergedDateFormatRef.value, panelCommon.dateFnsOptions.value);
      calendarValueRef.value = value;
    } else dateInputValueRef.value = "";
  });
  function sanitizeValue(value) {
    if (type === "datetime") return getTime(startOfSecond(value));
    if (type === "month") return getTime(startOfMonth(value));
    if (type === "year") return getTime(startOfYear(value));
    if (type === "quarter") return getTime(startOfQuarter(value));
    if (type === "week") {
      const weekStartsOn = ((firstDayOfWeekRef.value ?? localeRef.value.firstDayOfWeek) + 1) % 7;
      return getTime(startOfWeek(value, {
        weekStartsOn
      }));
    }
    return getTime(startOfDay(value));
  }
  function mergedIsDateDisabled(ts, detail) {
    const {
      isDateDisabled: {
        value: isDateDisabled
      }
    } = validation;
    if (!isDateDisabled) return false;
    return isDateDisabled(ts, detail);
  }
  function handleDateInput(value) {
    const date = strictParse(value, mergedDateFormatRef.value, /* @__PURE__ */new Date(), panelCommon.dateFnsOptions.value);
    if (isValid(date)) {
      if (props.value === null) panelCommon.doUpdateValue(getTime(sanitizeValue(Date.now())), props.panel);else if (!Array.isArray(props.value)) {
        const newDateTime = set(props.value, {
          year: getYear(date),
          month: getMonth(date),
          date: getDate(date)
        });
        panelCommon.doUpdateValue(getTime(sanitizeValue(getTime(newDateTime))), props.panel);
      }
    } else dateInputValueRef.value = value;
  }
  function handleDateInputBlur() {
    const date = strictParse(dateInputValueRef.value, mergedDateFormatRef.value, /* @__PURE__ */new Date(), panelCommon.dateFnsOptions.value);
    if (isValid(date)) {
      if (props.value === null) panelCommon.doUpdateValue(getTime(sanitizeValue(Date.now())), false);else if (!Array.isArray(props.value)) {
        const newDateTime = set(props.value, {
          year: getYear(date),
          month: getMonth(date),
          date: getDate(date)
        });
        panelCommon.doUpdateValue(getTime(sanitizeValue(getTime(newDateTime))), false);
      }
    } else deriveDateInputValue();
  }
  function clearSelectedDateTime() {
    dateInputValueRef.value = "";
    panelCommon.handleClearClick();
  }
  function handleNowClick() {
    panelCommon.doUpdateValue(getTime(sanitizeValue(Date.now())), true);
    const now = Date.now();
    calendarValueRef.value = now;
    panelCommon.doClose(true);
    if (props.panel && (type === "month" || type === "quarter" || type === "year")) {
      panelCommon.disableTransitionOneTick();
      justifyColumnsScrollState(now);
    }
  }
  const hoveredWeekRef = ref(null);
  function handleDateMouseEnter(dateItem) {
    if (dateItem.type === "date" && type === "week") hoveredWeekRef.value = sanitizeValue(getTime(dateItem.ts));
  }
  function isWeekHovered(dateItem) {
    if (dateItem.type === "date" && type === "week") return sanitizeValue(getTime(dateItem.ts)) === hoveredWeekRef.value;
    return false;
  }
  function handleDateClick(dateItem) {
    if (mergedIsDateDisabled(dateItem.ts, dateItem.type === "date" ? {
      type: "date",
      year: dateItem.dateObject.year,
      month: dateItem.dateObject.month,
      date: dateItem.dateObject.date
    } : dateItem.type === "month" ? {
      type: "month",
      year: dateItem.dateObject.year,
      month: dateItem.dateObject.month
    } : dateItem.type === "year" ? {
      type: "year",
      year: dateItem.dateObject.year
    } : {
      type: "quarter",
      year: dateItem.dateObject.year,
      quarter: dateItem.dateObject.quarter
    })) return;
    let newValue;
    if (props.value !== null && !Array.isArray(props.value)) newValue = props.value;else newValue = Date.now();
    if (type === "datetime" && props.defaultTime !== null && !Array.isArray(props.defaultTime)) {
      let time;
      if (typeof props.defaultTime === "function") time = extractSingleDefaultTime(dateItem.ts, props.defaultTime);else time = getDefaultTime(props.defaultTime);
      if (time) newValue = getTime(set(newValue, time));
    }
    newValue = getTime(dateItem.type === "quarter" && dateItem.dateObject.quarter ? setQuarter(setYear(newValue, dateItem.dateObject.year), dateItem.dateObject.quarter) : set(newValue, dateItem.dateObject));
    panelCommon.doUpdateValue(sanitizeValue(newValue), props.panel || type === "date" || type === "week" || type === "year");
    switch (type) {
      case "date":
      case "week":
        panelCommon.doClose();
        break;
      case "year":
        if (props.panel) panelCommon.disableTransitionOneTick();
        panelCommon.doClose();
        break;
      case "month":
        panelCommon.disableTransitionOneTick();
        justifyColumnsScrollState(newValue);
        break;
      case "quarter":
        panelCommon.disableTransitionOneTick();
        justifyColumnsScrollState(newValue);
    }
  }
  function handleQuickMonthClick(dateItem, updatePanelValue) {
    let newValue;
    if (props.value !== null && !Array.isArray(props.value)) newValue = props.value;else newValue = Date.now();
    newValue = getTime(dateItem.type === "month" ? setMonth(newValue, dateItem.dateObject.month) : setYear(newValue, dateItem.dateObject.year));
    updatePanelValue(newValue);
    justifyColumnsScrollState(newValue);
  }
  function onUpdateCalendarValue(value) {
    calendarValueRef.value = value;
  }
  function deriveDateInputValue(time) {
    if (props.value === null || Array.isArray(props.value)) {
      dateInputValueRef.value = "";
      return;
    }
    if (time === void 0) time = props.value;
    dateInputValueRef.value = format(time, mergedDateFormatRef.value, panelCommon.dateFnsOptions.value);
  }
  function handleConfirmClick() {
    if (validation.isDateInvalid.value || validation.isTimeInvalid.value) return;
    panelCommon.doConfirm();
    closeCalendar();
  }
  function closeCalendar() {
    if (props.active) panelCommon.doClose();
  }
  function nextYear() {
    calendarValueRef.value = getTime(addYears(calendarValueRef.value, 1));
    props.onNextYear?.();
  }
  function prevYear() {
    calendarValueRef.value = getTime(addYears(calendarValueRef.value, -1));
    props.onPrevYear?.();
  }
  function nextMonth() {
    calendarValueRef.value = getTime(addMonths(calendarValueRef.value, 1));
    props.onNextMonth?.();
  }
  function prevMonth() {
    calendarValueRef.value = getTime(addMonths(calendarValueRef.value, -1));
    props.onPrevMonth?.();
  }
  function virtualListContainer() {
    const {
      value
    } = yearVlRef;
    return value?.listElRef || null;
  }
  function virtualListContent() {
    const {
      value
    } = yearVlRef;
    return value?.itemsElRef || null;
  }
  function handleVirtualListScroll() {
    yearScrollbarRef.value?.sync();
  }
  function handleTimePickerChange(value) {
    if (value === null) return;
    panelCommon.doUpdateValue(value, props.panel);
  }
  function handleSingleShortcutMouseenter(shortcut) {
    panelCommon.cachePendingValue();
    const shortcutValue = panelCommon.getShortcutValue(shortcut);
    if (typeof shortcutValue !== "number") return;
    panelCommon.doUpdateValue(shortcutValue, false);
  }
  function handleSingleShortcutClick(shortcut) {
    const shortcutValue = panelCommon.getShortcutValue(shortcut);
    if (typeof shortcutValue !== "number") return;
    panelCommon.doUpdateValue(shortcutValue, props.panel);
    panelCommon.clearPendingValue();
    handleConfirmClick();
  }
  function justifyColumnsScrollState(value) {
    const {
      value: mergedValue
    } = props;
    if (monthScrollbarRef.value) {
      const monthIndex = value === void 0 ? mergedValue === null ? getMonth(Date.now()) : getMonth(mergedValue) : getMonth(value);
      monthScrollbarRef.value.scrollTo({
        top: monthIndex * 40
      });
    }
    if (yearVlRef.value) {
      const yearIndex = (value === void 0 ? mergedValue === null ? getYear(Date.now()) : getYear(mergedValue) : getYear(value)) - yearRangeRef.value[0];
      yearVlRef.value.scrollTo({
        top: yearIndex * 40
      });
    }
  }
  return {
    dateArray: dateArrayRef,
    monthArray: monthArrayRef,
    yearArray: yearArrayRef,
    quarterArray: quarterArrayRef,
    calendarYear: calendarYearRef,
    calendarMonth: calendarMonthRef,
    weekdays: weekdaysRef,
    calendarMonthBeforeYear: calendarMonthBeforeYearRef,
    mergedIsDateDisabled,
    nextYear,
    prevYear,
    nextMonth,
    prevMonth,
    handleNowClick,
    handleConfirmClick,
    handleSingleShortcutMouseenter,
    handleSingleShortcutClick,
    ...validation,
    ...panelCommon,
    monthScrollbarRef,
    yearScrollbarRef,
    yearVlRef,
    handleDateClick,
    handleDateInputBlur,
    handleDateInput,
    handleDateMouseEnter,
    isWeekHovered,
    handleTimePickerChange,
    clearSelectedDateTime,
    virtualListContainer,
    virtualListContent,
    handleVirtualListScroll,
    timePickerSize: panelCommon.timePickerSize,
    dateInputValue: dateInputValueRef,
    datePickerSlots,
    handleQuickMonthClick,
    justifyColumnsScrollState,
    calendarValue: calendarValueRef,
    onUpdateCalendarValue
  };
}
//#endregion
export { useCalendar, useCalendarProps };