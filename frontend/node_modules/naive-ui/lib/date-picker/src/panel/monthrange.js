const require__utils_naive_warn = require("../../../_utils/naive/warn.js");
const require__utils_vue_resolve_slot = require("../../../_utils/vue/resolve-slot.js");
const require__mixins_use_locale = require("../../../_mixins/use-locale.js");
const require_vdom = require("../../../vue-jsx-vapor/vdom.js");
const require__internal_focus_detector_index = require("../../../_internal/focus-detector/index.js");
const require__internal_scrollbar_src_Scrollbar = require("../../../_internal/scrollbar/src/Scrollbar.js");
const require_button_src_Button = require("../../../button/src/Button.js");
const require_date_picker_src_utils = require("../utils.js");
require("../config.js");
const require_date_picker_src_panel_use_dual_calendar = require("./use-dual-calendar.js");
let vue = require("vue");
let vueuc = require("vueuc");
//#region src/date-picker/src/panel/monthrange.tsx
const _hoisted_1 = ["onClick"];
const _hoisted_2 = ["onKeydown", "onFocus"];
var monthrange_default = (0, vue.defineComponent)({
	name: "MonthRangePanel",
	props: {
		...require_date_picker_src_panel_use_dual_calendar.useDualCalendarProps,
		type: {
			type: String,
			required: true
		}
	},
	setup(props) {
		if (process.env.NODE_ENV !== "production") (0, vue.watchEffect)(() => {
			if (props.actions?.includes("now")) require__utils_naive_warn.warnOnce("date-picker", `The \`now\` action is not supported for n-date-picker of ${props.type}type`);
		});
		const useCalendarRef = require_date_picker_src_panel_use_dual_calendar.useDualCalendar(props, props.type);
		const { dateLocaleRef } = require__mixins_use_locale("DatePicker");
		const renderItem = (item, i, mergedClsPrefix, type) => {
			const { handleColItemClick } = useCalendarRef;
			return (0, vue.openBlock)(), (0, vue.createElementBlock)("div", {
				"data-n-date": true,
				key: i,
				class: require_vdom.normalizeClass([
					`${mergedClsPrefix}-date-panel-month-calendar__picker-col-item`,
					item.isCurrent && `${mergedClsPrefix}-date-panel-month-calendar__picker-col-item--current`,
					item.selected && `${mergedClsPrefix}-date-panel-month-calendar__picker-col-item--selected`,
					false
				]),
				onClick: () => {
					handleColItemClick(item, type);
				}
			}, [item.type === "month" ? ((0, vue.openBlock)(), (0, vue.createElementBlock)(vue.Fragment, { key: 0 }, [require_vdom.normalizeVNode(() => require_date_picker_src_utils.getMonthString(item.dateObject.month, item.monthFormat, dateLocaleRef.value.locale))], 64)) : ((0, vue.openBlock)(), (0, vue.createElementBlock)(vue.Fragment, { key: 1 }, [item.type === "quarter" ? ((0, vue.openBlock)(), (0, vue.createElementBlock)(vue.Fragment, { key: 0 }, [require_vdom.normalizeVNode(() => require_date_picker_src_utils.getQuarterString(item.dateObject.quarter, item.quarterFormat, dateLocaleRef.value.locale))], 64)) : ((0, vue.openBlock)(), (0, vue.createElementBlock)(vue.Fragment, { key: 1 }, [require_vdom.normalizeVNode(() => require_date_picker_src_utils.getYearString(item.dateObject.year, item.yearFormat, dateLocaleRef.value.locale))], 64))], 64))], 10, _hoisted_1);
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
		const { mergedClsPrefix, mergedTheme, shortcuts, type, renderItem, onRender } = this;
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
			}, [(0, vue.createElementVNode)("div", { class: require_vdom.normalizeClass(`${mergedClsPrefix}-date-panel-month-calendar`) }, [((0, vue.openBlock)(), (0, vue.createBlock)(require__internal_scrollbar_src_Scrollbar.default, {
				ref: "startYearScrollbarRef",
				class: require_vdom.normalizeClass(`${mergedClsPrefix}-date-panel-month-calendar__picker-col`),
				theme: mergedTheme.peers.Scrollbar,
				themeOverrides: mergedTheme.peerOverrides.Scrollbar,
				container: () => this.virtualListContainer("start"),
				content: () => this.virtualListContent("start"),
				horizontalRailStyle: { zIndex: 1 },
				verticalRailStyle: { zIndex: 1 }
			}, { default: () => ((0, vue.openBlock)(), (0, vue.createBlock)(vueuc.VirtualList, {
				ref: "startYearVlRef",
				items: this.startYearArray,
				itemSize: 40,
				showScrollbar: false,
				keyField: "ts",
				onScroll: this.handleStartYearVlScroll,
				paddingBottom: 4
			}, { default: ({ item, index }) => {
				return renderItem(item, index, mergedClsPrefix, "start");
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
			])), type === "monthrange" || type === "quarterrange" ? ((0, vue.openBlock)(), (0, vue.createElementBlock)("div", {
				key: 0,
				class: require_vdom.normalizeClass(`${mergedClsPrefix}-date-panel-month-calendar__picker-col`)
			}, [((0, vue.openBlock)(), (0, vue.createBlock)(require__internal_scrollbar_src_Scrollbar.default, {
				ref: "startMonthScrollbarRef",
				theme: mergedTheme.peers.Scrollbar,
				themeOverrides: mergedTheme.peerOverrides.Scrollbar
			}, { default: () => [(type === "monthrange" ? this.startMonthArray : this.startQuarterArray).map((item, i) => renderItem(item, i, mergedClsPrefix, "start")), type === "monthrange" && ((0, vue.openBlock)(), (0, vue.createElementBlock)("div", { class: require_vdom.normalizeClass(`${mergedClsPrefix}-date-panel-month-calendar__padding`) }, null, 2))] }, 1032, ["theme", "themeOverrides"]))], 2)) : require_vdom.normalizeVNode(() => null)], 2)], 2),
			(0, vue.createElementVNode)("div", { class: require_vdom.normalizeClass(`${mergedClsPrefix}-date-panel__vertical-divider`) }, null, 2),
			(0, vue.createElementVNode)("div", {
				ref: "endDatesElRef",
				class: require_vdom.normalizeClass(`${mergedClsPrefix}-date-panel-calendar ${mergedClsPrefix}-date-panel-calendar--end`)
			}, [(0, vue.createElementVNode)("div", { class: require_vdom.normalizeClass(`${mergedClsPrefix}-date-panel-month-calendar`) }, [((0, vue.openBlock)(), (0, vue.createBlock)(require__internal_scrollbar_src_Scrollbar.default, {
				ref: "endYearScrollbarRef",
				class: require_vdom.normalizeClass(`${mergedClsPrefix}-date-panel-month-calendar__picker-col`),
				theme: mergedTheme.peers.Scrollbar,
				themeOverrides: mergedTheme.peerOverrides.Scrollbar,
				container: () => this.virtualListContainer("end"),
				content: () => this.virtualListContent("end"),
				horizontalRailStyle: { zIndex: 1 },
				verticalRailStyle: { zIndex: 1 }
			}, { default: () => ((0, vue.openBlock)(), (0, vue.createBlock)(vueuc.VirtualList, {
				ref: "endYearVlRef",
				items: this.endYearArray,
				itemSize: 40,
				showScrollbar: false,
				keyField: "ts",
				onScroll: this.handleEndYearVlScroll,
				paddingBottom: 4
			}, { default: ({ item, index }) => {
				return renderItem(item, index, mergedClsPrefix, "end");
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
			])), type === "monthrange" || type === "quarterrange" ? ((0, vue.openBlock)(), (0, vue.createElementBlock)("div", {
				key: 0,
				class: require_vdom.normalizeClass(`${mergedClsPrefix}-date-panel-month-calendar__picker-col`)
			}, [((0, vue.openBlock)(), (0, vue.createBlock)(require__internal_scrollbar_src_Scrollbar.default, {
				ref: "endMonthScrollbarRef",
				theme: mergedTheme.peers.Scrollbar,
				themeOverrides: mergedTheme.peerOverrides.Scrollbar
			}, { default: () => [(type === "monthrange" ? this.endMonthArray : this.endQuarterArray).map((item, i) => renderItem(item, i, mergedClsPrefix, "end")), type === "monthrange" && ((0, vue.openBlock)(), (0, vue.createElementBlock)("div", { class: require_vdom.normalizeClass(`${mergedClsPrefix}-date-panel-month-calendar__padding`) }, null, 2))] }, 1032, ["theme", "themeOverrides"]))], 2)) : require_vdom.normalizeVNode(() => null)], 2)], 2),
			require_vdom.normalizeVNode(() => require__utils_vue_resolve_slot.resolveWrappedSlot(this.datePickerSlots.footer, (children) => {
				return children ? ((0, vue.openBlock)(), (0, vue.createElementBlock)("div", {
					key: 1,
					class: require_vdom.normalizeClass(`${mergedClsPrefix}-date-panel-footer`)
				}, [require_vdom.normalizeVNode(() => children)], 2)) : null;
			})),
			this.actions?.length || shortcuts ? ((0, vue.openBlock)(), (0, vue.createElementBlock)("div", {
				key: 0,
				class: require_vdom.normalizeClass(`${mergedClsPrefix}-date-panel-actions`)
			}, [(0, vue.createElementVNode)("div", { class: require_vdom.normalizeClass(`${mergedClsPrefix}-date-panel-actions__prefix`) }, [require_vdom.normalizeVNode(() => shortcuts && Object.keys(shortcuts).map((key) => {
				const shortcut = shortcuts[key];
				return Array.isArray(shortcut) || typeof shortcut === "function" ? ((0, vue.openBlock)(), (0, vue.createBlock)(require_button_src_Button.XButton, {
					key: 2,
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
			}))], 2), (0, vue.createElementVNode)("div", { class: require_vdom.normalizeClass(`${mergedClsPrefix}-date-panel-actions__suffix`) }, [this.actions?.includes("clear") ? ((0, vue.openBlock)(), (0, vue.createElementBlock)(vue.Fragment, { key: 0 }, [require_vdom.normalizeVNode(() => require__utils_vue_resolve_slot.resolveSlotWithTypedProps(this.datePickerSlots.clear, {
				onClear: this.handleClearClick,
				text: this.locale.clear
			}, () => [((0, vue.openBlock)(), (0, vue.createBlock)(require_button_src_Button.XButton, {
				theme: mergedTheme.peers.Button,
				themeOverrides: mergedTheme.peerOverrides.Button,
				size: "tiny",
				onClick: this.handleClearClick
			}, { default: () => this.locale.clear }, 1032, [
				"theme",
				"themeOverrides",
				"onClick"
			]))]))], 64)) : require_vdom.normalizeVNode(() => null), this.actions?.includes("confirm") ? ((0, vue.openBlock)(), (0, vue.createElementBlock)(vue.Fragment, { key: 2 }, [require_vdom.normalizeVNode(() => require__utils_vue_resolve_slot.resolveSlotWithTypedProps(this.datePickerSlots.confirm, {
				disabled: this.isRangeInvalid,
				onConfirm: this.handleConfirmClick,
				text: this.locale.confirm
			}, () => [((0, vue.openBlock)(), (0, vue.createBlock)(require_button_src_Button.XButton, {
				theme: mergedTheme.peers.Button,
				themeOverrides: mergedTheme.peerOverrides.Button,
				size: "tiny",
				type: "primary",
				disabled: this.isRangeInvalid,
				onClick: this.handleConfirmClick
			}, { default: () => this.locale.confirm }, 1032, [
				"theme",
				"themeOverrides",
				"disabled",
				"onClick"
			]))]))], 64)) : require_vdom.normalizeVNode(() => null)], 2)], 2)) : require_vdom.normalizeVNode(() => null),
			((0, vue.openBlock)(), (0, vue.createBlock)(require__internal_focus_detector_index, { onFocus: this.handleFocusDetectorFocus }, null, 8, ["onFocus"]))
		], 42, _hoisted_2);
	}
});
//#endregion
module.exports = monthrange_default;
