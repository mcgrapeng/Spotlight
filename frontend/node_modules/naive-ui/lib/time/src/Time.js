Object.defineProperties(exports, {
	__esModule: { value: true },
	[Symbol.toStringTag]: { value: "Module" }
});
const require__mixins_use_locale = require("../../_mixins/use-locale.js");
let vue = require("vue");
let date_fns = require("date-fns");
let date_fns_tz = require("date-fns-tz");
//#region src/time/src/Time.ts
const timeProps = {
	time: {
		type: [Number, Date],
		default: void 0
	},
	type: {
		type: String,
		default: "datetime"
	},
	to: {
		type: [Number, Date],
		default: void 0
	},
	unix: Boolean,
	format: String,
	text: Boolean,
	timeZone: String
};
var Time_default = (0, vue.defineComponent)({
	name: "Time",
	props: timeProps,
	setup(props) {
		const now = Date.now();
		const { localeRef, dateLocaleRef } = require__mixins_use_locale("Time");
		const mergedFormatRef = (0, vue.computed)(() => {
			const { timeZone } = props;
			if (timeZone) return (time, _format, options) => {
				return (0, date_fns_tz.formatInTimeZone)(time, timeZone, _format, options);
			};
			return date_fns.format;
		});
		const dateFnsOptionsRef = (0, vue.computed)(() => {
			return { locale: dateLocaleRef.value.locale };
		});
		const mergedTimeRef = (0, vue.computed)(() => {
			const { time } = props;
			if (props.unix) {
				if (time === void 0) return now;
				return (0, date_fns.fromUnixTime)(typeof time === "number" ? time : time.valueOf());
			}
			return time ?? now;
		});
		const mergedToRef = (0, vue.computed)(() => {
			const { to } = props;
			if (props.unix) {
				if (to === void 0) return now;
				return (0, date_fns.fromUnixTime)(typeof to === "number" ? to : to.valueOf());
			}
			return to ?? now;
		});
		return { renderedTime: (0, vue.computed)(() => {
			if (props.format) return mergedFormatRef.value(mergedTimeRef.value, props.format, dateFnsOptionsRef.value);
			else if (props.type === "date") return mergedFormatRef.value(mergedTimeRef.value, localeRef.value.dateFormat, dateFnsOptionsRef.value);
			else if (props.type === "datetime") return mergedFormatRef.value(mergedTimeRef.value, localeRef.value.dateTimeFormat, dateFnsOptionsRef.value);
			else return (0, date_fns.formatDistanceStrict)(mergedTimeRef.value, mergedToRef.value, {
				addSuffix: true,
				locale: dateLocaleRef.value.locale
			});
		}) };
	},
	render() {
		return this.text ? (0, vue.createTextVNode)(this.renderedTime) : (0, vue.h)("time", [this.renderedTime]);
	}
});
//#endregion
exports.default = Time_default;
exports.timeProps = timeProps;
