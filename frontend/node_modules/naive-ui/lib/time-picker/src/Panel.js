const require_vdom = require("../../vue-jsx-vapor/vdom.js");
const require__internal_focus_detector_index = require("../../_internal/focus-detector/index.js");
const require__internal_scrollbar_src_Scrollbar = require("../../_internal/scrollbar/src/Scrollbar.js");
const require_button_src_Button = require("../../button/src/Button.js");
const require_time_picker_src_interface = require("./interface.js");
const require_time_picker_src_PanelCol = require("./PanelCol.js");
const require_time_picker_src_utils = require("./utils.js");
let vue = require("vue");
//#region src/time-picker/src/Panel.tsx
const _hoisted_1 = [
	"onFocusin",
	"onFocusout",
	"onKeydown"
];
const timePickerPanelProps = {
	actions: {
		type: Array,
		default: () => ["now", "confirm"]
	},
	showHour: {
		type: Boolean,
		default: true
	},
	showMinute: {
		type: Boolean,
		default: true
	},
	showSecond: {
		type: Boolean,
		default: true
	},
	showPeriod: {
		type: Boolean,
		default: true
	},
	isHourInvalid: Boolean,
	isMinuteInvalid: Boolean,
	isSecondInvalid: Boolean,
	isAmPmInvalid: Boolean,
	isValueInvalid: Boolean,
	hourValue: {
		type: Number,
		default: null
	},
	minuteValue: {
		type: Number,
		default: null
	},
	secondValue: {
		type: Number,
		default: null
	},
	amPmValue: {
		type: String,
		default: null
	},
	isHourDisabled: Function,
	isMinuteDisabled: Function,
	isSecondDisabled: Function,
	onHourClick: {
		type: Function,
		required: true
	},
	onMinuteClick: {
		type: Function,
		required: true
	},
	onSecondClick: {
		type: Function,
		required: true
	},
	onAmPmClick: {
		type: Function,
		required: true
	},
	onNowClick: Function,
	clearText: String,
	nowText: String,
	confirmText: String,
	transitionDisabled: Boolean,
	onClearClick: Function,
	onConfirmClick: Function,
	onFocusin: Function,
	onFocusout: Function,
	onFocusDetectorFocus: Function,
	onKeydown: Function,
	hours: [Number, Array],
	minutes: [Number, Array],
	seconds: [Number, Array],
	use12Hours: Boolean
};
var Panel_default = (0, vue.defineComponent)({
	name: "TimePickerPanel",
	props: timePickerPanelProps,
	setup(props) {
		const { mergedThemeRef, mergedClsPrefixRef } = (0, vue.inject)(require_time_picker_src_interface.timePickerInjectionKey);
		return {
			mergedTheme: mergedThemeRef,
			mergedClsPrefix: mergedClsPrefixRef,
			hours: (0, vue.computed)(() => {
				const { isHourDisabled, hours, use12Hours, amPmValue } = props;
				if (!use12Hours) return require_time_picker_src_utils.getTimeUnits(require_time_picker_src_utils.time.hours, hours).map((hour) => {
					return {
						label: hour,
						value: Number(hour),
						disabled: isHourDisabled ? isHourDisabled(Number(hour)) : false
					};
				});
				else {
					const mergedAmPmValue = amPmValue ?? require_time_picker_src_utils.getAmPm(Date.now());
					return require_time_picker_src_utils.getTimeUnits(require_time_picker_src_utils.time.hours, hours, mergedAmPmValue).map((hour) => {
						const hourAs12FormattedNumber = Number(hour);
						const hourAs24FormattedNumber = mergedAmPmValue === "pm" && hourAs12FormattedNumber !== 12 ? hourAs12FormattedNumber + 12 : hourAs12FormattedNumber;
						return {
							label: hour,
							value: hourAs24FormattedNumber,
							disabled: isHourDisabled ? isHourDisabled(hourAs24FormattedNumber) : false
						};
					});
				}
			}),
			minutes: (0, vue.computed)(() => {
				const { isMinuteDisabled, minutes } = props;
				return require_time_picker_src_utils.getTimeUnits(require_time_picker_src_utils.time.minutes, minutes).map((minute) => {
					return {
						label: minute,
						value: Number(minute),
						disabled: isMinuteDisabled ? isMinuteDisabled(Number(minute), props.hourValue) : false
					};
				});
			}),
			seconds: (0, vue.computed)(() => {
				const { isSecondDisabled, seconds } = props;
				return require_time_picker_src_utils.getTimeUnits(require_time_picker_src_utils.time.seconds, seconds).map((second) => {
					return {
						label: second,
						value: Number(second),
						disabled: isSecondDisabled ? isSecondDisabled(Number(second), props.minuteValue, props.hourValue) : false
					};
				});
			}),
			amPm: (0, vue.computed)(() => {
				const { isHourDisabled } = props;
				let amDisabled = true;
				let pmDisabled = true;
				for (let i = 0; i < 12; ++i) if (!isHourDisabled?.(i)) {
					amDisabled = false;
					break;
				}
				for (let i = 12; i < 24; ++i) if (!isHourDisabled?.(i)) {
					pmDisabled = false;
					break;
				}
				return [{
					label: "AM",
					value: "am",
					disabled: amDisabled
				}, {
					label: "PM",
					value: "pm",
					disabled: pmDisabled
				}];
			}),
			hourScrollRef: (0, vue.ref)(null),
			minuteScrollRef: (0, vue.ref)(null),
			secondScrollRef: (0, vue.ref)(null),
			amPmScrollRef: (0, vue.ref)(null)
		};
	},
	render() {
		const { mergedClsPrefix, mergedTheme } = this;
		return (0, vue.openBlock)(), (0, vue.createElementBlock)("div", {
			tabindex: 0,
			class: require_vdom.normalizeClass(`${mergedClsPrefix}-time-picker-panel`),
			onFocusin: this.onFocusin,
			onFocusout: this.onFocusout,
			onKeydown: this.onKeydown
		}, [
			(0, vue.createElementVNode)("div", { class: require_vdom.normalizeClass(`${mergedClsPrefix}-time-picker-cols`) }, [
				this.showHour ? ((0, vue.openBlock)(), (0, vue.createElementBlock)("div", {
					key: 0,
					class: require_vdom.normalizeClass([
						`${mergedClsPrefix}-time-picker-col`,
						this.isHourInvalid && `${mergedClsPrefix}-time-picker-col--invalid`,
						this.transitionDisabled && `${mergedClsPrefix}-time-picker-col--transition-disabled`
					])
				}, [((0, vue.openBlock)(), (0, vue.createBlock)(require__internal_scrollbar_src_Scrollbar.default, {
					ref: "hourScrollRef",
					theme: mergedTheme.peers.Scrollbar,
					themeOverrides: mergedTheme.peerOverrides.Scrollbar
				}, { default: () => [((0, vue.openBlock)(), (0, vue.createBlock)(require_time_picker_src_PanelCol, {
					clsPrefix: mergedClsPrefix,
					data: this.hours,
					activeValue: this.hourValue,
					onItemClick: this.onHourClick
				}, null, 8, [
					"clsPrefix",
					"data",
					"activeValue",
					"onItemClick"
				])), ((0, vue.openBlock)(), (0, vue.createElementBlock)("div", { class: require_vdom.normalizeClass(`${mergedClsPrefix}-time-picker-col__padding`) }, null, 2))] }, 1032, ["theme", "themeOverrides"]))], 2)) : require_vdom.normalizeVNode(() => null),
				this.showMinute ? ((0, vue.openBlock)(), (0, vue.createElementBlock)("div", {
					key: 2,
					class: require_vdom.normalizeClass([
						`${mergedClsPrefix}-time-picker-col`,
						this.transitionDisabled && `${mergedClsPrefix}-time-picker-col--transition-disabled`,
						this.isMinuteInvalid && `${mergedClsPrefix}-time-picker-col--invalid`
					])
				}, [((0, vue.openBlock)(), (0, vue.createBlock)(require__internal_scrollbar_src_Scrollbar.default, {
					ref: "minuteScrollRef",
					theme: mergedTheme.peers.Scrollbar,
					themeOverrides: mergedTheme.peerOverrides.Scrollbar
				}, { default: () => [((0, vue.openBlock)(), (0, vue.createBlock)(require_time_picker_src_PanelCol, {
					clsPrefix: mergedClsPrefix,
					data: this.minutes,
					activeValue: this.minuteValue,
					onItemClick: this.onMinuteClick
				}, null, 8, [
					"clsPrefix",
					"data",
					"activeValue",
					"onItemClick"
				])), ((0, vue.openBlock)(), (0, vue.createElementBlock)("div", { class: require_vdom.normalizeClass(`${mergedClsPrefix}-time-picker-col__padding`) }, null, 2))] }, 1032, ["theme", "themeOverrides"]))], 2)) : require_vdom.normalizeVNode(() => null),
				this.showSecond ? ((0, vue.openBlock)(), (0, vue.createElementBlock)("div", {
					key: 4,
					class: require_vdom.normalizeClass([
						`${mergedClsPrefix}-time-picker-col`,
						this.isSecondInvalid && `${mergedClsPrefix}-time-picker-col--invalid`,
						this.transitionDisabled && `${mergedClsPrefix}-time-picker-col--transition-disabled`
					])
				}, [((0, vue.openBlock)(), (0, vue.createBlock)(require__internal_scrollbar_src_Scrollbar.default, {
					ref: "secondScrollRef",
					theme: mergedTheme.peers.Scrollbar,
					themeOverrides: mergedTheme.peerOverrides.Scrollbar
				}, { default: () => [((0, vue.openBlock)(), (0, vue.createBlock)(require_time_picker_src_PanelCol, {
					clsPrefix: mergedClsPrefix,
					data: this.seconds,
					activeValue: this.secondValue,
					onItemClick: this.onSecondClick
				}, null, 8, [
					"clsPrefix",
					"data",
					"activeValue",
					"onItemClick"
				])), ((0, vue.openBlock)(), (0, vue.createElementBlock)("div", { class: require_vdom.normalizeClass(`${mergedClsPrefix}-time-picker-col__padding`) }, null, 2))] }, 1032, ["theme", "themeOverrides"]))], 2)) : require_vdom.normalizeVNode(() => null),
				this.use12Hours ? ((0, vue.openBlock)(), (0, vue.createElementBlock)("div", {
					key: 6,
					class: require_vdom.normalizeClass([
						`${mergedClsPrefix}-time-picker-col`,
						this.isAmPmInvalid && `${mergedClsPrefix}-time-picker-col--invalid`,
						this.transitionDisabled && `${mergedClsPrefix}-time-picker-col--transition-disabled`
					])
				}, [((0, vue.openBlock)(), (0, vue.createBlock)(require__internal_scrollbar_src_Scrollbar.default, {
					ref: "amPmScrollRef",
					theme: mergedTheme.peers.Scrollbar,
					themeOverrides: mergedTheme.peerOverrides.Scrollbar
				}, { default: () => [((0, vue.openBlock)(), (0, vue.createBlock)(require_time_picker_src_PanelCol, {
					clsPrefix: mergedClsPrefix,
					data: this.amPm,
					activeValue: this.amPmValue,
					onItemClick: this.onAmPmClick
				}, null, 8, [
					"clsPrefix",
					"data",
					"activeValue",
					"onItemClick"
				])), ((0, vue.openBlock)(), (0, vue.createElementBlock)("div", { class: require_vdom.normalizeClass(`${mergedClsPrefix}-time-picker-col__padding`) }, null, 2))] }, 1032, ["theme", "themeOverrides"]))], 2)) : require_vdom.normalizeVNode(() => null)
			], 2),
			this.actions?.length ? ((0, vue.openBlock)(), (0, vue.createElementBlock)("div", {
				key: 0,
				class: require_vdom.normalizeClass(`${mergedClsPrefix}-time-picker-actions`)
			}, [
				this.actions?.includes("clear") ? ((0, vue.openBlock)(), (0, vue.createBlock)(require_button_src_Button.default, {
					key: 0,
					theme: mergedTheme.peers.Button,
					themeOverrides: mergedTheme.peerOverrides.Button,
					size: "tiny",
					onClick: this.onClearClick
				}, { default: () => this.clearText }, 1032, [
					"theme",
					"themeOverrides",
					"onClick"
				])) : require_vdom.normalizeVNode(() => null),
				this.actions?.includes("now") ? ((0, vue.openBlock)(), (0, vue.createBlock)(require_button_src_Button.default, {
					key: 2,
					size: "tiny",
					theme: mergedTheme.peers.Button,
					themeOverrides: mergedTheme.peerOverrides.Button,
					onClick: this.onNowClick
				}, { default: () => this.nowText }, 1032, [
					"theme",
					"themeOverrides",
					"onClick"
				])) : require_vdom.normalizeVNode(() => null),
				this.actions?.includes("confirm") ? ((0, vue.openBlock)(), (0, vue.createBlock)(require_button_src_Button.default, {
					key: 4,
					size: "tiny",
					type: "primary",
					class: require_vdom.normalizeClass(`${mergedClsPrefix}-time-picker-actions__confirm`),
					theme: mergedTheme.peers.Button,
					themeOverrides: mergedTheme.peerOverrides.Button,
					disabled: this.isValueInvalid,
					onClick: this.onConfirmClick
				}, { default: () => this.confirmText }, 1032, [
					"class",
					"theme",
					"themeOverrides",
					"disabled",
					"onClick"
				])) : require_vdom.normalizeVNode(() => null)
			], 2)) : require_vdom.normalizeVNode(() => null),
			((0, vue.openBlock)(), (0, vue.createBlock)(require__internal_focus_detector_index, { onFocus: this.onFocusDetectorFocus }, null, 8, ["onFocus"]))
		], 42, _hoisted_1);
	}
});
//#endregion
module.exports = Panel_default;
