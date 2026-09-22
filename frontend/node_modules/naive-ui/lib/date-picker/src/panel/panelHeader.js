const require_vdom = require("../../../vue-jsx-vapor/vdom.js");
const require_date_picker_src_panel_month = require("./month.js");
let seemly = require("seemly");
let vue = require("vue");
let vueuc = require("vueuc");
let vdirs = require("vdirs");
//#region src/date-picker/src/panel/panelHeader.tsx
const _hoisted_1 = ["onClick"];
var panelHeader_default = (0, vue.defineComponent)({
	props: {
		mergedClsPrefix: {
			type: String,
			required: true
		},
		value: Number,
		monthBeforeYear: {
			type: Boolean,
			required: true
		},
		monthYearSeparator: {
			type: String,
			required: true
		},
		fastYearSelect: Boolean,
		fastMonthSelect: Boolean,
		calendarMonth: {
			type: String,
			required: true
		},
		calendarYear: {
			type: String,
			required: true
		},
		onUpdateValue: {
			type: Function,
			required: true
		}
	},
	setup(props) {
		const triggerRef = (0, vue.ref)(null);
		const monthPanelRef = (0, vue.ref)(null);
		const showRef = (0, vue.ref)(false);
		function toggleShow() {
			showRef.value = !showRef.value;
		}
		function handleSelectYear() {
			if (props.fastYearSelect) toggleShow();
		}
		function handleSelectMonth() {
			if (props.fastMonthSelect) toggleShow();
		}
		function handleClickOutside(e) {
			if (showRef.value && !triggerRef.value?.contains((0, seemly.getPreciseEventTarget)(e))) showRef.value = false;
		}
		function handleHeaderClick() {
			toggleShow();
		}
		return {
			show: showRef,
			triggerRef,
			monthPanelRef,
			handleSelectYear,
			handleSelectMonth,
			handleHeaderClick,
			handleClickOutside
		};
	},
	render() {
		const { handleClickOutside, mergedClsPrefix } = this;
		return (0, vue.openBlock)(), (0, vue.createElementBlock)("div", {
			class: require_vdom.normalizeClass(`${mergedClsPrefix}-date-panel-month__month-year`),
			ref: "triggerRef"
		}, [(0, vue.createVNode)(vueuc.VBinder, null, { default: () => [((0, vue.openBlock)(), (0, vue.createBlock)(vueuc.VTarget, null, { default: () => ((0, vue.openBlock)(), (0, vue.createElementBlock)("div", {
			class: require_vdom.normalizeClass([`${mergedClsPrefix}-date-panel-month__text`, this.show && `${mergedClsPrefix}-date-panel-month__text--active`]),
			onClick: this.handleHeaderClick
		}, [this.monthBeforeYear ? ((0, vue.openBlock)(), (0, vue.createElementBlock)(vue.Fragment, { key: 0 }, [require_vdom.normalizeVNode(() => [
			this.calendarMonth,
			this.monthYearSeparator,
			this.calendarYear
		])], 64)) : ((0, vue.openBlock)(), (0, vue.createElementBlock)(vue.Fragment, { key: 1 }, [require_vdom.normalizeVNode(() => [
			this.calendarYear,
			this.monthYearSeparator,
			this.calendarMonth
		])], 64))], 10, _hoisted_1)) }, 1024)), ((0, vue.openBlock)(), (0, vue.createBlock)(vueuc.VFollower, {
			show: this.show,
			teleportDisabled: true
		}, { default: () => ((0, vue.openBlock)(), (0, vue.createBlock)(vue.Transition, {
			name: "fade-in-scale-up-transition",
			appear: true
		}, { default: () => this.show ? (0, vue.withDirectives)(((0, vue.openBlock)(), (0, vue.createBlock)(require_date_picker_src_panel_month, {
			ref: "monthPanelRef",
			onUpdateValue: this.onUpdateValue,
			onSelectYear: this.handleSelectYear,
			onSelectMonth: this.handleSelectMonth,
			actions: [],
			calendarHeaderMonthYearSeparator: this.monthYearSeparator,
			type: "month",
			key: "month",
			useAsQuickJump: true,
			value: this.value
		}, null, 8, [
			"onUpdateValue",
			"onSelectYear",
			"onSelectMonth",
			"calendarHeaderMonthYearSeparator",
			"value"
		])), [[
			vdirs.clickoutside,
			handleClickOutside,
			void 0,
			{ capture: true }
		]]) : null }, 1024)) }, 1032, ["show"]))] }, 1024)], 2);
	}
});
//#endregion
module.exports = panelHeader_default;
