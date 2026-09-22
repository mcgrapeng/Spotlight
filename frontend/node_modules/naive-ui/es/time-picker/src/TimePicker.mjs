import { useAdjustedTo } from "../../_utils/composable/use-adjusted-to.mjs";
import { markEventEffectPerformed } from "../../_utils/event/index.mjs";
import { warnOnce } from "../../_utils/naive/warn.mjs";
import { call } from "../../_utils/vue/call.mjs";
import useConfig from "../../_mixins/use-config.mjs";
import { useThemeClass } from "../../_mixins/use-css-vars-class.mjs";
import useFormItem from "../../_mixins/use-form-item.mjs";
import useLocale from "../../_mixins/use-locale.mjs";
import useTheme from "../../_mixins/use-theme.mjs";
import { normalizeClass as normalizeClass$1, normalizeSlot, normalizeSlots } from "../../vue-jsx-vapor/vdom.mjs";
import Icon_default from "../../_internal/icon/src/Icon.mjs";
import Time_default from "../../_internal/icons/Time.mjs";
import Input_default from "../../input/src/Input.mjs";
import { strictParse } from "../../date-picker/src/utils.mjs";
import timePickerLight from "../styles/light.mjs";
import { timePickerInjectionKey } from "./interface.mjs";
import { findSimilarTime, isTimeInStep } from "./utils.mjs";
import Panel_default from "./Panel.mjs";
import index_cssr_default from "./styles/index.cssr.mjs";
import { getPreciseEventTarget, happensIn } from "seemly";
import { Transition, computed, createBlock, createElementBlock, createVNode, defineComponent, nextTick, normalizeStyle, openBlock, provide, ref, toRef, watch, watchEffect, withDirectives } from "vue";
import { useIsMounted, useKeyboard, useMergedState } from "vooks";
import { VBinder, VFollower, VTarget } from "vueuc";
import { clickoutside } from "vdirs";
import { format, getHours, getMilliseconds, getMinutes, getSeconds, getTime, isValid, set, setHours, setMinutes, setSeconds, startOfHour, startOfMinute, startOfSecond } from "date-fns";
import { formatInTimeZone } from "date-fns-tz";
//#region src/time-picker/src/TimePicker.tsx
function validateUnits(value, max) {
  if (value === void 0) return true;
  if (Array.isArray(value)) return value.every(v => v >= 0 && v <= max);else return value >= 0 && value <= max;
}
const timePickerProps = {
  ...useTheme.props,
  to: useAdjustedTo.propTo,
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
    validator: value => validateUnits(value, 23)
  },
  minutes: {
    type: [Number, Array],
    validator: value => validateUnits(value, 59)
  },
  seconds: {
    type: [Number, Array],
    validator: value => validateUnits(value, 59)
  },
  use12Hours: Boolean,
  stateful: {
    type: Boolean,
    default: true
  },
  onChange: [Function, Array]
};
var TimePicker_default = defineComponent({
  name: "TimePicker",
  props: timePickerProps,
  setup(props) {
    if (process.env.NODE_ENV !== "production") watchEffect(() => {
      if (props.onChange !== void 0) warnOnce("time-picker", "`on-change` is deprecated, please use `on-update:value` instead.");
    });
    const {
      mergedBorderedRef,
      mergedClsPrefixRef,
      namespaceRef,
      inlineThemeDisabled,
      mergedComponentPropsRef
    } = useConfig(props);
    const {
      localeRef,
      dateLocaleRef
    } = useLocale("TimePicker");
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
        const configSize = mergedComponentPropsRef?.value?.TimePicker?.size;
        if (configSize) return configSize;
        return "medium";
      }
    });
    const {
      mergedSizeRef,
      mergedDisabledRef,
      mergedStatusRef
    } = formItem;
    const themeRef = useTheme("TimePicker", "-time-picker", index_cssr_default, timePickerLight, props, mergedClsPrefixRef);
    const keyboardState = useKeyboard();
    const inputInstRef = ref(null);
    const panelInstRef = ref(null);
    const dateFnsOptionsRef = computed(() => {
      return {
        locale: dateLocaleRef.value.locale
      };
    });
    function getTimestampFromFormattedValue(value) {
      if (value === null) return null;
      return strictParse(value, props.valueFormat || props.format, /* @__PURE__ */new Date(), dateFnsOptionsRef.value).getTime();
    }
    const {
      defaultValue,
      defaultFormattedValue
    } = props;
    const uncontrolledValueRef = ref(defaultFormattedValue !== void 0 ? getTimestampFromFormattedValue(defaultFormattedValue) : defaultValue);
    const mergedValueRef = computed(() => {
      const {
        formattedValue
      } = props;
      if (formattedValue !== void 0) return getTimestampFromFormattedValue(formattedValue);
      const {
        value
      } = props;
      if (value !== void 0) return value;
      return uncontrolledValueRef.value;
    });
    const mergedFormatRef = computed(() => {
      const {
        timeZone
      } = props;
      if (timeZone) return (date, format, options) => {
        return formatInTimeZone(date, timeZone, format, options);
      };else return (date, _format, options) => {
        return format(date, _format, options);
      };
    });
    const displayTimeStringRef = ref("");
    watch(() => props.timeZone, () => {
      const mergedValue = mergedValueRef.value;
      displayTimeStringRef.value = mergedValue === null ? "" : mergedFormatRef.value(mergedValue, props.format, dateFnsOptionsRef.value);
    }, {
      immediate: true
    });
    const uncontrolledShowRef = ref(false);
    const controlledShowRef = toRef(props, "show");
    const mergedShowRef = useMergedState(controlledShowRef, uncontrolledShowRef);
    const memorizedValueRef = ref(mergedValueRef.value);
    const transitionDisabledRef = ref(false);
    const localizedClearRef = computed(() => {
      return localeRef.value.clear;
    });
    const localizedNowRef = computed(() => {
      return localeRef.value.now;
    });
    const localizedPlaceholderRef = computed(() => {
      if (props.placeholder !== void 0) return props.placeholder;
      return localeRef.value.placeholder;
    });
    const localizedNegativeTextRef = computed(() => {
      return localeRef.value.negativeText;
    });
    const localizedPositiveTextRef = computed(() => {
      return localeRef.value.positiveText;
    });
    const hourInFormatRef = computed(() => {
      return /H|h|K|k/.test(props.format);
    });
    const minuteInFormatRef = computed(() => {
      return props.format.includes("m");
    });
    const secondInFormatRef = computed(() => {
      return props.format.includes("s");
    });
    const hourValueRef = computed(() => {
      const {
        value
      } = mergedValueRef;
      if (value === null) return null;
      return Number(mergedFormatRef.value(value, "HH", dateFnsOptionsRef.value));
    });
    const minuteValueRef = computed(() => {
      const {
        value
      } = mergedValueRef;
      if (value === null) return null;
      return Number(mergedFormatRef.value(value, "mm", dateFnsOptionsRef.value));
    });
    const secondValueRef = computed(() => {
      const {
        value
      } = mergedValueRef;
      if (value === null) return null;
      return Number(mergedFormatRef.value(value, "ss", dateFnsOptionsRef.value));
    });
    const isHourInvalidRef = computed(() => {
      const {
        isHourDisabled
      } = props;
      if (hourValueRef.value === null) return false;
      if (!isTimeInStep(hourValueRef.value, "hours", props.hours)) return true;
      if (!isHourDisabled) return false;
      return isHourDisabled(hourValueRef.value);
    });
    const isMinuteInvalidRef = computed(() => {
      const {
        value: minuteValue
      } = minuteValueRef;
      const {
        value: hourValue
      } = hourValueRef;
      if (minuteValue === null || hourValue === null) return false;
      if (!isTimeInStep(minuteValue, "minutes", props.minutes)) return true;
      const {
        isMinuteDisabled
      } = props;
      if (!isMinuteDisabled) return false;
      return isMinuteDisabled(minuteValue, hourValue);
    });
    const isSecondInvalidRef = computed(() => {
      const {
        value: minuteValue
      } = minuteValueRef;
      const {
        value: hourValue
      } = hourValueRef;
      const {
        value: secondValue
      } = secondValueRef;
      if (secondValue === null || minuteValue === null || hourValue === null) return false;
      if (!isTimeInStep(secondValue, "seconds", props.seconds)) return true;
      const {
        isSecondDisabled
      } = props;
      if (!isSecondDisabled) return false;
      return isSecondDisabled(secondValue, minuteValue, hourValue);
    });
    const isValueInvalidRef = computed(() => {
      return isHourInvalidRef.value || isMinuteInvalidRef.value || isSecondInvalidRef.value;
    });
    const mergedAttrSizeRef = computed(() => {
      return props.format.length + 4;
    });
    const amPmValueRef = computed(() => {
      const {
        value
      } = mergedValueRef;
      if (value === null) return null;
      return getHours(value) < 12 ? "am" : "pm";
    });
    function doUpdateFormattedValue(value, timestampValue) {
      const {
        onUpdateFormattedValue,
        "onUpdate:formattedValue": _onUpdateFormattedValue
      } = props;
      if (onUpdateFormattedValue) call(onUpdateFormattedValue, value, timestampValue);
      if (_onUpdateFormattedValue) call(_onUpdateFormattedValue, value, timestampValue);
    }
    function createFormattedValue(value) {
      return value === null ? null : mergedFormatRef.value(value, props.valueFormat || props.format);
    }
    function doUpdateValue(value) {
      const {
        onUpdateValue,
        "onUpdate:value": _onUpdateValue,
        onChange
      } = props;
      const {
        nTriggerFormChange,
        nTriggerFormInput
      } = formItem;
      const formattedValue = createFormattedValue(value);
      if (onUpdateValue) call(onUpdateValue, value, formattedValue);
      if (_onUpdateValue) call(_onUpdateValue, value, formattedValue);
      if (onChange) call(onChange, value, formattedValue);
      doUpdateFormattedValue(formattedValue, value);
      uncontrolledValueRef.value = value;
      nTriggerFormChange();
      nTriggerFormInput();
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
    function doConfirm() {
      const {
        onConfirm
      } = props;
      if (onConfirm) call(onConfirm, mergedValueRef.value, createFormattedValue(mergedValueRef.value));
    }
    function handleTimeInputClear(e) {
      e.stopPropagation();
      doUpdateValue(null);
      deriveInputValue(null);
      props.onClear?.();
    }
    function handleFocusDetectorFocus() {
      closePanel({
        returnFocus: true
      });
    }
    function clearSelectedValue() {
      doUpdateValue(null);
      deriveInputValue(null);
      closePanel({
        returnFocus: true
      });
    }
    function handleInputKeydown(e) {
      if (e.key === "Escape" && mergedShowRef.value) markEventEffectPerformed(e);
    }
    function handleMenuKeydown(e) {
      switch (e.key) {
        case "Escape":
          if (mergedShowRef.value) {
            markEventEffectPerformed(e);
            closePanel({
              returnFocus: true
            });
          }
          break;
        case "Tab":
          if (keyboardState.shift && e.target === panelInstRef.value?.$el) {
            e.preventDefault();
            closePanel({
              returnFocus: true
            });
          }
      }
    }
    function disableTransitionOneTick() {
      transitionDisabledRef.value = true;
      nextTick(() => {
        transitionDisabledRef.value = false;
      });
    }
    function handleTriggerClick(e) {
      if (mergedDisabledRef.value || happensIn(e, "clear")) return;
      if (!mergedShowRef.value) openPanel();
    }
    function handleHourClick(hour) {
      if (typeof hour === "string") return;
      if (mergedValueRef.value === null) doUpdateValue(getTime(setHours(startOfHour(/* @__PURE__ */new Date()), hour)));else doUpdateValue(getTime(setHours(mergedValueRef.value, hour)));
    }
    function handleMinuteClick(minute) {
      if (typeof minute === "string") return;
      if (mergedValueRef.value === null) doUpdateValue(getTime(setMinutes(startOfMinute(/* @__PURE__ */new Date()), minute)));else doUpdateValue(getTime(setMinutes(mergedValueRef.value, minute)));
    }
    function handleSecondClick(second) {
      if (typeof second === "string") return;
      if (mergedValueRef.value === null) doUpdateValue(getTime(setSeconds(startOfSecond(/* @__PURE__ */new Date()), second)));else doUpdateValue(getTime(setSeconds(mergedValueRef.value, second)));
    }
    function handleAmPmClick(amPm) {
      const {
        value: mergedValue
      } = mergedValueRef;
      if (mergedValue === null) {
        const now = /* @__PURE__ */new Date();
        const hours = getHours(now);
        if (amPm === "pm" && hours < 12) doUpdateValue(getTime(setHours(now, hours + 12)));else if (amPm === "am" && hours >= 12) doUpdateValue(getTime(setHours(now, hours - 12)));
        doUpdateValue(getTime(now));
      } else {
        const hours = getHours(mergedValue);
        if (amPm === "pm" && hours < 12) doUpdateValue(getTime(setHours(mergedValue, hours + 12)));else if (amPm === "am" && hours >= 12) doUpdateValue(getTime(setHours(mergedValue, hours - 12)));
      }
    }
    function deriveInputValue(time) {
      if (time === void 0) time = mergedValueRef.value;
      if (time === null) displayTimeStringRef.value = "";else displayTimeStringRef.value = mergedFormatRef.value(time, props.format, dateFnsOptionsRef.value);
    }
    function handleTimeInputFocus(e) {
      if (isInternalFocusSwitch(e)) return;
      doFocus(e);
    }
    function handleTimeInputBlur(e) {
      if (isInternalFocusSwitch(e)) return;
      if (mergedShowRef.value) {
        if (!panelInstRef.value?.$el?.contains(e.relatedTarget)) {
          deriveInputValue();
          doBlur(e);
          closePanel({
            returnFocus: false
          });
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
      closePanel({
        returnFocus: false
      });
    }
    function scrollTimer() {
      if (!panelInstRef.value) return;
      const {
        hourScrollRef,
        minuteScrollRef,
        secondScrollRef,
        amPmScrollRef
      } = panelInstRef.value;
      [hourScrollRef, minuteScrollRef, secondScrollRef, amPmScrollRef].forEach(itemScrollRef => {
        if (!itemScrollRef) return;
        const activeItemEl = itemScrollRef.contentRef?.querySelector("[data-active]");
        if (activeItemEl) itemScrollRef.scrollTo({
          top: activeItemEl.offsetTop
        });
      });
    }
    function doUpdateShow(value) {
      uncontrolledShowRef.value = value;
      const {
        onUpdateShow,
        "onUpdate:show": _onUpdateShow
      } = props;
      if (onUpdateShow) call(onUpdateShow, value);
      if (_onUpdateShow) call(_onUpdateShow, value);
    }
    function isInternalFocusSwitch(e) {
      return !!(inputInstRef.value?.wrapperElRef?.contains(e.relatedTarget) || panelInstRef.value?.$el.contains(e.relatedTarget));
    }
    function openPanel() {
      memorizedValueRef.value = mergedValueRef.value;
      doUpdateShow(true);
      nextTick(scrollTimer);
    }
    function handleClickOutside(e) {
      if (mergedShowRef.value && !inputInstRef.value?.wrapperElRef?.contains(getPreciseEventTarget(e))) closePanel({
        returnFocus: false
      });
    }
    function closePanel({
      returnFocus
    }) {
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
      const time = strictParse(v, props.format, /* @__PURE__ */new Date(), dateFnsOptionsRef.value);
      displayTimeStringRef.value = v;
      if (isValid(time)) {
        const {
          value: mergedValue
        } = mergedValueRef;
        if (mergedValue !== null) {
          const newTime = set(mergedValue, {
            hours: getHours(time),
            minutes: getMinutes(time),
            seconds: getSeconds(time),
            milliseconds: getMilliseconds(time)
          });
          doUpdateValue(getTime(newTime));
        } else doUpdateValue(getTime(time));
      }
    }
    function handleCancelClick() {
      doUpdateValue(memorizedValueRef.value);
      doUpdateShow(false);
    }
    function handleNowClick() {
      const now = /* @__PURE__ */new Date();
      const getNowTime = {
        hours: getHours,
        minutes: getMinutes,
        seconds: getSeconds
      };
      const [mergeHours, mergeMinutes, mergeSeconds] = ["hours", "minutes", "seconds"].map(i => !props[i] || isTimeInStep(getNowTime[i](now), i, props[i]) ? getNowTime[i](now) : findSimilarTime(getNowTime[i](now), i, props[i]));
      const newValue = setSeconds(setMinutes(setHours(mergedValueRef.value ? mergedValueRef.value : getTime(now), mergeHours), mergeMinutes), mergeSeconds);
      doUpdateValue(getTime(newValue));
    }
    function handleConfirmClick() {
      deriveInputValue();
      doConfirm();
      closePanel({
        returnFocus: true
      });
    }
    function handleMenuFocusOut(e) {
      if (isInternalFocusSwitch(e)) return;
      deriveInputValue();
      doBlur(e);
      closePanel({
        returnFocus: false
      });
    }
    watch(mergedValueRef, value => {
      deriveInputValue(value);
      disableTransitionOneTick();
      nextTick(scrollTimer);
    });
    watch(mergedShowRef, () => {
      if (isValueInvalidRef.value) doUpdateValue(memorizedValueRef.value);
    });
    provide(timePickerInjectionKey, {
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
        "--n-icon-color-override": iconColor,
        "--n-icon-color-disabled-override": iconColorDisabled,
        "--n-bezier": cubicBezierEaseInOut
      };
    });
    const triggerThemeClassHandle = inlineThemeDisabled ? useThemeClass("time-picker-trigger", void 0, triggerCssVarsRef, props) : void 0;
    const cssVarsRef = computed(() => {
      const {
        self: {
          panelColor,
          itemTextColor,
          itemTextColorActive,
          itemColorHover,
          panelDividerColor,
          panelBoxShadow,
          itemOpacityDisabled,
          borderRadius,
          itemFontSize,
          itemWidth,
          itemHeight,
          panelActionPadding,
          itemBorderRadius
        },
        common: {
          cubicBezierEaseInOut
        }
      } = themeRef.value;
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
    const themeClassHandle = inlineThemeDisabled ? useThemeClass("time-picker", void 0, cssVarsRef, props) : void 0;
    return {
      focus: exposedMethods.focus,
      blur: exposedMethods.blur,
      mergedStatus: mergedStatusRef,
      mergedBordered: mergedBorderedRef,
      mergedClsPrefix: mergedClsPrefixRef,
      namespace: namespaceRef,
      uncontrolledValue: uncontrolledValueRef,
      mergedValue: mergedValueRef,
      isMounted: useIsMounted(),
      inputInstRef,
      panelInstRef,
      adjustedTo: useAdjustedTo(props),
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
    const {
      mergedClsPrefix,
      $slots,
      triggerOnRender
    } = this;
    triggerOnRender?.();
    return openBlock(), createElementBlock("div", {
      class: normalizeClass$1([`${mergedClsPrefix}-time-picker`, this.triggerThemeClass]),
      style: normalizeStyle(this.triggerCssVars)
    }, [createVNode(VBinder, null, {
      default: () => [(openBlock(), createBlock(VTarget, null, {
        default: () => (openBlock(), createBlock(Input_default, {
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
        }, normalizeSlots(this.showIcon ? {
          [this.clearable ? "clear-icon-placeholder" : "suffix"]: () => (openBlock(), createBlock(Icon_default, {
            clsPrefix: mergedClsPrefix,
            class: normalizeClass$1(`${mergedClsPrefix}-time-picker-icon`)
          }, {
            default: () => $slots.icon ? $slots.icon() : (openBlock(), createBlock(Time_default, {
              key: 1
            }))
          }, 1032, ["clsPrefix", "class"]))
        } : null), 1032, ["status", "value", "bordered", "passivelyActivated", "attrSize", "theme", "themeOverrides", "stateful", "size", "placeholder", "clearable", "disabled", "textDecoration", "onFocus", "onBlur", "onActivate", "onDeactivate", "onUpdateValue", "onClear", "internalDeactivateOnEnter", "internalForceFocus", "readonly", "onClick", "onKeydown"]))
      }, 1024)), (openBlock(), createBlock(VFollower, {
        teleportDisabled: this.adjustedTo === useAdjustedTo.tdkey,
        show: this.mergedShow,
        to: this.adjustedTo,
        containerClass: this.namespace,
        placement: this.placement
      }, {
        _: 1,
        default: normalizeSlot(() => (openBlock(), createBlock(Transition, {
          name: "fade-in-scale-up-transition",
          appear: this.isMounted
        }, {
          _: 1,
          default: normalizeSlot(() => {
            if (this.mergedShow) {
              this.onRender?.();
              return withDirectives((openBlock(), createBlock(Panel_default, {
                key: 2,
                ref: "panelInstRef",
                actions: this.actions,
                class: normalizeClass$1(this.themeClass),
                style: normalizeStyle(this.cssVars),
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
              }, null, 8, ["actions", "class", "style", "seconds", "minutes", "hours", "transitionDisabled", "hourValue", "showHour", "isHourInvalid", "isHourDisabled", "minuteValue", "showMinute", "isMinuteInvalid", "isMinuteDisabled", "secondValue", "amPmValue", "showSecond", "isSecondInvalid", "isSecondDisabled", "isValueInvalid", "clearText", "nowText", "confirmText", "use12Hours", "onFocusout", "onKeydown", "onHourClick", "onMinuteClick", "onSecondClick", "onAmPmClick", "onNowClick", "onConfirmClick", "onClearClick", "onFocusDetectorFocus"])), [[clickoutside, this.handleClickOutside, void 0, {
                capture: true
              }]]);
            }
            return null;
          })
        }, 8, ["appear"])))
      }, 8, ["teleportDisabled", "show", "to", "containerClass", "placement"]))]
    }, 1024)], 6);
  }
});
//#endregion
export { TimePicker_default as default, timePickerProps };