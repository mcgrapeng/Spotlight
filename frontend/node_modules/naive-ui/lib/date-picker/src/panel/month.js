const require__utils_vue_resolve_slot = require("../../../_utils/vue/resolve-slot.js");
const require__mixins_use_locale = require("../../../_mixins/use-locale.js");
const require_vdom = require("../../../vue-jsx-vapor/vdom.js");
const require__internal_focus_detector_index = require("../../../_internal/focus-detector/index.js");
const require__internal_scrollbar_src_Scrollbar = require("../../../_internal/scrollbar/src/Scrollbar.js");
const require_button_src_Button = require("../../../button/src/Button.js");
const require_date_picker_src_utils = require("../utils.js");
require("../config.js");
const require_date_picker_src_panel_use_calendar = require("./use-calendar.js");
let vue = require("vue");
let vueuc = require("vueuc");
//#region src/date-picker/src/panel/month.tsx
const _hoisted_1 = ["onClick"];
const _hoisted_2 = ["onFocus", "onKeydown"];
/**
* Month Panel
* Update picker value on:
* 1. item click
* 2. clear click
*/
var month_default = (0, vue.defineComponent)({
	name: "MonthPanel",
	props: {
		...require_date_picker_src_panel_use_calendar.useCalendarProps,
		type: {
			type: String,
			required: true
		},
		useAsQuickJump: Boolean
	},
	setup(props) {
		const useCalendarRef = require_date_picker_src_panel_use_calendar.useCalendar(props, props.type);
		const { dateLocaleRef } = require__mixins_use_locale("DatePicker");
		const getRenderContent = (item) => {
			switch (item.type) {
				case "year": return require_date_picker_src_utils.getYearString(item.dateObject.year, item.yearFormat, dateLocaleRef.value.locale);
				case "month": return require_date_picker_src_utils.getMonthString(item.dateObject.month, item.monthFormat, dateLocaleRef.value.locale);
				case "quarter": return require_date_picker_src_utils.getQuarterString(item.dateObject.quarter, item.quarterFormat, dateLocaleRef.value.locale);
			}
		};
		const { useAsQuickJump } = props;
		const renderItem = (item, i, mergedClsPrefix) => {
			const { mergedIsDateDisabled, handleDateClick, handleQuickMonthClick } = useCalendarRef;
			return (0, vue.openBlock)(), (0, vue.createElementBlock)("div", {
				"data-n-date": true,
				key: i,
				class: require_vdom.normalizeClass([
					`${mergedClsPrefix}-date-panel-month-calendar__picker-col-item`,
					item.isCurrent && `${mergedClsPrefix}-date-panel-month-calendar__picker-col-item--current`,
					item.selected && `${mergedClsPrefix}-date-panel-month-calendar__picker-col-item--selected`,
					!useAsQuickJump && mergedIsDateDisabled(item.ts, item.type === "year" ? {
						type: "year",
						year: item.dateObject.year
					} : item.type === "month" ? {
						type: "month",
						year: item.dateObject.year,
						month: item.dateObject.month
					} : item.type === "quarter" ? {
						type: "month",
						year: item.dateObject.year,
						month: item.dateObject.quarter
					} : null) && `${mergedClsPrefix}-date-panel-month-calendar__picker-col-item--disabled`
				]),
				onClick: () => {
					if (item.type === "year") props.onSelectYear?.();
					else if (item.type === "month") props.onSelectMonth?.();
					if (useAsQuickJump) handleQuickMonthClick(item, (value) => {
						props.onUpdateValue(value, false);
					});
					else handleDateClick(item);
				}
			}, [require_vdom.normalizeVNode(() => getRenderContent(item))], 10, _hoisted_1);
		};
		(0, vue.onMounted)(() => {
			useCalendarRef.justifyColumnsScrollState();
		});
		return {
			...useCalendarRef,
			renderItem
		};
	},
	render() {
		const { mergedClsPrefix, mergedTheme, shortcuts, actions, renderItem, type, onRender } = this;
		onRender?.();
		return (0, vue.openBlock)(), (0, vue.createElementBlock)("div", {
			ref: "selfRef",
			tabindex: 0,
			class: require_vdom.normalizeClass([
				`${mergedClsPrefix}-date-panel`,
				`${mergedClsPrefix}-date-panel--month`,
				!this.panel && `${mergedClsPrefix}-date-panel--shadow`,
				this.themeClass
			]),
			onFocus: this.handlePanelFocus,
			onKeydown: this.handlePanelKeyDown
		}, [
			(0, vue.createElementVNode)("div", { class: require_vdom.normalizeClass(`${mergedClsPrefix}-date-panel-month-calendar`) }, [((0, vue.openBlock)(), (0, vue.createBlock)(require__internal_scrollbar_src_Scrollbar.default, {
				ref: "yearScrollbarRef",
				class: require_vdom.normalizeClass(`${mergedClsPrefix}-date-panel-month-calendar__picker-col`),
				theme: mergedTheme.peers.Scrollbar,
				themeOverrides: mergedTheme.peerOverrides.Scrollbar,
				container: this.virtualListContainer,
				content: this.virtualListContent,
				horizontalRailStyle: { zIndex: 1 },
				verticalRailStyle: { zIndex: 1 }
			}, { default: () => ((0, vue.openBlock)(), (0, vue.createBlock)(vueuc.VirtualList, {
				ref: "yearVlRef",
				items: this.yearArray,
				itemSize: 40,
				showScrollbar: false,
				keyField: "ts",
				onScroll: this.handleVirtualListScroll,
				paddingBottom: 4
			}, { default: ({ item, index }) => {
				return renderItem(item, index, mergedClsPrefix);
			} }, 1032, [
				"items",
				"itemSize",
				"onScroll"
			])) }, 1032, [
				"class",
				"theme",
				"themeOverrides",
				"container",
				"content"
			])), type === "month" || type === "quarter" ? ((0, vue.openBlock)(), (0, vue.createElementBlock)("div", {
				key: 0,
				class: require_vdom.normalizeClass(`${mergedClsPrefix}-date-panel-month-calendar__picker-col`)
			}, [((0, vue.openBlock)(), (0, vue.createBlock)(require__internal_scrollbar_src_Scrollbar.default, {
				ref: "monthScrollbarRef",
				theme: mergedTheme.peers.Scrollbar,
				themeOverrides: mergedTheme.peerOverrides.Scrollbar
			}, { default: () => [(type === "month" ? this.monthArray : this.quarterArray).map((item, i) => renderItem(item, i, mergedClsPrefix)), ((0, vue.openBlock)(), (0, vue.createElementBlock)("div", { class: require_vdom.normalizeClass(`${mergedClsPrefix}-date-panel-${type}-calendar__padding`) }, null, 2))] }, 1032, ["theme", "themeOverrides"]))], 2)) : require_vdom.normalizeVNode(() => null)], 2),
			require_vdom.normalizeVNode(() => require__utils_vue_resolve_slot.resolveWrappedSlot(this.datePickerSlots.footer, (children) => {
				return children ? ((0, vue.openBlock)(), (0, vue.createElementBlock)("div", {
					key: 1,
					class: require_vdom.normalizeClass(`${mergedClsPrefix}-date-panel-footer`)
				}, [require_vdom.normalizeVNode(() => children)], 2)) : null;
			})),
			actions?.length || shortcuts ? ((0, vue.openBlock)(), (0, vue.createElementBlock)("div", {
				key: 0,
				class: require_vdom.normalizeClass(`${mergedClsPrefix}-date-panel-actions`)
			}, [(0, vue.createElementVNode)("div", { class: require_vdom.normalizeClass(`${mergedClsPrefix}-date-panel-actions__prefix`) }, [require_vdom.normalizeVNode(() => shortcuts && Object.keys(shortcuts).map((key) => {
				const shortcut = shortcuts[key];
				return Array.isArray(shortcut) ? null : ((0, vue.openBlock)(), (0, vue.createBlock)(require_button_src_Button.XButton, {
					key: 2,
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
				actions?.includes("clear") ? ((0, vue.openBlock)(), (0, vue.createElementBlock)(vue.Fragment, { key: 0 }, [require_vdom.normalizeVNode(() => require__utils_vue_resolve_slot.resolveSlotWithTypedProps(this.datePickerSlots.clear, {
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
				]))]))], 64)) : require_vdom.normalizeVNode(() => null),
				actions?.includes("now") ? ((0, vue.openBlock)(), (0, vue.createElementBlock)(vue.Fragment, { key: 2 }, [require_vdom.normalizeVNode(() => require__utils_vue_resolve_slot.resolveSlotWithTypedProps(this.datePickerSlots.now, {
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
				actions?.includes("confirm") ? ((0, vue.openBlock)(), (0, vue.createElementBlock)(vue.Fragment, { key: 4 }, [require_vdom.normalizeVNode(() => require__utils_vue_resolve_slot.resolveSlotWithTypedProps(this.datePickerSlots.confirm, {
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
module.exports = month_default;
