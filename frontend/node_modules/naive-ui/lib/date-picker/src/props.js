Object.defineProperty(exports, Symbol.toStringTag, { value: "Module" });
const require__utils_composable_use_adjusted_to = require("../../_utils/composable/use-adjusted-to.js");
//#region src/date-picker/src/props.ts
const datePickerProps = {
	...require("../../_mixins/use-theme.js").default.props,
	to: require__utils_composable_use_adjusted_to.useAdjustedTo.propTo,
	bordered: {
		type: Boolean,
		default: void 0
	},
	clearable: Boolean,
	fastYearSelect: Boolean,
	fastMonthSelect: Boolean,
	updateValueOnClose: Boolean,
	calendarDayFormat: String,
	calendarHeaderYearFormat: String,
	calendarHeaderMonthFormat: String,
	calendarHeaderMonthYearSeparator: {
		type: String,
		default: " "
	},
	calendarHeaderMonthBeforeYear: {
		type: Boolean,
		default: void 0
	},
	defaultValue: [Number, Array],
	defaultFormattedValue: [String, Array],
	defaultTime: [
		Number,
		String,
		Array,
		Function
	],
	disabled: {
		type: Boolean,
		default: void 0
	},
	placement: {
		type: String,
		default: "bottom-start"
	},
	value: [Number, Array],
	formattedValue: [String, Array],
	size: String,
	type: {
		type: String,
		default: "date"
	},
	valueFormat: String,
	separator: String,
	placeholder: String,
	startPlaceholder: String,
	endPlaceholder: String,
	format: String,
	dateFormat: String,
	timePickerFormat: String,
	actions: Array,
	shortcuts: Object,
	isDateDisabled: Function,
	isTimeDisabled: Function,
	show: {
		type: Boolean,
		default: void 0
	},
	panel: Boolean,
	ranges: Object,
	firstDayOfWeek: Number,
	inputReadonly: Boolean,
	closeOnSelect: Boolean,
	status: String,
	timePickerProps: [Object, Array],
	onClear: Function,
	onConfirm: Function,
	defaultCalendarStartTime: Number,
	defaultCalendarEndTime: Number,
	bindCalendarMonths: Boolean,
	monthFormat: {
		type: String,
		default: "M"
	},
	yearFormat: {
		type: String,
		default: "y"
	},
	quarterFormat: {
		type: String,
		default: "'Q'Q"
	},
	yearRange: {
		type: Array,
		default: () => [1901, 2100]
	},
	"onUpdate:show": [Function, Array],
	onUpdateShow: [Function, Array],
	"onUpdate:formattedValue": [Function, Array],
	onUpdateFormattedValue: [Function, Array],
	"onUpdate:value": [Function, Array],
	onUpdateValue: [Function, Array],
	onFocus: [Function, Array],
	onBlur: [Function, Array],
	onNextMonth: Function,
	onPrevMonth: Function,
	onNextYear: Function,
	onPrevYear: Function,
	onChange: [Function, Array]
};
//#endregion
exports.datePickerProps = datePickerProps;
