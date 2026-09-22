const require__utils_composable_use_adjusted_to = require("../../_utils/composable/use-adjusted-to.js");
const require__utils_cssr_index = require("../../_utils/cssr/index.js");
const require__utils_event_index = require("../../_utils/event/index.js");
const require__utils_naive_warn = require("../../_utils/naive/warn.js");
const require__utils_vue_call = require("../../_utils/vue/call.js");
const require__utils_vue_resolve_slot = require("../../_utils/vue/resolve-slot.js");
const require__mixins_use_config = require("../../_mixins/use-config.js");
const require__mixins_use_css_vars_class = require("../../_mixins/use-css-vars-class.js");
const require__mixins_use_form_item = require("../../_mixins/use-form-item.js");
const require__mixins_use_locale = require("../../_mixins/use-locale.js");
const require__mixins_use_theme = require("../../_mixins/use-theme.js");
const require_vdom = require("../../vue-jsx-vapor/vdom.js");
const require__internal_icon_src_Icon = require("../../_internal/icon/src/Icon.js");
const require__internal_icons_Date = require("../../_internal/icons/Date.js");
const require__internal_icons_To = require("../../_internal/icons/To.js");
const require_input_src_Input = require("../../input/src/Input.js");
const require_date_picker_src_utils = require("./utils.js");
const require_date_picker_styles_light = require("../styles/light.js");
const require_date_picker_src_interface = require("./interface.js");
const require_date_picker_src_panel_month = require("./panel/month.js");
const require_date_picker_src_panel_date = require("./panel/date.js");
const require_date_picker_src_panel_daterange = require("./panel/daterange.js");
const require_date_picker_src_panel_datetime = require("./panel/datetime.js");
const require_date_picker_src_panel_datetimerange = require("./panel/datetimerange.js");
const require_date_picker_src_panel_monthrange = require("./panel/monthrange.js");
const require_date_picker_src_props = require("./props.js");
const require_date_picker_src_styles_index_cssr = require("./styles/index.cssr.js");
const require_date_picker_src_validation_utils = require("./validation-utils.js");
let seemly = require("seemly");
let vue = require("vue");
let vooks = require("vooks");
let vueuc = require("vueuc");
let vdirs = require("vdirs");
let date_fns = require("date-fns");
//#region src/date-picker/src/DatePicker.tsx
const _hoisted_1 = ["onKeydown"];
var DatePicker_default = (0, vue.defineComponent)({
	name: "DatePicker",
	props: require_date_picker_src_props.datePickerProps,
	slots: Object,
	setup(props, { slots }) {
		if (process.env.NODE_ENV !== "production") (0, vue.watchEffect)(() => {
			if (props.onChange !== void 0) require__utils_naive_warn.warnOnce("date-picker", "`on-change` is deprecated, please use `on-update:value` instead.");
		});
		const { localeRef, dateLocaleRef } = require__mixins_use_locale("DatePicker");
		const { mergedComponentPropsRef, mergedClsPrefixRef, mergedBorderedRef, namespaceRef, inlineThemeDisabled } = require__mixins_use_config.default(props);
		const formItem = require__mixins_use_form_item.default(props, { mergedSize: (NFormItem) => {
			const { size } = props;
			if (size) return size;
			const { mergedSize: formItemSize } = NFormItem || {};
			if (formItemSize?.value) return formItemSize.value;
			const configSize = mergedComponentPropsRef?.value?.DatePicker?.size;
			if (configSize) return configSize;
			return "medium";
		} });
		const { mergedSizeRef, mergedDisabledRef, mergedStatusRef } = formItem;
		const panelInstRef = (0, vue.ref)(null);
		const triggerElRef = (0, vue.ref)(null);
		const inputInstRef = (0, vue.ref)(null);
		const uncontrolledShowRef = (0, vue.ref)(false);
		const controlledShowRef = (0, vue.toRef)(props, "show");
		const mergedShowRef = (0, vooks.useMergedState)(controlledShowRef, uncontrolledShowRef);
		const dateFnsOptionsRef = (0, vue.computed)(() => {
			return {
				locale: dateLocaleRef.value.locale,
				useAdditionalWeekYearTokens: true
			};
		});
		const mergedFormatRef = (0, vue.computed)(() => {
			const { format } = props;
			if (format) return format;
			switch (props.type) {
				case "date":
				case "daterange": return localeRef.value.dateFormat;
				case "datetime":
				case "datetimerange": return localeRef.value.dateTimeFormat;
				case "year":
				case "yearrange": return localeRef.value.yearTypeFormat;
				case "month":
				case "monthrange": return localeRef.value.monthTypeFormat;
				case "quarter":
				case "quarterrange": return localeRef.value.quarterFormat;
				case "week": return localeRef.value.weekFormat;
			}
		});
		const mergedValueFormatRef = (0, vue.computed)(() => {
			return props.valueFormat ?? mergedFormatRef.value;
		});
		function getTimestampValue(value) {
			if (value === null) return null;
			const { value: mergedValueFormat } = mergedValueFormatRef;
			const { value: dateFnsOptions } = dateFnsOptionsRef;
			if (Array.isArray(value)) return [require_date_picker_src_utils.strictParse(value[0], mergedValueFormat, /* @__PURE__ */ new Date(), dateFnsOptions).getTime(), require_date_picker_src_utils.strictParse(value[1], mergedValueFormat, /* @__PURE__ */ new Date(), dateFnsOptions).getTime()];
			return require_date_picker_src_utils.strictParse(value, mergedValueFormat, /* @__PURE__ */ new Date(), dateFnsOptions).getTime();
		}
		const { defaultFormattedValue, defaultValue } = props;
		const uncontrolledValueRef = (0, vue.ref)((defaultFormattedValue !== void 0 ? getTimestampValue(defaultFormattedValue) : defaultValue) ?? null);
		const controlledValueRef = (0, vue.computed)(() => {
			const { formattedValue } = props;
			if (formattedValue !== void 0) return getTimestampValue(formattedValue);
			return props.value;
		});
		const mergedValueRef = (0, vooks.useMergedState)(controlledValueRef, uncontrolledValueRef);
		const pendingValueRef = (0, vue.ref)(null);
		(0, vue.watchEffect)(() => {
			pendingValueRef.value = mergedValueRef.value;
		});
		const singleInputValueRef = (0, vue.ref)("");
		const rangeStartInputValueRef = (0, vue.ref)("");
		const rangeEndInputValueRef = (0, vue.ref)("");
		const themeRef = require__mixins_use_theme.default("DatePicker", "-date-picker", require_date_picker_src_styles_index_cssr, require_date_picker_styles_light.default, props, mergedClsPrefixRef);
		const timePickerSizeRef = (0, vue.computed)(() => {
			return mergedComponentPropsRef?.value?.DatePicker?.timePickerSize || "small";
		});
		const isRangeRef = (0, vue.computed)(() => {
			return [
				"daterange",
				"datetimerange",
				"monthrange",
				"quarterrange",
				"yearrange"
			].includes(props.type);
		});
		const localizedPlacehoderRef = (0, vue.computed)(() => {
			const { placeholder } = props;
			if (placeholder === void 0) {
				const { type } = props;
				switch (type) {
					case "date": return localeRef.value.datePlaceholder;
					case "datetime": return localeRef.value.datetimePlaceholder;
					case "month": return localeRef.value.monthPlaceholder;
					case "year": return localeRef.value.yearPlaceholder;
					case "quarter": return localeRef.value.quarterPlaceholder;
					case "week": return localeRef.value.weekPlaceholder;
					default: return "";
				}
			} else return placeholder;
		});
		const localizedStartPlaceholderRef = (0, vue.computed)(() => {
			if (props.startPlaceholder === void 0) {
				if (props.type === "daterange") return localeRef.value.startDatePlaceholder;
				else if (props.type === "datetimerange") return localeRef.value.startDatetimePlaceholder;
				else if (props.type === "monthrange") return localeRef.value.startMonthPlaceholder;
				return "";
			} else return props.startPlaceholder;
		});
		const localizedEndPlaceholderRef = (0, vue.computed)(() => {
			if (props.endPlaceholder === void 0) {
				if (props.type === "daterange") return localeRef.value.endDatePlaceholder;
				else if (props.type === "datetimerange") return localeRef.value.endDatetimePlaceholder;
				else if (props.type === "monthrange") return localeRef.value.endMonthPlaceholder;
				return "";
			} else return props.endPlaceholder;
		});
		const mergedActionsRef = (0, vue.computed)(() => {
			const { actions, type, clearable } = props;
			if (actions === null) return [];
			if (actions !== void 0) return actions;
			const result = clearable ? ["clear"] : [];
			switch (type) {
				case "date":
				case "week":
					result.push("now");
					return result;
				case "datetime":
					result.push("now", "confirm");
					return result;
				case "daterange":
					result.push("confirm");
					return result;
				case "datetimerange":
					result.push("confirm");
					return result;
				case "month":
					result.push("now", "confirm");
					return result;
				case "year":
					result.push("now");
					return result;
				case "quarter":
					result.push("now", "confirm");
					return result;
				case "monthrange":
				case "yearrange":
				case "quarterrange":
					result.push("confirm");
					return result;
				default: require__utils_naive_warn.warn("date-picker", "The type is wrong, n-date-picker's type only supports `date`, `datetime`, `daterange` and `datetimerange`.");
			}
		});
		function getFormattedValue(value) {
			if (value === null) return null;
			if (Array.isArray(value)) {
				const { value: mergedValueFormat } = mergedValueFormatRef;
				const { value: dateFnsOptions } = dateFnsOptionsRef;
				return [(0, date_fns.format)(value[0], mergedValueFormat, dateFnsOptions), (0, date_fns.format)(value[1], mergedValueFormat, dateFnsOptionsRef.value)];
			} else return (0, date_fns.format)(value, mergedValueFormatRef.value, dateFnsOptionsRef.value);
		}
		function doUpdatePendingValue(value) {
			pendingValueRef.value = value;
		}
		function doUpdateFormattedValue(value, timestampValue) {
			const { "onUpdate:formattedValue": _onUpdateFormattedValue, onUpdateFormattedValue } = props;
			if (_onUpdateFormattedValue) require__utils_vue_call.call(_onUpdateFormattedValue, value, timestampValue);
			if (onUpdateFormattedValue) require__utils_vue_call.call(onUpdateFormattedValue, value, timestampValue);
		}
		function doUpdateValue(value, options) {
			const { "onUpdate:value": _onUpdateValue, onUpdateValue, onChange } = props;
			const { nTriggerFormChange, nTriggerFormInput } = formItem;
			const formattedValue = getFormattedValue(value);
			if (options.doConfirm) doConfirm(value, formattedValue);
			if (onUpdateValue) require__utils_vue_call.call(onUpdateValue, value, formattedValue);
			if (_onUpdateValue) require__utils_vue_call.call(_onUpdateValue, value, formattedValue);
			if (onChange) require__utils_vue_call.call(onChange, value, formattedValue);
			uncontrolledValueRef.value = value;
			doUpdateFormattedValue(formattedValue, value);
			nTriggerFormChange();
			nTriggerFormInput();
		}
		function doClear() {
			const { onClear } = props;
			onClear?.();
		}
		function doConfirm(value, formattedValue) {
			const { onConfirm } = props;
			if (onConfirm) onConfirm(value, formattedValue);
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
		function doUpdateShow(show) {
			const { "onUpdate:show": _onUpdateShow, onUpdateShow } = props;
			if (_onUpdateShow) require__utils_vue_call.call(_onUpdateShow, show);
			if (onUpdateShow) require__utils_vue_call.call(onUpdateShow, show);
			uncontrolledShowRef.value = show;
		}
		function handleKeydown(e) {
			if (e.key === "Escape") {
				if (mergedShowRef.value) {
					require__utils_event_index.markEventEffectPerformed(e);
					closeCalendar({ returnFocus: true });
				}
			}
		}
		function handleInputKeydown(e) {
			if (e.key === "Escape" && mergedShowRef.value) require__utils_event_index.markEventEffectPerformed(e);
		}
		function handleClear() {
			doUpdateShow(false);
			inputInstRef.value?.deactivate();
			doClear();
		}
		function handlePanelClear() {
			inputInstRef.value?.deactivate();
			doClear();
		}
		function handlePanelTabOut() {
			closeCalendar({ returnFocus: true });
		}
		function handleClickOutside(e) {
			if (mergedShowRef.value && !triggerElRef.value?.contains((0, seemly.getPreciseEventTarget)(e))) closeCalendar({ returnFocus: false });
		}
		function handlePanelClose(disableUpdateOnClose) {
			closeCalendar({
				returnFocus: true,
				disableUpdateOnClose
			});
		}
		function handlePanelUpdateValue(value, doUpdate) {
			if (doUpdate) doUpdateValue(value, { doConfirm: false });
			else doUpdatePendingValue(value);
		}
		function handlePanelConfirm() {
			const pendingValue = pendingValueRef.value;
			doUpdateValue(Array.isArray(pendingValue) ? [pendingValue[0], pendingValue[1]] : pendingValue, { doConfirm: true });
		}
		function deriveInputState() {
			const { value } = pendingValueRef;
			if (isRangeRef.value) {
				if (Array.isArray(value) || value === null) deriveRangeInputState(value);
			} else if (!Array.isArray(value)) deriveSingleInputState(value);
		}
		function deriveSingleInputState(value) {
			if (value === null) singleInputValueRef.value = "";
			else singleInputValueRef.value = (0, date_fns.format)(value, mergedFormatRef.value, dateFnsOptionsRef.value);
		}
		function deriveRangeInputState(values) {
			if (values === null) {
				rangeStartInputValueRef.value = "";
				rangeEndInputValueRef.value = "";
			} else {
				const dateFnsOptions = dateFnsOptionsRef.value;
				rangeStartInputValueRef.value = (0, date_fns.format)(values[0], mergedFormatRef.value, dateFnsOptions);
				rangeEndInputValueRef.value = (0, date_fns.format)(values[1], mergedFormatRef.value, dateFnsOptions);
			}
		}
		function handleInputActivate() {
			if (!mergedShowRef.value) openCalendar();
		}
		function handleInputBlur(e) {
			if (!panelInstRef.value?.$el.contains(e.relatedTarget)) {
				doBlur(e);
				deriveInputState();
				closeCalendar({ returnFocus: false });
			}
		}
		function handleInputDeactivate() {
			if (mergedDisabledRef.value) return;
			deriveInputState();
			closeCalendar({ returnFocus: false });
		}
		function handleSingleUpdateValue(v) {
			if (v === "") {
				doUpdateValue(null, { doConfirm: false });
				pendingValueRef.value = null;
				singleInputValueRef.value = "";
				return;
			}
			const newSelectedDateTime = require_date_picker_src_utils.strictParse(v, mergedFormatRef.value, /* @__PURE__ */ new Date(), dateFnsOptionsRef.value);
			if ((0, date_fns.isValid)(newSelectedDateTime)) {
				doUpdateValue((0, date_fns.getTime)(newSelectedDateTime), { doConfirm: false });
				deriveInputState();
			} else singleInputValueRef.value = v;
		}
		function handleRangeUpdateValue(v, { source }) {
			if (v[0] === "" && v[1] === "") {
				doUpdateValue(null, { doConfirm: false });
				pendingValueRef.value = null;
				rangeStartInputValueRef.value = "";
				rangeEndInputValueRef.value = "";
				return;
			}
			const [startTime, endTime] = v;
			const newStartTime = require_date_picker_src_utils.strictParse(startTime, mergedFormatRef.value, /* @__PURE__ */ new Date(), dateFnsOptionsRef.value);
			const newEndTime = require_date_picker_src_utils.strictParse(endTime, mergedFormatRef.value, /* @__PURE__ */ new Date(), dateFnsOptionsRef.value);
			if ((0, date_fns.isValid)(newStartTime) && (0, date_fns.isValid)(newEndTime)) {
				let newStartTs = (0, date_fns.getTime)(newStartTime);
				let newEndTs = (0, date_fns.getTime)(newEndTime);
				if (newEndTime < newStartTime) {
					if (source === 0) newEndTs = newStartTs;
					else newStartTs = newEndTs;
				}
				doUpdateValue([newStartTs, newEndTs], { doConfirm: false });
				deriveInputState();
			} else [rangeStartInputValueRef.value, rangeEndInputValueRef.value] = v;
		}
		function handleTriggerClick(e) {
			if (mergedDisabledRef.value) return;
			if ((0, seemly.happensIn)(e, "clear")) return;
			if (!mergedShowRef.value) openCalendar();
		}
		function handleInputFocus(e) {
			if (mergedDisabledRef.value) return;
			doFocus(e);
		}
		function openCalendar() {
			if (mergedDisabledRef.value || mergedShowRef.value) return;
			doUpdateShow(true);
		}
		function closeCalendar({ returnFocus, disableUpdateOnClose }) {
			if (mergedShowRef.value) {
				doUpdateShow(false);
				if (props.type !== "date" && props.updateValueOnClose && !disableUpdateOnClose) handlePanelConfirm();
				if (returnFocus) inputInstRef.value?.focus();
			}
		}
		(0, vue.watch)(pendingValueRef, () => {
			deriveInputState();
		});
		deriveInputState();
		(0, vue.watch)(mergedShowRef, (value) => {
			if (!value) pendingValueRef.value = mergedValueRef.value;
		});
		const uniVaidation = require_date_picker_src_validation_utils.uniCalendarValidation(props, pendingValueRef);
		const dualValidation = require_date_picker_src_validation_utils.dualCalendarValidation(props, pendingValueRef);
		(0, vue.provide)(require_date_picker_src_interface.datePickerInjectionKey, {
			mergedClsPrefixRef,
			mergedThemeRef: themeRef,
			timePickerSizeRef,
			localeRef,
			dateLocaleRef,
			firstDayOfWeekRef: (0, vue.toRef)(props, "firstDayOfWeek"),
			isDateDisabledRef: (0, vue.toRef)(props, "isDateDisabled"),
			rangesRef: (0, vue.toRef)(props, "ranges"),
			timePickerPropsRef: (0, vue.toRef)(props, "timePickerProps"),
			closeOnSelectRef: (0, vue.toRef)(props, "closeOnSelect"),
			updateValueOnCloseRef: (0, vue.toRef)(props, "updateValueOnClose"),
			monthFormatRef: (0, vue.toRef)(props, "monthFormat"),
			yearFormatRef: (0, vue.toRef)(props, "yearFormat"),
			quarterFormatRef: (0, vue.toRef)(props, "quarterFormat"),
			yearRangeRef: (0, vue.toRef)(props, "yearRange"),
			...uniVaidation,
			...dualValidation,
			datePickerSlots: slots
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
				"--n-bezier": cubicBezierEaseInOut,
				"--n-icon-color-override": iconColor,
				"--n-icon-color-disabled-override": iconColorDisabled
			};
		});
		const triggerThemeClassHandle = inlineThemeDisabled ? require__mixins_use_css_vars_class.useThemeClass("date-picker-trigger", void 0, triggerCssVarsRef, props) : void 0;
		const cssVarsRef = (0, vue.computed)(() => {
			const { type } = props;
			const { common: { cubicBezierEaseInOut }, self: { calendarTitleFontSize, calendarDaysFontSize, itemFontSize, itemTextColor, itemColorDisabled, itemColorIncluded, itemColorHover, itemColorActive, itemBorderRadius, itemTextColorDisabled, itemTextColorActive, panelColor, panelTextColor, arrowColor, calendarTitleTextColor, panelActionDividerColor, panelHeaderDividerColor, calendarDaysDividerColor, panelBoxShadow, panelBorderRadius, calendarTitleFontWeight, panelExtraFooterPadding, panelActionPadding, itemSize, itemCellWidth, itemCellHeight, scrollItemWidth, scrollItemHeight, calendarTitlePadding, calendarTitleHeight, calendarDaysHeight, calendarDaysTextColor, arrowSize, panelHeaderPadding, calendarDividerColor, calendarTitleGridTempateColumns, iconColor, iconColorDisabled, scrollItemBorderRadius, calendarTitleColorHover, [require__utils_cssr_index.createKey("calendarLeftPadding", type)]: calendarLeftPadding, [require__utils_cssr_index.createKey("calendarRightPadding", type)]: calendarRightPadding } } = themeRef.value;
			return {
				"--n-bezier": cubicBezierEaseInOut,
				"--n-panel-border-radius": panelBorderRadius,
				"--n-panel-color": panelColor,
				"--n-panel-box-shadow": panelBoxShadow,
				"--n-panel-text-color": panelTextColor,
				"--n-panel-header-padding": panelHeaderPadding,
				"--n-panel-header-divider-color": panelHeaderDividerColor,
				"--n-calendar-left-padding": calendarLeftPadding,
				"--n-calendar-right-padding": calendarRightPadding,
				"--n-calendar-title-color-hover": calendarTitleColorHover,
				"--n-calendar-title-height": calendarTitleHeight,
				"--n-calendar-title-padding": calendarTitlePadding,
				"--n-calendar-title-font-size": calendarTitleFontSize,
				"--n-calendar-title-font-weight": calendarTitleFontWeight,
				"--n-calendar-title-text-color": calendarTitleTextColor,
				"--n-calendar-title-grid-template-columns": calendarTitleGridTempateColumns,
				"--n-calendar-days-height": calendarDaysHeight,
				"--n-calendar-days-divider-color": calendarDaysDividerColor,
				"--n-calendar-days-font-size": calendarDaysFontSize,
				"--n-calendar-days-text-color": calendarDaysTextColor,
				"--n-calendar-divider-color": calendarDividerColor,
				"--n-panel-action-padding": panelActionPadding,
				"--n-panel-extra-footer-padding": panelExtraFooterPadding,
				"--n-panel-action-divider-color": panelActionDividerColor,
				"--n-item-font-size": itemFontSize,
				"--n-item-border-radius": itemBorderRadius,
				"--n-item-size": itemSize,
				"--n-item-cell-width": itemCellWidth,
				"--n-item-cell-height": itemCellHeight,
				"--n-item-text-color": itemTextColor,
				"--n-item-color-included": itemColorIncluded,
				"--n-item-color-disabled": itemColorDisabled,
				"--n-item-color-hover": itemColorHover,
				"--n-item-color-active": itemColorActive,
				"--n-item-text-color-disabled": itemTextColorDisabled,
				"--n-item-text-color-active": itemTextColorActive,
				"--n-scroll-item-width": scrollItemWidth,
				"--n-scroll-item-height": scrollItemHeight,
				"--n-scroll-item-border-radius": scrollItemBorderRadius,
				"--n-arrow-size": arrowSize,
				"--n-arrow-color": arrowColor,
				"--n-icon-color": iconColor,
				"--n-icon-color-disabled": iconColorDisabled
			};
		});
		const themeClassHandle = inlineThemeDisabled ? require__mixins_use_css_vars_class.useThemeClass("date-picker", (0, vue.computed)(() => {
			return props.type;
		}), cssVarsRef, props) : void 0;
		return {
			...exposedMethods,
			mergedStatus: mergedStatusRef,
			mergedClsPrefix: mergedClsPrefixRef,
			mergedBordered: mergedBorderedRef,
			namespace: namespaceRef,
			uncontrolledValue: uncontrolledValueRef,
			pendingValue: pendingValueRef,
			panelInstRef,
			triggerElRef,
			inputInstRef,
			isMounted: (0, vooks.useIsMounted)(),
			displayTime: singleInputValueRef,
			displayStartTime: rangeStartInputValueRef,
			displayEndTime: rangeEndInputValueRef,
			mergedShow: mergedShowRef,
			adjustedTo: require__utils_composable_use_adjusted_to.useAdjustedTo(props),
			isRange: isRangeRef,
			localizedStartPlaceholder: localizedStartPlaceholderRef,
			localizedEndPlaceholder: localizedEndPlaceholderRef,
			mergedSize: mergedSizeRef,
			mergedDisabled: mergedDisabledRef,
			localizedPlacehoder: localizedPlacehoderRef,
			isValueInvalid: uniVaidation.isValueInvalidRef,
			isStartValueInvalid: dualValidation.isStartValueInvalidRef,
			isEndValueInvalid: dualValidation.isEndValueInvalidRef,
			handleInputKeydown,
			handleClickOutside,
			handleKeydown,
			handleClear,
			handlePanelClear,
			handleTriggerClick,
			handleInputActivate,
			handleInputDeactivate,
			handleInputFocus,
			handleInputBlur,
			handlePanelTabOut,
			handlePanelClose,
			handleRangeUpdateValue,
			handleSingleUpdateValue,
			handlePanelUpdateValue,
			handlePanelConfirm,
			mergedTheme: themeRef,
			actions: mergedActionsRef,
			triggerCssVars: inlineThemeDisabled ? void 0 : triggerCssVarsRef,
			triggerThemeClass: triggerThemeClassHandle?.themeClass,
			triggerOnRender: triggerThemeClassHandle?.onRender,
			cssVars: inlineThemeDisabled ? void 0 : cssVarsRef,
			themeClass: themeClassHandle?.themeClass,
			onRender: themeClassHandle?.onRender,
			onNextMonth: props.onNextMonth,
			onPrevMonth: props.onPrevMonth,
			onNextYear: props.onNextYear,
			onPrevYear: props.onPrevYear
		};
	},
	render() {
		const { clearable, triggerOnRender, mergedClsPrefix, $slots } = this;
		const commonPanelProps = {
			onUpdateValue: this.handlePanelUpdateValue,
			onTabOut: this.handlePanelTabOut,
			onClose: this.handlePanelClose,
			onClear: this.handlePanelClear,
			onKeydown: this.handleKeydown,
			onConfirm: this.handlePanelConfirm,
			ref: "panelInstRef",
			value: this.pendingValue,
			active: this.mergedShow,
			actions: this.actions,
			shortcuts: this.shortcuts,
			style: this.cssVars,
			defaultTime: this.defaultTime,
			themeClass: this.themeClass,
			panel: this.panel,
			inputReadonly: this.inputReadonly || this.mergedDisabled,
			onRender: this.onRender,
			onNextMonth: this.onNextMonth,
			onPrevMonth: this.onPrevMonth,
			onNextYear: this.onNextYear,
			onPrevYear: this.onPrevYear,
			timePickerFormat: this.timePickerFormat,
			dateFormat: this.dateFormat,
			fastYearSelect: this.fastYearSelect,
			fastMonthSelect: this.fastMonthSelect,
			calendarDayFormat: this.calendarDayFormat,
			calendarHeaderYearFormat: this.calendarHeaderYearFormat,
			calendarHeaderMonthFormat: this.calendarHeaderMonthFormat,
			calendarHeaderMonthYearSeparator: this.calendarHeaderMonthYearSeparator,
			calendarHeaderMonthBeforeYear: this.calendarHeaderMonthBeforeYear
		};
		const renderPanel = () => {
			const { type } = this;
			return type === "datetime" ? ((0, vue.openBlock)(), (0, vue.createBlock)(require_date_picker_src_panel_datetime, (0, vue.mergeProps)({ key: 1 }, commonPanelProps, { defaultCalendarStartTime: this.defaultCalendarStartTime }), require_vdom.normalizeSlots($slots), 1040, ["defaultCalendarStartTime"])) : type === "daterange" ? ((0, vue.openBlock)(), (0, vue.createBlock)(require_date_picker_src_panel_daterange, (0, vue.mergeProps)({ key: 2 }, commonPanelProps, {
				defaultCalendarStartTime: this.defaultCalendarStartTime,
				defaultCalendarEndTime: this.defaultCalendarEndTime,
				bindCalendarMonths: this.bindCalendarMonths
			}), require_vdom.normalizeSlots($slots), 1040, [
				"defaultCalendarStartTime",
				"defaultCalendarEndTime",
				"bindCalendarMonths"
			])) : type === "datetimerange" ? ((0, vue.openBlock)(), (0, vue.createBlock)(require_date_picker_src_panel_datetimerange, (0, vue.mergeProps)({ key: 3 }, commonPanelProps, {
				defaultCalendarStartTime: this.defaultCalendarStartTime,
				defaultCalendarEndTime: this.defaultCalendarEndTime,
				bindCalendarMonths: this.bindCalendarMonths
			}), require_vdom.normalizeSlots($slots), 1040, [
				"defaultCalendarStartTime",
				"defaultCalendarEndTime",
				"bindCalendarMonths"
			])) : type === "month" || type === "year" || type === "quarter" ? ((0, vue.openBlock)(), (0, vue.createBlock)(require_date_picker_src_panel_month, (0, vue.mergeProps)(commonPanelProps, {
				type,
				key: type
			}), null, 16, ["type"])) : type === "monthrange" || type === "yearrange" || type === "quarterrange" ? ((0, vue.openBlock)(), (0, vue.createBlock)(require_date_picker_src_panel_monthrange, (0, vue.mergeProps)({ key: 5 }, commonPanelProps, { type }), null, 16, ["type"])) : ((0, vue.openBlock)(), (0, vue.createBlock)(require_date_picker_src_panel_date, (0, vue.mergeProps)({ key: 6 }, commonPanelProps, {
				type,
				defaultCalendarStartTime: this.defaultCalendarStartTime
			}), require_vdom.normalizeSlots($slots), 1040, ["type", "defaultCalendarStartTime"]));
		};
		if (this.panel) return renderPanel();
		triggerOnRender?.();
		const commonInputProps = {
			bordered: this.mergedBordered,
			size: this.mergedSize,
			passivelyActivated: true,
			disabled: this.mergedDisabled,
			readonly: this.inputReadonly || this.mergedDisabled,
			clearable,
			onClear: this.handleClear,
			onClick: this.handleTriggerClick,
			onKeydown: this.handleInputKeydown,
			onActivate: this.handleInputActivate,
			onDeactivate: this.handleInputDeactivate,
			onFocus: this.handleInputFocus,
			onBlur: this.handleInputBlur
		};
		return (0, vue.openBlock)(), (0, vue.createElementBlock)("div", {
			ref: "triggerElRef",
			class: require_vdom.normalizeClass([
				`${mergedClsPrefix}-date-picker`,
				this.mergedDisabled && `${mergedClsPrefix}-date-picker--disabled`,
				this.isRange && `${mergedClsPrefix}-date-picker--range`,
				this.triggerThemeClass
			]),
			style: (0, vue.normalizeStyle)(this.triggerCssVars),
			onKeydown: this.handleKeydown
		}, [(0, vue.createVNode)(vueuc.VBinder, null, { default: () => [((0, vue.openBlock)(), (0, vue.createBlock)(vueuc.VTarget, null, { default: () => this.isRange ? ((0, vue.openBlock)(), (0, vue.createBlock)(require_input_src_Input.default, (0, vue.mergeProps)({
			key: 7,
			ref: "inputInstRef",
			status: this.mergedStatus,
			value: [this.displayStartTime, this.displayEndTime],
			placeholder: [this.localizedStartPlaceholder, this.localizedEndPlaceholder],
			textDecoration: [this.isStartValueInvalid ? "line-through" : "", this.isEndValueInvalid ? "line-through" : ""],
			pair: true,
			onUpdateValue: this.handleRangeUpdateValue,
			theme: this.mergedTheme.peers.Input,
			themeOverrides: this.mergedTheme.peerOverrides.Input,
			internalForceFocus: this.mergedShow,
			internalDeactivateOnEnter: true
		}, commonInputProps), {
			separator: () => this.separator === void 0 ? require__utils_vue_resolve_slot.resolveSlot($slots.separator, () => [((0, vue.openBlock)(), (0, vue.createBlock)(require__internal_icon_src_Icon, {
				clsPrefix: mergedClsPrefix,
				class: require_vdom.normalizeClass(`${mergedClsPrefix}-date-picker-icon`)
			}, { default: () => ((0, vue.openBlock)(), (0, vue.createBlock)(require__internal_icons_To)) }, 1032, ["clsPrefix", "class"]))]) : this.separator,
			[clearable ? "clear-icon-placeholder" : "suffix"]: () => require__utils_vue_resolve_slot.resolveSlot($slots["date-icon"], () => [((0, vue.openBlock)(), (0, vue.createBlock)(require__internal_icon_src_Icon, {
				clsPrefix: mergedClsPrefix,
				class: require_vdom.normalizeClass(`${mergedClsPrefix}-date-picker-icon`)
			}, { default: () => ((0, vue.openBlock)(), (0, vue.createBlock)(require__internal_icons_Date)) }, 1032, ["clsPrefix", "class"]))])
		}, 1040, [
			"status",
			"value",
			"placeholder",
			"textDecoration",
			"onUpdateValue",
			"theme",
			"themeOverrides",
			"internalForceFocus"
		])) : ((0, vue.openBlock)(), (0, vue.createBlock)(require_input_src_Input.default, (0, vue.mergeProps)({
			key: 8,
			ref: "inputInstRef",
			status: this.mergedStatus,
			value: this.displayTime,
			placeholder: this.localizedPlacehoder,
			textDecoration: this.isValueInvalid && !this.isRange ? "line-through" : "",
			onUpdateValue: this.handleSingleUpdateValue,
			theme: this.mergedTheme.peers.Input,
			themeOverrides: this.mergedTheme.peerOverrides.Input,
			internalForceFocus: this.mergedShow,
			internalDeactivateOnEnter: true
		}, commonInputProps), { [clearable ? "clear-icon-placeholder" : "suffix"]: () => ((0, vue.openBlock)(), (0, vue.createBlock)(require__internal_icon_src_Icon, {
			clsPrefix: mergedClsPrefix,
			class: require_vdom.normalizeClass(`${mergedClsPrefix}-date-picker-icon`)
		}, { default: () => require__utils_vue_resolve_slot.resolveSlot($slots["date-icon"], () => [((0, vue.openBlock)(), (0, vue.createBlock)(require__internal_icons_Date))]) }, 1032, ["clsPrefix", "class"])) }, 1040, [
			"status",
			"value",
			"placeholder",
			"textDecoration",
			"onUpdateValue",
			"theme",
			"themeOverrides",
			"internalForceFocus"
		])) }, 1024)), ((0, vue.openBlock)(), (0, vue.createBlock)(vueuc.VFollower, {
			show: this.mergedShow,
			containerClass: this.namespace,
			to: this.adjustedTo,
			teleportDisabled: this.adjustedTo === require__utils_composable_use_adjusted_to.useAdjustedTo.tdkey,
			placement: this.placement
		}, { default: () => ((0, vue.openBlock)(), (0, vue.createBlock)(vue.Transition, {
			name: "fade-in-scale-up-transition",
			appear: this.isMounted
		}, { default: () => {
			if (!this.mergedShow) return null;
			return (0, vue.withDirectives)(renderPanel(), [[
				vdirs.clickoutside,
				this.handleClickOutside,
				void 0,
				{ capture: true }
			]]);
		} }, 1032, ["appear"])) }, 1032, [
			"show",
			"containerClass",
			"to",
			"teleportDisabled",
			"placement"
		]))] }, 1024)], 46, _hoisted_1);
	}
});
//#endregion
module.exports = DatePicker_default;
