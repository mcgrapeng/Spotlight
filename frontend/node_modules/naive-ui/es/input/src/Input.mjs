import { createKey } from "../../_utils/cssr/index.mjs";
import { call } from "../../_utils/vue/call.mjs";
import { resolveSlot, resolveWrappedSlot } from "../../_utils/vue/resolve-slot.mjs";
import useConfig from "../../_mixins/use-config.mjs";
import { useThemeClass } from "../../_mixins/use-css-vars-class.mjs";
import useFormItem from "../../_mixins/use-form-item.mjs";
import useLocale from "../../_mixins/use-locale.mjs";
import { useRtl } from "../../_mixins/use-rtl.mjs";
import useStyle from "../../_mixins/use-style.mjs";
import useTheme from "../../_mixins/use-theme.mjs";
import { normalizeClass as normalizeClass$1, normalizeVNode } from "../../vue-jsx-vapor/vdom.mjs";
import Icon_default from "../../_internal/icon/src/Icon.mjs";
import Eye_default from "../../_internal/icons/Eye.mjs";
import EyeOff_default from "../../_internal/icons/EyeOff.mjs";
import Clear_default from "../../_internal/clear/src/Clear.mjs";
import Scrollbar from "../../_internal/scrollbar/src/Scrollbar.mjs";
import Suffix_default from "../../_internal/suffix/src/Suffix.mjs";
import { isSafari } from "../../_utils/env/browser.mjs";
import inputLight from "../styles/light.mjs";
import { inputInjectionKey } from "./interface.mjs";
import input_cssr_default, { safariStyle } from "./styles/input.cssr.mjs";
import { isEmptyInputValue, useCursor } from "./utils.mjs";
import WordCount_default from "./WordCount.mjs";
import { getPadding } from "seemly";
import { Fragment, computed, createBlock, createElementBlock, createElementVNode, defineComponent, getCurrentInstance, mergeProps, nextTick, normalizeStyle, onMounted, openBlock, provide, ref, toRef, watch, watchEffect } from "vue";
import { off, on } from "evtd";
import { useMemo, useMergedState } from "vooks";
import { VResizeObserver } from "vueuc";
//#region src/input/src/Input.tsx
const _hoisted_1 = ["autofocus", "rows", "placeholder", "value", "disabled", "maxlength", "minlength", "readonly", "tabindex", "onBlur", "onFocus", "onInput", "onChange", "onScroll"];
const _hoisted_2 = ["type", "tabindex", "placeholder", "disabled", "maxlength", "minlength", "value", "readonly", "autofocus", "size", "onBlur", "onFocus", "onInput", "onChange"];
const _hoisted_3 = ["onMousedown", "onClick"];
const _hoisted_4 = ["type", "tabindex", "placeholder", "disabled", "maxlength", "minlength", "value", "readonly", "onBlur", "onFocus", "onInput", "onChange"];
const _hoisted_5 = ["tabindex", "onFocus", "onBlur", "onClick", "onMousedown", "onMouseenter", "onMouseleave", "onCompositionstart", "onCompositionend", "onKeyup", "onKeydown"];
const inputProps = {
  ...useTheme.props,
  bordered: {
    type: Boolean,
    default: void 0
  },
  type: {
    type: String,
    default: "text"
  },
  placeholder: [Array, String],
  defaultValue: {
    type: [String, Array],
    default: null
  },
  value: [String, Array],
  disabled: {
    type: Boolean,
    default: void 0
  },
  size: String,
  rows: {
    type: [Number, String],
    default: 3
  },
  round: Boolean,
  minlength: [String, Number],
  maxlength: [String, Number],
  clearable: Boolean,
  autosize: {
    type: [Boolean, Object],
    default: false
  },
  pair: Boolean,
  separator: String,
  readonly: {
    type: [String, Boolean],
    default: false
  },
  passivelyActivated: Boolean,
  showPasswordOn: String,
  stateful: {
    type: Boolean,
    default: true
  },
  autofocus: Boolean,
  inputProps: Object,
  resizable: {
    type: Boolean,
    default: true
  },
  showCount: Boolean,
  loading: {
    type: Boolean,
    default: void 0
  },
  allowInput: Function,
  renderCount: Function,
  onMousedown: Function,
  onKeydown: Function,
  onKeyup: [Function, Array],
  onInput: [Function, Array],
  onFocus: [Function, Array],
  onBlur: [Function, Array],
  onClick: [Function, Array],
  onChange: [Function, Array],
  onClear: [Function, Array],
  countGraphemes: Function,
  status: String,
  "onUpdate:value": [Function, Array],
  onUpdateValue: [Function, Array],
  /** private */
  textDecoration: [String, Array],
  attrSize: {
    type: Number,
    default: 20
  },
  onInputBlur: [Function, Array],
  onInputFocus: [Function, Array],
  onDeactivate: [Function, Array],
  onActivate: [Function, Array],
  onWrapperFocus: [Function, Array],
  onWrapperBlur: [Function, Array],
  internalDeactivateOnEnter: Boolean,
  internalForceFocus: Boolean,
  internalLoadingBeforeSuffix: {
    type: Boolean,
    default: true
  },
  /** deprecated */
  showPasswordToggle: Boolean
};
var Input_default = defineComponent({
  name: "Input",
  props: inputProps,
  slots: Object,
  setup(props) {
    const {
      mergedClsPrefixRef,
      mergedBorderedRef,
      inlineThemeDisabled,
      mergedRtlRef,
      mergedComponentPropsRef
    } = useConfig(props);
    const themeRef = useTheme("Input", "-input", input_cssr_default, inputLight, props, mergedClsPrefixRef);
    if (isSafari) useStyle("-input-safari", safariStyle, mergedClsPrefixRef);
    const wrapperElRef = ref(null);
    const textareaElRef = ref(null);
    const textareaMirrorElRef = ref(null);
    const inputMirrorElRef = ref(null);
    const inputElRef = ref(null);
    const inputEl2Ref = ref(null);
    const currentFocusedInputRef = ref(null);
    const focusedInputCursorControl = useCursor(currentFocusedInputRef);
    const textareaScrollbarInstRef = ref(null);
    const {
      localeRef
    } = useLocale("Input");
    const uncontrolledValueRef = ref(props.defaultValue);
    const controlledValueRef = toRef(props, "value");
    const mergedValueRef = useMergedState(controlledValueRef, uncontrolledValueRef);
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
        const configSize = mergedComponentPropsRef?.value?.Input?.size;
        if (configSize) return configSize;
        return "medium";
      }
    });
    const {
      mergedSizeRef,
      mergedDisabledRef,
      mergedStatusRef
    } = formItem;
    const focusedRef = ref(false);
    const hoverRef = ref(false);
    const isComposingRef = ref(false);
    const activatedRef = ref(false);
    let syncSource = null;
    const mergedPlaceholderRef = computed(() => {
      const {
        placeholder,
        pair
      } = props;
      if (pair) {
        if (Array.isArray(placeholder)) return placeholder;else if (placeholder === void 0) return ["", ""];
        return [placeholder, placeholder];
      } else if (placeholder === void 0) return [localeRef.value.placeholder];else return [placeholder];
    });
    const showPlaceholder1Ref = computed(() => {
      const {
        value: isComposing
      } = isComposingRef;
      const {
        value: mergedValue
      } = mergedValueRef;
      const {
        value: mergedPlaceholder
      } = mergedPlaceholderRef;
      return !isComposing && (isEmptyInputValue(mergedValue) || Array.isArray(mergedValue) && isEmptyInputValue(mergedValue[0])) && mergedPlaceholder[0];
    });
    const showPlaceholder2Ref = computed(() => {
      const {
        value: isComposing
      } = isComposingRef;
      const {
        value: mergedValue
      } = mergedValueRef;
      const {
        value: mergedPlaceholder
      } = mergedPlaceholderRef;
      return !isComposing && mergedPlaceholder[1] && (isEmptyInputValue(mergedValue) || Array.isArray(mergedValue) && isEmptyInputValue(mergedValue[1]));
    });
    const mergedFocusRef = useMemo(() => {
      return props.internalForceFocus || focusedRef.value;
    });
    const showClearButton = useMemo(() => {
      if (mergedDisabledRef.value || props.readonly || !props.clearable || !mergedFocusRef.value && !hoverRef.value) return false;
      const {
        value: mergedValue
      } = mergedValueRef;
      const {
        value: mergedFocus
      } = mergedFocusRef;
      if (props.pair) return !!(Array.isArray(mergedValue) && (mergedValue[0] || mergedValue[1])) && (hoverRef.value || mergedFocus);else return !!mergedValue && (hoverRef.value || mergedFocus);
    });
    const mergedShowPasswordOnRef = computed(() => {
      const {
        showPasswordOn
      } = props;
      if (showPasswordOn) return showPasswordOn;
      if (props.showPasswordToggle) return "click";
    });
    const passwordVisibleRef = ref(false);
    const textDecorationStyleRef = computed(() => {
      const {
        textDecoration
      } = props;
      if (!textDecoration) return ["", ""];
      if (Array.isArray(textDecoration)) return textDecoration.map(v => ({
        textDecoration: v
      }));
      return [{
        textDecoration
      }];
    });
    const textAreaScrollContainerWidthRef = ref(void 0);
    const updateTextAreaStyle = () => {
      if (props.type === "textarea") {
        const {
          autosize
        } = props;
        if (autosize) textAreaScrollContainerWidthRef.value = textareaScrollbarInstRef.value?.$el?.offsetWidth;
        if (!textareaElRef.value) return;
        if (typeof autosize === "boolean") return;
        const {
          paddingTop: stylePaddingTop,
          paddingBottom: stylePaddingBottom,
          lineHeight: styleLineHeight
        } = window.getComputedStyle(textareaElRef.value);
        const paddingTop = Number(stylePaddingTop.slice(0, -2));
        const paddingBottom = Number(stylePaddingBottom.slice(0, -2));
        const lineHeight = Number(styleLineHeight.slice(0, -2));
        const {
          value: textareaMirrorEl
        } = textareaMirrorElRef;
        if (!textareaMirrorEl) return;
        if (autosize.minRows) {
          const minRows = Math.max(autosize.minRows, 1);
          const styleMinHeight = `${paddingTop + paddingBottom + lineHeight * minRows}px`;
          textareaMirrorEl.style.minHeight = styleMinHeight;
        }
        if (autosize.maxRows) {
          const styleMaxHeight = `${paddingTop + paddingBottom + lineHeight * autosize.maxRows}px`;
          textareaMirrorEl.style.maxHeight = styleMaxHeight;
        }
      }
    };
    const maxlengthRef = computed(() => {
      const {
        maxlength
      } = props;
      return maxlength === void 0 ? void 0 : Number(maxlength);
    });
    onMounted(() => {
      const {
        value
      } = mergedValueRef;
      if (!Array.isArray(value)) syncMirror(value);
    });
    const vm = getCurrentInstance().proxy;
    function doUpdateValue(value, meta) {
      const {
        onUpdateValue,
        "onUpdate:value": _onUpdateValue,
        onInput
      } = props;
      const {
        nTriggerFormInput
      } = formItem;
      if (onUpdateValue) call(onUpdateValue, value, meta);
      if (_onUpdateValue) call(_onUpdateValue, value, meta);
      if (onInput) call(onInput, value, meta);
      uncontrolledValueRef.value = value;
      nTriggerFormInput();
    }
    function doChange(value, meta) {
      const {
        onChange
      } = props;
      const {
        nTriggerFormChange
      } = formItem;
      if (onChange) call(onChange, value, meta);
      uncontrolledValueRef.value = value;
      nTriggerFormChange();
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
    function doClear(e) {
      const {
        onClear
      } = props;
      if (onClear) call(onClear, e);
    }
    function doUpdateValueBlur(e) {
      const {
        onInputBlur
      } = props;
      if (onInputBlur) call(onInputBlur, e);
    }
    function doUpdateValueFocus(e) {
      const {
        onInputFocus
      } = props;
      if (onInputFocus) call(onInputFocus, e);
    }
    function doDeactivate() {
      const {
        onDeactivate
      } = props;
      if (onDeactivate) call(onDeactivate);
    }
    function doActivate() {
      const {
        onActivate
      } = props;
      if (onActivate) call(onActivate);
    }
    function doClick(e) {
      const {
        onClick
      } = props;
      if (onClick) call(onClick, e);
    }
    function doWrapperFocus(e) {
      const {
        onWrapperFocus
      } = props;
      if (onWrapperFocus) call(onWrapperFocus, e);
    }
    function doWrapperBlur(e) {
      const {
        onWrapperBlur
      } = props;
      if (onWrapperBlur) call(onWrapperBlur, e);
    }
    function handleCompositionStart() {
      isComposingRef.value = true;
    }
    function handleCompositionEnd(e) {
      isComposingRef.value = false;
      if (e.target === inputEl2Ref.value) handleInput(e, 1);else handleInput(e, 0);
    }
    function handleInput(e, index = 0, event = "input") {
      const targetValue = e.target.value;
      syncMirror(targetValue);
      if (e instanceof InputEvent && !e.isComposing) isComposingRef.value = false;
      if (props.type === "textarea") {
        const {
          value: textareaScrollbarInst
        } = textareaScrollbarInstRef;
        if (textareaScrollbarInst) textareaScrollbarInst.syncUnifiedContainer();
      }
      syncSource = targetValue;
      if (isComposingRef.value) return;
      focusedInputCursorControl.recordCursor();
      const isIncomingValueValid = allowInput(targetValue);
      if (isIncomingValueValid) {
        if (!props.pair) {
          if (event === "input") doUpdateValue(targetValue, {
            source: index
          });else doChange(targetValue, {
            source: index
          });
        } else {
          let {
            value
          } = mergedValueRef;
          if (!Array.isArray(value)) value = ["", ""];else value = [value[0], value[1]];
          value[index] = targetValue;
          if (event === "input") doUpdateValue(value, {
            source: index
          });else doChange(value, {
            source: index
          });
        }
      }
      vm.$forceUpdate();
      if (!isIncomingValueValid) nextTick(focusedInputCursorControl.restoreCursor);
    }
    function allowInput(value) {
      const {
        countGraphemes,
        maxlength,
        minlength
      } = props;
      if (countGraphemes) {
        let graphemesCount;
        if (maxlength !== void 0) {
          if (graphemesCount === void 0) graphemesCount = countGraphemes(value);
          if (graphemesCount > Number(maxlength)) return false;
        }
        if (minlength !== void 0) {
          if (graphemesCount === void 0) graphemesCount = countGraphemes(value);
          if (graphemesCount < Number(maxlength)) return false;
        }
      }
      const {
        allowInput
      } = props;
      if (typeof allowInput === "function") return allowInput(value);
      return true;
    }
    function handleInputBlur(e) {
      doUpdateValueBlur(e);
      if (e.relatedTarget === wrapperElRef.value) doDeactivate();
      if (!(e.relatedTarget !== null && (e.relatedTarget === inputElRef.value || e.relatedTarget === inputEl2Ref.value || e.relatedTarget === textareaElRef.value))) activatedRef.value = false;
      dealWithEvent(e, "blur");
      currentFocusedInputRef.value = null;
    }
    function handleInputFocus(e, index) {
      doUpdateValueFocus(e);
      focusedRef.value = true;
      activatedRef.value = true;
      doActivate();
      dealWithEvent(e, "focus");
      if (index === 0) currentFocusedInputRef.value = inputElRef.value;else if (index === 1) currentFocusedInputRef.value = inputEl2Ref.value;else if (index === 2) currentFocusedInputRef.value = textareaElRef.value;
    }
    function handleWrapperBlur(e) {
      if (props.passivelyActivated) {
        doWrapperBlur(e);
        dealWithEvent(e, "blur");
      }
    }
    function handleWrapperFocus(e) {
      if (props.passivelyActivated) {
        focusedRef.value = true;
        doWrapperFocus(e);
        dealWithEvent(e, "focus");
      }
    }
    function dealWithEvent(e, type) {
      if (e.relatedTarget !== null && (e.relatedTarget === inputElRef.value || e.relatedTarget === inputEl2Ref.value || e.relatedTarget === textareaElRef.value || e.relatedTarget === wrapperElRef.value)) {} else if (type === "focus") {
        doFocus(e);
        focusedRef.value = true;
      } else if (type === "blur") {
        doBlur(e);
        focusedRef.value = false;
      }
    }
    function handleChange(e, index) {
      handleInput(e, index, "change");
    }
    function handleClick(e) {
      doClick(e);
    }
    function handleClear(e) {
      doClear(e);
      clearValue();
    }
    function clearValue() {
      if (props.pair) {
        doUpdateValue(["", ""], {
          source: "clear"
        });
        doChange(["", ""], {
          source: "clear"
        });
      } else {
        doUpdateValue("", {
          source: "clear"
        });
        doChange("", {
          source: "clear"
        });
      }
    }
    function handleMouseDown(e) {
      const {
        onMousedown
      } = props;
      if (onMousedown) onMousedown(e);
      const {
        tagName
      } = e.target;
      if (tagName !== "INPUT" && tagName !== "TEXTAREA") {
        if (props.resizable) {
          const {
            value: wrapperEl
          } = wrapperElRef;
          if (wrapperEl) {
            const {
              left,
              top,
              width,
              height
            } = wrapperEl.getBoundingClientRect();
            const resizeHandleSize = 14;
            if (left + width - resizeHandleSize < e.clientX && e.clientX < left + width && top + height - resizeHandleSize < e.clientY && e.clientY < top + height) return;
          }
        }
        e.preventDefault();
        if (!focusedRef.value) focus();
      }
    }
    function handleMouseEnter() {
      hoverRef.value = true;
      if (props.type === "textarea") textareaScrollbarInstRef.value?.handleMouseEnterWrapper();
    }
    function handleMouseLeave() {
      hoverRef.value = false;
      if (props.type === "textarea") textareaScrollbarInstRef.value?.handleMouseLeaveWrapper();
    }
    function handlePasswordToggleClick() {
      if (mergedDisabledRef.value) return;
      if (mergedShowPasswordOnRef.value !== "click") return;
      passwordVisibleRef.value = !passwordVisibleRef.value;
    }
    function handlePasswordToggleMousedown(e) {
      if (mergedDisabledRef.value) return;
      e.preventDefault();
      const preventDefaultOnce = e => {
        e.preventDefault();
        off("mouseup", document, preventDefaultOnce);
      };
      on("mouseup", document, preventDefaultOnce);
      if (mergedShowPasswordOnRef.value !== "mousedown") return;
      passwordVisibleRef.value = true;
      const hidePassword = () => {
        passwordVisibleRef.value = false;
        off("mouseup", document, hidePassword);
      };
      on("mouseup", document, hidePassword);
    }
    function handleWrapperKeyup(e) {
      if (props.onKeyup) call(props.onKeyup, e);
    }
    function handleWrapperKeydown(e) {
      if (props.onKeydown) call(props.onKeydown, e);
      switch (e.key) {
        case "Escape":
          handleWrapperKeydownEsc();
          break;
        case "Enter":
          handleWrapperKeydownEnter(e);
      }
    }
    function handleWrapperKeydownEnter(e) {
      if (props.passivelyActivated) {
        const {
          value: focused
        } = activatedRef;
        if (focused) {
          if (props.internalDeactivateOnEnter) handleWrapperKeydownEsc();
          return;
        }
        e.preventDefault();
        if (props.type === "textarea") textareaElRef.value?.focus();else inputElRef.value?.focus();
      }
    }
    function handleWrapperKeydownEsc() {
      if (props.passivelyActivated) {
        activatedRef.value = false;
        nextTick(() => {
          wrapperElRef.value?.focus();
        });
      }
    }
    function focus() {
      if (mergedDisabledRef.value) return;
      if (props.passivelyActivated) wrapperElRef.value?.focus();else {
        textareaElRef.value?.focus();
        inputElRef.value?.focus();
      }
    }
    function blur() {
      if (wrapperElRef.value?.contains(document.activeElement)) document.activeElement.blur();
    }
    function select() {
      textareaElRef.value?.select();
      inputElRef.value?.select();
    }
    function activate() {
      if (mergedDisabledRef.value) return;
      if (textareaElRef.value) textareaElRef.value.focus();else if (inputElRef.value) inputElRef.value.focus();
    }
    function deactivate() {
      const {
        value: wrapperEl
      } = wrapperElRef;
      if (wrapperEl?.contains(document.activeElement) && wrapperEl !== document.activeElement) handleWrapperKeydownEsc();
    }
    function scrollTo(options) {
      if (props.type === "textarea") {
        const {
          value: textareaEl
        } = textareaElRef;
        textareaEl?.scrollTo(options);
      } else {
        const {
          value: inputEl
        } = inputElRef;
        inputEl?.scrollTo(options);
      }
    }
    function syncMirror(value) {
      const {
        type,
        pair,
        autosize
      } = props;
      if (!pair && autosize) {
        if (type === "textarea") {
          const {
            value: textareaMirrorEl
          } = textareaMirrorElRef;
          if (textareaMirrorEl) textareaMirrorEl.textContent = `${value ?? ""}\r\n`;
        } else {
          const {
            value: inputMirrorEl
          } = inputMirrorElRef;
          if (inputMirrorEl) {
            if (value) inputMirrorEl.textContent = value;else inputMirrorEl.innerHTML = "&nbsp;";
          }
        }
      }
    }
    function handleTextAreaMirrorResize() {
      updateTextAreaStyle();
    }
    const placeholderStyleRef = ref({
      top: "0"
    });
    function handleTextAreaScroll(e) {
      const {
        scrollTop
      } = e.target;
      placeholderStyleRef.value.top = `${-scrollTop}px`;
      textareaScrollbarInstRef.value?.syncUnifiedContainer();
    }
    let stopWatchMergedValue1 = null;
    watchEffect(() => {
      const {
        autosize,
        type
      } = props;
      if (autosize && type === "textarea") stopWatchMergedValue1 = watch(mergedValueRef, value => {
        if (!Array.isArray(value) && value !== syncSource) syncMirror(value);
      });else stopWatchMergedValue1?.();
    });
    let stopWatchMergedValue2 = null;
    watchEffect(() => {
      if (props.type === "textarea") stopWatchMergedValue2 = watch(mergedValueRef, value => {
        if (!Array.isArray(value) && value !== syncSource) textareaScrollbarInstRef.value?.syncUnifiedContainer();
      });else stopWatchMergedValue2?.();
    });
    provide(inputInjectionKey, {
      mergedValueRef,
      maxlengthRef,
      mergedClsPrefixRef,
      countGraphemesRef: toRef(props, "countGraphemes")
    });
    const exposedProps = {
      wrapperElRef,
      inputElRef,
      textareaElRef,
      isCompositing: isComposingRef,
      clear: clearValue,
      focus,
      blur,
      select,
      deactivate,
      activate,
      scrollTo
    };
    const rtlEnabledRef = useRtl("Input", mergedRtlRef, mergedClsPrefixRef);
    const cssVarsRef = computed(() => {
      const {
        value: size
      } = mergedSizeRef;
      const {
        common: {
          cubicBezierEaseInOut
        },
        self: {
          color,
          colorHover,
          borderRadius,
          textColor,
          caretColor,
          caretColorError,
          caretColorWarning,
          textDecorationColor,
          border,
          borderDisabled,
          borderHover,
          borderFocus,
          placeholderColor,
          placeholderColorDisabled,
          lineHeightTextarea,
          colorDisabled,
          colorFocus,
          textColorDisabled,
          boxShadowFocus,
          iconSize,
          colorFocusWarning,
          boxShadowFocusWarning,
          borderWarning,
          borderFocusWarning,
          borderHoverWarning,
          colorFocusError,
          boxShadowFocusError,
          borderError,
          borderFocusError,
          borderHoverError,
          clearSize,
          clearColor,
          clearColorHover,
          clearColorPressed,
          iconColor,
          iconColorDisabled,
          suffixTextColor,
          countTextColor,
          countTextColorDisabled,
          iconColorHover,
          iconColorPressed,
          loadingColor,
          loadingColorError,
          loadingColorWarning,
          fontWeight,
          [createKey("padding", size)]: padding,
          [createKey("fontSize", size)]: fontSize,
          [createKey("height", size)]: height
        }
      } = themeRef.value;
      const {
        left: paddingLeft,
        right: paddingRight
      } = getPadding(padding);
      return {
        "--n-bezier": cubicBezierEaseInOut,
        "--n-count-text-color": countTextColor,
        "--n-count-text-color-disabled": countTextColorDisabled,
        "--n-color": color,
        "--n-color-hover": colorHover,
        "--n-font-size": fontSize,
        "--n-font-weight": fontWeight,
        "--n-border-radius": borderRadius,
        "--n-height": height,
        "--n-padding-left": paddingLeft,
        "--n-padding-right": paddingRight,
        "--n-text-color": textColor,
        "--n-caret-color": caretColor,
        "--n-text-decoration-color": textDecorationColor,
        "--n-border": border,
        "--n-border-disabled": borderDisabled,
        "--n-border-hover": borderHover,
        "--n-border-focus": borderFocus,
        "--n-placeholder-color": placeholderColor,
        "--n-placeholder-color-disabled": placeholderColorDisabled,
        "--n-icon-size": iconSize,
        "--n-line-height-textarea": lineHeightTextarea,
        "--n-color-disabled": colorDisabled,
        "--n-color-focus": colorFocus,
        "--n-text-color-disabled": textColorDisabled,
        "--n-box-shadow-focus": boxShadowFocus,
        "--n-loading-color": loadingColor,
        "--n-caret-color-warning": caretColorWarning,
        "--n-color-focus-warning": colorFocusWarning,
        "--n-box-shadow-focus-warning": boxShadowFocusWarning,
        "--n-border-warning": borderWarning,
        "--n-border-focus-warning": borderFocusWarning,
        "--n-border-hover-warning": borderHoverWarning,
        "--n-loading-color-warning": loadingColorWarning,
        "--n-caret-color-error": caretColorError,
        "--n-color-focus-error": colorFocusError,
        "--n-box-shadow-focus-error": boxShadowFocusError,
        "--n-border-error": borderError,
        "--n-border-focus-error": borderFocusError,
        "--n-border-hover-error": borderHoverError,
        "--n-loading-color-error": loadingColorError,
        "--n-clear-color": clearColor,
        "--n-clear-size": clearSize,
        "--n-clear-color-hover": clearColorHover,
        "--n-clear-color-pressed": clearColorPressed,
        "--n-icon-color": iconColor,
        "--n-icon-color-hover": iconColorHover,
        "--n-icon-color-pressed": iconColorPressed,
        "--n-icon-color-disabled": iconColorDisabled,
        "--n-suffix-text-color": suffixTextColor
      };
    });
    const themeClassHandle = inlineThemeDisabled ? useThemeClass("input", computed(() => {
      const {
        value: size
      } = mergedSizeRef;
      return size[0];
    }), cssVarsRef, props) : void 0;
    return {
      ...exposedProps,
      wrapperElRef,
      inputElRef,
      inputMirrorElRef,
      inputEl2Ref,
      textareaElRef,
      textareaMirrorElRef,
      textareaScrollbarInstRef,
      rtlEnabled: rtlEnabledRef,
      uncontrolledValue: uncontrolledValueRef,
      mergedValue: mergedValueRef,
      passwordVisible: passwordVisibleRef,
      mergedPlaceholder: mergedPlaceholderRef,
      showPlaceholder1: showPlaceholder1Ref,
      showPlaceholder2: showPlaceholder2Ref,
      mergedFocus: mergedFocusRef,
      isComposing: isComposingRef,
      activated: activatedRef,
      showClearButton,
      mergedSize: mergedSizeRef,
      mergedDisabled: mergedDisabledRef,
      textDecorationStyle: textDecorationStyleRef,
      mergedClsPrefix: mergedClsPrefixRef,
      mergedBordered: mergedBorderedRef,
      mergedShowPasswordOn: mergedShowPasswordOnRef,
      placeholderStyle: placeholderStyleRef,
      mergedStatus: mergedStatusRef,
      textAreaScrollContainerWidth: textAreaScrollContainerWidthRef,
      handleTextAreaScroll,
      handleCompositionStart,
      handleCompositionEnd,
      handleInput,
      handleInputBlur,
      handleInputFocus,
      handleWrapperBlur,
      handleWrapperFocus,
      handleMouseEnter,
      handleMouseLeave,
      handleMouseDown,
      handleChange,
      handleClick,
      handleClear,
      handlePasswordToggleClick,
      handlePasswordToggleMousedown,
      handleWrapperKeydown,
      handleWrapperKeyup,
      handleTextAreaMirrorResize,
      getTextareaScrollContainer: () => {
        return textareaElRef.value;
      },
      mergedTheme: themeRef,
      cssVars: inlineThemeDisabled ? void 0 : cssVarsRef,
      themeClass: themeClassHandle?.themeClass,
      onRender: themeClassHandle?.onRender
    };
  },
  render() {
    const {
      mergedClsPrefix,
      mergedStatus,
      themeClass,
      type,
      countGraphemes,
      onRender
    } = this;
    const $slots = this.$slots;
    onRender?.();
    return openBlock(), createElementBlock("div", {
      ref: "wrapperElRef",
      class: normalizeClass$1([`${mergedClsPrefix}-input`, `${mergedClsPrefix}-input--${this.mergedSize}-size`, themeClass, mergedStatus && `${mergedClsPrefix}-input--${mergedStatus}-status`, {
        [`${mergedClsPrefix}-input--rtl`]: this.rtlEnabled,
        [`${mergedClsPrefix}-input--disabled`]: this.mergedDisabled,
        [`${mergedClsPrefix}-input--textarea`]: type === "textarea",
        [`${mergedClsPrefix}-input--resizable`]: this.resizable && !this.autosize,
        [`${mergedClsPrefix}-input--autosize`]: this.autosize,
        [`${mergedClsPrefix}-input--round`]: this.round && !(type === "textarea"),
        [`${mergedClsPrefix}-input--pair`]: this.pair,
        [`${mergedClsPrefix}-input--focus`]: this.mergedFocus,
        [`${mergedClsPrefix}-input--stateful`]: this.stateful
      }]),
      style: normalizeStyle(this.cssVars),
      tabindex: !this.mergedDisabled && this.passivelyActivated && !this.activated ? 0 : void 0,
      onFocus: this.handleWrapperFocus,
      onBlur: this.handleWrapperBlur,
      onClick: this.handleClick,
      onMousedown: this.handleMouseDown,
      onMouseenter: this.handleMouseEnter,
      onMouseleave: this.handleMouseLeave,
      onCompositionstart: this.handleCompositionStart,
      onCompositionend: this.handleCompositionEnd,
      onKeyup: this.handleWrapperKeyup,
      onKeydown: this.handleWrapperKeydown
    }, [createElementVNode("div", {
      class: normalizeClass$1(`${mergedClsPrefix}-input-wrapper`)
    }, [normalizeVNode(() => resolveWrappedSlot($slots.prefix, children => children && (openBlock(), createElementBlock("div", {
      class: normalizeClass$1(`${mergedClsPrefix}-input__prefix`)
    }, [normalizeVNode(() => children)], 2)))), type === "textarea" ? (openBlock(), createBlock(Scrollbar, {
      key: 0,
      ref: "textareaScrollbarInstRef",
      class: normalizeClass$1(`${mergedClsPrefix}-input__textarea`),
      container: this.getTextareaScrollContainer,
      theme: this.theme?.peers?.Scrollbar,
      themeOverrides: this.themeOverrides?.peers?.Scrollbar,
      triggerDisplayManually: true,
      useUnifiedContainer: true,
      internalHoistYRail: true
    }, {
      default: () => {
        const {
          textAreaScrollContainerWidth
        } = this;
        const scrollContainerWidthStyle = {
          width: this.autosize && textAreaScrollContainerWidth && `${textAreaScrollContainerWidth}px`
        };
        return openBlock(), createElementBlock(Fragment, null, [createElementVNode("textarea", mergeProps(this.inputProps, {
          ref: "textareaElRef",
          class: [`${mergedClsPrefix}-input__textarea-el`, this.inputProps?.class],
          autofocus: this.autofocus,
          rows: Number(this.rows),
          placeholder: this.placeholder,
          value: this.mergedValue,
          disabled: this.mergedDisabled,
          maxlength: countGraphemes ? void 0 : this.maxlength,
          minlength: countGraphemes ? void 0 : this.minlength,
          readonly: this.readonly,
          tabindex: this.passivelyActivated && !this.activated ? -1 : void 0,
          style: [this.textDecorationStyle[0], this.inputProps?.style, scrollContainerWidthStyle],
          onBlur: this.handleInputBlur,
          onFocus: e => {
            this.handleInputFocus(e, 2);
          },
          onInput: this.handleInput,
          onChange: this.handleChange,
          onScroll: this.handleTextAreaScroll
        }), null, 16, _hoisted_1), this.showPlaceholder1 ? (openBlock(), createElementBlock("div", {
          class: normalizeClass$1(`${mergedClsPrefix}-input__placeholder`),
          style: normalizeStyle([this.placeholderStyle, scrollContainerWidthStyle]),
          key: "placeholder"
        }, [normalizeVNode(() => this.mergedPlaceholder[0])], 6)) : normalizeVNode(() => null), this.autosize ? (openBlock(), createBlock(VResizeObserver, {
          key: 2,
          onResize: this.handleTextAreaMirrorResize
        }, {
          default: () => (openBlock(), createElementBlock("div", {
            ref: "textareaMirrorElRef",
            class: normalizeClass$1(`${mergedClsPrefix}-input__textarea-mirror`),
            key: "mirror"
          }, null, 2))
        }, 1032, ["onResize"])) : normalizeVNode(() => null)], 64);
      }
    }, 1032, ["class", "container", "theme", "themeOverrides"])) : (openBlock(), createElementBlock("div", {
      key: 1,
      class: normalizeClass$1(`${mergedClsPrefix}-input__input`)
    }, [createElementVNode("input", mergeProps({
      type: type === "password" && this.mergedShowPasswordOn && this.passwordVisible ? "text" : type
    }, this.inputProps, {
      ref: "inputElRef",
      class: [`${mergedClsPrefix}-input__input-el`, this.inputProps?.class],
      style: [this.textDecorationStyle[0], this.inputProps?.style],
      tabindex: this.passivelyActivated && !this.activated ? -1 : this.inputProps?.tabindex,
      placeholder: this.mergedPlaceholder[0],
      disabled: this.mergedDisabled,
      maxlength: countGraphemes ? void 0 : this.maxlength,
      minlength: countGraphemes ? void 0 : this.minlength,
      value: Array.isArray(this.mergedValue) ? this.mergedValue[0] : this.mergedValue,
      readonly: this.readonly,
      autofocus: this.autofocus,
      size: this.attrSize,
      onBlur: this.handleInputBlur,
      onFocus: e => {
        this.handleInputFocus(e, 0);
      },
      onInput: e => {
        this.handleInput(e, 0);
      },
      onChange: e => {
        this.handleChange(e, 0);
      }
    }), null, 16, _hoisted_2), this.showPlaceholder1 ? (openBlock(), createElementBlock("div", {
      key: 0,
      class: normalizeClass$1(`${mergedClsPrefix}-input__placeholder`)
    }, [createElementVNode("span", null, [normalizeVNode(() => this.mergedPlaceholder[0])])], 2)) : normalizeVNode(() => null), this.autosize ? (openBlock(), createElementBlock("div", {
      class: normalizeClass$1(`${mergedClsPrefix}-input__input-mirror`),
      key: "mirror",
      ref: "inputMirrorElRef"
    }, "\xA0", 2)) : normalizeVNode(() => null)], 2)), normalizeVNode(() => !this.pair && resolveWrappedSlot($slots.suffix, children => {
      return children || this.clearable || this.showCount || this.mergedShowPasswordOn || this.loading !== void 0 ? (openBlock(), createElementBlock("div", {
        key: 1,
        class: normalizeClass$1(`${mergedClsPrefix}-input__suffix`)
      }, [normalizeVNode(() => [resolveWrappedSlot($slots["clear-icon-placeholder"], children => {
        return (this.clearable || children) && (openBlock(), createBlock(Clear_default, {
          clsPrefix: mergedClsPrefix,
          show: this.showClearButton,
          onClear: this.handleClear
        }, {
          placeholder: () => children,
          icon: () => this.$slots["clear-icon"]?.()
        }, 1032, ["clsPrefix", "show", "onClear"]));
      }), !this.internalLoadingBeforeSuffix ? children : null, this.loading !== void 0 ? (openBlock(), createBlock(Suffix_default, {
        key: 2,
        clsPrefix: mergedClsPrefix,
        loading: this.loading,
        showArrow: false,
        showClear: false,
        style: normalizeStyle(this.cssVars)
      }, null, 8, ["clsPrefix", "loading", "style"])) : null, this.internalLoadingBeforeSuffix ? children : null, this.showCount && this.type !== "textarea" ? (openBlock(), createBlock(WordCount_default, {
        key: 3
      }, {
        default: props => {
          const {
            renderCount
          } = this;
          if (renderCount) return renderCount(props);
          return $slots.count?.(props);
        }
      }, 1024)) : null, this.mergedShowPasswordOn && this.type === "password" ? (openBlock(), createElementBlock("div", {
        key: 4,
        class: normalizeClass$1(`${mergedClsPrefix}-input__eye`),
        onMousedown: this.handlePasswordToggleMousedown,
        onClick: this.handlePasswordToggleClick
      }, [this.passwordVisible ? (openBlock(), createElementBlock(Fragment, {
        key: 0
      }, [normalizeVNode(() => resolveSlot($slots["password-visible-icon"], () => [(openBlock(), createBlock(Icon_default, {
        clsPrefix: mergedClsPrefix
      }, {
        default: () => (openBlock(), createBlock(Eye_default))
      }, 1032, ["clsPrefix"]))]))], 64)) : (openBlock(), createElementBlock(Fragment, {
        key: 1
      }, [normalizeVNode(() => resolveSlot($slots["password-invisible-icon"], () => [(openBlock(), createBlock(Icon_default, {
        clsPrefix: mergedClsPrefix
      }, {
        default: () => (openBlock(), createBlock(EyeOff_default))
      }, 1032, ["clsPrefix"]))]))], 64))], 42, _hoisted_3)) : null])], 2)) : null;
    }))], 2), this.pair ? (openBlock(), createElementBlock("span", {
      key: 0,
      class: normalizeClass$1(`${mergedClsPrefix}-input__separator`)
    }, [normalizeVNode(() => resolveSlot($slots.separator, () => [this.separator]))], 2)) : normalizeVNode(() => null), this.pair ? (openBlock(), createElementBlock("div", {
      key: 2,
      class: normalizeClass$1(`${mergedClsPrefix}-input-wrapper`)
    }, [createElementVNode("div", {
      class: normalizeClass$1(`${mergedClsPrefix}-input__input`)
    }, [createElementVNode("input", {
      ref: "inputEl2Ref",
      type: this.type,
      class: normalizeClass$1(`${mergedClsPrefix}-input__input-el`),
      tabindex: this.passivelyActivated && !this.activated ? -1 : void 0,
      placeholder: this.mergedPlaceholder[1],
      disabled: this.mergedDisabled,
      maxlength: countGraphemes ? void 0 : this.maxlength,
      minlength: countGraphemes ? void 0 : this.minlength,
      value: Array.isArray(this.mergedValue) ? this.mergedValue[1] : void 0,
      readonly: this.readonly,
      style: normalizeStyle(this.textDecorationStyle[1]),
      onBlur: this.handleInputBlur,
      onFocus: e => {
        this.handleInputFocus(e, 1);
      },
      onInput: e => {
        this.handleInput(e, 1);
      },
      onChange: e => {
        this.handleChange(e, 1);
      }
    }, null, 46, _hoisted_4), this.showPlaceholder2 ? (openBlock(), createElementBlock("div", {
      key: 0,
      class: normalizeClass$1(`${mergedClsPrefix}-input__placeholder`)
    }, [createElementVNode("span", null, [normalizeVNode(() => this.mergedPlaceholder[1])])], 2)) : normalizeVNode(() => null)], 2), normalizeVNode(() => resolveWrappedSlot($slots.suffix, children => {
      return (this.clearable || children) && (openBlock(), createElementBlock("div", {
        class: normalizeClass$1(`${mergedClsPrefix}-input__suffix`)
      }, [normalizeVNode(() => [this.clearable && (openBlock(), createBlock(Clear_default, {
        clsPrefix: mergedClsPrefix,
        show: this.showClearButton,
        onClear: this.handleClear
      }, {
        icon: () => $slots["clear-icon"]?.(),
        placeholder: () => $slots["clear-icon-placeholder"]?.()
      }, 1032, ["clsPrefix", "show", "onClear"])), children])], 2));
    }))], 2)) : normalizeVNode(() => null), this.mergedBordered ? (openBlock(), createElementBlock("div", {
      key: 4,
      class: normalizeClass$1(`${mergedClsPrefix}-input__border`)
    }, null, 2)) : normalizeVNode(() => null), this.mergedBordered ? (openBlock(), createElementBlock("div", {
      key: 6,
      class: normalizeClass$1(`${mergedClsPrefix}-input__state-border`)
    }, null, 2)) : normalizeVNode(() => null), this.showCount && type === "textarea" ? (openBlock(), createBlock(WordCount_default, {
      key: 8
    }, {
      default: props => {
        const {
          renderCount
        } = this;
        if (renderCount) return renderCount(props);
        return $slots.count?.(props);
      }
    }, 1024)) : normalizeVNode(() => null)], 46, _hoisted_5);
  }
});
//#endregion
export { Input_default as default, inputProps };