import { createKey } from "../../_utils/cssr/index.mjs";
import { isArrayShallowEqual } from "../../_utils/naive/value.mjs";
import { call } from "../../_utils/vue/call.mjs";
import { resolveSlotWithTypedProps } from "../../_utils/vue/resolve-slot.mjs";
import useConfig from "../../_mixins/use-config.mjs";
import { useThemeClass } from "../../_mixins/use-css-vars-class.mjs";
import useFormItem from "../../_mixins/use-form-item.mjs";
import { useRtl } from "../../_mixins/use-rtl.mjs";
import useTheme from "../../_mixins/use-theme.mjs";
import { normalizeClass as normalizeClass$1, normalizeVNode } from "../../vue-jsx-vapor/vdom.mjs";
import Input_default from "../../input/src/Input.mjs";
import inputOtpLight from "../styles/light.mjs";
import index_cssr_default from "./styles/index.cssr.mjs";
import { pxfy, repeat } from "seemly";
import { computed, createBlock, createElementBlock, defineComponent, mergeProps, normalizeStyle, openBlock, ref, toRef } from "vue";
import { useMergedState } from "vooks";
//#region src/input-otp/src/InputOtp.tsx
const inputOtpProps = {
  ...useTheme.props,
  defaultValue: {
    type: Array,
    default: []
  },
  value: Array,
  length: {
    type: Number,
    default: 6
  },
  block: Boolean,
  size: String,
  disabled: Boolean,
  mask: Boolean,
  readonly: Boolean,
  status: String,
  gap: [String, Number],
  placeholder: {
    type: String,
    default: ""
  },
  allowInput: Function,
  onBlur: [Function, Array],
  onFocus: [Function, Array],
  "onUpdate:value": [Function, Array],
  onUpdateValue: [Function, Array],
  onFinish: [Function, Array]
};
var InputOtp_default = defineComponent({
  name: "InputOtp",
  props: inputOtpProps,
  slots: Object,
  setup(props) {
    const {
      mergedClsPrefixRef,
      mergedRtlRef,
      inlineThemeDisabled,
      mergedComponentPropsRef
    } = useConfig(props);
    const themeRef = useTheme("InputOtp", "-input-otp", index_cssr_default, inputOtpLight, props, mergedClsPrefixRef);
    const rtlEnabledRef = useRtl("InputOtp", mergedRtlRef, mergedClsPrefixRef);
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
        const configSize = mergedComponentPropsRef?.value?.InputOtp?.size;
        if (configSize) return configSize;
        return "medium";
      }
    });
    const {
      mergedSizeRef,
      mergedDisabledRef,
      mergedStatusRef
    } = formItem;
    const cssVarsRef = computed(() => {
      const {
        value: size
      } = mergedSizeRef;
      const {
        gap: propGap
      } = props;
      const {
        self: {
          [createKey("inputWidth", size)]: inputWidth,
          [createKey("gap", size)]: gap
        }
      } = themeRef.value;
      return {
        "--n-gap": propGap === void 0 ? gap : typeof propGap === "number" ? pxfy(propGap) : propGap,
        "--n-input-width": inputWidth
      };
    });
    const themeClassHandle = inlineThemeDisabled ? useThemeClass("input-otp", computed(() => {
      const {
        value: size
      } = mergedSizeRef;
      return size[0];
    }), cssVarsRef, props) : void 0;
    const uncontrolledValueRef = ref(props.defaultValue);
    const controlledValueRef = toRef(props, "value");
    const mergedValueRef = useMergedState(controlledValueRef, uncontrolledValueRef);
    const inputRefList = ref([]);
    const inputTypeRef = computed(() => props.mask ? "password" : "text");
    const handleFocus = (e, index) => {
      if (inputRefList?.value.some(inputInst => inputInst.inputElRef === e.relatedTarget)) return;
      const {
        onFocus
      } = props;
      if (onFocus) call(onFocus, e, index);
      const {
        nTriggerFormFocus
      } = formItem;
      nTriggerFormFocus();
    };
    const handleBlur = (e, index) => {
      if (inputRefList?.value.some(inputInst => inputInst.inputElRef === e.relatedTarget)) return;
      const {
        onBlur
      } = props;
      const {
        nTriggerFormBlur
      } = formItem;
      if (onBlur) call(onBlur, e, index);
      nTriggerFormBlur();
    };
    const focusOnChar = charIndex => {
      if (charIndex >= props.length) return;
      if (charIndex < 0) return;
      inputRefList?.value[charIndex].focus();
      inputRefList?.value[charIndex].select();
    };
    const focusOnNextChar = currentIndex => {
      if (currentIndex >= props.length - 1) return;
      focusOnChar(currentIndex + 1);
    };
    const focusOnPrevChar = currentIndex => {
      if (currentIndex <= 0) return;
      focusOnChar(currentIndex - 1);
    };
    const justifyValue = value => {
      const justifiedValue = value ? Array.from(value) : [];
      const length = props.length;
      while (justifiedValue.length > length) justifiedValue.pop();
      while (justifiedValue.length < length) justifiedValue.push("");
      return justifiedValue;
    };
    function doUpdateValue(value, meta) {
      const {
        nTriggerFormInput,
        nTriggerFormChange
      } = formItem;
      if (isArrayShallowEqual(value, mergedValueRef.value)) {
        nTriggerFormInput();
        return;
      }
      const {
        "onUpdate:value": _onUpdateValue,
        onUpdateValue,
        length,
        onFinish
      } = props;
      if (_onUpdateValue) call(_onUpdateValue, value, meta);
      if (onUpdateValue) call(onUpdateValue, value, meta);
      if (value.filter(v => v).length === length && onFinish) call(onFinish, value);
      uncontrolledValueRef.value = value;
      nTriggerFormInput();
      nTriggerFormChange();
    }
    const handlePaste = (e, index) => {
      if (props.readonly || mergedDisabledRef.value) return;
      e.preventDefault();
      const {
        clipboardData
      } = e;
      const text = clipboardData?.getData("text");
      if (!text) return;
      const currentValue = justifyValue(mergedValueRef.value);
      let startIndex = index;
      const allowInput = props.allowInput;
      let pasteApplied = false;
      let appendedText = "";
      for (let i = 0; i < text.length; ++i) {
        if (allowInput && !allowInput(text[i], startIndex, currentValue)) continue;
        pasteApplied = true;
        currentValue[startIndex] = text[i];
        appendedText += text[i];
        startIndex++;
        if (startIndex >= currentValue.length) break;
      }
      if (pasteApplied) {
        focusOnChar(startIndex);
        doUpdateValue(currentValue, {
          diff: appendedText,
          index: startIndex,
          source: "paste"
        });
      }
    };
    const handleKeydown = (e, index) => {
      if (mergedDisabledRef.value) return;
      const keyCode = e.code || e.key;
      const currentValue = justifyValue(mergedValueRef.value);
      if (keyCode === "Backspace" && !props.readonly) {
        e.preventDefault();
        currentValue[Math.max(index, 0)] = "";
        doUpdateValue(currentValue, {
          diff: "",
          index,
          source: "delete"
        });
        focusOnPrevChar(index);
      } else if (keyCode === "ArrowLeft") {
        e.preventDefault();
        focusOnPrevChar(index);
      } else if (keyCode === "ArrowRight") {
        e.preventDefault();
        focusOnNextChar(index);
      }
    };
    const handleInput = (value, index) => {
      const currentValue = justifyValue(mergedValueRef.value);
      const currentValueAtIndex = currentValue[index];
      const text = value.replace(currentValueAtIndex, "") || value;
      if (text.length > 1) {
        let startIndex = index;
        const allowInput = props.allowInput;
        let pasteApplied = false;
        let appendedText = "";
        for (let i = 0; i < text.length; ++i) {
          if (allowInput && !allowInput(text[i], startIndex, currentValue)) continue;
          pasteApplied = true;
          currentValue[startIndex] = text[i];
          appendedText += text[i];
          startIndex++;
          if (startIndex >= currentValue.length) break;
        }
        if (pasteApplied) {
          focusOnChar(Math.min(startIndex, props.length - 1));
          doUpdateValue(currentValue, {
            diff: appendedText,
            index: startIndex,
            source: "input"
          });
        }
        return;
      }
      const char = text[text.length - 1] || "";
      const allowInput = props.allowInput;
      if (allowInput && !allowInput(char, index, currentValue)) return;
      currentValue[index] = char;
      doUpdateValue(currentValue, {
        diff: char,
        index,
        source: "input"
      });
      focusOnNextChar(index);
    };
    const getTemplateEvents = index => {
      return {
        onInput: value => handleInput(value, index),
        onPaste: event => handlePaste(event, index),
        onKeydown: event => handleKeydown(event, index),
        onFocus: event => handleFocus(event, index),
        onBlur: event => handleBlur(event, index)
      };
    };
    const exposedMethods = {
      focusOnChar
    };
    return {
      mergedTheme: themeRef,
      perItemValueArray: computed(() => justifyValue(mergedValueRef.value)),
      mergedClsPrefix: mergedClsPrefixRef,
      inputRefList,
      inputType: inputTypeRef,
      rtlEnabled: rtlEnabledRef,
      mergedStatus: mergedStatusRef,
      mergedDisabled: mergedDisabledRef,
      cssVars: inlineThemeDisabled ? void 0 : cssVarsRef,
      themeClass: themeClassHandle?.themeClass,
      getTemplateEvents,
      onRender: themeClassHandle?.onRender,
      ...exposedMethods
    };
  },
  render() {
    const {
      mergedTheme,
      mergedClsPrefix,
      perItemValueArray,
      size,
      placeholder,
      mergedDisabled,
      mergedStatus,
      readonly,
      inputType,
      $slots,
      getTemplateEvents,
      themeClass,
      onRender
    } = this;
    onRender?.();
    return openBlock(), createElementBlock("div", {
      style: normalizeStyle(this.cssVars),
      class: normalizeClass$1([`${mergedClsPrefix}-input-otp`, themeClass, this.rtlEnabled && `${mergedClsPrefix}-input-otp--rtl`, this.block && `${mergedClsPrefix}-input-otp--block`])
    }, [normalizeVNode(() => repeat(this.length, void 0).map((_, index) => resolveSlotWithTypedProps($slots.default, {
      index,
      value: perItemValueArray[index],
      type: inputType,
      size,
      placeholder,
      disabled: mergedDisabled,
      readonly,
      status: mergedStatus,
      builtinThemeOverrides: {
        paddingTiny: "0",
        paddingSmall: "0",
        paddingMedium: "0",
        paddingLarge: "0"
      },
      theme: mergedTheme.peers.Input,
      themeOverrides: mergedTheme.peerOverrides.Input,
      ref: el => this.inputRefList[index] = el,
      ...getTemplateEvents(index)
    }, ({
      index,
      ...restProps
    }) => [(openBlock(), createBlock(Input_default, mergeProps(restProps, {
      key: index
    }), null, 16))])))], 6);
  }
});
//#endregion
export { InputOtp_default as default, inputOtpProps };