import { useOnResize } from "../../../_utils/composable/use-resize.mjs";
import { createKey } from "../../../_utils/cssr/index.mjs";
import { getTitleAttribute } from "../../../_utils/naive/attribute.mjs";
import { render } from "../../../_utils/vue/render.mjs";
import { Wrapper } from "../../../_utils/vue/wrapper.mjs";
import useConfig from "../../../_mixins/use-config.mjs";
import { useThemeClass } from "../../../_mixins/use-css-vars-class.mjs";
import { useRtl } from "../../../_mixins/use-rtl.mjs";
import useTheme from "../../../_mixins/use-theme.mjs";
import { normalizeClass as normalizeClass$1, normalizeVNode } from "../../../vue-jsx-vapor/vdom.mjs";
import Popover_default from "../../../popover/src/Popover.mjs";
import Tag_default from "../../../tag/src/Tag.mjs";
import Suffix_default from "../../suffix/src/Suffix.mjs";
import internalSelectionLight from "../styles/light.mjs";
import index_cssr_default from "./styles/index.cssr.mjs";
import { getPadding } from "seemly";
import { Fragment, computed, createBlock, createElementBlock, createElementVNode, defineComponent, mergeProps, nextTick, normalizeStyle, onMounted, openBlock, ref, toRef, watch, watchEffect } from "vue";
import { VOverflow } from "vueuc";
//#region src/_internal/selection/src/Selection.tsx
const _hoisted_1 = ["disabled", "value", "autofocus", "onBlur", "onFocus", "onKeydown", "onInput", "onCompositionstart", "onCompositionend"];
const _hoisted_2 = ["tabindex"];
const _hoisted_3 = ["title"];
const _hoisted_4 = ["value", "readonly", "disabled", "autofocus", "onFocus", "onBlur", "onInput", "onCompositionstart", "onCompositionend"];
const _hoisted_5 = ["tabindex"];
const _hoisted_6 = ["onClick", "onMouseenter", "onMouseleave", "onKeydown", "onFocusin", "onFocusout", "onMousedown"];
var Selection_default = defineComponent({
  name: "InternalSelection",
  props: {
    ...useTheme.props,
    clsPrefix: {
      type: String,
      required: true
    },
    bordered: {
      type: Boolean,
      default: void 0
    },
    active: Boolean,
    pattern: {
      type: String,
      default: ""
    },
    placeholder: String,
    selectedOption: {
      type: Object,
      default: null
    },
    selectedOptions: {
      type: Array,
      default: null
    },
    labelField: {
      type: String,
      default: "label"
    },
    valueField: {
      type: String,
      default: "value"
    },
    multiple: Boolean,
    filterable: Boolean,
    clearable: Boolean,
    disabled: Boolean,
    size: {
      type: String,
      default: "medium"
    },
    loading: Boolean,
    autofocus: Boolean,
    showArrow: {
      type: Boolean,
      default: true
    },
    inputProps: Object,
    focused: Boolean,
    renderTag: Function,
    onKeydown: Function,
    onClick: Function,
    onBlur: Function,
    onFocus: Function,
    onDeleteOption: Function,
    maxTagCount: [String, Number],
    ellipsisTagPopoverProps: Object,
    onClear: Function,
    onPatternInput: Function,
    onPatternFocus: Function,
    onPatternBlur: Function,
    renderLabel: Function,
    status: String,
    inlineThemeDisabled: Boolean,
    ignoreComposition: {
      type: Boolean,
      default: true
    },
    onResize: Function
  },
  setup(props) {
    const {
      mergedClsPrefixRef,
      mergedRtlRef
    } = useConfig(props);
    const rtlEnabledRef = useRtl("InternalSelection", mergedRtlRef, mergedClsPrefixRef);
    const patternInputMirrorRef = ref(null);
    const patternInputRef = ref(null);
    const selfRef = ref(null);
    const multipleElRef = ref(null);
    const singleElRef = ref(null);
    const patternInputWrapperRef = ref(null);
    const counterRef = ref(null);
    const counterWrapperRef = ref(null);
    const overflowRef = ref(null);
    const inputTagElRef = ref(null);
    const showTagsPopoverRef = ref(false);
    const patternInputFocusedRef = ref(false);
    const hoverRef = ref(false);
    const themeRef = useTheme("InternalSelection", "-internal-selection", index_cssr_default, internalSelectionLight, props, toRef(props, "clsPrefix"));
    const mergedClearableRef = computed(() => {
      return props.clearable && !props.disabled && (hoverRef.value || props.active);
    });
    const filterablePlaceholderRef = computed(() => {
      return props.selectedOption ? props.renderTag ? props.renderTag({
        option: props.selectedOption,
        handleClose: () => {}
      }) : props.renderLabel ? props.renderLabel(props.selectedOption, true) : render(props.selectedOption[props.labelField], props.selectedOption, true) : props.placeholder;
    });
    const labelRef = computed(() => {
      const option = props.selectedOption;
      if (!option) return void 0;
      return option[props.labelField];
    });
    const selectedRef = computed(() => {
      if (props.multiple) return !!(Array.isArray(props.selectedOptions) && props.selectedOptions.length);else return props.selectedOption !== null;
    });
    function syncMirrorWidth() {
      const {
        value: patternInputMirrorEl
      } = patternInputMirrorRef;
      if (patternInputMirrorEl) {
        const {
          value: patternInputEl
        } = patternInputRef;
        if (patternInputEl) {
          patternInputEl.style.width = `${patternInputMirrorEl.offsetWidth}px`;
          if (props.maxTagCount !== "responsive") overflowRef.value?.sync({
            showAllItemsBeforeCalculate: false
          });
        }
      }
    }
    function hideInputTag() {
      const {
        value: inputTagEl
      } = inputTagElRef;
      if (inputTagEl) inputTagEl.style.display = "none";
    }
    function showInputTag() {
      const {
        value: inputTagEl
      } = inputTagElRef;
      if (inputTagEl) inputTagEl.style.display = "inline-block";
    }
    watch(toRef(props, "active"), value => {
      if (!value) hideInputTag();
    });
    watch(toRef(props, "pattern"), () => {
      if (props.multiple) nextTick(syncMirrorWidth);
    });
    function doFocus(e) {
      const {
        onFocus
      } = props;
      if (onFocus) onFocus(e);
    }
    function doBlur(e) {
      const {
        onBlur
      } = props;
      if (onBlur) onBlur(e);
    }
    function doDeleteOption(value) {
      const {
        onDeleteOption
      } = props;
      if (onDeleteOption) onDeleteOption(value);
    }
    function doClear(e) {
      const {
        onClear
      } = props;
      if (onClear) onClear(e);
    }
    function doPatternInput(value) {
      const {
        onPatternInput
      } = props;
      if (onPatternInput) onPatternInput(value);
    }
    function handleFocusin(e) {
      if (!e.relatedTarget || !selfRef.value?.contains(e.relatedTarget)) doFocus(e);
    }
    function handleFocusout(e) {
      if (selfRef.value?.contains(e.relatedTarget)) return;
      doBlur(e);
    }
    function handleClear(e) {
      doClear(e);
    }
    function handleMouseEnter() {
      hoverRef.value = true;
    }
    function handleMouseLeave() {
      hoverRef.value = false;
    }
    function handleMouseDown(e) {
      if (!props.active || !props.filterable) return;
      if (e.target === patternInputRef.value) return;
      e.preventDefault();
    }
    function handleDeleteOption(option) {
      doDeleteOption(option);
    }
    const isComposingRef = ref(false);
    function handlePatternKeyDown(e) {
      if (e.key === "Backspace" && !isComposingRef.value) {
        if (!props.pattern.length) {
          const {
            selectedOptions
          } = props;
          if (selectedOptions?.length) handleDeleteOption(selectedOptions[selectedOptions.length - 1]);
        }
      }
    }
    let cachedInputEvent = null;
    function handlePatternInputInput(e) {
      const {
        value: patternInputMirrorEl
      } = patternInputMirrorRef;
      if (patternInputMirrorEl) {
        patternInputMirrorEl.textContent = e.target.value;
        syncMirrorWidth();
      }
      if (props.ignoreComposition) {
        if (!isComposingRef.value) doPatternInput(e);else cachedInputEvent = e;
      } else doPatternInput(e);
    }
    function handleCompositionStart() {
      isComposingRef.value = true;
    }
    function handleCompositionEnd() {
      isComposingRef.value = false;
      if (props.ignoreComposition) doPatternInput(cachedInputEvent);
      cachedInputEvent = null;
    }
    function handlePatternInputFocus(e) {
      patternInputFocusedRef.value = true;
      props.onPatternFocus?.(e);
    }
    function handlePatternInputBlur(e) {
      patternInputFocusedRef.value = false;
      props.onPatternBlur?.(e);
    }
    function blur() {
      if (props.filterable) {
        patternInputFocusedRef.value = false;
        patternInputWrapperRef.value?.blur();
        patternInputRef.value?.blur();
      } else if (props.multiple) {
        const {
          value: multipleEl
        } = multipleElRef;
        multipleEl?.blur();
      } else {
        const {
          value: singleEl
        } = singleElRef;
        singleEl?.blur();
      }
    }
    function focus() {
      if (props.filterable) {
        patternInputFocusedRef.value = false;
        patternInputWrapperRef.value?.focus();
      } else if (props.multiple) multipleElRef.value?.focus();else singleElRef.value?.focus();
    }
    function focusInput() {
      const {
        value: patternInputEl
      } = patternInputRef;
      if (patternInputEl) {
        showInputTag();
        patternInputEl.focus();
      }
    }
    function blurInput() {
      const {
        value: patternInputEl
      } = patternInputRef;
      if (patternInputEl) patternInputEl.blur();
    }
    function updateCounter(count) {
      const {
        value
      } = counterRef;
      if (value) value.setTextContent(`+${count}`);
    }
    function getCounter() {
      const {
        value
      } = counterWrapperRef;
      return value;
    }
    function getTail() {
      return patternInputRef.value;
    }
    let enterTimerId = null;
    function clearEnterTimer() {
      if (enterTimerId !== null) window.clearTimeout(enterTimerId);
    }
    function handleMouseEnterCounter() {
      if (props.active) return;
      clearEnterTimer();
      enterTimerId = window.setTimeout(() => {
        if (selectedRef.value) showTagsPopoverRef.value = true;
      }, 100);
    }
    function handleMouseLeaveCounter() {
      clearEnterTimer();
    }
    function onPopoverUpdateShow(show) {
      if (!show) {
        clearEnterTimer();
        showTagsPopoverRef.value = false;
      }
    }
    watch(selectedRef, value => {
      if (!value) showTagsPopoverRef.value = false;
    });
    onMounted(() => {
      watchEffect(() => {
        const patternInputWrapperEl = patternInputWrapperRef.value;
        if (!patternInputWrapperEl) return;
        if (props.disabled) patternInputWrapperEl.removeAttribute("tabindex");else patternInputWrapperEl.tabIndex = patternInputFocusedRef.value ? -1 : 0;
      });
    });
    useOnResize(selfRef, props.onResize);
    const {
      inlineThemeDisabled
    } = props;
    const cssVarsRef = computed(() => {
      const {
        size
      } = props;
      const {
        common: {
          cubicBezierEaseInOut
        },
        self: {
          fontWeight,
          borderRadius,
          color,
          placeholderColor,
          textColor,
          paddingSingle,
          paddingMultiple,
          caretColor,
          colorDisabled,
          textColorDisabled,
          placeholderColorDisabled,
          colorActive,
          boxShadowFocus,
          boxShadowActive,
          boxShadowHover,
          border,
          borderFocus,
          borderHover,
          borderActive,
          arrowColor,
          arrowColorDisabled,
          loadingColor,
          colorActiveWarning,
          boxShadowFocusWarning,
          boxShadowActiveWarning,
          boxShadowHoverWarning,
          borderWarning,
          borderFocusWarning,
          borderHoverWarning,
          borderActiveWarning,
          colorActiveError,
          boxShadowFocusError,
          boxShadowActiveError,
          boxShadowHoverError,
          borderError,
          borderFocusError,
          borderHoverError,
          borderActiveError,
          clearColor,
          clearColorHover,
          clearColorPressed,
          clearSize,
          arrowSize,
          [createKey("height", size)]: height,
          [createKey("fontSize", size)]: fontSize
        }
      } = themeRef.value;
      const paddingSingleDiscrete = getPadding(paddingSingle);
      const paddingMultipleDiscrete = getPadding(paddingMultiple);
      return {
        "--n-bezier": cubicBezierEaseInOut,
        "--n-border": border,
        "--n-border-active": borderActive,
        "--n-border-focus": borderFocus,
        "--n-border-hover": borderHover,
        "--n-border-radius": borderRadius,
        "--n-box-shadow-active": boxShadowActive,
        "--n-box-shadow-focus": boxShadowFocus,
        "--n-box-shadow-hover": boxShadowHover,
        "--n-caret-color": caretColor,
        "--n-color": color,
        "--n-color-active": colorActive,
        "--n-color-disabled": colorDisabled,
        "--n-font-size": fontSize,
        "--n-height": height,
        "--n-padding-single-top": paddingSingleDiscrete.top,
        "--n-padding-multiple-top": paddingMultipleDiscrete.top,
        "--n-padding-single-right": paddingSingleDiscrete.right,
        "--n-padding-multiple-right": paddingMultipleDiscrete.right,
        "--n-padding-single-left": paddingSingleDiscrete.left,
        "--n-padding-multiple-left": paddingMultipleDiscrete.left,
        "--n-padding-single-bottom": paddingSingleDiscrete.bottom,
        "--n-padding-multiple-bottom": paddingMultipleDiscrete.bottom,
        "--n-placeholder-color": placeholderColor,
        "--n-placeholder-color-disabled": placeholderColorDisabled,
        "--n-text-color": textColor,
        "--n-text-color-disabled": textColorDisabled,
        "--n-arrow-color": arrowColor,
        "--n-arrow-color-disabled": arrowColorDisabled,
        "--n-loading-color": loadingColor,
        "--n-color-active-warning": colorActiveWarning,
        "--n-box-shadow-focus-warning": boxShadowFocusWarning,
        "--n-box-shadow-active-warning": boxShadowActiveWarning,
        "--n-box-shadow-hover-warning": boxShadowHoverWarning,
        "--n-border-warning": borderWarning,
        "--n-border-focus-warning": borderFocusWarning,
        "--n-border-hover-warning": borderHoverWarning,
        "--n-border-active-warning": borderActiveWarning,
        "--n-color-active-error": colorActiveError,
        "--n-box-shadow-focus-error": boxShadowFocusError,
        "--n-box-shadow-active-error": boxShadowActiveError,
        "--n-box-shadow-hover-error": boxShadowHoverError,
        "--n-border-error": borderError,
        "--n-border-focus-error": borderFocusError,
        "--n-border-hover-error": borderHoverError,
        "--n-border-active-error": borderActiveError,
        "--n-clear-size": clearSize,
        "--n-clear-color": clearColor,
        "--n-clear-color-hover": clearColorHover,
        "--n-clear-color-pressed": clearColorPressed,
        "--n-arrow-size": arrowSize,
        "--n-font-weight": fontWeight
      };
    });
    const themeClassHandle = inlineThemeDisabled ? useThemeClass("internal-selection", computed(() => {
      return props.size[0];
    }), cssVarsRef, props) : void 0;
    return {
      mergedTheme: themeRef,
      mergedClearable: mergedClearableRef,
      mergedClsPrefix: mergedClsPrefixRef,
      rtlEnabled: rtlEnabledRef,
      patternInputFocused: patternInputFocusedRef,
      filterablePlaceholder: filterablePlaceholderRef,
      label: labelRef,
      selected: selectedRef,
      showTagsPanel: showTagsPopoverRef,
      isComposing: isComposingRef,
      counterRef,
      counterWrapperRef,
      patternInputMirrorRef,
      patternInputRef,
      selfRef,
      multipleElRef,
      singleElRef,
      patternInputWrapperRef,
      overflowRef,
      inputTagElRef,
      handleMouseDown,
      handleFocusin,
      handleClear,
      handleMouseEnter,
      handleMouseLeave,
      handleDeleteOption,
      handlePatternKeyDown,
      handlePatternInputInput,
      handlePatternInputBlur,
      handlePatternInputFocus,
      handleMouseEnterCounter,
      handleMouseLeaveCounter,
      handleFocusout,
      handleCompositionEnd,
      handleCompositionStart,
      onPopoverUpdateShow,
      focus,
      focusInput,
      blur,
      blurInput,
      updateCounter,
      getCounter,
      getTail,
      renderLabel: props.renderLabel,
      cssVars: inlineThemeDisabled ? void 0 : cssVarsRef,
      themeClass: themeClassHandle?.themeClass,
      onRender: themeClassHandle?.onRender
    };
  },
  render() {
    const {
      status,
      multiple,
      size,
      disabled,
      filterable,
      maxTagCount,
      bordered,
      clsPrefix,
      ellipsisTagPopoverProps,
      onRender,
      renderTag,
      renderLabel
    } = this;
    onRender?.();
    const maxTagCountResponsive = maxTagCount === "responsive";
    const maxTagCountNumeric = typeof maxTagCount === "number";
    const useMaxTagCount = maxTagCountResponsive || maxTagCountNumeric;
    const suffix = (openBlock(), createBlock(Wrapper, null, {
      default: () => (openBlock(), createBlock(Suffix_default, {
        clsPrefix,
        loading: this.loading,
        showArrow: this.showArrow,
        showClear: this.mergedClearable && this.selected,
        onClear: this.handleClear
      }, {
        default: () => this.$slots.arrow?.()
      }, 1032, ["clsPrefix", "loading", "showArrow", "showClear", "onClear"]))
    }, 1024));
    let body;
    if (multiple) {
      const {
        labelField
      } = this;
      const createTag = option => (openBlock(), createElementBlock("div", {
        class: normalizeClass$1(`${clsPrefix}-base-selection-tag-wrapper`),
        key: option.value
      }, [renderTag ? (openBlock(), createElementBlock(Fragment, {
        key: 0
      }, [normalizeVNode(() => renderTag({
        option,
        handleClose: () => {
          this.handleDeleteOption(option);
        }
      }))], 64)) : (openBlock(), createBlock(Tag_default, {
        key: 1,
        size,
        closable: !option.disabled,
        disabled,
        onClose: () => {
          this.handleDeleteOption(option);
        },
        internalCloseIsButtonTag: false,
        internalCloseFocusable: false
      }, {
        default: () => renderLabel ? renderLabel(option, true) : render(option[labelField], option, true)
      }, 1032, ["size", "closable", "disabled", "onClose"]))], 2));
      const createOriginalTagNodes = () => (maxTagCountNumeric ? this.selectedOptions.slice(0, maxTagCount) : this.selectedOptions).map(createTag);
      const input = filterable ? (openBlock(), createElementBlock("div", {
        class: normalizeClass$1(`${clsPrefix}-base-selection-input-tag`),
        ref: "inputTagElRef",
        key: "__input-tag__"
      }, [createElementVNode("input", mergeProps(this.inputProps, {
        ref: "patternInputRef",
        tabindex: -1,
        disabled,
        value: this.pattern,
        autofocus: this.autofocus,
        class: `${clsPrefix}-base-selection-input-tag__input`,
        onBlur: this.handlePatternInputBlur,
        onFocus: this.handlePatternInputFocus,
        onKeydown: this.handlePatternKeyDown,
        onInput: this.handlePatternInputInput,
        onCompositionstart: this.handleCompositionStart,
        onCompositionend: this.handleCompositionEnd
      }), null, 16, _hoisted_1), createElementVNode("span", {
        ref: "patternInputMirrorRef",
        class: normalizeClass$1(`${clsPrefix}-base-selection-input-tag__mirror`)
      }, [normalizeVNode(() => this.pattern)], 2)], 2)) : null;
      const renderCounter = maxTagCountResponsive ? () => (openBlock(), createElementBlock("div", {
        class: normalizeClass$1(`${clsPrefix}-base-selection-tag-wrapper`),
        ref: "counterWrapperRef"
      }, [(openBlock(), createBlock(Tag_default, {
        size,
        ref: "counterRef",
        onMouseenter: this.handleMouseEnterCounter,
        onMouseleave: this.handleMouseLeaveCounter,
        disabled
      }, null, 8, ["size", "onMouseenter", "onMouseleave", "disabled"]))], 2)) : void 0;
      let counter;
      if (maxTagCountNumeric) {
        const rest = this.selectedOptions.length - maxTagCount;
        if (rest > 0) counter = (counter => {
          return openBlock(), createElementBlock("div", {
            class: normalizeClass$1(`${clsPrefix}-base-selection-tag-wrapper`),
            key: "__counter__"
          }, [(openBlock(), createBlock(Tag_default, {
            size,
            ref: "counterRef",
            onMouseenter: this.handleMouseEnterCounter,
            disabled
          }, {
            default: () => `+${rest}`
          }, 1032, ["size", "onMouseenter", "disabled"]))], 2);
        })(counter);
      }
      const tags = maxTagCountResponsive ? filterable ? (openBlock(), createBlock(VOverflow, {
        key: 3,
        ref: "overflowRef",
        updateCounter: this.updateCounter,
        getCounter: this.getCounter,
        getTail: this.getTail,
        style: {
          width: "100%",
          display: "flex",
          overflow: "hidden"
        }
      }, {
        default: createOriginalTagNodes,
        counter: renderCounter,
        tail: () => input
      }, 1032, ["updateCounter", "getCounter", "getTail"])) : (openBlock(), createBlock(VOverflow, {
        key: 4,
        ref: "overflowRef",
        updateCounter: this.updateCounter,
        getCounter: this.getCounter,
        style: {
          width: "100%",
          display: "flex",
          overflow: "hidden"
        }
      }, {
        default: createOriginalTagNodes,
        counter: renderCounter
      }, 1032, ["updateCounter", "getCounter"])) : maxTagCountNumeric && counter ? createOriginalTagNodes().concat(counter) : createOriginalTagNodes();
      const renderPopover = useMaxTagCount ? () => (openBlock(), createElementBlock("div", {
        class: normalizeClass$1(`${clsPrefix}-base-selection-popover`)
      }, [maxTagCountResponsive ? (openBlock(), createElementBlock(Fragment, {
        key: 0
      }, [normalizeVNode(() => createOriginalTagNodes())], 64)) : (openBlock(), createElementBlock(Fragment, {
        key: 1
      }, [normalizeVNode(() => this.selectedOptions.map(createTag))], 64))], 2)) : void 0;
      const popoverProps = useMaxTagCount ? {
        show: this.showTagsPanel,
        trigger: "hover",
        overlap: true,
        placement: "top",
        width: "trigger",
        onUpdateShow: this.onPopoverUpdateShow,
        theme: this.mergedTheme.peers.Popover,
        themeOverrides: this.mergedTheme.peerOverrides.Popover,
        ...ellipsisTagPopoverProps
      } : null;
      const placeholder = (this.selected ? false : this.active ? !this.pattern && !this.isComposing : true) ? (openBlock(), createElementBlock("div", {
        key: 5,
        class: normalizeClass$1(`${clsPrefix}-base-selection-placeholder ${clsPrefix}-base-selection-overlay`)
      }, [createElementVNode("div", {
        class: normalizeClass$1(`${clsPrefix}-base-selection-placeholder__inner`)
      }, [normalizeVNode(() => this.placeholder)], 2)], 2)) : null;
      const popoverTrigger = filterable ? (openBlock(), createElementBlock("div", {
        key: 6,
        ref: "patternInputWrapperRef",
        class: normalizeClass$1(`${clsPrefix}-base-selection-tags`)
      }, [normalizeVNode(() => tags), maxTagCountResponsive ? normalizeVNode(() => null) : (openBlock(), createElementBlock(Fragment, {
        key: 1
      }, [normalizeVNode(() => input)], 64)), normalizeVNode(() => suffix)], 2)) : (openBlock(), createElementBlock("div", {
        key: 7,
        ref: "multipleElRef",
        class: normalizeClass$1(`${clsPrefix}-base-selection-tags`),
        tabindex: disabled ? void 0 : 0
      }, [normalizeVNode(() => tags), normalizeVNode(() => suffix)], 10, _hoisted_2));
      body = (body => {
        return openBlock(), createElementBlock(Fragment, {
          key: 8
        }, [useMaxTagCount ? (openBlock(), createBlock(Popover_default, mergeProps({
          key: 0
        }, popoverProps, {
          scrollable: true,
          style: "max-height: calc(var(--v-target-height) * 6.6);"
        }), {
          trigger: () => popoverTrigger,
          default: renderPopover
        }, 1040)) : (openBlock(), createElementBlock(Fragment, {
          key: 1
        }, [normalizeVNode(() => popoverTrigger)], 64)), normalizeVNode(() => placeholder)], 64);
      })(body);
    } else if (filterable) {
      const hasInput = this.pattern || this.isComposing;
      const showPlaceholder = this.active ? !hasInput : !this.selected;
      const showSelectedLabel = this.active ? false : this.selected;
      body = (body => {
        return openBlock(), createElementBlock("div", {
          key: 9,
          ref: "patternInputWrapperRef",
          class: normalizeClass$1(`${clsPrefix}-base-selection-label`),
          title: this.patternInputFocused ? void 0 : getTitleAttribute(this.label)
        }, [createElementVNode("input", mergeProps(this.inputProps, {
          ref: "patternInputRef",
          class: `${clsPrefix}-base-selection-input`,
          value: this.active ? this.pattern : "",
          placeholder: "",
          readonly: disabled,
          disabled,
          tabindex: -1,
          autofocus: this.autofocus,
          onFocus: this.handlePatternInputFocus,
          onBlur: this.handlePatternInputBlur,
          onInput: this.handlePatternInputInput,
          onCompositionstart: this.handleCompositionStart,
          onCompositionend: this.handleCompositionEnd
        }), null, 16, _hoisted_4), showSelectedLabel ? (openBlock(), createElementBlock("div", {
          class: normalizeClass$1(`${clsPrefix}-base-selection-label__render-label ${clsPrefix}-base-selection-overlay`),
          key: "input"
        }, [createElementVNode("div", {
          class: normalizeClass$1(`${clsPrefix}-base-selection-overlay__wrapper`)
        }, [renderTag ? (openBlock(), createElementBlock(Fragment, {
          key: 0
        }, [normalizeVNode(() => renderTag({
          option: this.selectedOption,
          handleClose: () => {}
        }))], 64)) : (openBlock(), createElementBlock(Fragment, {
          key: 1
        }, [renderLabel ? (openBlock(), createElementBlock(Fragment, {
          key: 0
        }, [normalizeVNode(() => renderLabel(this.selectedOption, true))], 64)) : (openBlock(), createElementBlock(Fragment, {
          key: 1
        }, [normalizeVNode(() => render(this.label, this.selectedOption, true))], 64))], 64))], 2)], 2)) : normalizeVNode(() => null), showPlaceholder ? (openBlock(), createElementBlock("div", {
          class: normalizeClass$1(`${clsPrefix}-base-selection-placeholder ${clsPrefix}-base-selection-overlay`),
          key: "placeholder"
        }, [createElementVNode("div", {
          class: normalizeClass$1(`${clsPrefix}-base-selection-overlay__wrapper`)
        }, [normalizeVNode(() => this.filterablePlaceholder)], 2)], 2)) : normalizeVNode(() => null), normalizeVNode(() => suffix)], 10, _hoisted_3);
      })(body);
    } else body = (body => {
      return openBlock(), createElementBlock("div", {
        key: 10,
        ref: "singleElRef",
        class: normalizeClass$1(`${clsPrefix}-base-selection-label`),
        tabindex: this.disabled ? void 0 : 0
      }, [this.label !== void 0 ? (openBlock(), createElementBlock("div", {
        class: normalizeClass$1(`${clsPrefix}-base-selection-input`),
        title: getTitleAttribute(this.label),
        key: "input"
      }, [createElementVNode("div", {
        class: normalizeClass$1(`${clsPrefix}-base-selection-input__content`)
      }, [renderTag ? (openBlock(), createElementBlock(Fragment, {
        key: 0
      }, [normalizeVNode(() => renderTag({
        option: this.selectedOption,
        handleClose: () => {}
      }))], 64)) : (openBlock(), createElementBlock(Fragment, {
        key: 1
      }, [renderLabel ? (openBlock(), createElementBlock(Fragment, {
        key: 0
      }, [normalizeVNode(() => renderLabel(this.selectedOption, true))], 64)) : (openBlock(), createElementBlock(Fragment, {
        key: 1
      }, [normalizeVNode(() => render(this.label, this.selectedOption, true))], 64))], 64))], 2)], 10, ["title"])) : (openBlock(), createElementBlock("div", {
        class: normalizeClass$1(`${clsPrefix}-base-selection-placeholder ${clsPrefix}-base-selection-overlay`),
        key: "placeholder"
      }, [createElementVNode("div", {
        class: normalizeClass$1(`${clsPrefix}-base-selection-placeholder__inner`)
      }, [normalizeVNode(() => this.placeholder)], 2)], 2)), normalizeVNode(() => suffix)], 10, _hoisted_5);
    })(body);
    return openBlock(), createElementBlock("div", {
      ref: "selfRef",
      class: normalizeClass$1([`${clsPrefix}-base-selection`, this.rtlEnabled && `${clsPrefix}-base-selection--rtl`, this.themeClass, status && `${clsPrefix}-base-selection--${status}-status`, {
        [`${clsPrefix}-base-selection--active`]: this.active,
        [`${clsPrefix}-base-selection--selected`]: this.selected || this.active && this.pattern,
        [`${clsPrefix}-base-selection--disabled`]: this.disabled,
        [`${clsPrefix}-base-selection--multiple`]: this.multiple,
        [`${clsPrefix}-base-selection--focus`]: this.focused
      }]),
      style: normalizeStyle(this.cssVars),
      onClick: this.onClick,
      onMouseenter: this.handleMouseEnter,
      onMouseleave: this.handleMouseLeave,
      onKeydown: this.onKeydown,
      onFocusin: this.handleFocusin,
      onFocusout: this.handleFocusout,
      onMousedown: this.handleMouseDown
    }, [normalizeVNode(() => body), bordered ? (openBlock(), createElementBlock("div", {
      key: 0,
      class: normalizeClass$1(`${clsPrefix}-base-selection__border`)
    }, null, 2)) : normalizeVNode(() => null), bordered ? (openBlock(), createElementBlock("div", {
      key: 2,
      class: normalizeClass$1(`${clsPrefix}-base-selection__state-border`)
    }, null, 2)) : normalizeVNode(() => null)], 46, _hoisted_6);
  }
});
//#endregion
export { Selection_default as default };