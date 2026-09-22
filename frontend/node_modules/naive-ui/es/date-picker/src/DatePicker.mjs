import { useAdjustedTo } from "../../_utils/composable/use-adjusted-to.mjs";
import { createKey } from "../../_utils/cssr/index.mjs";
import { markEventEffectPerformed } from "../../_utils/event/index.mjs";
import { warn, warnOnce } from "../../_utils/naive/warn.mjs";
import { call } from "../../_utils/vue/call.mjs";
import { resolveSlot } from "../../_utils/vue/resolve-slot.mjs";
import useConfig from "../../_mixins/use-config.mjs";
import { useThemeClass } from "../../_mixins/use-css-vars-class.mjs";
import useFormItem from "../../_mixins/use-form-item.mjs";
import useLocale from "../../_mixins/use-locale.mjs";
import useTheme from "../../_mixins/use-theme.mjs";
import { normalizeClass as normalizeClass$1, normalizeSlots } from "../../vue-jsx-vapor/vdom.mjs";
import Icon_default from "../../_internal/icon/src/Icon.mjs";
import Date_default from "../../_internal/icons/Date.mjs";
import To_default from "../../_internal/icons/To.mjs";
import Input_default from "../../input/src/Input.mjs";
import { strictParse } from "./utils.mjs";
import datePickerLight from "../styles/light.mjs";
import { datePickerInjectionKey } from "./interface.mjs";
import month_default from "./panel/month.mjs";
import date_default from "./panel/date.mjs";
import daterange_default from "./panel/daterange.mjs";
import datetime_default from "./panel/datetime.mjs";
import datetimerange_default from "./panel/datetimerange.mjs";
import monthrange_default from "./panel/monthrange.mjs";
import { datePickerProps } from "./props.mjs";
import index_cssr_default from "./styles/index.cssr.mjs";
import { dualCalendarValidation, uniCalendarValidation } from "./validation-utils.mjs";
import { getPreciseEventTarget, happensIn } from "seemly";
import { Transition, computed, createBlock, createElementBlock, createVNode, defineComponent, mergeProps, normalizeStyle, openBlock, provide, ref, toRef, watch, watchEffect, withDirectives } from "vue";
import { useIsMounted, useMergedState } from "vooks";
import { VBinder, VFollower, VTarget } from "vueuc";
import { clickoutside } from "vdirs";
import { format, getTime, isValid } from "date-fns";
//#region src/date-picker/src/DatePicker.tsx
const _hoisted_1 = ["onKeydown"];
var DatePicker_default = defineComponent({
  name: "DatePicker",
  props: datePickerProps,
  slots: Object,
  setup(props, {
    slots
  }) {
    if (process.env.NODE_ENV !== "production") watchEffect(() => {
      if (props.onChange !== void 0) warnOnce("date-picker", "`on-change` is deprecated, please use `on-update:value` instead.");
    });
    const {
      localeRef,
      dateLocaleRef
    } = useLocale("DatePicker");
    const {
      mergedComponentPropsRef,
      mergedClsPrefixRef,
      mergedBorderedRef,
      namespaceRef,
      inlineThemeDisabled
    } = useConfig(props);
    const formItem = useFormItem(props, {
      mergedSize: NFormItem => {
        const {
          size
        } = props;
        if (size) return size;
        const {
          mergedSize: formItemSize
        } = NFormItem || {};
        if (formItemSize?.value) return formItemSize.value;
        const configSize = mergedComponentPropsRef?.value?.DatePicker?.size;
        if (configSize) return configSize;
        return "medium";
      }
    });
    const {
      mergedSizeRef,
      mergedDisabledRef,
      mergedStatusRef
    } = formItem;
    const panelInstRef = ref(null);
    const triggerElRef = ref(null);
    const inputInstRef = ref(null);
    const uncontrolledShowRef = ref(false);
    const controlledShowRef = toRef(props, "show");
    const mergedShowRef = useMergedState(controlledShowRef, uncontrolledShowRef);
    const dateFnsOptionsRef = computed(() => {
      return {
        locale: dateLocaleRef.value.locale,
        useAdditionalWeekYearTokens: true
      };
    });
    const mergedFormatRef = computed(() => {
      const {
        format
      } = props;
      if (format) return format;
      switch (props.type) {
        case "date":
        case "daterange":
          return localeRef.value.dateFormat;
        case "datetime":
        case "datetimerange":
          return localeRef.value.dateTimeFormat;
        case "year":
        case "yearrange":
          return localeRef.value.yearTypeFormat;
        case "month":
        case "monthrange":
          return localeRef.value.monthTypeFormat;
        case "quarter":
        case "quarterrange":
          return localeRef.value.quarterFormat;
        case "week":
          return localeRef.value.weekFormat;
      }
    });
    const mergedValueFormatRef = computed(() => {
      return props.valueFormat ?? mergedFormatRef.value;
    });
    function getTimestampValue(value) {
      if (value === null) return null;
      const {
        value: mergedValueFormat
      } = mergedValueFormatRef;
      const {
        value: dateFnsOptions
      } = dateFnsOptionsRef;
      if (Array.isArray(value)) return [strictParse(value[0], mergedValueFormat, /* @__PURE__ */new Date(), dateFnsOptions).getTime(), strictParse(value[1], mergedValueFormat, /* @__PURE__ */new Date(), dateFnsOptions).getTime()];
      return strictParse(value, mergedValueFormat, /* @__PURE__ */new Date(), dateFnsOptions).getTime();
    }
    const {
      defaultFormattedValue,
      defaultValue
    } = props;
    const uncontrolledValueRef = ref((defaultFormattedValue !== void 0 ? getTimestampValue(defaultFormattedValue) : defaultValue) ?? null);
    const controlledValueRef = computed(() => {
      const {
        formattedValue
      } = props;
      if (formattedValue !== void 0) return getTimestampValue(formattedValue);
      return props.value;
    });
    const mergedValueRef = useMergedState(controlledValueRef, uncontrolledValueRef);
    const pendingValueRef = ref(null);
    watchEffect(() => {
      pendingValueRef.value = mergedValueRef.value;
    });
    const singleInputValueRef = ref("");
    const rangeStartInputValueRef = ref("");
    const rangeEndInputValueRef = ref("");
    const themeRef = useTheme("DatePicker", "-date-picker", index_cssr_default, datePickerLight, props, mergedClsPrefixRef);
    const timePickerSizeRef = computed(() => {
      return mergedComponentPropsRef?.value?.DatePicker?.timePickerSize || "small";
    });
    const isRangeRef = computed(() => {
      return ["daterange", "datetimerange", "monthrange", "quarterrange", "yearrange"].includes(props.type);
    });
    const localizedPlacehoderRef = computed(() => {
      const {
        placeholder
      } = props;
      if (placeholder === void 0) {
        const {
          type
        } = props;
        switch (type) {
          case "date":
            return localeRef.value.datePlaceholder;
          case "datetime":
            return localeRef.value.datetimePlaceholder;
          case "month":
            return localeRef.value.monthPlaceholder;
          case "year":
            return localeRef.value.yearPlaceholder;
          case "quarter":
            return localeRef.value.quarterPlaceholder;
          case "week":
            return localeRef.value.weekPlaceholder;
          default:
            return "";
        }
      } else return placeholder;
    });
    const localizedStartPlaceholderRef = computed(() => {
      if (props.startPlaceholder === void 0) {
        if (props.type === "daterange") return localeRef.value.startDatePlaceholder;else if (props.type === "datetimerange") return localeRef.value.startDatetimePlaceholder;else if (props.type === "monthrange") return localeRef.value.startMonthPlaceholder;
        return "";
      } else return props.startPlaceholder;
    });
    const localizedEndPlaceholderRef = computed(() => {
      if (props.endPlaceholder === void 0) {
        if (props.type === "daterange") return localeRef.value.endDatePlaceholder;else if (props.type === "datetimerange") return localeRef.value.endDatetimePlaceholder;else if (props.type === "monthrange") return localeRef.value.endMonthPlaceholder;
        return "";
      } else return props.endPlaceholder;
    });
    const mergedActionsRef = computed(() => {
      const {
        actions,
        type,
        clearable
      } = props;
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
        default:
          warn("date-picker", "The type is wrong, n-date-picker's type only supports `date`, `datetime`, `daterange` and `datetimerange`.");
      }
    });
    function getFormattedValue(value) {
      if (value === null) return null;
      if (Array.isArray(value)) {
        const {
          value: mergedValueFormat
        } = mergedValueFormatRef;
        const {
          value: dateFnsOptions
        } = dateFnsOptionsRef;
        return [format(value[0], mergedValueFormat, dateFnsOptions), format(value[1], mergedValueFormat, dateFnsOptionsRef.value)];
      } else return format(value, mergedValueFormatRef.value, dateFnsOptionsRef.value);
    }
    function doUpdatePendingValue(value) {
      pendingValueRef.value = value;
    }
    function doUpdateFormattedValue(value, timestampValue) {
      const {
        "onUpdate:formattedValue": _onUpdateFormattedValue,
        onUpdateFormattedValue
      } = props;
      if (_onUpdateFormattedValue) call(_onUpdateFormattedValue, value, timestampValue);
      if (onUpdateFormattedValue) call(onUpdateFormattedValue, value, timestampValue);
    }
    function doUpdateValue(value, options) {
      const {
        "onUpdate:value": _onUpdateValue,
        onUpdateValue,
        onChange
      } = props;
      const {
        nTriggerFormChange,
        nTriggerFormInput
      } = formItem;
      const formattedValue = getFormattedValue(value);
      if (options.doConfirm) doConfirm(value, formattedValue);
      if (onUpdateValue) call(onUpdateValue, value, formattedValue);
      if (_onUpdateValue) call(_onUpdateValue, value, formattedValue);
      if (onChange) call(onChange, value, formattedValue);
      uncontrolledValueRef.value = value;
      doUpdateFormattedValue(formattedValue, value);
      nTriggerFormChange();
      nTriggerFormInput();
    }
    function doClear() {
      const {
        onClear
      } = props;
      onClear?.();
    }
    function doConfirm(value, formattedValue) {
      const {
        onConfirm
      } = props;
      if (onConfirm) onConfirm(value, formattedValue);
    }
    function doFocus(e) {
      const {
        onFocus
      } = props;
      const {
        nTriggerFormFocus
      } = formItem;
      if (onFocus) call(onFocus, e);
      nTriggerFormFocus();
    }
    function doBlur(e) {
      const {
        onBlur
      } = props;
      const {
        nTriggerFormBlur
      } = formItem;
      if (onBlur) call(onBlur, e);
      nTriggerFormBlur();
    }
    function doUpdateShow(show) {
      const {
        "onUpdate:show": _onUpdateShow,
        onUpdateShow
      } = props;
      if (_onUpdateShow) call(_onUpdateShow, show);
      if (onUpdateShow) call(onUpdateShow, show);
      uncontrolledShowRef.value = show;
    }
    function handleKeydown(e) {
      if (e.key === "Escape") {
        if (mergedShowRef.value) {
          markEventEffectPerformed(e);
          closeCalendar({
            returnFocus: true
          });
        }
      }
    }
    function handleInputKeydown(e) {
      if (e.key === "Escape" && mergedShowRef.value) markEventEffectPerformed(e);
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
      closeCalendar({
        returnFocus: true
      });
    }
    function handleClickOutside(e) {
      if (mergedShowRef.value && !triggerElRef.value?.contains(getPreciseEventTarget(e))) closeCalendar({
        returnFocus: false
      });
    }
    function handlePanelClose(disableUpdateOnClose) {
      closeCalendar({
        returnFocus: true,
        disableUpdateOnClose
      });
    }
    function handlePanelUpdateValue(value, doUpdate) {
      if (doUpdate) doUpdateValue(value, {
        doConfirm: false
      });else doUpdatePendingValue(value);
    }
    function handlePanelConfirm() {
      const pendingValue = pendingValueRef.value;
      doUpdateValue(Array.isArray(pendingValue) ? [pendingValue[0], pendingValue[1]] : pendingValue, {
        doConfirm: true
      });
    }
    function deriveInputState() {
      const {
        value
      } = pendingValueRef;
      if (isRangeRef.value) {
        if (Array.isArray(value) || value === null) deriveRangeInputState(value);
      } else if (!Array.isArray(value)) deriveSingleInputState(value);
    }
    function deriveSingleInputState(value) {
      if (value === null) singleInputValueRef.value = "";else singleInputValueRef.value = format(value, mergedFormatRef.value, dateFnsOptionsRef.value);
    }
    function deriveRangeInputState(values) {
      if (values === null) {
        rangeStartInputValueRef.value = "";
        rangeEndInputValueRef.value = "";
      } else {
        const dateFnsOptions = dateFnsOptionsRef.value;
        rangeStartInputValueRef.value = format(values[0], mergedFormatRef.value, dateFnsOptions);
        rangeEndInputValueRef.value = format(values[1], mergedFormatRef.value, dateFnsOptions);
      }
    }
    function handleInputActivate() {
      if (!mergedShowRef.value) openCalendar();
    }
    function handleInputBlur(e) {
      if (!panelInstRef.value?.$el.contains(e.relatedTarget)) {
        doBlur(e);
        deriveInputState();
        closeCalendar({
          returnFocus: false
        });
      }
    }
    function handleInputDeactivate() {
      if (mergedDisabledRef.value) return;
      deriveInputState();
      closeCalendar({
        returnFocus: false
      });
    }
    function handleSingleUpdateValue(v) {
      if (v === "") {
        doUpdateValue(null, {
          doConfirm: false
        });
        pendingValueRef.value = null;
        singleInputValueRef.value = "";
        return;
      }
      const newSelectedDateTime = strictParse(v, mergedFormatRef.value, /* @__PURE__ */new Date(), dateFnsOptionsRef.value);
      if (isValid(newSelectedDateTime)) {
        doUpdateValue(getTime(newSelectedDateTime), {
          doConfirm: false
        });
        deriveInputState();
      } else singleInputValueRef.value = v;
    }
    function handleRangeUpdateValue(v, {
      source
    }) {
      if (v[0] === "" && v[1] === "") {
        doUpdateValue(null, {
          doConfirm: false
        });
        pendingValueRef.value = null;
        rangeStartInputValueRef.value = "";
        rangeEndInputValueRef.value = "";
        return;
      }
      const [startTime, endTime] = v;
      const newStartTime = strictParse(startTime, mergedFormatRef.value, /* @__PURE__ */new Date(), dateFnsOptionsRef.value);
      const newEndTime = strictParse(endTime, mergedFormatRef.value, /* @__PURE__ */new Date(), dateFnsOptionsRef.value);
      if (isValid(newStartTime) && isValid(newEndTime)) {
        let newStartTs = getTime(newStartTime);
        let newEndTs = getTime(newEndTime);
        if (newEndTime < newStartTime) {
          if (source === 0) newEndTs = newStartTs;else newStartTs = newEndTs;
        }
        doUpdateValue([newStartTs, newEndTs], {
          doConfirm: false
        });
        deriveInputState();
      } else [rangeStartInputValueRef.value, rangeEndInputValueRef.value] = v;
    }
    function handleTriggerClick(e) {
      if (mergedDisabledRef.value) return;
      if (happensIn(e, "clear")) return;
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
    function closeCalendar({
      returnFocus,
      disableUpdateOnClose
    }) {
      if (mergedShowRef.value) {
        doUpdateShow(false);
        if (props.type !== "date" && props.updateValueOnClose && !disableUpdateOnClose) handlePanelConfirm();
        if (returnFocus) inputInstRef.value?.focus();
      }
    }
    watch(pendingValueRef, () => {
      deriveInputState();
    });
    deriveInputState();
    watch(mergedShowRef, value => {
      if (!value) pendingValueRef.value = mergedValueRef.value;
    });
    const uniVaidation = uniCalendarValidation(props, pendingValueRef);
    const dualValidation = dualCalendarValidation(props, pendingValueRef);
    provide(datePickerInjectionKey, {
      mergedClsPrefixRef,
      mergedThemeRef: themeRef,
      timePickerSizeRef,
      localeRef,
      dateLocaleRef,
      firstDayOfWeekRef: toRef(props, "firstDayOfWeek"),
      isDateDisabledRef: toRef(props, "isDateDisabled"),
      rangesRef: toRef(props, "ranges"),
      timePickerPropsRef: toRef(props, "timePickerProps"),
      closeOnSelectRef: toRef(props, "closeOnSelect"),
      updateValueOnCloseRef: toRef(props, "updateValueOnClose"),
      monthFormatRef: toRef(props, "monthFormat"),
      yearFormatRef: toRef(props, "yearFormat"),
      quarterFormatRef: toRef(props, "quarterFormat"),
      yearRangeRef: toRef(props, "yearRange"),
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
    const triggerCssVarsRef = computed(() => {
      const {
        common: {
          cubicBezierEaseInOut
        },
        self: {
          iconColor,
          iconColorDisabled
        }
      } = themeRef.value;
      return {
        "--n-bezier": cubicBezierEaseInOut,
        "--n-icon-color-override": iconColor,
        "--n-icon-color-disabled-override": iconColorDisabled
      };
    });
    const triggerThemeClassHandle = inlineThemeDisabled ? useThemeClass("date-picker-trigger", void 0, triggerCssVarsRef, props) : void 0;
    const cssVarsRef = computed(() => {
      const {
        type
      } = props;
      const {
        common: {
          cubicBezierEaseInOut
        },
        self: {
          calendarTitleFontSize,
          calendarDaysFontSize,
          itemFontSize,
          itemTextColor,
          itemColorDisabled,
          itemColorIncluded,
          itemColorHover,
          itemColorActive,
          itemBorderRadius,
          itemTextColorDisabled,
          itemTextColorActive,
          panelColor,
          panelTextColor,
          arrowColor,
          calendarTitleTextColor,
          panelActionDividerColor,
          panelHeaderDividerColor,
          calendarDaysDividerColor,
          panelBoxShadow,
          panelBorderRadius,
          calendarTitleFontWeight,
          panelExtraFooterPadding,
          panelActionPadding,
          itemSize,
          itemCellWidth,
          itemCellHeight,
          scrollItemWidth,
          scrollItemHeight,
          calendarTitlePadding,
          calendarTitleHeight,
          calendarDaysHeight,
          calendarDaysTextColor,
          arrowSize,
          panelHeaderPadding,
          calendarDividerColor,
          calendarTitleGridTempateColumns,
          iconColor,
          iconColorDisabled,
          scrollItemBorderRadius,
          calendarTitleColorHover,
          [createKey("calendarLeftPadding", type)]: calendarLeftPadding,
          [createKey("calendarRightPadding", type)]: calendarRightPadding
        }
      } = themeRef.value;
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
    const themeClassHandle = inlineThemeDisabled ? useThemeClass("date-picker", computed(() => {
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
      isMounted: useIsMounted(),
      displayTime: singleInputValueRef,
      displayStartTime: rangeStartInputValueRef,
      displayEndTime: rangeEndInputValueRef,
      mergedShow: mergedShowRef,
      adjustedTo: useAdjustedTo(props),
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
    const {
      clearable,
      triggerOnRender,
      mergedClsPrefix,
      $slots
    } = this;
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
      const {
        type
      } = this;
      return type === "datetime" ? (openBlock(), createBlock(datetime_default, mergeProps({
        key: 1
      }, commonPanelProps, {
        defaultCalendarStartTime: this.defaultCalendarStartTime
      }), normalizeSlots($slots), 1040, ["defaultCalendarStartTime"])) : type === "daterange" ? (openBlock(), createBlock(daterange_default, mergeProps({
        key: 2
      }, commonPanelProps, {
        defaultCalendarStartTime: this.defaultCalendarStartTime,
        defaultCalendarEndTime: this.defaultCalendarEndTime,
        bindCalendarMonths: this.bindCalendarMonths
      }), normalizeSlots($slots), 1040, ["defaultCalendarStartTime", "defaultCalendarEndTime", "bindCalendarMonths"])) : type === "datetimerange" ? (openBlock(), createBlock(datetimerange_default, mergeProps({
        key: 3
      }, commonPanelProps, {
        defaultCalendarStartTime: this.defaultCalendarStartTime,
        defaultCalendarEndTime: this.defaultCalendarEndTime,
        bindCalendarMonths: this.bindCalendarMonths
      }), normalizeSlots($slots), 1040, ["defaultCalendarStartTime", "defaultCalendarEndTime", "bindCalendarMonths"])) : type === "month" || type === "year" || type === "quarter" ? (openBlock(), createBlock(month_default, mergeProps(commonPanelProps, {
        type,
        key: type
      }), null, 16, ["type"])) : type === "monthrange" || type === "yearrange" || type === "quarterrange" ? (openBlock(), createBlock(monthrange_default, mergeProps({
        key: 5
      }, commonPanelProps, {
        type
      }), null, 16, ["type"])) : (openBlock(), createBlock(date_default, mergeProps({
        key: 6
      }, commonPanelProps, {
        type,
        defaultCalendarStartTime: this.defaultCalendarStartTime
      }), normalizeSlots($slots), 1040, ["type", "defaultCalendarStartTime"]));
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
    return openBlock(), createElementBlock("div", {
      ref: "triggerElRef",
      class: normalizeClass$1([`${mergedClsPrefix}-date-picker`, this.mergedDisabled && `${mergedClsPrefix}-date-picker--disabled`, this.isRange && `${mergedClsPrefix}-date-picker--range`, this.triggerThemeClass]),
      style: normalizeStyle(this.triggerCssVars),
      onKeydown: this.handleKeydown
    }, [createVNode(VBinder, null, {
      default: () => [(openBlock(), createBlock(VTarget, null, {
        default: () => this.isRange ? (openBlock(), createBlock(Input_default, mergeProps({
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
          separator: () => this.separator === void 0 ? resolveSlot($slots.separator, () => [(openBlock(), createBlock(Icon_default, {
            clsPrefix: mergedClsPrefix,
            class: normalizeClass$1(`${mergedClsPrefix}-date-picker-icon`)
          }, {
            default: () => (openBlock(), createBlock(To_default))
          }, 1032, ["clsPrefix", "class"]))]) : this.separator,
          [clearable ? "clear-icon-placeholder" : "suffix"]: () => resolveSlot($slots["date-icon"], () => [(openBlock(), createBlock(Icon_default, {
            clsPrefix: mergedClsPrefix,
            class: normalizeClass$1(`${mergedClsPrefix}-date-picker-icon`)
          }, {
            default: () => (openBlock(), createBlock(Date_default))
          }, 1032, ["clsPrefix", "class"]))])
        }, 1040, ["status", "value", "placeholder", "textDecoration", "onUpdateValue", "theme", "themeOverrides", "internalForceFocus"])) : (openBlock(), createBlock(Input_default, mergeProps({
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
        }, commonInputProps), {
          [clearable ? "clear-icon-placeholder" : "suffix"]: () => (openBlock(), createBlock(Icon_default, {
            clsPrefix: mergedClsPrefix,
            class: normalizeClass$1(`${mergedClsPrefix}-date-picker-icon`)
          }, {
            default: () => resolveSlot($slots["date-icon"], () => [(openBlock(), createBlock(Date_default))])
          }, 1032, ["clsPrefix", "class"]))
        }, 1040, ["status", "value", "placeholder", "textDecoration", "onUpdateValue", "theme", "themeOverrides", "internalForceFocus"]))
      }, 1024)), (openBlock(), createBlock(VFollower, {
        show: this.mergedShow,
        containerClass: this.namespace,
        to: this.adjustedTo,
        teleportDisabled: this.adjustedTo === useAdjustedTo.tdkey,
        placement: this.placement
      }, {
        default: () => (openBlock(), createBlock(Transition, {
          name: "fade-in-scale-up-transition",
          appear: this.isMounted
        }, {
          default: () => {
            if (!this.mergedShow) return null;
            return withDirectives(renderPanel(), [[clickoutside, this.handleClickOutside, void 0, {
              capture: true
            }]]);
          }
        }, 1032, ["appear"]))
      }, 1032, ["show", "containerClass", "to", "teleportDisabled", "placement"]))]
    }, 1024)], 46, _hoisted_1);
  }
});
//#endregion
export { DatePicker_default as default };