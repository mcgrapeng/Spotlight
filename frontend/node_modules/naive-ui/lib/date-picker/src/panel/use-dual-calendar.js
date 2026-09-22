Object.defineProperty(exports, Symbol.toStringTag, { value: "Module" });
const require_date_picker_src_utils = require("../utils.js");
const require_date_picker_src_interface = require("../interface.js");
require("../config.js");
const require_date_picker_src_panel_use_panel_common = require("./use-panel-common.js");
let vue = require("vue");
let date_fns = require("date-fns");
//#region src/date-picker/src/panel/use-dual-calendar.ts
const useDualCalendarProps = {
	...require_date_picker_src_panel_use_panel_common.usePanelCommonProps,
	defaultCalendarStartTime: Number,
	defaultCalendarEndTime: Number,
	bindCalendarMonths: Boolean,
	actions: {
		type: Array,
		default: () => ["clear", "confirm"]
	}
};
function useDualCalendar(props, type) {
	const { isDateDisabledRef, isStartHourDisabledRef, isEndHourDisabledRef, isStartMinuteDisabledRef, isEndMinuteDisabledRef, isStartSecondDisabledRef, isEndSecondDisabledRef, isStartDateInvalidRef, isEndDateInvalidRef, isStartTimeInvalidRef, isEndTimeInvalidRef, isStartValueInvalidRef, isEndValueInvalidRef, isRangeInvalidRef, localeRef, rangesRef, closeOnSelectRef, updateValueOnCloseRef, firstDayOfWeekRef, datePickerSlots, monthFormatRef, yearFormatRef, quarterFormatRef, yearRangeRef } = (0, vue.inject)(require_date_picker_src_interface.datePickerInjectionKey);
	const validation = {
		isDateDisabled: isDateDisabledRef,
		isStartHourDisabled: isStartHourDisabledRef,
		isEndHourDisabled: isEndHourDisabledRef,
		isStartMinuteDisabled: isStartMinuteDisabledRef,
		isEndMinuteDisabled: isEndMinuteDisabledRef,
		isStartSecondDisabled: isStartSecondDisabledRef,
		isEndSecondDisabled: isEndSecondDisabledRef,
		isStartDateInvalid: isStartDateInvalidRef,
		isEndDateInvalid: isEndDateInvalidRef,
		isStartTimeInvalid: isStartTimeInvalidRef,
		isEndTimeInvalid: isEndTimeInvalidRef,
		isStartValueInvalid: isStartValueInvalidRef,
		isEndValueInvalid: isEndValueInvalidRef,
		isRangeInvalid: isRangeInvalidRef
	};
	const panelCommon = require_date_picker_src_panel_use_panel_common.usePanelCommon(props);
	const startDatesElRef = (0, vue.ref)(null);
	const endDatesElRef = (0, vue.ref)(null);
	const startYearScrollbarRef = (0, vue.ref)(null);
	const endYearScrollbarRef = (0, vue.ref)(null);
	const startYearVlRef = (0, vue.ref)(null);
	const endYearVlRef = (0, vue.ref)(null);
	const startMonthScrollbarRef = (0, vue.ref)(null);
	const endMonthScrollbarRef = (0, vue.ref)(null);
	const { value } = props;
	const defaultCalendarStartTime = props.defaultCalendarStartTime ?? (Array.isArray(value) && typeof value[0] === "number" ? value[0] : Date.now());
	const startCalendarDateTimeRef = (0, vue.ref)(defaultCalendarStartTime);
	const endCalendarDateTimeRef = (0, vue.ref)(props.defaultCalendarEndTime ?? (Array.isArray(value) && typeof value[1] === "number" ? value[1] : (0, date_fns.getTime)((0, date_fns.addMonths)(defaultCalendarStartTime, 1))));
	adjustCalendarTimes(true);
	const nowRef = (0, vue.ref)(Date.now());
	const isSelectingRef = (0, vue.ref)(false);
	const memorizedStartDateTimeRef = (0, vue.ref)(0);
	const mergedDateFormatRef = (0, vue.computed)(() => props.dateFormat || localeRef.value.dateFormat);
	const mergedDayFormatRef = (0, vue.computed)(() => props.calendarDayFormat || localeRef.value.dayFormat);
	const startDateInput = (0, vue.ref)(Array.isArray(value) ? (0, date_fns.format)(value[0], mergedDateFormatRef.value, panelCommon.dateFnsOptions.value) : "");
	const endDateInputRef = (0, vue.ref)(Array.isArray(value) ? (0, date_fns.format)(value[1], mergedDateFormatRef.value, panelCommon.dateFnsOptions.value) : "");
	const selectingPhaseRef = (0, vue.computed)(() => {
		if (isSelectingRef.value) return "end";
		else return "start";
	});
	const startDateArrayRef = (0, vue.computed)(() => {
		return require_date_picker_src_utils.dateArray(startCalendarDateTimeRef.value, props.value, nowRef.value, firstDayOfWeekRef.value ?? localeRef.value.firstDayOfWeek);
	});
	const endDateArrayRef = (0, vue.computed)(() => {
		return require_date_picker_src_utils.dateArray(endCalendarDateTimeRef.value, props.value, nowRef.value, firstDayOfWeekRef.value ?? localeRef.value.firstDayOfWeek);
	});
	const weekdaysRef = (0, vue.computed)(() => {
		return startDateArrayRef.value.slice(0, 7).map((dateItem) => {
			const { ts } = dateItem;
			return (0, date_fns.format)(ts, mergedDayFormatRef.value, panelCommon.dateFnsOptions.value);
		});
	});
	const startCalendarMonthRef = (0, vue.computed)(() => {
		return (0, date_fns.format)(startCalendarDateTimeRef.value, props.calendarHeaderMonthFormat || localeRef.value.monthFormat, panelCommon.dateFnsOptions.value);
	});
	const endCalendarMonthRef = (0, vue.computed)(() => {
		return (0, date_fns.format)(endCalendarDateTimeRef.value, props.calendarHeaderMonthFormat || localeRef.value.monthFormat, panelCommon.dateFnsOptions.value);
	});
	const startCalendarYearRef = (0, vue.computed)(() => {
		return (0, date_fns.format)(startCalendarDateTimeRef.value, props.calendarHeaderYearFormat || localeRef.value.yearFormat, panelCommon.dateFnsOptions.value);
	});
	const endCalendarYearRef = (0, vue.computed)(() => {
		return (0, date_fns.format)(endCalendarDateTimeRef.value, props.calendarHeaderYearFormat || localeRef.value.yearFormat, panelCommon.dateFnsOptions.value);
	});
	const startTimeValueRef = (0, vue.computed)(() => {
		const { value } = props;
		if (Array.isArray(value)) return value[0];
		return null;
	});
	const endTimeValueRef = (0, vue.computed)(() => {
		const { value } = props;
		if (Array.isArray(value)) return value[1];
		return null;
	});
	const shortcutsRef = (0, vue.computed)(() => {
		const { shortcuts } = props;
		return shortcuts || rangesRef.value;
	});
	const startYearArrayRef = (0, vue.computed)(() => {
		return require_date_picker_src_utils.yearArray(require_date_picker_src_utils.pluckValueFromRange(props.value, "start"), nowRef.value, { yearFormat: yearFormatRef.value }, yearRangeRef);
	});
	const endYearArrayRef = (0, vue.computed)(() => {
		return require_date_picker_src_utils.yearArray(require_date_picker_src_utils.pluckValueFromRange(props.value, "end"), nowRef.value, { yearFormat: yearFormatRef.value }, yearRangeRef);
	});
	const startQuarterArrayRef = (0, vue.computed)(() => {
		const startValue = require_date_picker_src_utils.pluckValueFromRange(props.value, "start");
		return require_date_picker_src_utils.quarterArray(startValue ?? Date.now(), startValue, nowRef.value, { quarterFormat: quarterFormatRef.value });
	});
	const endQuarterArrayRef = (0, vue.computed)(() => {
		const endValue = require_date_picker_src_utils.pluckValueFromRange(props.value, "end");
		return require_date_picker_src_utils.quarterArray(endValue ?? Date.now(), endValue, nowRef.value, { quarterFormat: quarterFormatRef.value });
	});
	const startMonthArrayRef = (0, vue.computed)(() => {
		const startValue = require_date_picker_src_utils.pluckValueFromRange(props.value, "start");
		return require_date_picker_src_utils.monthArray(startValue ?? Date.now(), startValue, nowRef.value, { monthFormat: monthFormatRef.value });
	});
	const endMonthArrayRef = (0, vue.computed)(() => {
		const endValue = require_date_picker_src_utils.pluckValueFromRange(props.value, "end");
		return require_date_picker_src_utils.monthArray(endValue ?? Date.now(), endValue, nowRef.value, { monthFormat: monthFormatRef.value });
	});
	const calendarMonthBeforeYearRef = (0, vue.computed)(() => {
		return props.calendarHeaderMonthBeforeYear ?? localeRef.value.monthBeforeYear;
	});
	(0, vue.watch)((0, vue.computed)(() => props.value), (value) => {
		if (value !== null && Array.isArray(value)) {
			const [startMoment, endMoment] = value;
			startDateInput.value = (0, date_fns.format)(startMoment, mergedDateFormatRef.value, panelCommon.dateFnsOptions.value);
			endDateInputRef.value = (0, date_fns.format)(endMoment, mergedDateFormatRef.value, panelCommon.dateFnsOptions.value);
			if (!isSelectingRef.value) syncCalendarTimeWithValue(value);
		} else {
			startDateInput.value = "";
			endDateInputRef.value = "";
		}
	});
	function handleCalendarChange(value, oldValue) {
		if (type === "daterange" || type === "datetimerange") {
			if ((0, date_fns.getYear)(value) !== (0, date_fns.getYear)(oldValue) || (0, date_fns.getMonth)(value) !== (0, date_fns.getMonth)(oldValue)) panelCommon.disableTransitionOneTick();
		}
	}
	(0, vue.watch)(startCalendarDateTimeRef, handleCalendarChange);
	(0, vue.watch)(endCalendarDateTimeRef, handleCalendarChange);
	function adjustCalendarTimes(byStartCalendarTime) {
		const startTime = (0, date_fns.startOfMonth)(startCalendarDateTimeRef.value);
		const endTime = (0, date_fns.startOfMonth)(endCalendarDateTimeRef.value);
		if (props.bindCalendarMonths || startTime >= endTime) {
			if (byStartCalendarTime) endCalendarDateTimeRef.value = (0, date_fns.getTime)((0, date_fns.addMonths)(startTime, 1));
			else startCalendarDateTimeRef.value = (0, date_fns.getTime)((0, date_fns.addMonths)(endTime, -1));
		}
	}
	function startCalendarNextYear() {
		startCalendarDateTimeRef.value = (0, date_fns.getTime)((0, date_fns.addMonths)(startCalendarDateTimeRef.value, 12));
		adjustCalendarTimes(true);
	}
	function startCalendarPrevYear() {
		startCalendarDateTimeRef.value = (0, date_fns.getTime)((0, date_fns.addMonths)(startCalendarDateTimeRef.value, -12));
		adjustCalendarTimes(true);
	}
	function startCalendarNextMonth() {
		startCalendarDateTimeRef.value = (0, date_fns.getTime)((0, date_fns.addMonths)(startCalendarDateTimeRef.value, 1));
		adjustCalendarTimes(true);
	}
	function startCalendarPrevMonth() {
		startCalendarDateTimeRef.value = (0, date_fns.getTime)((0, date_fns.addMonths)(startCalendarDateTimeRef.value, -1));
		adjustCalendarTimes(true);
	}
	function endCalendarNextYear() {
		endCalendarDateTimeRef.value = (0, date_fns.getTime)((0, date_fns.addMonths)(endCalendarDateTimeRef.value, 12));
		adjustCalendarTimes(false);
	}
	function endCalendarPrevYear() {
		endCalendarDateTimeRef.value = (0, date_fns.getTime)((0, date_fns.addMonths)(endCalendarDateTimeRef.value, -12));
		adjustCalendarTimes(false);
	}
	function endCalendarNextMonth() {
		endCalendarDateTimeRef.value = (0, date_fns.getTime)((0, date_fns.addMonths)(endCalendarDateTimeRef.value, 1));
		adjustCalendarTimes(false);
	}
	function endCalendarPrevMonth() {
		endCalendarDateTimeRef.value = (0, date_fns.getTime)((0, date_fns.addMonths)(endCalendarDateTimeRef.value, -1));
		adjustCalendarTimes(false);
	}
	function onUpdateStartCalendarValue(value) {
		startCalendarDateTimeRef.value = value;
		adjustCalendarTimes(true);
	}
	function onUpdateEndCalendarValue(value) {
		endCalendarDateTimeRef.value = value;
		adjustCalendarTimes(false);
	}
	function mergedIsDateDisabled(ts) {
		const isDateDisabled = isDateDisabledRef.value;
		if (!isDateDisabled) return false;
		if (!Array.isArray(props.value)) return isDateDisabled(ts, "start", null);
		if (selectingPhaseRef.value === "start") return isDateDisabled(ts, "start", null);
		else {
			const { value: memorizedStartDateTime } = memorizedStartDateTimeRef;
			if (ts < memorizedStartDateTimeRef.value) return isDateDisabled(ts, "start", [memorizedStartDateTime, memorizedStartDateTime]);
			else return isDateDisabled(ts, "end", [memorizedStartDateTime, memorizedStartDateTime]);
		}
	}
	function syncCalendarTimeWithValue(value) {
		if (value === null) return;
		const [startMoment, endMoment] = value;
		startCalendarDateTimeRef.value = startMoment;
		if ((0, date_fns.startOfMonth)(endMoment) <= (0, date_fns.startOfMonth)(startMoment)) endCalendarDateTimeRef.value = (0, date_fns.getTime)((0, date_fns.startOfMonth)((0, date_fns.addMonths)(startMoment, 1)));
		else endCalendarDateTimeRef.value = (0, date_fns.getTime)((0, date_fns.startOfMonth)(endMoment));
	}
	function handleDateClick(dateItem) {
		if (!isSelectingRef.value) {
			isSelectingRef.value = true;
			memorizedStartDateTimeRef.value = dateItem.ts;
			changeStartEndTime(dateItem.ts, dateItem.ts, "done");
		} else {
			isSelectingRef.value = false;
			const { value } = props;
			if (props.panel && Array.isArray(value)) changeStartEndTime(value[0], value[1], "done");
			else if (closeOnSelectRef.value && type === "daterange") {
				if (updateValueOnCloseRef.value) closeCalendar();
				else handleConfirmClick();
			}
		}
	}
	function handleDateMouseEnter(dateItem) {
		if (isSelectingRef.value) {
			if (mergedIsDateDisabled(dateItem.ts)) return;
			if (dateItem.ts >= memorizedStartDateTimeRef.value) changeStartEndTime(memorizedStartDateTimeRef.value, dateItem.ts, "wipPreview");
			else changeStartEndTime(dateItem.ts, memorizedStartDateTimeRef.value, "wipPreview");
		}
	}
	function handleConfirmClick() {
		if (isRangeInvalidRef.value) return;
		panelCommon.doConfirm();
		closeCalendar();
	}
	function closeCalendar() {
		isSelectingRef.value = false;
		if (props.active) panelCommon.doClose();
	}
	function changeStartDateTime(time) {
		if (typeof time !== "number") time = (0, date_fns.getTime)(time);
		if (props.value === null) panelCommon.doUpdateValue([time, time], props.panel);
		else if (Array.isArray(props.value)) panelCommon.doUpdateValue([time, Math.max(props.value[1], time)], props.panel);
	}
	function changeEndDateTime(time) {
		if (typeof time !== "number") time = (0, date_fns.getTime)(time);
		if (props.value === null) panelCommon.doUpdateValue([time, time], props.panel);
		else if (Array.isArray(props.value)) panelCommon.doUpdateValue([Math.min(props.value[0], time), time], props.panel);
	}
	function changeStartEndTime(startTime, endTime, source) {
		if (typeof startTime !== "number") startTime = (0, date_fns.getTime)(startTime);
		if (source !== "shortcutPreview" && source !== "shortcutDone") {
			let startDefaultTime;
			let endDefaultTime;
			if (type === "datetimerange") {
				const { defaultTime } = props;
				if (typeof defaultTime === "function") {
					startDefaultTime = require_date_picker_src_utils.extractRangeDefaultTime(startTime, defaultTime, "start", [startTime, endTime]);
					endDefaultTime = require_date_picker_src_utils.extractRangeDefaultTime(endTime, defaultTime, "end", [startTime, endTime]);
				} else if (Array.isArray(defaultTime)) {
					startDefaultTime = require_date_picker_src_utils.getDefaultTime(defaultTime[0]);
					endDefaultTime = require_date_picker_src_utils.getDefaultTime(defaultTime[1]);
				} else {
					startDefaultTime = require_date_picker_src_utils.getDefaultTime(defaultTime);
					endDefaultTime = startDefaultTime;
				}
			}
			if (startDefaultTime) startTime = (0, date_fns.getTime)((0, date_fns.set)(startTime, startDefaultTime));
			if (endDefaultTime) endTime = (0, date_fns.getTime)((0, date_fns.set)(endTime, endDefaultTime));
		}
		panelCommon.doUpdateValue([startTime, endTime], props.panel && (source === "done" || source === "shortcutDone"));
	}
	function sanitizeValue(datetime) {
		if (type === "datetimerange") return (0, date_fns.getTime)((0, date_fns.startOfSecond)(datetime));
		else if (type === "monthrange") return (0, date_fns.getTime)((0, date_fns.startOfMonth)(datetime));
		else return (0, date_fns.getTime)((0, date_fns.startOfDay)(datetime));
	}
	function handleStartDateInput(value) {
		const date = require_date_picker_src_utils.strictParse(value, mergedDateFormatRef.value, /* @__PURE__ */ new Date(), panelCommon.dateFnsOptions.value);
		if ((0, date_fns.isValid)(date)) {
			if (!props.value) {
				const newValue = (0, date_fns.set)(/* @__PURE__ */ new Date(), {
					year: (0, date_fns.getYear)(date),
					month: (0, date_fns.getMonth)(date),
					date: (0, date_fns.getDate)(date)
				});
				changeStartDateTime(sanitizeValue((0, date_fns.getTime)(newValue)));
			} else if (Array.isArray(props.value)) {
				const newValue = (0, date_fns.set)(props.value[0], {
					year: (0, date_fns.getYear)(date),
					month: (0, date_fns.getMonth)(date),
					date: (0, date_fns.getDate)(date)
				});
				changeStartDateTime(sanitizeValue((0, date_fns.getTime)(newValue)));
			}
		} else startDateInput.value = value;
	}
	function handleEndDateInput(value) {
		/** strict check when input */
		const date = require_date_picker_src_utils.strictParse(value, mergedDateFormatRef.value, /* @__PURE__ */ new Date(), panelCommon.dateFnsOptions.value);
		if ((0, date_fns.isValid)(date)) {
			if (props.value === null) {
				const newValue = (0, date_fns.set)(/* @__PURE__ */ new Date(), {
					year: (0, date_fns.getYear)(date),
					month: (0, date_fns.getMonth)(date),
					date: (0, date_fns.getDate)(date)
				});
				changeEndDateTime(sanitizeValue((0, date_fns.getTime)(newValue)));
			} else if (Array.isArray(props.value)) {
				const newValue = (0, date_fns.set)(props.value[1], {
					year: (0, date_fns.getYear)(date),
					month: (0, date_fns.getMonth)(date),
					date: (0, date_fns.getDate)(date)
				});
				changeEndDateTime(sanitizeValue((0, date_fns.getTime)(newValue)));
			}
		} else endDateInputRef.value = value;
	}
	function handleStartDateInputBlur() {
		const date = require_date_picker_src_utils.strictParse(startDateInput.value, mergedDateFormatRef.value, /* @__PURE__ */ new Date(), panelCommon.dateFnsOptions.value);
		const { value } = props;
		if ((0, date_fns.isValid)(date)) {
			if (value === null) {
				const newValue = (0, date_fns.set)(/* @__PURE__ */ new Date(), {
					year: (0, date_fns.getYear)(date),
					month: (0, date_fns.getMonth)(date),
					date: (0, date_fns.getDate)(date)
				});
				changeStartDateTime(sanitizeValue((0, date_fns.getTime)(newValue)));
			} else if (Array.isArray(value)) {
				const newValue = (0, date_fns.set)(value[0], {
					year: (0, date_fns.getYear)(date),
					month: (0, date_fns.getMonth)(date),
					date: (0, date_fns.getDate)(date)
				});
				changeStartDateTime(sanitizeValue((0, date_fns.getTime)(newValue)));
			}
		} else refreshDisplayDateString();
	}
	function handleEndDateInputBlur() {
		const date = require_date_picker_src_utils.strictParse(endDateInputRef.value, mergedDateFormatRef.value, /* @__PURE__ */ new Date(), panelCommon.dateFnsOptions.value);
		const { value } = props;
		if ((0, date_fns.isValid)(date)) {
			if (value === null) {
				const newValue = (0, date_fns.set)(/* @__PURE__ */ new Date(), {
					year: (0, date_fns.getYear)(date),
					month: (0, date_fns.getMonth)(date),
					date: (0, date_fns.getDate)(date)
				});
				changeEndDateTime(sanitizeValue((0, date_fns.getTime)(newValue)));
			} else if (Array.isArray(value)) {
				const newValue = (0, date_fns.set)(value[1], {
					year: (0, date_fns.getYear)(date),
					month: (0, date_fns.getMonth)(date),
					date: (0, date_fns.getDate)(date)
				});
				changeEndDateTime(sanitizeValue((0, date_fns.getTime)(newValue)));
			}
		} else refreshDisplayDateString();
	}
	function refreshDisplayDateString(times) {
		const { value } = props;
		if (value === null || !Array.isArray(value)) {
			startDateInput.value = "";
			endDateInputRef.value = "";
			return;
		}
		if (times === void 0) times = value;
		startDateInput.value = (0, date_fns.format)(times[0], mergedDateFormatRef.value, panelCommon.dateFnsOptions.value);
		endDateInputRef.value = (0, date_fns.format)(times[1], mergedDateFormatRef.value, panelCommon.dateFnsOptions.value);
	}
	function handleStartTimePickerChange(value) {
		if (value === null) return;
		changeStartDateTime(value);
	}
	function handleEndTimePickerChange(value) {
		if (value === null) return;
		changeEndDateTime(value);
	}
	function handleRangeShortcutMouseenter(shortcut) {
		panelCommon.cachePendingValue();
		const shortcutValue = panelCommon.getShortcutValue(shortcut);
		if (!Array.isArray(shortcutValue)) return;
		changeStartEndTime(shortcutValue[0], shortcutValue[1], "shortcutPreview");
	}
	function handleRangeShortcutClick(shortcut) {
		const shortcutValue = panelCommon.getShortcutValue(shortcut);
		if (!Array.isArray(shortcutValue)) return;
		changeStartEndTime(shortcutValue[0], shortcutValue[1], "shortcutDone");
		panelCommon.clearPendingValue();
		handleConfirmClick();
	}
	function justifyColumnsScrollState(value, type) {
		const mergedValue = value === void 0 ? props.value : value;
		if (value === void 0 || type === "start") {
			if (startMonthScrollbarRef.value) {
				const monthIndex = !Array.isArray(mergedValue) ? (0, date_fns.getMonth)(Date.now()) : (0, date_fns.getMonth)(mergedValue[0]);
				startMonthScrollbarRef.value.scrollTo({
					debounce: false,
					index: monthIndex,
					elSize: 40
				});
			}
			if (startYearVlRef.value) {
				const yearIndex = (!Array.isArray(mergedValue) ? (0, date_fns.getYear)(Date.now()) : (0, date_fns.getYear)(mergedValue[0])) - yearRangeRef.value[0];
				startYearVlRef.value.scrollTo({
					index: yearIndex,
					debounce: false
				});
			}
		}
		if (value === void 0 || type === "end") {
			if (endMonthScrollbarRef.value) {
				const monthIndex = !Array.isArray(mergedValue) ? (0, date_fns.getMonth)(Date.now()) : (0, date_fns.getMonth)(mergedValue[1]);
				endMonthScrollbarRef.value.scrollTo({
					debounce: false,
					index: monthIndex,
					elSize: 40
				});
			}
			if (endYearVlRef.value) {
				const yearIndex = (!Array.isArray(mergedValue) ? (0, date_fns.getYear)(Date.now()) : (0, date_fns.getYear)(mergedValue[1])) - yearRangeRef.value[0];
				endYearVlRef.value.scrollTo({
					index: yearIndex,
					debounce: false
				});
			}
		}
	}
	function handleColItemClick(dateItem, clickType) {
		const { value } = props;
		const noCurrentValue = !Array.isArray(value);
		const itemTs = dateItem.type === "year" && type !== "yearrange" ? noCurrentValue ? (0, date_fns.set)(dateItem.ts, { month: (0, date_fns.getMonth)(type === "quarterrange" ? (0, date_fns.startOfQuarter)(/* @__PURE__ */ new Date()) : /* @__PURE__ */ new Date()) }).valueOf() : (0, date_fns.set)(dateItem.ts, { month: (0, date_fns.getMonth)(type === "quarterrange" ? (0, date_fns.startOfQuarter)(value[clickType === "start" ? 0 : 1]) : value[clickType === "start" ? 0 : 1]) }).valueOf() : dateItem.ts;
		if (noCurrentValue) {
			const partialValue = sanitizeValue(itemTs);
			const nextValue = [partialValue, partialValue];
			panelCommon.doUpdateValue(nextValue, props.panel);
			justifyColumnsScrollState(nextValue, "start");
			justifyColumnsScrollState(nextValue, "end");
			panelCommon.disableTransitionOneTick();
			return;
		}
		const nextValue = [value[0], value[1]];
		let otherPartsChanged = false;
		if (clickType === "start") {
			nextValue[0] = sanitizeValue(itemTs);
			if (nextValue[0] > nextValue[1]) {
				nextValue[1] = nextValue[0];
				otherPartsChanged = true;
			}
		} else {
			nextValue[1] = sanitizeValue(itemTs);
			if (nextValue[0] > nextValue[1]) {
				nextValue[0] = nextValue[1];
				otherPartsChanged = true;
			}
		}
		panelCommon.doUpdateValue(nextValue, props.panel);
		switch (type) {
			case "monthrange":
			case "quarterrange":
				panelCommon.disableTransitionOneTick();
				if (otherPartsChanged) {
					justifyColumnsScrollState(nextValue, "start");
					justifyColumnsScrollState(nextValue, "end");
				} else justifyColumnsScrollState(nextValue, clickType);
				break;
			case "yearrange":
				panelCommon.disableTransitionOneTick();
				justifyColumnsScrollState(nextValue, "start");
				justifyColumnsScrollState(nextValue, "end");
		}
	}
	function handleStartYearVlScroll() {
		startYearScrollbarRef.value?.sync();
	}
	function handleEndYearVlScroll() {
		endYearScrollbarRef.value?.sync();
	}
	function virtualListContainer(type) {
		if (type === "start") return startYearVlRef.value?.listElRef || null;
		else return endYearVlRef.value?.listElRef || null;
	}
	function virtualListContent(type) {
		if (type === "start") return startYearVlRef.value?.itemsElRef || null;
		else return endYearVlRef.value?.itemsElRef || null;
	}
	return {
		startDatesElRef,
		endDatesElRef,
		handleDateClick,
		handleColItemClick,
		handleDateMouseEnter,
		handleConfirmClick,
		startCalendarPrevYear,
		startCalendarPrevMonth,
		startCalendarNextYear,
		startCalendarNextMonth,
		endCalendarPrevYear,
		endCalendarPrevMonth,
		endCalendarNextMonth,
		endCalendarNextYear,
		mergedIsDateDisabled,
		changeStartEndTime,
		ranges: rangesRef,
		calendarMonthBeforeYear: calendarMonthBeforeYearRef,
		startCalendarMonth: startCalendarMonthRef,
		startCalendarYear: startCalendarYearRef,
		endCalendarMonth: endCalendarMonthRef,
		endCalendarYear: endCalendarYearRef,
		weekdays: weekdaysRef,
		startDateArray: startDateArrayRef,
		endDateArray: endDateArrayRef,
		startYearArray: startYearArrayRef,
		startMonthArray: startMonthArrayRef,
		startQuarterArray: startQuarterArrayRef,
		endYearArray: endYearArrayRef,
		endMonthArray: endMonthArrayRef,
		endQuarterArray: endQuarterArrayRef,
		isSelecting: isSelectingRef,
		handleRangeShortcutMouseenter,
		handleRangeShortcutClick,
		...panelCommon,
		...validation,
		startYearVlRef,
		endYearVlRef,
		startMonthScrollbarRef,
		endMonthScrollbarRef,
		startYearScrollbarRef,
		endYearScrollbarRef,
		startDateDisplayString: startDateInput,
		endDateInput: endDateInputRef,
		timePickerSize: panelCommon.timePickerSize,
		startTimeValue: startTimeValueRef,
		endTimeValue: endTimeValueRef,
		datePickerSlots,
		shortcuts: shortcutsRef,
		startCalendarDateTime: startCalendarDateTimeRef,
		endCalendarDateTime: endCalendarDateTimeRef,
		justifyColumnsScrollState,
		handleFocusDetectorFocus: panelCommon.handleFocusDetectorFocus,
		handleStartTimePickerChange,
		handleEndTimePickerChange,
		handleStartDateInput,
		handleStartDateInputBlur,
		handleEndDateInput,
		handleEndDateInputBlur,
		handleStartYearVlScroll,
		handleEndYearVlScroll,
		virtualListContainer,
		virtualListContent,
		onUpdateStartCalendarValue,
		onUpdateEndCalendarValue
	};
}
//#endregion
exports.useDualCalendar = useDualCalendar;
exports.useDualCalendarProps = useDualCalendarProps;
