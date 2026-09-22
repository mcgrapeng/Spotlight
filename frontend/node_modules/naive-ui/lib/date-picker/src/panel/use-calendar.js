Object.defineProperty(exports, Symbol.toStringTag, { value: "Module" });
const require_date_picker_src_utils = require("../utils.js");
const require_date_picker_src_interface = require("../interface.js");
require("../config.js");
const require_date_picker_src_panel_use_panel_common = require("./use-panel-common.js");
let vue = require("vue");
let date_fns = require("date-fns");
//#region src/date-picker/src/panel/use-calendar.ts
const useCalendarProps = {
	...require_date_picker_src_panel_use_panel_common.usePanelCommonProps,
	defaultCalendarStartTime: Number,
	actions: {
		type: Array,
		default: () => [
			"now",
			"clear",
			"confirm"
		]
	}
};
function useCalendar(props, type) {
	const panelCommon = require_date_picker_src_panel_use_panel_common.usePanelCommon(props);
	const { isValueInvalidRef, isDateDisabledRef, isDateInvalidRef, isTimeInvalidRef, isDateTimeInvalidRef, isHourDisabledRef, isMinuteDisabledRef, isSecondDisabledRef, localeRef, firstDayOfWeekRef, datePickerSlots, yearFormatRef, monthFormatRef, quarterFormatRef, yearRangeRef } = (0, vue.inject)(require_date_picker_src_interface.datePickerInjectionKey);
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
	const mergedDateFormatRef = (0, vue.computed)(() => props.dateFormat || localeRef.value.dateFormat);
	const mergedDayFormatRef = (0, vue.computed)(() => props.calendarDayFormat || localeRef.value.dayFormat);
	const dateInputValueRef = (0, vue.ref)(props.value === null || Array.isArray(props.value) ? "" : (0, date_fns.format)(props.value, mergedDateFormatRef.value));
	const calendarValueRef = (0, vue.ref)(props.value === null || Array.isArray(props.value) ? props.defaultCalendarStartTime ?? Date.now() : props.value);
	const yearVlRef = (0, vue.ref)(null);
	const yearScrollbarRef = (0, vue.ref)(null);
	const monthScrollbarRef = (0, vue.ref)(null);
	const nowRef = (0, vue.ref)(Date.now());
	const dateArrayRef = (0, vue.computed)(() => {
		return require_date_picker_src_utils.dateArray(calendarValueRef.value, props.value, nowRef.value, firstDayOfWeekRef.value ?? localeRef.value.firstDayOfWeek, false, type === "week");
	});
	const monthArrayRef = (0, vue.computed)(() => {
		const { value } = props;
		return require_date_picker_src_utils.monthArray(calendarValueRef.value, Array.isArray(value) ? null : value, nowRef.value, { monthFormat: monthFormatRef.value });
	});
	const yearArrayRef = (0, vue.computed)(() => {
		const { value } = props;
		return require_date_picker_src_utils.yearArray(Array.isArray(value) ? null : value, nowRef.value, { yearFormat: yearFormatRef.value }, yearRangeRef);
	});
	const quarterArrayRef = (0, vue.computed)(() => {
		const { value } = props;
		return require_date_picker_src_utils.quarterArray(calendarValueRef.value, Array.isArray(value) ? null : value, nowRef.value, { quarterFormat: quarterFormatRef.value });
	});
	const weekdaysRef = (0, vue.computed)(() => {
		return dateArrayRef.value.slice(0, 7).map((dateItem) => {
			const { ts } = dateItem;
			return (0, date_fns.format)(ts, mergedDayFormatRef.value, panelCommon.dateFnsOptions.value);
		});
	});
	const calendarMonthRef = (0, vue.computed)(() => {
		return (0, date_fns.format)(calendarValueRef.value, props.calendarHeaderMonthFormat || localeRef.value.monthFormat, panelCommon.dateFnsOptions.value);
	});
	const calendarYearRef = (0, vue.computed)(() => {
		return (0, date_fns.format)(calendarValueRef.value, props.calendarHeaderYearFormat || localeRef.value.yearFormat, panelCommon.dateFnsOptions.value);
	});
	const calendarMonthBeforeYearRef = (0, vue.computed)(() => {
		return props.calendarHeaderMonthBeforeYear ?? localeRef.value.monthBeforeYear;
	});
	(0, vue.watch)(calendarValueRef, (value, oldValue) => {
		if (type === "date" || type === "datetime") {
			if (!(0, date_fns.isSameMonth)(value, oldValue)) panelCommon.disableTransitionOneTick();
		}
	});
	(0, vue.watch)((0, vue.computed)(() => props.value), (value) => {
		if (value !== null && !Array.isArray(value)) {
			dateInputValueRef.value = (0, date_fns.format)(value, mergedDateFormatRef.value, panelCommon.dateFnsOptions.value);
			calendarValueRef.value = value;
		} else dateInputValueRef.value = "";
	});
	function sanitizeValue(value) {
		if (type === "datetime") return (0, date_fns.getTime)((0, date_fns.startOfSecond)(value));
		if (type === "month") return (0, date_fns.getTime)((0, date_fns.startOfMonth)(value));
		if (type === "year") return (0, date_fns.getTime)((0, date_fns.startOfYear)(value));
		if (type === "quarter") return (0, date_fns.getTime)((0, date_fns.startOfQuarter)(value));
		if (type === "week") {
			const weekStartsOn = ((firstDayOfWeekRef.value ?? localeRef.value.firstDayOfWeek) + 1) % 7;
			return (0, date_fns.getTime)((0, date_fns.startOfWeek)(value, { weekStartsOn }));
		}
		return (0, date_fns.getTime)((0, date_fns.startOfDay)(value));
	}
	function mergedIsDateDisabled(ts, detail) {
		const { isDateDisabled: { value: isDateDisabled } } = validation;
		if (!isDateDisabled) return false;
		return isDateDisabled(ts, detail);
	}
	function handleDateInput(value) {
		const date = require_date_picker_src_utils.strictParse(value, mergedDateFormatRef.value, /* @__PURE__ */ new Date(), panelCommon.dateFnsOptions.value);
		if ((0, date_fns.isValid)(date)) {
			if (props.value === null) panelCommon.doUpdateValue((0, date_fns.getTime)(sanitizeValue(Date.now())), props.panel);
			else if (!Array.isArray(props.value)) {
				const newDateTime = (0, date_fns.set)(props.value, {
					year: (0, date_fns.getYear)(date),
					month: (0, date_fns.getMonth)(date),
					date: (0, date_fns.getDate)(date)
				});
				panelCommon.doUpdateValue((0, date_fns.getTime)(sanitizeValue((0, date_fns.getTime)(newDateTime))), props.panel);
			}
		} else dateInputValueRef.value = value;
	}
	function handleDateInputBlur() {
		const date = require_date_picker_src_utils.strictParse(dateInputValueRef.value, mergedDateFormatRef.value, /* @__PURE__ */ new Date(), panelCommon.dateFnsOptions.value);
		if ((0, date_fns.isValid)(date)) {
			if (props.value === null) panelCommon.doUpdateValue((0, date_fns.getTime)(sanitizeValue(Date.now())), false);
			else if (!Array.isArray(props.value)) {
				const newDateTime = (0, date_fns.set)(props.value, {
					year: (0, date_fns.getYear)(date),
					month: (0, date_fns.getMonth)(date),
					date: (0, date_fns.getDate)(date)
				});
				panelCommon.doUpdateValue((0, date_fns.getTime)(sanitizeValue((0, date_fns.getTime)(newDateTime))), false);
			}
		} else deriveDateInputValue();
	}
	function clearSelectedDateTime() {
		dateInputValueRef.value = "";
		panelCommon.handleClearClick();
	}
	function handleNowClick() {
		panelCommon.doUpdateValue((0, date_fns.getTime)(sanitizeValue(Date.now())), true);
		const now = Date.now();
		calendarValueRef.value = now;
		panelCommon.doClose(true);
		if (props.panel && (type === "month" || type === "quarter" || type === "year")) {
			panelCommon.disableTransitionOneTick();
			justifyColumnsScrollState(now);
		}
	}
	const hoveredWeekRef = (0, vue.ref)(null);
	function handleDateMouseEnter(dateItem) {
		if (dateItem.type === "date" && type === "week") hoveredWeekRef.value = sanitizeValue((0, date_fns.getTime)(dateItem.ts));
	}
	function isWeekHovered(dateItem) {
		if (dateItem.type === "date" && type === "week") return sanitizeValue((0, date_fns.getTime)(dateItem.ts)) === hoveredWeekRef.value;
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
		if (props.value !== null && !Array.isArray(props.value)) newValue = props.value;
		else newValue = Date.now();
		if (type === "datetime" && props.defaultTime !== null && !Array.isArray(props.defaultTime)) {
			let time;
			if (typeof props.defaultTime === "function") time = require_date_picker_src_utils.extractSingleDefaultTime(dateItem.ts, props.defaultTime);
			else time = require_date_picker_src_utils.getDefaultTime(props.defaultTime);
			if (time) newValue = (0, date_fns.getTime)((0, date_fns.set)(newValue, time));
		}
		newValue = (0, date_fns.getTime)(dateItem.type === "quarter" && dateItem.dateObject.quarter ? (0, date_fns.setQuarter)((0, date_fns.setYear)(newValue, dateItem.dateObject.year), dateItem.dateObject.quarter) : (0, date_fns.set)(newValue, dateItem.dateObject));
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
		if (props.value !== null && !Array.isArray(props.value)) newValue = props.value;
		else newValue = Date.now();
		newValue = (0, date_fns.getTime)(dateItem.type === "month" ? (0, date_fns.setMonth)(newValue, dateItem.dateObject.month) : (0, date_fns.setYear)(newValue, dateItem.dateObject.year));
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
		dateInputValueRef.value = (0, date_fns.format)(time, mergedDateFormatRef.value, panelCommon.dateFnsOptions.value);
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
		calendarValueRef.value = (0, date_fns.getTime)((0, date_fns.addYears)(calendarValueRef.value, 1));
		props.onNextYear?.();
	}
	function prevYear() {
		calendarValueRef.value = (0, date_fns.getTime)((0, date_fns.addYears)(calendarValueRef.value, -1));
		props.onPrevYear?.();
	}
	function nextMonth() {
		calendarValueRef.value = (0, date_fns.getTime)((0, date_fns.addMonths)(calendarValueRef.value, 1));
		props.onNextMonth?.();
	}
	function prevMonth() {
		calendarValueRef.value = (0, date_fns.getTime)((0, date_fns.addMonths)(calendarValueRef.value, -1));
		props.onPrevMonth?.();
	}
	function virtualListContainer() {
		const { value } = yearVlRef;
		return value?.listElRef || null;
	}
	function virtualListContent() {
		const { value } = yearVlRef;
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
		const { value: mergedValue } = props;
		if (monthScrollbarRef.value) {
			const monthIndex = value === void 0 ? mergedValue === null ? (0, date_fns.getMonth)(Date.now()) : (0, date_fns.getMonth)(mergedValue) : (0, date_fns.getMonth)(value);
			monthScrollbarRef.value.scrollTo({ top: monthIndex * 40 });
		}
		if (yearVlRef.value) {
			const yearIndex = (value === void 0 ? mergedValue === null ? (0, date_fns.getYear)(Date.now()) : (0, date_fns.getYear)(mergedValue) : (0, date_fns.getYear)(value)) - yearRangeRef.value[0];
			yearVlRef.value.scrollTo({ top: yearIndex * 40 });
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
exports.useCalendar = useCalendar;
exports.useCalendarProps = useCalendarProps;
