const require__utils_naive_warn = require("../../../_utils/naive/warn.js");
const require__utils_vue_resolve_slot = require("../../../_utils/vue/resolve-slot.js");
const require_vdom = require("../../../vue-jsx-vapor/vdom.js");
const require__internal_icons_Backward = require("../../../_internal/icons/Backward.js");
const require__internal_icons_FastBackward = require("../../../_internal/icons/FastBackward.js");
const require__internal_icons_FastForward = require("../../../_internal/icons/FastForward.js");
const require__internal_icons_Forward = require("../../../_internal/icons/Forward.js");
const require__internal_focus_detector_index = require("../../../_internal/focus-detector/index.js");
const require_button_src_Button = require("../../../button/src/Button.js");
const require_date_picker_src_panel_panelHeader = require("./panelHeader.js");
const require_date_picker_src_panel_use_dual_calendar = require("./use-dual-calendar.js");
let vue = require("vue");
//#region src/date-picker/src/panel/daterange.tsx
const _hoisted_1 = ["onClick", "onMouseenter"];
const _hoisted_2 = ["onClick", "onMouseenter"];
const _hoisted_3 = ["onKeydown", "onFocus"];
const _hoisted_4 = ["onClick"];
const _hoisted_5 = ["onClick"];
const _hoisted_6 = ["onClick"];
const _hoisted_7 = ["onClick"];
const _hoisted_8 = ["onClick"];
const _hoisted_9 = ["onClick"];
const _hoisted_10 = ["onClick"];
const _hoisted_11 = ["onClick"];
var daterange_default = (0, vue.defineComponent)({
	name: "DateRangePanel",
	props: require_date_picker_src_panel_use_dual_calendar.useDualCalendarProps,
	setup(props) {
		if (process.env.NODE_ENV !== "production") (0, vue.watchEffect)(() => {
			if (props.actions?.includes("now")) require__utils_naive_warn.warnOnce("date-picker", "The `now` action is not supported for n-date-picker of `daterange` type");
		});
		return require_date_picker_src_panel_use_dual_calendar.useDualCalendar(props, "daterange");
	},
	render() {
		const { mergedClsPrefix, mergedTheme, shortcuts, onRender, datePickerSlots } = this;
		onRender?.();
		return (0, vue.openBlock)(), (0, vue.createElementBlock)("div", {
			ref: "selfRef",
			tabindex: 0,
			class: require_vdom.normalizeClass([
				`${mergedClsPrefix}-date-panel`,
				`${mergedClsPrefix}-date-panel--daterange`,
				!this.panel && `${mergedClsPrefix}-date-panel--shadow`,
				this.themeClass
			]),
			onKeydown: this.handlePanelKeyDown,
			onFocus: this.handlePanelFocus
		}, [
			(0, vue.createElementVNode)("div", {
				ref: "startDatesElRef",
				class: require_vdom.normalizeClass(`${mergedClsPrefix}-date-panel-calendar ${mergedClsPrefix}-date-panel-calendar--start`)
			}, [
				(0, vue.createElementVNode)("div", { class: require_vdom.normalizeClass(`${mergedClsPrefix}-date-panel-month`) }, [
					(0, vue.createElementVNode)("div", {
						class: require_vdom.normalizeClass(`${mergedClsPrefix}-date-panel-month__fast-prev`),
						onClick: this.startCalendarPrevYear
					}, [require_vdom.normalizeVNode(() => require__utils_vue_resolve_slot.resolveSlot(datePickerSlots["prev-year"], () => [((0, vue.openBlock)(), (0, vue.createBlock)(require__internal_icons_FastBackward))]))], 10, _hoisted_4),
					(0, vue.createElementVNode)("div", {
						class: require_vdom.normalizeClass(`${mergedClsPrefix}-date-panel-month__prev`),
						onClick: this.startCalendarPrevMonth
					}, [require_vdom.normalizeVNode(() => require__utils_vue_resolve_slot.resolveSlot(datePickerSlots["prev-month"], () => [((0, vue.openBlock)(), (0, vue.createBlock)(require__internal_icons_Backward))]))], 10, _hoisted_5),
					((0, vue.openBlock)(), (0, vue.createBlock)(require_date_picker_src_panel_panelHeader, {
						fastYearSelect: this.fastYearSelect,
						fastMonthSelect: this.fastMonthSelect,
						monthYearSeparator: this.calendarHeaderMonthYearSeparator,
						monthBeforeYear: this.calendarMonthBeforeYear,
						value: this.startCalendarDateTime,
						onUpdateValue: this.onUpdateStartCalendarValue,
						mergedClsPrefix,
						calendarMonth: this.startCalendarMonth,
						calendarYear: this.startCalendarYear
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
						onClick: this.startCalendarNextMonth
					}, [require_vdom.normalizeVNode(() => require__utils_vue_resolve_slot.resolveSlot(datePickerSlots["next-month"], () => [((0, vue.openBlock)(), (0, vue.createBlock)(require__internal_icons_Forward))]))], 10, _hoisted_6),
					(0, vue.createElementVNode)("div", {
						class: require_vdom.normalizeClass(`${mergedClsPrefix}-date-panel-month__fast-next`),
						onClick: this.startCalendarNextYear
					}, [require_vdom.normalizeVNode(() => require__utils_vue_resolve_slot.resolveSlot(datePickerSlots["next-year"], () => [((0, vue.openBlock)(), (0, vue.createBlock)(require__internal_icons_FastForward))]))], 10, _hoisted_7)
				], 2),
				(0, vue.createElementVNode)("div", { class: require_vdom.normalizeClass(`${mergedClsPrefix}-date-panel-weekdays`) }, [require_vdom.normalizeVNode(() => this.weekdays.map((weekday) => ((0, vue.openBlock)(), (0, vue.createElementBlock)("div", {
					key: weekday,
					class: require_vdom.normalizeClass(`${mergedClsPrefix}-date-panel-weekdays__day`)
				}, [require_vdom.normalizeVNode(() => weekday)], 2))))], 2),
				(0, vue.createElementVNode)("div", { class: require_vdom.normalizeClass(`${mergedClsPrefix}-date-panel__divider`) }, null, 2),
				(0, vue.createElementVNode)("div", { class: require_vdom.normalizeClass(`${mergedClsPrefix}-date-panel-dates`) }, [require_vdom.normalizeVNode(() => this.startDateArray.map((dateItem, i) => ((0, vue.openBlock)(), (0, vue.createElementBlock)("div", {
					"data-n-date": true,
					key: i,
					class: require_vdom.normalizeClass([`${mergedClsPrefix}-date-panel-date`, {
						[`${mergedClsPrefix}-date-panel-date--excluded`]: !dateItem.inCurrentMonth,
						[`${mergedClsPrefix}-date-panel-date--current`]: dateItem.isCurrentDate,
						[`${mergedClsPrefix}-date-panel-date--selected`]: dateItem.selected,
						[`${mergedClsPrefix}-date-panel-date--covered`]: dateItem.inSpan,
						[`${mergedClsPrefix}-date-panel-date--start`]: dateItem.startOfSpan,
						[`${mergedClsPrefix}-date-panel-date--end`]: dateItem.endOfSpan,
						[`${mergedClsPrefix}-date-panel-date--disabled`]: this.mergedIsDateDisabled(dateItem.ts)
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
			(0, vue.createElementVNode)("div", { class: require_vdom.normalizeClass(`${mergedClsPrefix}-date-panel__vertical-divider`) }, null, 2),
			(0, vue.createElementVNode)("div", {
				ref: "endDatesElRef",
				class: require_vdom.normalizeClass(`${mergedClsPrefix}-date-panel-calendar ${mergedClsPrefix}-date-panel-calendar--end`)
			}, [
				(0, vue.createElementVNode)("div", { class: require_vdom.normalizeClass(`${mergedClsPrefix}-date-panel-month`) }, [
					(0, vue.createElementVNode)("div", {
						class: require_vdom.normalizeClass(`${mergedClsPrefix}-date-panel-month__fast-prev`),
						onClick: this.endCalendarPrevYear
					}, [require_vdom.normalizeVNode(() => require__utils_vue_resolve_slot.resolveSlot(datePickerSlots["prev-year"], () => [((0, vue.openBlock)(), (0, vue.createBlock)(require__internal_icons_FastBackward))]))], 10, _hoisted_8),
					(0, vue.createElementVNode)("div", {
						class: require_vdom.normalizeClass(`${mergedClsPrefix}-date-panel-month__prev`),
						onClick: this.endCalendarPrevMonth
					}, [require_vdom.normalizeVNode(() => require__utils_vue_resolve_slot.resolveSlot(datePickerSlots["prev-month"], () => [((0, vue.openBlock)(), (0, vue.createBlock)(require__internal_icons_Backward))]))], 10, _hoisted_9),
					((0, vue.openBlock)(), (0, vue.createBlock)(require_date_picker_src_panel_panelHeader, {
						fastYearSelect: this.fastYearSelect,
						fastMonthSelect: this.fastMonthSelect,
						monthYearSeparator: this.calendarHeaderMonthYearSeparator,
						monthBeforeYear: this.calendarMonthBeforeYear,
						value: this.endCalendarDateTime,
						onUpdateValue: this.onUpdateEndCalendarValue,
						mergedClsPrefix,
						calendarMonth: this.endCalendarMonth,
						calendarYear: this.endCalendarYear
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
						onClick: this.endCalendarNextMonth
					}, [require_vdom.normalizeVNode(() => require__utils_vue_resolve_slot.resolveSlot(datePickerSlots["next-month"], () => [((0, vue.openBlock)(), (0, vue.createBlock)(require__internal_icons_Forward))]))], 10, _hoisted_10),
					(0, vue.createElementVNode)("div", {
						class: require_vdom.normalizeClass(`${mergedClsPrefix}-date-panel-month__fast-next`),
						onClick: this.endCalendarNextYear
					}, [require_vdom.normalizeVNode(() => require__utils_vue_resolve_slot.resolveSlot(datePickerSlots["next-year"], () => [((0, vue.openBlock)(), (0, vue.createBlock)(require__internal_icons_FastForward))]))], 10, _hoisted_11)
				], 2),
				(0, vue.createElementVNode)("div", { class: require_vdom.normalizeClass(`${mergedClsPrefix}-date-panel-weekdays`) }, [require_vdom.normalizeVNode(() => this.weekdays.map((weekday) => ((0, vue.openBlock)(), (0, vue.createElementBlock)("div", {
					key: weekday,
					class: require_vdom.normalizeClass(`${mergedClsPrefix}-date-panel-weekdays__day`)
				}, [require_vdom.normalizeVNode(() => weekday)], 2))))], 2),
				(0, vue.createElementVNode)("div", { class: require_vdom.normalizeClass(`${mergedClsPrefix}-date-panel__divider`) }, null, 2),
				(0, vue.createElementVNode)("div", { class: require_vdom.normalizeClass(`${mergedClsPrefix}-date-panel-dates`) }, [require_vdom.normalizeVNode(() => this.endDateArray.map((dateItem, i) => ((0, vue.openBlock)(), (0, vue.createElementBlock)("div", {
					"data-n-date": true,
					key: i,
					class: require_vdom.normalizeClass([`${mergedClsPrefix}-date-panel-date`, {
						[`${mergedClsPrefix}-date-panel-date--excluded`]: !dateItem.inCurrentMonth,
						[`${mergedClsPrefix}-date-panel-date--current`]: dateItem.isCurrentDate,
						[`${mergedClsPrefix}-date-panel-date--selected`]: dateItem.selected,
						[`${mergedClsPrefix}-date-panel-date--covered`]: dateItem.inSpan,
						[`${mergedClsPrefix}-date-panel-date--start`]: dateItem.startOfSpan,
						[`${mergedClsPrefix}-date-panel-date--end`]: dateItem.endOfSpan,
						[`${mergedClsPrefix}-date-panel-date--disabled`]: this.mergedIsDateDisabled(dateItem.ts)
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
				], 42, _hoisted_2))))], 2)
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
				return Array.isArray(shortcut) || typeof shortcut === "function" ? ((0, vue.openBlock)(), (0, vue.createBlock)(require_button_src_Button.XButton, {
					key: 1,
					size: "tiny",
					onMouseenter: () => {
						this.handleRangeShortcutMouseenter(shortcut);
					},
					onClick: () => {
						this.handleRangeShortcutClick(shortcut);
					},
					onMouseleave: () => {
						this.handleShortcutMouseleave();
					}
				}, { default: () => key }, 1032, [
					"onMouseenter",
					"onClick",
					"onMouseleave"
				])) : null;
			}))], 2), (0, vue.createElementVNode)("div", { class: require_vdom.normalizeClass(`${mergedClsPrefix}-date-panel-actions__suffix`) }, [this.actions?.includes("clear") ? ((0, vue.openBlock)(), (0, vue.createElementBlock)(vue.Fragment, { key: 0 }, [require_vdom.normalizeVNode(() => require__utils_vue_resolve_slot.resolveSlotWithTypedProps(datePickerSlots.clear, {
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
			]))]))], 64)) : require_vdom.normalizeVNode(() => null), this.actions?.includes("confirm") ? ((0, vue.openBlock)(), (0, vue.createElementBlock)(vue.Fragment, { key: 2 }, [require_vdom.normalizeVNode(() => require__utils_vue_resolve_slot.resolveSlotWithTypedProps(datePickerSlots.confirm, {
				onConfirm: this.handleConfirmClick,
				disabled: this.isRangeInvalid || this.isSelecting,
				text: this.locale.confirm
			}, () => [((0, vue.openBlock)(), (0, vue.createBlock)(require_button_src_Button.default, {
				theme: mergedTheme.peers.Button,
				themeOverrides: mergedTheme.peerOverrides.Button,
				size: "tiny",
				type: "primary",
				disabled: this.isRangeInvalid || this.isSelecting,
				onClick: this.handleConfirmClick
			}, { default: () => this.locale.confirm }, 1032, [
				"theme",
				"themeOverrides",
				"disabled",
				"onClick"
			]))]))], 64)) : require_vdom.normalizeVNode(() => null)], 2)], 2)) : require_vdom.normalizeVNode(() => null),
			((0, vue.openBlock)(), (0, vue.createBlock)(require__internal_focus_detector_index, { onFocus: this.handleFocusDetectorFocus }, null, 8, ["onFocus"]))
		], 42, _hoisted_3);
	}
});
//#endregion
module.exports = daterange_default;
