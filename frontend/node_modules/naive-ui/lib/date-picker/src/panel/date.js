const require__utils_naive_warn = require("../../../_utils/naive/warn.js");
const require__utils_vue_resolve_slot = require("../../../_utils/vue/resolve-slot.js");
const require_vdom = require("../../../vue-jsx-vapor/vdom.js");
const require__internal_icons_Backward = require("../../../_internal/icons/Backward.js");
const require__internal_icons_FastBackward = require("../../../_internal/icons/FastBackward.js");
const require__internal_icons_FastForward = require("../../../_internal/icons/FastForward.js");
const require__internal_icons_Forward = require("../../../_internal/icons/Forward.js");
const require__internal_focus_detector_index = require("../../../_internal/focus-detector/index.js");
const require_button_src_Button = require("../../../button/src/Button.js");
const require_date_picker_src_panel_use_calendar = require("./use-calendar.js");
const require_date_picker_src_panel_panelHeader = require("./panelHeader.js");
let vue = require("vue");
//#region src/date-picker/src/panel/date.tsx
const _hoisted_1 = ["onClick", "onMouseenter"];
const _hoisted_2 = ["onFocus", "onKeydown"];
const _hoisted_3 = ["onClick"];
const _hoisted_4 = ["onClick"];
const _hoisted_5 = ["onClick"];
const _hoisted_6 = ["onClick"];
/**
* Date Panel
* Update picker value on:
* 1. item click
* 2. clear click
*/
var date_default = (0, vue.defineComponent)({
	name: "DatePanel",
	props: {
		...require_date_picker_src_panel_use_calendar.useCalendarProps,
		type: {
			type: String,
			required: true
		}
	},
	setup(props) {
		if (process.env.NODE_ENV !== "production") (0, vue.watchEffect)(() => {
			if (props.actions?.includes("confirm")) require__utils_naive_warn.warnOnce("date-picker", "The `confirm` action is not supported for n-date-picker of `date` type");
		});
		return require_date_picker_src_panel_use_calendar.useCalendar(props, props.type);
	},
	render() {
		const { mergedClsPrefix, mergedTheme, shortcuts, onRender, datePickerSlots, type } = this;
		onRender?.();
		return (0, vue.openBlock)(), (0, vue.createElementBlock)("div", {
			ref: "selfRef",
			tabindex: 0,
			class: require_vdom.normalizeClass([
				`${mergedClsPrefix}-date-panel`,
				`${mergedClsPrefix}-date-panel--${type}`,
				!this.panel && `${mergedClsPrefix}-date-panel--shadow`,
				this.themeClass
			]),
			onFocus: this.handlePanelFocus,
			onKeydown: this.handlePanelKeyDown
		}, [
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
						}),
						[`${mergedClsPrefix}-date-panel-date--week-hovered`]: this.isWeekHovered(dateItem),
						[`${mergedClsPrefix}-date-panel-date--week-selected`]: dateItem.inSelectedWeek
					}]),
					onClick: () => {
						this.handleDateClick(dateItem);
					},
					onMouseenter: () => {
						this.handleDateMouseEnter(dateItem);
					}
				}, [
					(0, vue.createElementVNode)("div", { class: require_vdom.normalizeClass(`${mergedClsPrefix}-date-panel-date__trigger`) }, null, 2),
					require_vdom.normalizeVNode(() => dateItem.dateObject.date),
					dateItem.isCurrentDate ? ((0, vue.openBlock)(), (0, vue.createElementBlock)("div", {
						key: 0,
						class: require_vdom.normalizeClass(`${mergedClsPrefix}-date-panel-date__sup`)
					}, null, 2)) : require_vdom.normalizeVNode(() => null)
				], 42, _hoisted_1))))], 2)
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
			}))], 2), (0, vue.createElementVNode)("div", { class: require_vdom.normalizeClass(`${mergedClsPrefix}-date-panel-actions__suffix`) }, [this.actions?.includes("clear") ? ((0, vue.openBlock)(), (0, vue.createElementBlock)(vue.Fragment, { key: 0 }, [require_vdom.normalizeVNode(() => require__utils_vue_resolve_slot.resolveSlotWithTypedProps(this.$slots.clear, {
				onClear: this.handleClearClick,
				text: this.locale.clear
			}, () => [((0, vue.openBlock)(), (0, vue.createBlock)(require_button_src_Button.default, {
				theme: mergedTheme.peers.Button,
				themeOverrides: mergedTheme.peerOverrides.Button,
				size: "tiny",
				onClick: this.handleClearClick
			}, { default: () => this.locale.clear }, 1032, [
				"theme",
				"themeOverrides",
				"onClick"
			]))]))], 64)) : require_vdom.normalizeVNode(() => null), this.actions?.includes("now") ? ((0, vue.openBlock)(), (0, vue.createElementBlock)(vue.Fragment, { key: 2 }, [require_vdom.normalizeVNode(() => require__utils_vue_resolve_slot.resolveSlotWithTypedProps(this.$slots.now, {
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
			]))]))], 64)) : require_vdom.normalizeVNode(() => null)], 2)], 2)) : require_vdom.normalizeVNode(() => null),
			((0, vue.openBlock)(), (0, vue.createBlock)(require__internal_focus_detector_index, { onFocus: this.handleFocusDetectorFocus }, null, 8, ["onFocus"]))
		], 42, _hoisted_2);
	}
});
//#endregion
module.exports = date_default;
