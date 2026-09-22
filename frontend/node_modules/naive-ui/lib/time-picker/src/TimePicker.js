Object.defineProperties(exports, {
	__esModule: { value: true },
	[Symbol.toStringTag]: { value: "Module" }
});
const require__utils_composable_use_adjusted_to = require("../../_utils/composable/use-adjusted-to.js");
const require__utils_event_index = require("../../_utils/event/index.js");
const require__utils_naive_warn = require("../../_utils/naive/warn.js");
const require__utils_vue_call = require("../../_utils/vue/call.js");
const require__mixins_use_config = require("../../_mixins/use-config.js");
const require__mixins_use_css_vars_class = require("../../_mixins/use-css-vars-class.js");
const require__mixins_use_form_item = require("../../_mixins/use-form-item.js");
const require__mixins_use_locale = require("../../_mixins/use-locale.js");
const require__mixins_use_theme = require("../../_mixins/use-theme.js");
const require_vdom = require("../../vue-jsx-vapor/vdom.js");
const require__internal_icon_src_Icon = require("../../_internal/icon/src/Icon.js");
const require__internal_icons_Time = require("../../_internal/icons/Time.js");
const require_input_src_Input = require("../../input/src/Input.js");
const require_date_picker_src_utils = require("../../date-picker/src/utils.js");
const require_time_picker_styles_light = require("../styles/light.js");
const require_time_picker_src_interface = require("./interface.js");
const require_time_picker_src_utils = require("./utils.js");
const require_time_picker_src_Panel = require("./Panel.js");
const require_time_picker_src_styles_index_cssr = require("./styles/index.cssr.js");
let seemly = require("seemly");
let vue = require("vue");
let vooks = require("vooks");
let vueuc = require("vueuc");
let vdirs = require("vdirs");
let date_fns = require("date-fns");
let date_fns_tz = require("date-fns-tz");
//#region src/time-picker/src/TimePicker.tsx
function validateUnits(value, max) {
	if (value === void 0) return true;
	if (Array.isArray(value)) return value.every((v) => v >= 0 && v <= max);
	else return value >= 0 && value <= max;
}
const timePickerProps = {
	...require__mixins_use_theme.default.props,
	to: require__utils_composable_use_adjusted_to.useAdjustedTo.propTo,
	bordered: {
		type: Boolean,
		default: void 0
	},
	actions: Array,
	defaultValue: {
		type: Number,
		default: null
	},
	defaultFormattedValue: String,
	placeholder: String,
	placement: {
		type: String,
		default: "bottom-start"
	},
	value: Number,
	format: {
		type: String,
		default: "HH:mm:ss"
	},
	valueFormat: String,
	formattedValue: String,
	isHourDisabled: Function,
	size: String,
	isMinuteDisabled: Function,
	isSecondDisabled: Function,
	inputReadonly: Boolean,
	clearable: Boolean,
	status: String,
	"onUpdate:value": [Function, Array],
	onUpdateValue: [Function, Array],
	"onUpdate:show": [Function, Array],
	onUpdateShow: [Function, Array],
	onUpdateFormattedValue: [Function, Array],
	"onUpdate:formattedValue": [Function, Array],
	onBlur: [Function, Array],
	onConfirm: [Function, Array],
	onClear: Function,
	onFocus: [Function, Array],
	timeZone: String,
	showIcon: {
		type: Boolean,
		default: true
	},
	disabled: {
		type: Boolean,
		default: void 0
	},
	show: {
		type: Boolean,
		default: void 0
	},
	hours: {
		type: [Number, Array],
		validator: (value) => validateUnits(value, 23)
	},
	minutes: {
		type: [Number, Array],
		validator: (value) => validateUnits(value, 59)
	},
	seconds: {
		type: [Number, Array],
		validator: (value) => validateUnits(value, 59)
	},
	use12Hours: Boolean,
	stateful: {
		type: Boolean,
		default: true
	},
	onChange: [Function, Array]
};
var TimePicker_default = (0, vue.defineComponent)({
	name: "TimePicker",
	props: timePickerProps,
	setup(props) {
		if (process.env.NODE_ENV !== "production") (0, vue.watchEffect)(() => {
			if (props.onChange !== void 0) require__utils_naive_warn.warnOnce("time-picker", "`on-change` is deprecated, please use `on-update:value` instead.");
		});
		const { mergedBorderedRef, mergedClsPrefixRef, namespaceRef, inlineThemeDisabled, mergedComponentPropsRef } = require__mixins_use_config.default(props);
		const { localeRef, dateLocaleRef } = require__mixins_use_locale("TimePicker");
		const formItem = require__mixins_use_form_item.default(props, { mergedSize: (NFormItem) => {
			const { size } = props;
			if (size) return size;
			const { mergedSize: formItemSize } = NFormItem || {};
			if (formItemSize?.value) return formItemSize.value;
			const configSize = mergedComponentPropsRef?.value?.TimePicker?.size;
			if (configSize) return configSize;
			return "medium";
		} });
		const { mergedSizeRef, mergedDisabledRef, mergedStatusRef } = formItem;
		const themeRef = require__mixins_use_theme.default("TimePicker", "-time-picker", require_time_picker_src_styles_index_cssr, require_time_picker_styles_light.default, props, mergedClsPrefixRef);
		const keyboardState = (0, vooks.useKeyboard)();
		const inputInstRef = (0, vue.ref)(null);
		const panelInstRef = (0, vue.ref)(null);
		const dateFnsOptionsRef = (0, vue.computed)(() => {
			return { locale: dateLocaleRef.value.locale };
		});
		function getTimestampFromFormattedValue(value) {
			if (value === null) return null;
			return require_date_picker_src_utils.strictParse(value, props.valueFormat || props.format, /* @__PURE__ */ new Date(), dateFnsOptionsRef.value).getTime();
		}
		const { defaultValue, defaultFormattedValue } = props;
		const uncontrolledValueRef = (0, vue.ref)(defaultFormattedValue !== void 0 ? getTimestampFromFormattedValue(defaultFormattedValue) : defaultValue);
		const mergedValueRef = (0, vue.computed)(() => {
			const { formattedValue } = props;
			if (formattedValue !== void 0) return getTimestampFromFormattedValue(formattedValue);
			const { value } = props;
			if (value !== void 0) return value;
			return uncontrolledValueRef.value;
		});
		const mergedFormatRef = (0, vue.computed)(() => {
			const { timeZone } = props;
			if (timeZone) return (date, format, options) => {
				return (0, date_fns_tz.formatInTimeZone)(date, timeZone, format, options);
			};
			else return (date, _format, options) => {
				return (0, date_fns.format)(date, _format, options);
			};
		});
		const displayTimeStringRef = (0, vue.ref)("");
		(0, vue.watch)(() => props.timeZone, () => {
			const mergedValue = mergedValueRef.value;
			displayTimeStringRef.value = mergedValue === null ? "" : mergedFormatRef.value(mergedValue, props.format, dateFnsOptionsRef.value);
		}, { immediate: true });
		const uncontrolledShowRef = (0, vue.ref)(false);
		const controlledShowRef = (0, vue.toRef)(props, "show");
		const mergedShowRef = (0, vooks.useMergedState)(controlledShowRef, uncontrolledShowRef);
		const memorizedValueRef = (0, vue.ref)(mergedValueRef.value);
		const transitionDisabledRef = (0, vue.ref)(false);
		const localizedClearRef = (0, vue.computed)(() => {
			return localeRef.value.clear;
		});
		const localizedNowRef = (0, vue.computed)(() => {
			return localeRef.value.now;
		});
		const localizedPlaceholderRef = (0, vue.computed)(() => {
			if (props.placeholder !== void 0) return props.placeholder;
			return localeRef.value.placeholder;
		});
		const localizedNegativeTextRef = (0, vue.computed)(() => {
			return localeRef.value.negativeText;
		});
		const localizedPositiveTextRef = (0, vue.computed)(() => {
			return localeRef.value.positiveText;
		});
		const hourInFormatRef = (0, vue.computed)(() => {
			return /H|h|K|k/.test(props.format);
		});
		const minuteInFormatRef = (0, vue.computed)(() => {
			return props.format.includes("m");
		});
		const secondInFormatRef = (0, vue.computed)(() => {
			return props.format.includes("s");
		});
		const hourValueRef = (0, vue.computed)(() => {
			const { value } = mergedValueRef;
			if (value === null) return null;
			return Number(mergedFormatRef.value(value, "HH", dateFnsOptionsRef.value));
		});
		const minuteValueRef = (0, vue.computed)(() => {
			const { value } = mergedValueRef;
			if (value === null) return null;
			return Number(mergedFormatRef.value(value, "mm", dateFnsOptionsRef.value));
		});
		const secondValueRef = (0, vue.computed)(() => {
			const { value } = mergedValueRef;
			if (value === null) return null;
			return Number(mergedFormatRef.value(value, "ss", dateFnsOptionsRef.value));
		});
		const isHourInvalidRef = (0, vue.computed)(() => {
			const { isHourDisabled } = props;
			if (hourValueRef.value === null) return false;
			if (!require_time_picker_src_utils.isTimeInStep(hourValueRef.value, "hours", props.hours)) return true;
			if (!isHourDisabled) return false;
			return isHourDisabled(hourValueRef.value);
		});
		const isMinuteInvalidRef = (0, vue.computed)(() => {
			const { value: minuteValue } = minuteValueRef;
			const { value: hourValue } = hourValueRef;
			if (minuteValue === null || hourValue === null) return false;
			if (!require_time_picker_src_utils.isTimeInStep(minuteValue, "minutes", props.minutes)) return true;
			const { isMinuteDisabled } = props;
			if (!isMinuteDisabled) return false;
			return isMinuteDisabled(minuteValue, hourValue);
		});
		const isSecondInvalidRef = (0, vue.computed)(() => {
			const { value: minuteValue } = minuteValueRef;
			const { value: hourValue } = hourValueRef;
			const { value: secondValue } = secondValueRef;
			if (secondValue === null || minuteValue === null || hourValue === null) return false;
			if (!require_time_picker_src_utils.isTimeInStep(secondValue, "seconds", props.seconds)) return true;
			const { isSecondDisabled } = props;
			if (!isSecondDisabled) return false;
			return isSecondDisabled(secondValue, minuteValue, hourValue);
		});
		const isValueInvalidRef = (0, vue.computed)(() => {
			return isHourInvalidRef.value || isMinuteInvalidRef.value || isSecondInvalidRef.value;
		});
		const mergedAttrSizeRef = (0, vue.computed)(() => {
			return props.format.length + 4;
		});
		const amPmValueRef = (0, vue.computed)(() => {
			const { value } = mergedValueRef;
			if (value === null) return null;
			return (0, date_fns.getHours)(value) < 12 ? "am" : "pm";
		});
		function doUpdateFormattedValue(value, timestampValue) {
			const { onUpdateFormattedValue, "onUpdate:formattedValue": _onUpdateFormattedValue } = props;
			if (onUpdateFormattedValue) require__utils_vue_call.call(onUpdateFormattedValue, value, timestampValue);
			if (_onUpdateFormattedValue) require__utils_vue_call.call(_onUpdateFormattedValue, value, timestampValue);
		}
		function createFormattedValue(value) {
			return value === null ? null : mergedFormatRef.value(value, props.valueFormat || props.format);
		}
		function doUpdateValue(value) {
			const { onUpdateValue, "onUpdate:value": _onUpdateValue, onChange } = props;
			const { nTriggerFormChange, nTriggerFormInput } = formItem;
			const formattedValue = createFormattedValue(value);
			if (onUpdateValue) require__utils_vue_call.call(onUpdateValue, value, formattedValue);
			if (_onUpdateValue) require__utils_vue_call.call(_onUpdateValue, value, formattedValue);
			if (onChange) require__utils_vue_call.call(onChange, value, formattedValue);
			doUpdateFormattedValue(formattedValue, value);
			uncontrolledValueRef.value = value;
			nTriggerFormChange();
			nTriggerFormInput();
		}
		function doFocus(e) {
			const { onFocus } = props;
			const { nTriggerFormFocus } = formItem;
			if (onFocus) require__utils_vue_call.call(onFocus, e);
			nTriggerFormFocus();
		}
		function doBlur(e) {
			const { onBlur } = props;
			const { nTriggerFormBlur } = formItem;
			if (onBlur) require__utils_vue_call.call(onBlur, e);
			nTriggerFormBlur();
		}
		function doConfirm() {
			const { onConfirm } = props;
			if (onConfirm) require__utils_vue_call.call(onConfirm, mergedValueRef.value, createFormattedValue(mergedValueRef.value));
		}
		function handleTimeInputClear(e) {
			e.stopPropagation();
			doUpdateValue(null);
			deriveInputValue(null);
			props.onClear?.();
		}
		function handleFocusDetectorFocus() {
			closePanel({ returnFocus: true });
		}
		function clearSelectedValue() {
			doUpdateValue(null);
			deriveInputValue(null);
			closePanel({ returnFocus: true });
		}
		function handleInputKeydown(e) {
			if (e.key === "Escape" && mergedShowRef.value) require__utils_event_index.markEventEffectPerformed(e);
		}
		function handleMenuKeydown(e) {
			switch (e.key) {
				case "Escape":
					if (mergedShowRef.value) {
						require__utils_event_index.markEventEffectPerformed(e);
						closePanel({ returnFocus: true });
					}
					break;
				case "Tab": if (keyboardState.shift && e.target === panelInstRef.value?.$el) {
					e.preventDefault();
					closePanel({ returnFocus: true });
				}
			}
		}
		function disableTransitionOneTick() {
			transitionDisabledRef.value = true;
			(0, vue.nextTick)(() => {
				transitionDisabledRef.value = false;
			});
		}
		function handleTriggerClick(e) {
			if (mergedDisabledRef.value || (0, seemly.happensIn)(e, "clear")) return;
			if (!mergedShowRef.value) openPanel();
		}
		function handleHourClick(hour) {
			if (typeof hour === "string") return;
			if (mergedValueRef.value === null) doUpdateValue((0, date_fns.getTime)((0, date_fns.setHours)((0, date_fns.startOfHour)(/* @__PURE__ */ new Date()), hour)));
			else doUpdateValue((0, date_fns.getTime)((0, date_fns.setHours)(mergedValueRef.value, hour)));
		}
		function handleMinuteClick(minute) {
			if (typeof minute === "string") return;
			if (mergedValueRef.value === null) doUpdateValue((0, date_fns.getTime)((0, date_fns.setMinutes)((0, date_fns.startOfMinute)(/* @__PURE__ */ new Date()), minute)));
			else doUpdateValue((0, date_fns.getTime)((0, date_fns.setMinutes)(mergedValueRef.value, minute)));
		}
		function handleSecondClick(second) {
			if (typeof second === "string") return;
			if (mergedValueRef.value === null) doUpdateValue((0, date_fns.getTime)((0, date_fns.setSeconds)((0, date_fns.startOfSecond)(/* @__PURE__ */ new Date()), second)));
			else doUpdateValue((0, date_fns.getTime)((0, date_fns.setSeconds)(mergedValueRef.value, second)));
		}
		function handleAmPmClick(amPm) {
			const { value: mergedValue } = mergedValueRef;
			if (mergedValue === null) {
				const now = /* @__PURE__ */ new Date();
				const hours = (0, date_fns.getHours)(now);
				if (amPm === "pm" && hours < 12) doUpdateValue((0, date_fns.getTime)((0, date_fns.setHours)(now, hours + 12)));
				else if (amPm === "am" && hours >= 12) doUpdateValue((0, date_fns.getTime)((0, date_fns.setHours)(now, hours - 12)));
				doUpdateValue((0, date_fns.getTime)(now));
			} else {
				const hours = (0, date_fns.getHours)(mergedValue);
				if (amPm === "pm" && hours < 12) doUpdateValue((0, date_fns.getTime)((0, date_fns.setHours)(mergedValue, hours + 12)));
				else if (amPm === "am" && hours >= 12) doUpdateValue((0, date_fns.getTime)((0, date_fns.setHours)(mergedValue, hours - 12)));
			}
		}
		function deriveInputValue(time) {
			if (time === void 0) time = mergedValueRef.value;
			if (time === null) displayTimeStringRef.value = "";
			else displayTimeStringRef.value = mergedFormatRef.value(time, props.format, dateFnsOptionsRef.value);
		}
		function handleTimeInputFocus(e) {
			if (isInternalFocusSwitch(e)) return;
			doFocus(e);
		}
		function handleTimeInputBlur(e) {
			if (isInternalFocusSwitch(e)) return;
			if (mergedShowRef.value) {
				if (!(panelInstRef.value?.$el)?.contains(e.relatedTarget)) {
					deriveInputValue();
					doBlur(e);
					closePanel({ returnFocus: false });
				}
			} else {
				deriveInputValue();
				doBlur(e);
			}
		}
		function handleTimeInputActivate() {
			if (mergedDisabledRef.value) return;
			if (!mergedShowRef.value) openPanel();
		}
		function handleTimeInputDeactivate() {
			if (mergedDisabledRef.value) return;
			deriveInputValue();
			closePanel({ returnFocus: false });
		}
		function scrollTimer() {
			if (!panelInstRef.value) return;
			const { hourScrollRef, minuteScrollRef, secondScrollRef, amPmScrollRef } = panelInstRef.value;
			[
				hourScrollRef,
				minuteScrollRef,
				secondScrollRef,
				amPmScrollRef
			].forEach((itemScrollRef) => {
				if (!itemScrollRef) return;
				const activeItemEl = itemScrollRef.contentRef?.querySelector("[data-active]");
				if (activeItemEl) itemScrollRef.scrollTo({ top: activeItemEl.offsetTop });
			});
		}
		function doUpdateShow(value) {
			uncontrolledShowRef.value = value;
			const { onUpdateShow, "onUpdate:show": _onUpdateShow } = props;
			if (onUpdateShow) require__utils_vue_call.call(onUpdateShow, value);
			if (_onUpdateShow) require__utils_vue_call.call(_onUpdateShow, value);
		}
		function isInternalFocusSwitch(e) {
			return !!(inputInstRef.value?.wrapperElRef?.contains(e.relatedTarget) || panelInstRef.value?.$el.contains(e.relatedTarget));
		}
		function openPanel() {
			memorizedValueRef.value = mergedValueRef.value;
			doUpdateShow(true);
			(0, vue.nextTick)(scrollTimer);
		}
		function handleClickOutside(e) {
			if (mergedShowRef.value && !inputInstRef.value?.wrapperElRef?.contains((0, seemly.getPreciseEventTarget)(e))) closePanel({ returnFocus: false });
		}
		function closePanel({ returnFocus }) {
			if (mergedShowRef.value) {
				doUpdateShow(false);
				if (returnFocus) inputInstRef.value?.focus();
			}
		}
		function handleTimeInputUpdateValue(v) {
			if (v === "") {
				doUpdateValue(null);
				return;
			}
			const time = require_date_picker_src_utils.strictParse(v, props.format, /* @__PURE__ */ new Date(), dateFnsOptionsRef.value);
			displayTimeStringRef.value = v;
			if ((0, date_fns.isValid)(time)) {
				const { value: mergedValue } = mergedValueRef;
				if (mergedValue !== null) {
					const newTime = (0, date_fns.set)(mergedValue, {
						hours: (0, date_fns.getHours)(time),
						minutes: (0, date_fns.getMinutes)(time),
						seconds: (0, date_fns.getSeconds)(time),
						milliseconds: (0, date_fns.getMilliseconds)(time)
					});
					doUpdateValue((0, date_fns.getTime)(newTime));
				} else doUpdateValue((0, date_fns.getTime)(time));
			}
		}
		function handleCancelClick() {
			doUpdateValue(memorizedValueRef.value);
			doUpdateShow(false);
		}
		function handleNowClick() {
			const now = /* @__PURE__ */ new Date();
			const getNowTime = {
				hours: date_fns.getHours,
				minutes: date_fns.getMinutes,
				seconds: date_fns.getSeconds
			};
			const [mergeHours, mergeMinutes, mergeSeconds] = [
				"hours",
				"minutes",
				"seconds"
			].map((i) => !props[i] || require_time_picker_src_utils.isTimeInStep(getNowTime[i](now), i, props[i]) ? getNowTime[i](now) : require_time_picker_src_utils.findSimilarTime(getNowTime[i](now), i, props[i]));
			const newValue = (0, date_fns.setSeconds)((0, date_fns.setMinutes)((0, date_fns.setHours)(mergedValueRef.value ? mergedValueRef.value : (0, date_fns.getTime)(now), mergeHours), mergeMinutes), mergeSeconds);
			doUpdateValue((0, date_fns.getTime)(newValue));
		}
		function handleConfirmClick() {
			deriveInputValue();
			doConfirm();
			closePanel({ returnFocus: true });
		}
		function handleMenuFocusOut(e) {
			if (isInternalFocusSwitch(e)) return;
			deriveInputValue();
			doBlur(e);
			closePanel({ returnFocus: false });
		}
		(0, vue.watch)(mergedValueRef, (value) => {
			deriveInputValue(value);
			disableTransitionOneTick();
			(0, vue.nextTick)(scrollTimer);
		});
		(0, vue.watch)(mergedShowRef, () => {
			if (isValueInvalidRef.value) doUpdateValue(memorizedValueRef.value);
		});
		(0, vue.provide)(require_time_picker_src_interface.timePickerInjectionKey, {
			mergedThemeRef: themeRef,
			mergedClsPrefixRef
		});
		const exposedMethods = {
			focus: () => {
				inputInstRef.value?.focus();
			},
			blur: () => {
				inputInstRef.value?.blur();
			}
		};
		const triggerCssVarsRef = (0, vue.computed)(() => {
			const { common: { cubicBezierEaseInOut }, self: { iconColor, iconColorDisabled } } = themeRef.value;
			return {
				"--n-icon-color-override": iconColor,
				"--n-icon-color-disabled-override": iconColorDisabled,
				"--n-bezier": cubicBezierEaseInOut
			};
		});
		const triggerThemeClassHandle = inlineThemeDisabled ? require__mixins_use_css_vars_class.useThemeClass("time-picker-trigger", void 0, triggerCssVarsRef, props) : void 0;
		const cssVarsRef = (0, vue.computed)(() => {
			const { self: { panelColor, itemTextColor, itemTextColorActive, itemColorHover, panelDividerColor, panelBoxShadow, itemOpacityDisabled, borderRadius, itemFontSize, itemWidth, itemHeight, panelActionPadding, itemBorderRadius }, common: { cubicBezierEaseInOut } } = themeRef.value;
			return {
				"--n-bezier": cubicBezierEaseInOut,
				"--n-border-radius": borderRadius,
				"--n-item-color-hover": itemColorHover,
				"--n-item-font-size": itemFontSize,
				"--n-item-height": itemHeight,
				"--n-item-opacity-disabled": itemOpacityDisabled,
				"--n-item-text-color": itemTextColor,
				"--n-item-text-color-active": itemTextColorActive,
				"--n-item-width": itemWidth,
				"--n-panel-action-padding": panelActionPadding,
				"--n-panel-box-shadow": panelBoxShadow,
				"--n-panel-color": panelColor,
				"--n-panel-divider-color": panelDividerColor,
				"--n-item-border-radius": itemBorderRadius
			};
		});
		const themeClassHandle = inlineThemeDisabled ? require__mixins_use_css_vars_class.useThemeClass("time-picker", void 0, cssVarsRef, props) : void 0;
		return {
			focus: exposedMethods.focus,
			blur: exposedMethods.blur,
			mergedStatus: mergedStatusRef,
			mergedBordered: mergedBorderedRef,
			mergedClsPrefix: mergedClsPrefixRef,
			namespace: namespaceRef,
			uncontrolledValue: uncontrolledValueRef,
			mergedValue: mergedValueRef,
			isMounted: (0, vooks.useIsMounted)(),
			inputInstRef,
			panelInstRef,
			adjustedTo: require__utils_composable_use_adjusted_to.useAdjustedTo(props),
			mergedShow: mergedShowRef,
			localizedClear: localizedClearRef,
			localizedNow: localizedNowRef,
			localizedPlaceholder: localizedPlaceholderRef,
			localizedNegativeText: localizedNegativeTextRef,
			localizedPositiveText: localizedPositiveTextRef,
			hourInFormat: hourInFormatRef,
			minuteInFormat: minuteInFormatRef,
			secondInFormat: secondInFormatRef,
			mergedAttrSize: mergedAttrSizeRef,
			displayTimeString: displayTimeStringRef,
			mergedSize: mergedSizeRef,
			mergedDisabled: mergedDisabledRef,
			isValueInvalid: isValueInvalidRef,
			isHourInvalid: isHourInvalidRef,
			isMinuteInvalid: isMinuteInvalidRef,
			isSecondInvalid: isSecondInvalidRef,
			transitionDisabled: transitionDisabledRef,
			hourValue: hourValueRef,
			minuteValue: minuteValueRef,
			secondValue: secondValueRef,
			amPmValue: amPmValueRef,
			handleInputKeydown,
			handleTimeInputFocus,
			handleTimeInputBlur,
			handleNowClick,
			handleConfirmClick,
			handleTimeInputUpdateValue,
			handleMenuFocusOut,
			handleCancelClick,
			handleClickOutside,
			handleTimeInputActivate,
			handleTimeInputDeactivate,
			handleHourClick,
			handleMinuteClick,
			handleSecondClick,
			handleAmPmClick,
			handleTimeInputClear,
			handleFocusDetectorFocus,
			handleMenuKeydown,
			handleTriggerClick,
			mergedTheme: themeRef,
			triggerCssVars: inlineThemeDisabled ? void 0 : triggerCssVarsRef,
			triggerThemeClass: triggerThemeClassHandle?.themeClass,
			triggerOnRender: triggerThemeClassHandle?.onRender,
			cssVars: inlineThemeDisabled ? void 0 : cssVarsRef,
			themeClass: themeClassHandle?.themeClass,
			onRender: themeClassHandle?.onRender,
			clearSelectedValue
		};
	},
	render() {
		const { mergedClsPrefix, $slots, triggerOnRender } = this;
		triggerOnRender?.();
		return (0, vue.openBlock)(), (0, vue.createElementBlock)("div", {
			class: require_vdom.normalizeClass([`${mergedClsPrefix}-time-picker`, this.triggerThemeClass]),
			style: (0, vue.normalizeStyle)(this.triggerCssVars)
		}, [(0, vue.createVNode)(vueuc.VBinder, null, { default: () => [((0, vue.openBlock)(), (0, vue.createBlock)(vueuc.VTarget, null, { default: () => ((0, vue.openBlock)(), (0, vue.createBlock)(require_input_src_Input.default, {
			ref: "inputInstRef",
			status: this.mergedStatus,
			value: this.displayTimeString,
			bordered: this.mergedBordered,
			passivelyActivated: true,
			attrSize: this.mergedAttrSize,
			theme: this.mergedTheme.peers.Input,
			themeOverrides: this.mergedTheme.peerOverrides.Input,
			stateful: this.stateful,
			size: this.mergedSize,
			placeholder: this.localizedPlaceholder,
			clearable: this.clearable,
			disabled: this.mergedDisabled,
			textDecoration: this.isValueInvalid ? "line-through" : void 0,
			onFocus: this.handleTimeInputFocus,
			onBlur: this.handleTimeInputBlur,
			onActivate: this.handleTimeInputActivate,
			onDeactivate: this.handleTimeInputDeactivate,
			onUpdateValue: this.handleTimeInputUpdateValue,
			onClear: this.handleTimeInputClear,
			internalDeactivateOnEnter: true,
			internalForceFocus: this.mergedShow,
			readonly: this.inputReadonly || this.mergedDisabled,
			onClick: this.handleTriggerClick,
			onKeydown: this.handleInputKeydown
		}, require_vdom.normalizeSlots(this.showIcon ? { [this.clearable ? "clear-icon-placeholder" : "suffix"]: () => ((0, vue.openBlock)(), (0, vue.createBlock)(require__internal_icon_src_Icon, {
			clsPrefix: mergedClsPrefix,
			class: require_vdom.normalizeClass(`${mergedClsPrefix}-time-picker-icon`)
		}, { default: () => $slots.icon ? $slots.icon() : ((0, vue.openBlock)(), (0, vue.createBlock)(require__internal_icons_Time, { key: 1 })) }, 1032, ["clsPrefix", "class"])) } : null), 1032, [
			"status",
			"value",
			"bordered",
			"passivelyActivated",
			"attrSize",
			"theme",
			"themeOverrides",
			"stateful",
			"size",
			"placeholder",
			"clearable",
			"disabled",
			"textDecoration",
			"onFocus",
			"onBlur",
			"onActivate",
			"onDeactivate",
			"onUpdateValue",
			"onClear",
			"internalDeactivateOnEnter",
			"internalForceFocus",
			"readonly",
			"onClick",
			"onKeydown"
		])) }, 1024)), ((0, vue.openBlock)(), (0, vue.createBlock)(vueuc.VFollower, {
			teleportDisabled: this.adjustedTo === require__utils_composable_use_adjusted_to.useAdjustedTo.tdkey,
			show: this.mergedShow,
			to: this.adjustedTo,
			containerClass: this.namespace,
			placement: this.placement
		}, {
			_: 1,
			default: require_vdom.normalizeSlot(() => ((0, vue.openBlock)(), (0, vue.createBlock)(vue.Transition, {
				name: "fade-in-scale-up-transition",
				appear: this.isMounted
			}, {
				_: 1,
				default: require_vdom.normalizeSlot(() => {
					if (this.mergedShow) {
						this.onRender?.();
						return (0, vue.withDirectives)(((0, vue.openBlock)(), (0, vue.createBlock)(require_time_picker_src_Panel, {
							key: 2,
							ref: "panelInstRef",
							actions: this.actions,
							class: require_vdom.normalizeClass(this.themeClass),
							style: (0, vue.normalizeStyle)(this.cssVars),
							seconds: this.seconds,
							minutes: this.minutes,
							hours: this.hours,
							transitionDisabled: this.transitionDisabled,
							hourValue: this.hourValue,
							showHour: this.hourInFormat,
							isHourInvalid: this.isHourInvalid,
							isHourDisabled: this.isHourDisabled,
							minuteValue: this.minuteValue,
							showMinute: this.minuteInFormat,
							isMinuteInvalid: this.isMinuteInvalid,
							isMinuteDisabled: this.isMinuteDisabled,
							secondValue: this.secondValue,
							amPmValue: this.amPmValue,
							showSecond: this.secondInFormat,
							isSecondInvalid: this.isSecondInvalid,
							isSecondDisabled: this.isSecondDisabled,
							isValueInvalid: this.isValueInvalid,
							clearText: this.localizedClear,
							nowText: this.localizedNow,
							confirmText: this.localizedPositiveText,
							use12Hours: this.use12Hours,
							onFocusout: this.handleMenuFocusOut,
							onKeydown: this.handleMenuKeydown,
							onHourClick: this.handleHourClick,
							onMinuteClick: this.handleMinuteClick,
							onSecondClick: this.handleSecondClick,
							onAmPmClick: this.handleAmPmClick,
							onNowClick: this.handleNowClick,
							onConfirmClick: this.handleConfirmClick,
							onClearClick: this.clearSelectedValue,
							onFocusDetectorFocus: this.handleFocusDetectorFocus
						}, null, 8, [
							"actions",
							"class",
							"style",
							"seconds",
							"minutes",
							"hours",
							"transitionDisabled",
							"hourValue",
							"showHour",
							"isHourInvalid",
							"isHourDisabled",
							"minuteValue",
							"showMinute",
							"isMinuteInvalid",
							"isMinuteDisabled",
							"secondValue",
							"amPmValue",
							"showSecond",
							"isSecondInvalid",
							"isSecondDisabled",
							"isValueInvalid",
							"clearText",
							"nowText",
							"confirmText",
							"use12Hours",
							"onFocusout",
							"onKeydown",
							"onHourClick",
							"onMinuteClick",
							"onSecondClick",
							"onAmPmClick",
							"onNowClick",
							"onConfirmClick",
							"onClearClick",
							"onFocusDetectorFocus"
						])), [[
							vdirs.clickoutside,
							this.handleClickOutside,
							void 0,
							{ capture: true }
						]]);
					}
					return null;
				})
			}, 8, ["appear"])))
		}, 8, [
			"teleportDisabled",
			"show",
			"to",
			"containerClass",
			"placement"
		]))] }, 1024)], 6);
	}
});
//#endregion
exports.default = TimePicker_default;
exports.timePickerProps = timePickerProps;
