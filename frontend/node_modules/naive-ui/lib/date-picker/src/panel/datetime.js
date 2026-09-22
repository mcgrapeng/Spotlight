const require__utils_vue_resolve_slot = require("../../../_utils/vue/resolve-slot.js");
const require_vdom = require("../../../vue-jsx-vapor/vdom.js");
const require__internal_icons_Backward = require("../../../_internal/icons/Backward.js");
const require__internal_icons_FastBackward = require("../../../_internal/icons/FastBackward.js");
const require__internal_icons_FastForward = require("../../../_internal/icons/FastForward.js");
const require__internal_icons_Forward = require("../../../_internal/icons/Forward.js");
const require__internal_focus_detector_index = require("../../../_internal/focus-detector/index.js");
const require_input_src_Input = require("../../../input/src/Input.js");
const require_button_src_Button = require("../../../button/src/Button.js");
const require_date_picker_src_panel_use_calendar = require("./use-calendar.js");
const require_date_picker_src_panel_panelHeader = require("./panelHeader.js");
const require_time_picker_src_TimePicker = require("../../../time-picker/src/TimePicker.js");
let vue = require("vue");
//#region src/date-picker/src/panel/datetime.tsx
const _hoisted_1 = ["onClick"];
const _hoisted_2 = ["onKeydown", "onFocus"];
const _hoisted_3 = ["onClick"];
const _hoisted_4 = ["onClick"];
const _hoisted_5 = ["onClick"];
const _hoisted_6 = ["onClick"];
/**
* DateTime Panel
* Update picker value on:
* 1. confirm click
* 2. clear click
*/
var datetime_default = (0, vue.defineComponent)({
	name: "DateTimePanel",
	props: require_date_picker_src_panel_use_calendar.useCalendarProps,
	setup(props) {
		return require_date_picker_src_panel_use_calendar.useCalendar(props, "datetime");
	},
	render() {
		const { mergedClsPrefix, mergedTheme, shortcuts, timePickerProps, datePickerSlots, onRender } = this;
		onRender?.();
		return (0, vue.openBlock)(), (0, vue.createElementBlock)("div", {
			ref: "selfRef",
			tabindex: 0,
			class: require_vdom.normalizeClass([
				`${mergedClsPrefix}-date-panel`,
				`${mergedClsPrefix}-date-panel--datetime`,
				!this.panel && `${mergedClsPrefix}-date-panel--shadow`,
				this.themeClass
			]),
			onKeydown: this.handlePanelKeyDown,
			onFocus: this.handlePanelFocus
		}, [
			(0, vue.createElementVNode)("div", { class: require_vdom.normalizeClass(`${mergedClsPrefix}-date-panel-header`) }, [((0, vue.openBlock)(), (0, vue.createBlock)(require_input_src_Input.default, {
				value: this.dateInputValue,
				theme: mergedTheme.peers.Input,
				themeOverrides: mergedTheme.peerOverrides.Input,
				stateful: false,
				size: this.timePickerSize,
				readonly: this.inputReadonly,
				class: require_vdom.normalizeClass(`${mergedClsPrefix}-date-panel-date-input`),
				textDecoration: this.isDateInvalid ? "line-through" : "",
				placeholder: this.locale.selectDate,
				onBlur: this.handleDateInputBlur,
				onUpdateValue: this.handleDateInput
			}, null, 8, [
				"value",
				"theme",
				"themeOverrides",
				"size",
				"readonly",
				"class",
				"textDecoration",
				"placeholder",
				"onBlur",
				"onUpdateValue"
			])), ((0, vue.openBlock)(), (0, vue.createBlock)(require_time_picker_src_TimePicker.default, (0, vue.mergeProps)({
				size: this.timePickerSize,
				placeholder: this.locale.selectTime,
				format: this.timePickerFormat
			}, Array.isArray(timePickerProps) ? void 0 : timePickerProps, {
				showIcon: false,
				to: false,
				theme: mergedTheme.peers.TimePicker,
				themeOverrides: mergedTheme.peerOverrides.TimePicker,
				value: Array.isArray(this.value) ? null : this.value,
				isHourDisabled: this.isHourDisabled,
				isMinuteDisabled: this.isMinuteDisabled,
				isSecondDisabled: this.isSecondDisabled,
				onUpdateValue: this.handleTimePickerChange,
				stateful: false
			}), null, 16, [
				"size",
				"placeholder",
				"format",
				"theme",
				"themeOverrides",
				"value",
				"isHourDisabled",
				"isMinuteDisabled",
				"isSecondDisabled",
				"onUpdateValue"
			]))], 2),
			(0, vue.createElementVNode)("div", { class: require_vdom.normalizeClass(`${mergedClsPrefix}-date-panel-calendar`) }, [
				(0, vue.createElementVNode)("div", { class: require_vdom.normalizeClass(`${mergedClsPrefix}-date-panel-month`) }, [
					(0, vue.createElementVNode)("div", {
						class: require_vdom.normalizeClass(`${mergedClsPrefix}-date-panel-month__fast-prev`),
						onClick: this.prevYear
					}, [require_vdom.normalizeVNode(() => require__utils_vue_resolve_slot.resolveSlot(datePickerSlots["prev-year"], () => [((0, vue.openBlock)(), (0, vue.createBlock)(require__internal_icons_FastBackward))]))], 10, _hoisted_3),
					(0, vue.createElementVNode)("div", {
						class: require_vdom.normalizeClass(`${mergedClsPrefix}-date-panel-month__prev`),
						onClick: this.prevMonth
					}, [require_vdom.normalizeVNode(() => require__utils_vue_resolve_slot.resolveSlot(datePickerSlots["prev-month"], () => [((0, vue.openBlock)(), (0, vue.createBlock)(require__internal_icons_Backward))]))], 10, _hoisted_4),
					((0, vue.openBlock)(), (0, vue.createBlock)(require_date_picker_src_panel_panelHeader, {
						fastYearSelect: this.fastYearSelect,
						fastMonthSelect: this.fastMonthSelect,
						monthYearSeparator: this.calendarHeaderMonthYearSeparator,
						monthBeforeYear: this.calendarMonthBeforeYear,
						value: this.calendarValue,
						onUpdateValue: this.onUpdateCalendarValue,
						mergedClsPrefix,
						calendarMonth: this.calendarMonth,
						calendarYear: this.calendarYear
					}, null, 8, [
						"fastYearSelect",
						"fastMonthSelect",
						"monthYearSeparator",
						"monthBeforeYear",
						"value",
						"onUpdateValue",
						"mergedClsPrefix",
						"calendarMonth",
						"calendarYear"
					])),
					(0, vue.createElementVNode)("div", {
						class: require_vdom.normalizeClass(`${mergedClsPrefix}-date-panel-month__next`),
						onClick: this.nextMonth
					}, [require_vdom.normalizeVNode(() => require__utils_vue_resolve_slot.resolveSlot(datePickerSlots["next-month"], () => [((0, vue.openBlock)(), (0, vue.createBlock)(require__internal_icons_Forward))]))], 10, _hoisted_5),
					(0, vue.createElementVNode)("div", {
						class: require_vdom.normalizeClass(`${mergedClsPrefix}-date-panel-month__fast-next`),
						onClick: this.nextYear
					}, [require_vdom.normalizeVNode(() => require__utils_vue_resolve_slot.resolveSlot(datePickerSlots["next-year"], () => [((0, vue.openBlock)(), (0, vue.createBlock)(require__internal_icons_FastForward))]))], 10, _hoisted_6)
				], 2),
				(0, vue.createElementVNode)("div", { class: require_vdom.normalizeClass(`${mergedClsPrefix}-date-panel-weekdays`) }, [require_vdom.normalizeVNode(() => this.weekdays.map((weekday) => ((0, vue.openBlock)(), (0, vue.createElementBlock)("div", {
					key: weekday,
					class: require_vdom.normalizeClass(`${mergedClsPrefix}-date-panel-weekdays__day`)
				}, [require_vdom.normalizeVNode(() => weekday)], 2))))], 2),
				(0, vue.createElementVNode)("div", { class: require_vdom.normalizeClass(`${mergedClsPrefix}-date-panel-dates`) }, [require_vdom.normalizeVNode(() => this.dateArray.map((dateItem, i) => ((0, vue.openBlock)(), (0, vue.createElementBlock)("div", {
					"data-n-date": true,
					key: i,
					class: require_vdom.normalizeClass([`${mergedClsPrefix}-date-panel-date`, {
						[`${mergedClsPrefix}-date-panel-date--current`]: dateItem.isCurrentDate,
						[`${mergedClsPrefix}-date-panel-date--selected`]: dateItem.selected,
						[`${mergedClsPrefix}-date-panel-date--excluded`]: !dateItem.inCurrentMonth,
						[`${mergedClsPrefix}-date-panel-date--disabled`]: this.mergedIsDateDisabled(dateItem.ts, {
							type: "date",
							year: dateItem.dateObject.year,
							month: dateItem.dateObject.month,
							date: dateItem.dateObject.date
						})
					}]),
					onClick: () => {
						this.handleDateClick(dateItem);
					}
				}, [
					(0, vue.createElementVNode)("div", { class: require_vdom.normalizeClass(`${mergedClsPrefix}-date-panel-date__trigger`) }, null, 2),
					require_vdom.normalizeVNode(() => dateItem.dateObject.date),
					dateItem.isCurrentDate ? ((0, vue.openBlock)(), (0, vue.createElementBlock)("div", {
						key: 0,
						class: require_vdom.normalizeClass(`${mergedClsPrefix}-date-panel-date__sup`)
					}, null, 2)) : require_vdom.normalizeVNode(() => null)
				], 10, _hoisted_1))))], 2)
			], 2),
			this.datePickerSlots.footer ? ((0, vue.openBlock)(), (0, vue.createElementBlock)("div", {
				key: 0,
				class: require_vdom.normalizeClass(`${mergedClsPrefix}-date-panel-footer`)
			}, [require_vdom.normalizeVNode(() => this.datePickerSlots.footer())], 2)) : require_vdom.normalizeVNode(() => null),
			this.actions?.length || shortcuts ? ((0, vue.openBlock)(), (0, vue.createElementBlock)("div", {
				key: 2,
				class: require_vdom.normalizeClass(`${mergedClsPrefix}-date-panel-actions`)
			}, [(0, vue.createElementVNode)("div", { class: require_vdom.normalizeClass(`${mergedClsPrefix}-date-panel-actions__prefix`) }, [require_vdom.normalizeVNode(() => shortcuts && Object.keys(shortcuts).map((key) => {
				const shortcut = shortcuts[key];
				return Array.isArray(shortcut) ? null : ((0, vue.openBlock)(), (0, vue.createBlock)(require_button_src_Button.XButton, {
					key: 1,
					size: "tiny",
					onMouseenter: () => {
						this.handleSingleShortcutMouseenter(shortcut);
					},
					onClick: () => {
						this.handleSingleShortcutClick(shortcut);
					},
					onMouseleave: () => {
						this.handleShortcutMouseleave();
					}
				}, { default: () => key }, 1032, [
					"onMouseenter",
					"onClick",
					"onMouseleave"
				]));
			}))], 2), (0, vue.createElementVNode)("div", { class: require_vdom.normalizeClass(`${mergedClsPrefix}-date-panel-actions__suffix`) }, [
				this.actions?.includes("clear") ? ((0, vue.openBlock)(), (0, vue.createElementBlock)(vue.Fragment, { key: 0 }, [require_vdom.normalizeVNode(() => require__utils_vue_resolve_slot.resolveSlotWithTypedProps(this.datePickerSlots.clear, {
					onClear: this.clearSelectedDateTime,
					text: this.locale.clear
				}, () => [((0, vue.openBlock)(), (0, vue.createBlock)(require_button_src_Button.default, {
					theme: mergedTheme.peers.Button,
					themeOverrides: mergedTheme.peerOverrides.Button,
					size: "tiny",
					onClick: this.clearSelectedDateTime
				}, { default: () => this.locale.clear }, 1032, [
					"theme",
					"themeOverrides",
					"onClick"
				]))]))], 64)) : require_vdom.normalizeVNode(() => null),
				this.actions?.includes("now") ? ((0, vue.openBlock)(), (0, vue.createElementBlock)(vue.Fragment, { key: 2 }, [require_vdom.normalizeVNode(() => require__utils_vue_resolve_slot.resolveSlotWithTypedProps(datePickerSlots.now, {
					onNow: this.handleNowClick,
					text: this.locale.now
				}, () => [((0, vue.openBlock)(), (0, vue.createBlock)(require_button_src_Button.default, {
					theme: mergedTheme.peers.Button,
					themeOverrides: mergedTheme.peerOverrides.Button,
					size: "tiny",
					onClick: this.handleNowClick
				}, { default: () => this.locale.now }, 1032, [
					"theme",
					"themeOverrides",
					"onClick"
				]))]))], 64)) : require_vdom.normalizeVNode(() => null),
				this.actions?.includes("confirm") ? ((0, vue.openBlock)(), (0, vue.createElementBlock)(vue.Fragment, { key: 4 }, [require_vdom.normalizeVNode(() => require__utils_vue_resolve_slot.resolveSlotWithTypedProps(datePickerSlots.confirm, {
					onConfirm: this.handleConfirmClick,
					disabled: this.isDateInvalid,
					text: this.locale.confirm
				}, () => [((0, vue.openBlock)(), (0, vue.createBlock)(require_button_src_Button.default, {
					theme: mergedTheme.peers.Button,
					themeOverrides: mergedTheme.peerOverrides.Button,
					size: "tiny",
					type: "primary",
					disabled: this.isDateInvalid,
					onClick: this.handleConfirmClick
				}, { default: () => this.locale.confirm }, 1032, [
					"theme",
					"themeOverrides",
					"disabled",
					"onClick"
				]))]))], 64)) : require_vdom.normalizeVNode(() => null)
			], 2)], 2)) : require_vdom.normalizeVNode(() => null),
			((0, vue.openBlock)(), (0, vue.createBlock)(require__internal_focus_detector_index, { onFocus: this.handleFocusDetectorFocus }, null, 8, ["onFocus"]))
		], 42, _hoisted_2);
	}
});
//#endregion
module.exports = datetime_default;
