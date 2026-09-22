import { warnOnce } from "../../_utils/naive/warn.mjs";
import { call } from "../../_utils/vue/call.mjs";
import { resolveSlot, resolveWrappedSlot } from "../../_utils/vue/resolve-slot.mjs";
import useConfig from "../../_mixins/use-config.mjs";
import useFormItem from "../../_mixins/use-form-item.mjs";
import useLocale from "../../_mixins/use-locale.mjs";
import { useRtl } from "../../_mixins/use-rtl.mjs";
import useTheme from "../../_mixins/use-theme.mjs";
import { normalizeClass as normalizeClass$1, normalizeVNode } from "../../vue-jsx-vapor/vdom.mjs";
import Icon_default from "../../_internal/icon/src/Icon.mjs";
import Add_default from "../../_internal/icons/Add.mjs";
import Remove_default from "../../_internal/icons/Remove.mjs";
import Input_default from "../../input/src/Input.mjs";
import { XButton } from "../../button/src/Button.mjs";
import inputNumberLight from "../styles/light.mjs";
import input_number_cssr_default from "./styles/input-number.cssr.mjs";
import { format, isWipValue, parse, parseNumber, validator } from "./utils.mjs";
import { rgba } from "seemly";
import { computed, createBlock, createElementBlock, defineComponent, nextTick, openBlock, ref, toRef, watch, watchEffect } from "vue";
import { on } from "evtd";
import { useMemo, useMergedState } from "vooks";
//#region src/input-number/src/InputNumber.tsx
const HOLDING_CHANGE_THRESHOLD = 800;
const HOLDING_CHANGE_INTERVAL = 100;
const inputNumberProps = {
  ...useTheme.props,
  autofocus: Boolean,
  loading: {
    type: Boolean,
    default: void 0
  },
  placeholder: String,
  defaultValue: {
    type: Number,
    default: null
  },
  value: Number,
  step: {
    type: [Number, String],
    default: 1
  },
  min: [Number, String],
  max: [Number, String],
  size: String,
  disabled: {
    type: Boolean,
    default: void 0
  },
  validator: Function,
  bordered: {
    type: Boolean,
    default: void 0
  },
  showButton: {
    type: Boolean,
    default: true
  },
  buttonPlacement: {
    type: String,
    default: "right"
  },
  inputProps: Object,
  readonly: Boolean,
  clearable: Boolean,
  keyboard: {
    type: Object,
    default: {}
  },
  updateValueOnInput: {
    type: Boolean,
    default: true
  },
  round: {
    type: Boolean,
    default: void 0
  },
  parse: Function,
  format: Function,
  precision: Number,
  status: String,
  "onUpdate:value": [Function, Array],
  onUpdateValue: [Function, Array],
  onFocus: [Function, Array],
  onBlur: [Function, Array],
  onClear: [Function, Array],
  onChange: [Function, Array]
};
var InputNumber_default = defineComponent({
  name: "InputNumber",
  props: inputNumberProps,
  slots: Object,
  setup(props) {
    if (process.env.NODE_ENV !== "production") watchEffect(() => {
      if (props.onChange !== void 0) warnOnce("input-number", "`on-change` is deprecated, please use `on-update:value` instead");
    });
    const {
      mergedBorderedRef,
      mergedClsPrefixRef,
      mergedRtlRef,
      mergedComponentPropsRef
    } = useConfig(props);
    const themeRef = useTheme("InputNumber", "-input-number", input_number_cssr_default, inputNumberLight, props, mergedClsPrefixRef);
    const {
      localeRef
    } = useLocale("InputNumber");
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
        const configSize = mergedComponentPropsRef?.value?.InputNumber?.size;
        if (configSize) return configSize;
        return "medium";
      }
    });
    const {
      mergedSizeRef,
      mergedDisabledRef,
      mergedStatusRef
    } = formItem;
    const inputInstRef = ref(null);
    const minusButtonInstRef = ref(null);
    const addButtonInstRef = ref(null);
    const uncontrolledValueRef = ref(props.defaultValue);
    const controlledValueRef = toRef(props, "value");
    const mergedValueRef = useMergedState(controlledValueRef, uncontrolledValueRef);
    const displayedValueRef = ref("");
    const getPrecision = value => {
      const fraction = String(value).split(".")[1];
      return fraction ? fraction.length : 0;
    };
    const getMaxPrecision = currentValue => {
      const precisions = [props.min, props.max, props.step, currentValue].map(value => {
        if (value === void 0) return 0;
        return getPrecision(value);
      });
      return Math.max(...precisions);
    };
    const mergedPlaceholderRef = useMemo(() => {
      const {
        placeholder
      } = props;
      if (placeholder !== void 0) return placeholder;
      return localeRef.value.placeholder;
    });
    const mergedStepRef = useMemo(() => {
      const parsedNumber = parseNumber(props.step);
      if (parsedNumber !== null) return parsedNumber === 0 ? 1 : Math.abs(parsedNumber);
      return 1;
    });
    const mergedMinRef = useMemo(() => {
      const parsedNumber = parseNumber(props.min);
      if (parsedNumber !== null) return parsedNumber;else return null;
    });
    const mergedMaxRef = useMemo(() => {
      const parsedNumber = parseNumber(props.max);
      if (parsedNumber !== null) return parsedNumber;else return null;
    });
    const deriveDisplayedValueFromValue = () => {
      const {
        value: mergedValue
      } = mergedValueRef;
      if (validator(mergedValue)) {
        const {
          format: formatProp,
          precision
        } = props;
        if (formatProp) displayedValueRef.value = formatProp(mergedValue);else if (mergedValue === null || precision === void 0 || getPrecision(mergedValue) > precision) displayedValueRef.value = format(mergedValue, void 0);else displayedValueRef.value = format(mergedValue, precision);
      } else displayedValueRef.value = String(mergedValue);
    };
    deriveDisplayedValueFromValue();
    const doUpdateValue = value => {
      const {
        value: mergedValue
      } = mergedValueRef;
      if (value === mergedValue) {
        deriveDisplayedValueFromValue();
        return;
      }
      const {
        "onUpdate:value": _onUpdateValue,
        onUpdateValue,
        onChange
      } = props;
      const {
        nTriggerFormInput,
        nTriggerFormChange
      } = formItem;
      if (onChange) call(onChange, value);
      if (onUpdateValue) call(onUpdateValue, value);
      if (_onUpdateValue) call(_onUpdateValue, value);
      uncontrolledValueRef.value = value;
      nTriggerFormInput();
      nTriggerFormChange();
    };
    const deriveValueFromDisplayedValue = ({
      offset,
      doUpdateIfValid,
      fixPrecision,
      isInputing
    }) => {
      const {
        value: displayedValue
      } = displayedValueRef;
      if (isInputing && isWipValue(displayedValue)) return false;
      const parsedValue = (props.parse || parse)(displayedValue);
      if (parsedValue === null) {
        if (doUpdateIfValid) doUpdateValue(null);
        return null;
      }
      if (validator(parsedValue)) {
        const currentPrecision = getPrecision(parsedValue);
        const {
          precision
        } = props;
        if (precision !== void 0 && precision < currentPrecision && !fixPrecision) return false;
        let nextValue = Number.parseFloat((parsedValue + offset).toFixed(precision ?? getMaxPrecision(parsedValue)));
        if (validator(nextValue)) {
          const {
            value: mergedMax
          } = mergedMaxRef;
          const {
            value: mergedMin
          } = mergedMinRef;
          if (mergedMax !== null && nextValue > mergedMax) {
            if (!doUpdateIfValid || isInputing) return false;
            nextValue = mergedMax;
          }
          if (mergedMin !== null && nextValue < mergedMin) {
            if (!doUpdateIfValid || isInputing) return false;
            nextValue = mergedMin;
          }
          if (props.validator && !props.validator(nextValue)) return false;
          if (doUpdateIfValid) doUpdateValue(nextValue);
          return nextValue;
        }
      }
      return false;
    };
    const displayedValueInvalidRef = useMemo(() => {
      return deriveValueFromDisplayedValue({
        offset: 0,
        doUpdateIfValid: false,
        isInputing: false,
        fixPrecision: false
      }) === false;
    });
    const minusableRef = useMemo(() => {
      const {
        value: mergedValue
      } = mergedValueRef;
      if (props.validator && mergedValue === null) return false;
      const {
        value: mergedStep
      } = mergedStepRef;
      return deriveValueFromDisplayedValue({
        offset: -mergedStep,
        doUpdateIfValid: false,
        isInputing: false,
        fixPrecision: false
      }) !== false;
    });
    const addableRef = useMemo(() => {
      const {
        value: mergedValue
      } = mergedValueRef;
      if (props.validator && mergedValue === null) return false;
      const {
        value: mergedStep
      } = mergedStepRef;
      return deriveValueFromDisplayedValue({
        offset: +mergedStep,
        doUpdateIfValid: false,
        isInputing: false,
        fixPrecision: false
      }) !== false;
    });
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
      if (e.target === inputInstRef.value?.wrapperElRef) return;
      const value = deriveValueFromDisplayedValue({
        offset: 0,
        doUpdateIfValid: true,
        isInputing: false,
        fixPrecision: true
      });
      if (value !== false) {
        const inputElRef = inputInstRef.value?.inputElRef;
        if (inputElRef) inputElRef.value = String(value || "");
        if (mergedValueRef.value === value) deriveDisplayedValueFromValue();
      } else deriveDisplayedValueFromValue();
      const {
        onBlur
      } = props;
      const {
        nTriggerFormBlur
      } = formItem;
      if (onBlur) call(onBlur, e);
      nTriggerFormBlur();
      nextTick(() => {
        deriveDisplayedValueFromValue();
      });
    }
    function doClear(e) {
      const {
        onClear
      } = props;
      if (onClear) call(onClear, e);
    }
    function doAdd() {
      const {
        value: addable
      } = addableRef;
      if (!addable) {
        clearAddHoldTimeout();
        return;
      }
      const {
        value: mergedValue
      } = mergedValueRef;
      if (mergedValue === null) {
        if (!props.validator) doUpdateValue(createValidValue());
      } else {
        const {
          value: mergedStep
        } = mergedStepRef;
        deriveValueFromDisplayedValue({
          offset: mergedStep,
          doUpdateIfValid: true,
          isInputing: false,
          fixPrecision: true
        });
      }
    }
    function doMinus() {
      const {
        value: minusable
      } = minusableRef;
      if (!minusable) {
        clearMinusHoldTimeout();
        return;
      }
      const {
        value: mergedValue
      } = mergedValueRef;
      if (mergedValue === null) {
        if (!props.validator) doUpdateValue(createValidValue());
      } else {
        const {
          value: mergedStep
        } = mergedStepRef;
        deriveValueFromDisplayedValue({
          offset: -mergedStep,
          doUpdateIfValid: true,
          isInputing: false,
          fixPrecision: true
        });
      }
    }
    const handleFocus = doFocus;
    const handleBlur = doBlur;
    function createValidValue() {
      if (props.validator) return null;
      const {
        value: mergedMin
      } = mergedMinRef;
      const {
        value: mergedMax
      } = mergedMaxRef;
      if (mergedMin !== null) return Math.max(0, mergedMin);else if (mergedMax !== null) return Math.min(0, mergedMax);else return 0;
    }
    function handleClear(e) {
      doClear(e);
      doUpdateValue(null);
    }
    function handleMouseDown(e) {
      if (addButtonInstRef.value?.$el.contains(e.target)) e.preventDefault();
      if (minusButtonInstRef.value?.$el.contains(e.target)) e.preventDefault();
      inputInstRef.value?.activate();
    }
    let minusHoldStateIntervalId = null;
    let addHoldStateIntervalId = null;
    let firstMinusMousedownId = null;
    function clearMinusHoldTimeout() {
      if (firstMinusMousedownId) {
        window.clearTimeout(firstMinusMousedownId);
        firstMinusMousedownId = null;
      }
      if (minusHoldStateIntervalId) {
        window.clearInterval(minusHoldStateIntervalId);
        minusHoldStateIntervalId = null;
      }
    }
    let firstAddMousedownId = null;
    function clearAddHoldTimeout() {
      if (firstAddMousedownId) {
        window.clearTimeout(firstAddMousedownId);
        firstAddMousedownId = null;
      }
      if (addHoldStateIntervalId) {
        window.clearInterval(addHoldStateIntervalId);
        addHoldStateIntervalId = null;
      }
    }
    function handleMinusMousedown() {
      clearMinusHoldTimeout();
      firstMinusMousedownId = window.setTimeout(() => {
        minusHoldStateIntervalId = window.setInterval(() => {
          doMinus();
        }, HOLDING_CHANGE_INTERVAL);
      }, HOLDING_CHANGE_THRESHOLD);
      on("mouseup", document, clearMinusHoldTimeout, {
        once: true
      });
    }
    function handleAddMousedown() {
      clearAddHoldTimeout();
      firstAddMousedownId = window.setTimeout(() => {
        addHoldStateIntervalId = window.setInterval(() => {
          doAdd();
        }, HOLDING_CHANGE_INTERVAL);
      }, HOLDING_CHANGE_THRESHOLD);
      on("mouseup", document, clearAddHoldTimeout, {
        once: true
      });
    }
    const handleAddClick = () => {
      if (addHoldStateIntervalId) return;
      doAdd();
    };
    const handleMinusClick = () => {
      if (minusHoldStateIntervalId) return;
      doMinus();
    };
    function handleKeyDown(e) {
      if (e.key === "Enter") {
        if (e.target === inputInstRef.value?.wrapperElRef) return;
        if (deriveValueFromDisplayedValue({
          offset: 0,
          doUpdateIfValid: true,
          isInputing: false,
          fixPrecision: true
        }) !== false) inputInstRef.value?.deactivate();
      } else if (e.key === "ArrowUp") {
        if (!addableRef.value) return;
        if (props.keyboard.ArrowUp === false) return;
        e.preventDefault();
        if (deriveValueFromDisplayedValue({
          offset: 0,
          doUpdateIfValid: true,
          isInputing: false,
          fixPrecision: true
        }) !== false) doAdd();
      } else if (e.key === "ArrowDown") {
        if (!minusableRef.value) return;
        if (props.keyboard.ArrowDown === false) return;
        e.preventDefault();
        if (deriveValueFromDisplayedValue({
          offset: 0,
          doUpdateIfValid: true,
          isInputing: false,
          fixPrecision: true
        }) !== false) doMinus();
      }
    }
    function handleUpdateDisplayedValue(value) {
      displayedValueRef.value = value;
      if (props.updateValueOnInput && !props.format && !props.parse && props.precision === void 0) deriveValueFromDisplayedValue({
        offset: 0,
        doUpdateIfValid: true,
        isInputing: true,
        fixPrecision: false
      });
    }
    watch(mergedValueRef, () => {
      deriveDisplayedValueFromValue();
    });
    const exposedMethods = {
      focus: () => inputInstRef.value?.focus(),
      blur: () => inputInstRef.value?.blur(),
      select: () => inputInstRef.value?.select()
    };
    const rtlEnabledRef = useRtl("InputNumber", mergedRtlRef, mergedClsPrefixRef);
    return {
      ...exposedMethods,
      rtlEnabled: rtlEnabledRef,
      inputInstRef,
      minusButtonInstRef,
      addButtonInstRef,
      mergedClsPrefix: mergedClsPrefixRef,
      mergedBordered: mergedBorderedRef,
      uncontrolledValue: uncontrolledValueRef,
      mergedValue: mergedValueRef,
      mergedPlaceholder: mergedPlaceholderRef,
      displayedValueInvalid: displayedValueInvalidRef,
      mergedSize: mergedSizeRef,
      mergedDisabled: mergedDisabledRef,
      displayedValue: displayedValueRef,
      addable: addableRef,
      minusable: minusableRef,
      mergedStatus: mergedStatusRef,
      handleFocus,
      handleBlur,
      handleClear,
      handleMouseDown,
      handleAddClick,
      handleMinusClick,
      handleAddMousedown,
      handleMinusMousedown,
      handleKeyDown,
      handleUpdateDisplayedValue,
      mergedTheme: themeRef,
      inputThemeOverrides: {
        paddingSmall: "0 8px 0 10px",
        paddingMedium: "0 8px 0 12px",
        paddingLarge: "0 8px 0 14px"
      },
      buttonThemeOverrides: computed(() => {
        const {
          self: {
            iconColorDisabled
          }
        } = themeRef.value;
        const [r, g, b, a] = rgba(iconColorDisabled);
        return {
          textColorTextDisabled: `rgb(${r}, ${g}, ${b})`,
          opacityDisabled: `${a}`
        };
      })
    };
  },
  render() {
    const {
      mergedClsPrefix,
      $slots
    } = this;
    const renderMinusButton = () => {
      return openBlock(), createBlock(XButton, {
        text: true,
        disabled: !this.minusable || this.mergedDisabled || this.readonly,
        focusable: false,
        theme: this.mergedTheme.peers.Button,
        themeOverrides: this.mergedTheme.peerOverrides.Button,
        builtinThemeOverrides: this.buttonThemeOverrides,
        onClick: this.handleMinusClick,
        onMousedown: this.handleMinusMousedown,
        ref: "minusButtonInstRef"
      }, {
        icon: () => resolveSlot($slots["minus-icon"], () => [(openBlock(), createBlock(Icon_default, {
          clsPrefix: mergedClsPrefix
        }, {
          default: () => (openBlock(), createBlock(Remove_default))
        }, 1032, ["clsPrefix"]))])
      }, 1032, ["disabled", "theme", "themeOverrides", "builtinThemeOverrides", "onClick", "onMousedown"]);
    };
    const renderAddButton = () => {
      return openBlock(), createBlock(XButton, {
        text: true,
        disabled: !this.addable || this.mergedDisabled || this.readonly,
        focusable: false,
        theme: this.mergedTheme.peers.Button,
        themeOverrides: this.mergedTheme.peerOverrides.Button,
        builtinThemeOverrides: this.buttonThemeOverrides,
        onClick: this.handleAddClick,
        onMousedown: this.handleAddMousedown,
        ref: "addButtonInstRef"
      }, {
        icon: () => resolveSlot($slots["add-icon"], () => [(openBlock(), createBlock(Icon_default, {
          clsPrefix: mergedClsPrefix
        }, {
          default: () => (openBlock(), createBlock(Add_default))
        }, 1032, ["clsPrefix"]))])
      }, 1032, ["disabled", "theme", "themeOverrides", "builtinThemeOverrides", "onClick", "onMousedown"]);
    };
    return openBlock(), createElementBlock("div", {
      class: normalizeClass$1([`${mergedClsPrefix}-input-number`, this.rtlEnabled && `${mergedClsPrefix}-input-number--rtl`])
    }, [(openBlock(), createBlock(Input_default, {
      ref: "inputInstRef",
      autofocus: this.autofocus,
      status: this.mergedStatus,
      bordered: this.mergedBordered,
      loading: this.loading,
      value: this.displayedValue,
      onUpdateValue: this.handleUpdateDisplayedValue,
      theme: this.mergedTheme.peers.Input,
      themeOverrides: this.mergedTheme.peerOverrides.Input,
      builtinThemeOverrides: this.inputThemeOverrides,
      size: this.mergedSize,
      placeholder: this.mergedPlaceholder,
      disabled: this.mergedDisabled,
      readonly: this.readonly,
      round: this.round,
      textDecoration: this.displayedValueInvalid ? "line-through" : void 0,
      onFocus: this.handleFocus,
      onBlur: this.handleBlur,
      onKeydown: this.handleKeyDown,
      onMousedown: this.handleMouseDown,
      onClear: this.handleClear,
      clearable: this.clearable,
      inputProps: this.inputProps,
      internalLoadingBeforeSuffix: true
    }, {
      prefix: () => this.showButton && this.buttonPlacement === "both" ? [renderMinusButton(), resolveWrappedSlot($slots.prefix, children => {
        if (children) return openBlock(), createElementBlock("span", {
          key: 1,
          class: normalizeClass$1(`${mergedClsPrefix}-input-number-prefix`)
        }, [normalizeVNode(() => children)], 2);
        return null;
      })] : $slots.prefix?.(),
      suffix: () => this.showButton ? [resolveWrappedSlot($slots.suffix, children => {
        if (children) return openBlock(), createElementBlock("span", {
          key: 2,
          class: normalizeClass$1(`${mergedClsPrefix}-input-number-suffix`)
        }, [normalizeVNode(() => children)], 2);
        return null;
      }), this.buttonPlacement === "right" ? renderMinusButton() : null, renderAddButton()] : $slots.suffix?.()
    }, 1032, ["autofocus", "status", "bordered", "loading", "value", "onUpdateValue", "theme", "themeOverrides", "builtinThemeOverrides", "size", "placeholder", "disabled", "readonly", "round", "textDecoration", "onFocus", "onBlur", "onKeydown", "onMousedown", "onClear", "clearable", "inputProps"]))], 2);
  }
});
//#endregion
export { InputNumber_default as default, inputNumberProps };