Object.defineProperty(exports, Symbol.toStringTag, { value: "Module" });
let vue = require("vue");
let date_fns = require("date-fns");
//#region src/date-picker/src/validation-utils.ts
function uniCalendarValidation(props, mergedValueRef) {
	const timePickerValidatorRef = (0, vue.computed)(() => {
		const { isTimeDisabled } = props;
		const { value } = mergedValueRef;
		if (value === null || Array.isArray(value)) return void 0;
		return isTimeDisabled?.(value);
	});
	const isHourDisabledRef = (0, vue.computed)(() => {
		return timePickerValidatorRef.value?.isHourDisabled;
	});
	const isMinuteDisabledRef = (0, vue.computed)(() => {
		return timePickerValidatorRef.value?.isMinuteDisabled;
	});
	const isSecondDisabledRef = (0, vue.computed)(() => {
		return timePickerValidatorRef.value?.isSecondDisabled;
	});
	const isDateInvalidRef = (0, vue.computed)(() => {
		const { type, isDateDisabled } = props;
		const { value } = mergedValueRef;
		if (value === null || Array.isArray(value) || !["date", "datetime"].includes(type) || !isDateDisabled) return false;
		return isDateDisabled(value, { type: "input" });
	});
	const isTimeInvalidRef = (0, vue.computed)(() => {
		const { type } = props;
		const { value } = mergedValueRef;
		if (value === null || !(type !== "datetime") || Array.isArray(value)) return false;
		const time = new Date(value);
		const hour = time.getHours();
		const minute = time.getMinutes();
		const second = time.getMinutes();
		return (isHourDisabledRef.value ? isHourDisabledRef.value(hour) : false) || (isMinuteDisabledRef.value ? isMinuteDisabledRef.value(minute, hour) : false) || (isSecondDisabledRef.value ? isSecondDisabledRef.value(second, minute, hour) : false);
	});
	const isDateTimeInvalidRef = (0, vue.computed)(() => {
		return isDateInvalidRef.value || isTimeInvalidRef.value;
	});
	return {
		isValueInvalidRef: (0, vue.computed)(() => {
			const { type } = props;
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
	const timePickerValidatorRef = (0, vue.computed)(() => {
		const { isTimeDisabled } = props;
		const { value } = mergedValueRef;
		if (!Array.isArray(value) || !isTimeDisabled) return [void 0, void 0];
		return [isTimeDisabled?.(value[0], "start", value), isTimeDisabled?.(value[1], "end", value)];
	});
	const timeValidator = {
		isStartHourDisabledRef: (0, vue.computed)(() => timePickerValidatorRef.value[0]?.isHourDisabled),
		isEndHourDisabledRef: (0, vue.computed)(() => timePickerValidatorRef.value[1]?.isHourDisabled),
		isStartMinuteDisabledRef: (0, vue.computed)(() => timePickerValidatorRef.value[0]?.isMinuteDisabled),
		isEndMinuteDisabledRef: (0, vue.computed)(() => timePickerValidatorRef.value[1]?.isMinuteDisabled),
		isStartSecondDisabledRef: (0, vue.computed)(() => timePickerValidatorRef.value[0]?.isSecondDisabled),
		isEndSecondDisabledRef: (0, vue.computed)(() => timePickerValidatorRef.value[1]?.isSecondDisabled)
	};
	const isStartDateInvalidRef = (0, vue.computed)(() => {
		const { type, isDateDisabled } = props;
		const { value } = mergedValueRef;
		if (value === null || !Array.isArray(value) || !["daterange", "datetimerange"].includes(type) || !isDateDisabled) return false;
		return isDateDisabled(value[0], "start", value);
	});
	const isEndDateInvalidRef = (0, vue.computed)(() => {
		const { type, isDateDisabled } = props;
		const { value } = mergedValueRef;
		if (value === null || !Array.isArray(value) || !["daterange", "datetimerange"].includes(type) || !isDateDisabled) return false;
		return isDateDisabled(value[1], "end", value);
	});
	const isStartTimeInvalidRef = (0, vue.computed)(() => {
		const { type } = props;
		const { value } = mergedValueRef;
		if (value === null || !Array.isArray(value) || type !== "datetimerange") return false;
		const startHours = (0, date_fns.getHours)(value[0]);
		const startMinutes = (0, date_fns.getMinutes)(value[0]);
		const startSeconds = (0, date_fns.getSeconds)(value[0]);
		const { isStartHourDisabledRef, isStartMinuteDisabledRef, isStartSecondDisabledRef } = timeValidator;
		return (isStartHourDisabledRef.value ? isStartHourDisabledRef.value(startHours) : false) || (isStartMinuteDisabledRef.value ? isStartMinuteDisabledRef.value(startMinutes, startHours) : false) || (isStartSecondDisabledRef.value ? isStartSecondDisabledRef.value(startSeconds, startMinutes, startHours) : false);
	});
	const isEndTimeInvalidRef = (0, vue.computed)(() => {
		const { type } = props;
		const { value } = mergedValueRef;
		if (value === null || !Array.isArray(value) || type !== "datetimerange") return false;
		const endHours = (0, date_fns.getHours)(value[1]);
		const endMinutes = (0, date_fns.getMinutes)(value[1]);
		const endSeconds = (0, date_fns.getSeconds)(value[1]);
		const { isEndHourDisabledRef, isEndMinuteDisabledRef, isEndSecondDisabledRef } = timeValidator;
		return (isEndHourDisabledRef.value ? isEndHourDisabledRef.value(endHours) : false) || (isEndMinuteDisabledRef.value ? isEndMinuteDisabledRef.value(endMinutes, endHours) : false) || (isEndSecondDisabledRef.value ? isEndSecondDisabledRef.value(endSeconds, endMinutes, endHours) : false);
	});
	const isStartValueInvalidRef = (0, vue.computed)(() => {
		return isStartDateInvalidRef.value || isStartTimeInvalidRef.value;
	});
	const isEndValueInvalidRef = (0, vue.computed)(() => {
		return isEndDateInvalidRef.value || isEndTimeInvalidRef.value;
	});
	const isRangeInvalidRef = (0, vue.computed)(() => {
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
exports.dualCalendarValidation = dualCalendarValidation;
exports.uniCalendarValidation = uniCalendarValidation;
