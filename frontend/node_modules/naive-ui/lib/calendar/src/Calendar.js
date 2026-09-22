Object.defineProperties(exports, {
	__esModule: { value: true },
	[Symbol.toStringTag]: { value: "Module" }
});
const require__utils_vue_call = require("../../_utils/vue/call.js");
const require__utils_vue_resolve_slot = require("../../_utils/vue/resolve-slot.js");
const require__mixins_use_config = require("../../_mixins/use-config.js");
const require__mixins_use_css_vars_class = require("../../_mixins/use-css-vars-class.js");
const require__mixins_use_locale = require("../../_mixins/use-locale.js");
const require__mixins_use_theme = require("../../_mixins/use-theme.js");
const require_vdom = require("../../vue-jsx-vapor/vdom.js");
const require__internal_icon_src_Icon = require("../../_internal/icon/src/Icon.js");
const require__internal_icons_ChevronLeft = require("../../_internal/icons/ChevronLeft.js");
const require__internal_icons_ChevronRight = require("../../_internal/icons/ChevronRight.js");
const require_button_src_Button = require("../../button/src/Button.js");
const require_button_group_src_ButtonGroup = require("../../button-group/src/ButtonGroup.js");
const require_date_picker_src_utils = require("../../date-picker/src/utils.js");
const require_calendar_styles_light = require("../styles/light.js");
const require_calendar_src_styles_index_cssr = require("./styles/index.cssr.js");
let vue = require("vue");
let vooks = require("vooks");
let date_fns = require("date-fns");
//#region src/calendar/src/Calendar.tsx
const _hoisted_1 = ["title"];
const _hoisted_2 = ["onClick"];
const _hoisted_3 = ["title"];
const calendarProps = {
	...require__mixins_use_theme.default.props,
	isDateDisabled: Function,
	value: Number,
	defaultValue: {
		type: Number,
		default: null
	},
	onPanelChange: Function,
	"onUpdate:value": [Function, Array],
	onUpdateValue: [Function, Array]
};
var Calendar_default = (0, vue.defineComponent)({
	name: "Calendar",
	props: calendarProps,
	slots: Object,
	setup(props) {
		const { mergedClsPrefixRef, inlineThemeDisabled } = require__mixins_use_config.default(props);
		const themeRef = require__mixins_use_theme.default("Calendar", "-calendar", require_calendar_src_styles_index_cssr, require_calendar_styles_light.default, props, mergedClsPrefixRef);
		const { localeRef, dateLocaleRef } = require__mixins_use_locale("DatePicker");
		const now = Date.now();
		const monthTsRef = (0, vue.ref)((0, date_fns.startOfMonth)(props.defaultValue ?? now).valueOf());
		const uncontrolledValueRef = (0, vue.ref)(props.defaultValue || null);
		const mergedValueRef = (0, vooks.useMergedState)((0, vue.toRef)(props, "value"), uncontrolledValueRef);
		function doUpdateValue(value, time) {
			const { onUpdateValue, "onUpdate:value": _onUpdateValue } = props;
			if (onUpdateValue) require__utils_vue_call.call(onUpdateValue, value, time);
			if (_onUpdateValue) require__utils_vue_call.call(_onUpdateValue, value, time);
			uncontrolledValueRef.value = value;
		}
		function handlePrevClick() {
			const monthTs = (0, date_fns.addMonths)(monthTsRef.value, -1).valueOf();
			monthTsRef.value = monthTs;
			props.onPanelChange?.({
				year: (0, date_fns.getYear)(monthTs),
				month: (0, date_fns.getMonth)(monthTs) + 1
			});
		}
		function handleNextClick() {
			const monthTs = (0, date_fns.addMonths)(monthTsRef.value, 1).valueOf();
			monthTsRef.value = monthTs;
			props.onPanelChange?.({
				year: (0, date_fns.getYear)(monthTs),
				month: (0, date_fns.getMonth)(monthTs) + 1
			});
		}
		function handleTodayClick() {
			const { value: monthTs } = monthTsRef;
			const oldYear = (0, date_fns.getYear)(monthTs);
			const oldMonth = (0, date_fns.getMonth)(monthTs);
			const newMonthTs = (0, date_fns.startOfMonth)(now).valueOf();
			monthTsRef.value = newMonthTs;
			const newYear = (0, date_fns.getYear)(newMonthTs);
			const newMonth = (0, date_fns.getMonth)(newMonthTs);
			if (oldYear !== newYear || oldMonth !== newMonth) props.onPanelChange?.({
				year: newYear,
				month: newMonth + 1
			});
		}
		const cssVarsRef = (0, vue.computed)(() => {
			const { common: { cubicBezierEaseInOut }, self: { borderColor, borderColorModal, borderColorPopover, borderRadius, titleFontSize, textColor, titleFontWeight, titleTextColor, dayTextColor, fontSize, lineHeight, dateColorCurrent, dateTextColorCurrent, cellColorHover, cellColor, cellColorModal, barColor, cellColorPopover, cellColorHoverModal, cellColorHoverPopover } } = themeRef.value;
			return {
				"--n-bezier": cubicBezierEaseInOut,
				"--n-border-color": borderColor,
				"--n-border-color-modal": borderColorModal,
				"--n-border-color-popover": borderColorPopover,
				"--n-border-radius": borderRadius,
				"--n-text-color": textColor,
				"--n-title-font-weight": titleFontWeight,
				"--n-title-font-size": titleFontSize,
				"--n-title-text-color": titleTextColor,
				"--n-day-text-color": dayTextColor,
				"--n-font-size": fontSize,
				"--n-line-height": lineHeight,
				"--n-date-color-current": dateColorCurrent,
				"--n-date-text-color-current": dateTextColorCurrent,
				"--n-cell-color": cellColor,
				"--n-cell-color-modal": cellColorModal,
				"--n-cell-color-popover": cellColorPopover,
				"--n-cell-color-hover": cellColorHover,
				"--n-cell-color-hover-modal": cellColorHoverModal,
				"--n-cell-color-hover-popover": cellColorHoverPopover,
				"--n-bar-color": barColor
			};
		});
		const themeClassHandle = inlineThemeDisabled ? require__mixins_use_css_vars_class.useThemeClass("calendar", void 0, cssVarsRef, props) : void 0;
		return {
			mergedClsPrefix: mergedClsPrefixRef,
			locale: localeRef,
			dateLocale: dateLocaleRef,
			now,
			mergedValue: mergedValueRef,
			monthTs: monthTsRef,
			dateItems: (0, vue.computed)(() => {
				return require_date_picker_src_utils.dateArray(monthTsRef.value, mergedValueRef.value, now, localeRef.value.firstDayOfWeek, true);
			}),
			doUpdateValue,
			handleTodayClick,
			handlePrevClick,
			handleNextClick,
			mergedTheme: themeRef,
			cssVars: inlineThemeDisabled ? void 0 : cssVarsRef,
			themeClass: themeClassHandle?.themeClass,
			onRender: themeClassHandle?.onRender
		};
	},
	render() {
		const { isDateDisabled, mergedClsPrefix, monthTs, cssVars, mergedValue, mergedTheme, $slots, locale: { monthBeforeYear, today }, dateLocale: { locale }, handleTodayClick, handlePrevClick, handleNextClick, onRender } = this;
		onRender?.();
		const normalizedValue = mergedValue && (0, date_fns.startOfDay)(mergedValue).valueOf();
		const year = (0, date_fns.getYear)(monthTs);
		const calendarMonth = (0, date_fns.getMonth)(monthTs) + 1;
		return (0, vue.openBlock)(), (0, vue.createElementBlock)("div", {
			class: require_vdom.normalizeClass([`${mergedClsPrefix}-calendar`, this.themeClass]),
			style: (0, vue.normalizeStyle)(cssVars)
		}, [(0, vue.createElementVNode)("div", { class: require_vdom.normalizeClass(`${mergedClsPrefix}-calendar-header`) }, [(0, vue.createElementVNode)("div", { class: require_vdom.normalizeClass(`${mergedClsPrefix}-calendar-header__title`) }, [require_vdom.normalizeVNode(() => require__utils_vue_resolve_slot.resolveSlotWithTypedProps($slots.header, {
			year,
			month: calendarMonth
		}, () => {
			const localeMonth = (0, date_fns.format)(monthTs, "MMMM", { locale });
			return [monthBeforeYear ? `${localeMonth} ${year}` : `${year} ${localeMonth}`];
		}))], 2), (0, vue.createElementVNode)("div", { class: require_vdom.normalizeClass(`${mergedClsPrefix}-calendar-header__extra`) }, [(0, vue.createVNode)(require_button_group_src_ButtonGroup.default, null, { default: () => ((0, vue.openBlock)(), (0, vue.createElementBlock)(vue.Fragment, null, [
			((0, vue.openBlock)(), (0, vue.createBlock)(require_button_src_Button.default, {
				size: "small",
				onClick: handlePrevClick,
				theme: mergedTheme.peers.Button,
				themeOverrides: mergedTheme.peerOverrides.Button
			}, { icon: () => ((0, vue.openBlock)(), (0, vue.createBlock)(require__internal_icon_src_Icon, {
				clsPrefix: mergedClsPrefix,
				class: require_vdom.normalizeClass(`${mergedClsPrefix}-calendar-prev-btn`)
			}, { default: () => ((0, vue.openBlock)(), (0, vue.createBlock)(require__internal_icons_ChevronLeft)) }, 1032, ["clsPrefix", "class"])) }, 1032, [
				"onClick",
				"theme",
				"themeOverrides"
			])),
			((0, vue.openBlock)(), (0, vue.createBlock)(require_button_src_Button.default, {
				size: "small",
				onClick: handleTodayClick,
				theme: mergedTheme.peers.Button,
				themeOverrides: mergedTheme.peerOverrides.Button
			}, { default: () => today }, 1032, [
				"onClick",
				"theme",
				"themeOverrides"
			])),
			((0, vue.openBlock)(), (0, vue.createBlock)(require_button_src_Button.default, {
				size: "small",
				onClick: handleNextClick,
				theme: mergedTheme.peers.Button,
				themeOverrides: mergedTheme.peerOverrides.Button
			}, { icon: () => ((0, vue.openBlock)(), (0, vue.createBlock)(require__internal_icon_src_Icon, {
				clsPrefix: mergedClsPrefix,
				class: require_vdom.normalizeClass(`${mergedClsPrefix}-calendar-next-btn`)
			}, { default: () => ((0, vue.openBlock)(), (0, vue.createBlock)(require__internal_icons_ChevronRight)) }, 1032, ["clsPrefix", "class"])) }, 1032, [
				"onClick",
				"theme",
				"themeOverrides"
			]))
		], 64)) }, 1024)], 2)], 2), (0, vue.createElementVNode)("div", { class: require_vdom.normalizeClass(`${mergedClsPrefix}-calendar-dates`) }, [require_vdom.normalizeVNode(() => this.dateItems.map(({ dateObject, ts, inCurrentMonth, isCurrentDate }, index) => {
			const { year, month, date } = dateObject;
			const fullDate = (0, date_fns.format)(ts, "yyyy-MM-dd");
			const notInCurrentMonth = !inCurrentMonth;
			const disabled = isDateDisabled?.(ts) === true;
			const selected = normalizedValue === (0, date_fns.startOfDay)(ts).valueOf();
			return (0, vue.openBlock)(), (0, vue.createElementBlock)("div", {
				key: `${calendarMonth}-${index}`,
				class: require_vdom.normalizeClass([
					`${mergedClsPrefix}-calendar-cell`,
					disabled && `${mergedClsPrefix}-calendar-cell--disabled`,
					notInCurrentMonth && `${mergedClsPrefix}-calendar-cell--other-month`,
					disabled && `${mergedClsPrefix}-calendar-cell--not-allowed`,
					isCurrentDate && `${mergedClsPrefix}-calendar-cell--current`,
					selected && `${mergedClsPrefix}-calendar-cell--selected`
				]),
				onClick: () => {
					if (disabled) return;
					const monthTs = (0, date_fns.startOfMonth)(ts).valueOf();
					this.monthTs = monthTs;
					if (notInCurrentMonth) this.onPanelChange?.({
						year: (0, date_fns.getYear)(monthTs),
						month: (0, date_fns.getMonth)(monthTs) + 1
					});
					this.doUpdateValue(ts, {
						year,
						month: month + 1,
						date
					});
				}
			}, [
				(0, vue.createElementVNode)("div", { class: require_vdom.normalizeClass(`${mergedClsPrefix}-calendar-date`) }, [(0, vue.createElementVNode)("div", {
					class: require_vdom.normalizeClass(`${mergedClsPrefix}-calendar-date__date`),
					title: fullDate
				}, [require_vdom.normalizeVNode(() => date)], 10, _hoisted_3), require_vdom.normalizeVNode(() => index < 7 && ((0, vue.openBlock)(), (0, vue.createElementBlock)("div", {
					class: require_vdom.normalizeClass(`${mergedClsPrefix}-calendar-date__day`),
					title: fullDate
				}, [require_vdom.normalizeVNode(() => (0, date_fns.format)(ts, "EEE", { locale }))], 10, _hoisted_1)))], 2),
				require_vdom.normalizeVNode(() => $slots.default?.({
					year,
					month: month + 1,
					date
				})),
				(0, vue.createElementVNode)("div", { class: require_vdom.normalizeClass(`${mergedClsPrefix}-calendar-cell__bar`) }, null, 2)
			], 10, _hoisted_2);
		}))], 2)], 6);
	}
});
//#endregion
exports.calendarProps = calendarProps;
exports.default = Calendar_default;
