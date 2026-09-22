import { useAdjustedTo } from "../../_utils/composable/use-adjusted-to.mjs";
import { warnOnce } from "../../_utils/naive/warn.mjs";
import { call } from "../../_utils/vue/call.mjs";
import { getFirstSlotVNodeWithTypedProps } from "../../_utils/vue/get-first-slot-vnode.mjs";
import useConfig from "../../_mixins/use-config.mjs";
import { useThemeClass } from "../../_mixins/use-css-vars-class.mjs";
import useFormItem from "../../_mixins/use-form-item.mjs";
import useTheme from "../../_mixins/use-theme.mjs";
import { normalizeClass as normalizeClass$1, normalizeSlot } from "../../vue-jsx-vapor/vdom.mjs";
import SelectMenu_default from "../../_internal/select-menu/src/SelectMenu.mjs";
import Input_default from "../../input/src/Input.mjs";
import { createTmOptions } from "../../select/src/utils.mjs";
import autoCompleteLight from "../styles/light.mjs";
import index_cssr_default from "./styles/index.cssr.mjs";
import { mapAutoCompleteOptionsToSelectOptions } from "./utils.mjs";
import { getPreciseEventTarget } from "seemly";
import { Transition, computed, createBlock, createElementBlock, createVNode, defineComponent, mergeProps, openBlock, ref, toRef, watchEffect, withDirectives } from "vue";
import { useIsMounted, useMergedState } from "vooks";
import { VBinder, VFollower, VTarget } from "vueuc";
import { createTreeMate } from "treemate";
import { clickoutside } from "vdirs";
//#region src/auto-complete/src/AutoComplete.tsx
const _hoisted_1 = ["onKeydown", "onCompositionstart", "onCompositionend"];
const autoCompleteProps = {
  ...useTheme.props,
  to: useAdjustedTo.propTo,
  menuProps: Object,
  append: Boolean,
  bordered: {
    type: Boolean,
    default: void 0
  },
  clearable: {
    type: Boolean,
    default: void 0
  },
  defaultValue: {
    type: String,
    default: null
  },
  loading: {
    type: Boolean,
    default: void 0
  },
  disabled: {
    type: Boolean,
    default: void 0
  },
  placeholder: String,
  placement: {
    type: String,
    default: "bottom-start"
  },
  value: String,
  blurAfterSelect: Boolean,
  clearAfterSelect: Boolean,
  getShow: Function,
  showEmpty: Boolean,
  inputProps: Object,
  renderOption: Function,
  renderLabel: Function,
  size: String,
  options: {
    type: Array,
    default: () => []
  },
  zIndex: Number,
  status: String,
  "onUpdate:value": [Function, Array],
  onUpdateValue: [Function, Array],
  onSelect: [Function, Array],
  onBlur: [Function, Array],
  onFocus: [Function, Array],
  scrollbarProps: Object,
  onInput: [Function, Array]
};
var AutoComplete_default = defineComponent({
  name: "AutoComplete",
  props: autoCompleteProps,
  slots: Object,
  setup(props) {
    if (process.env.NODE_ENV !== "production") watchEffect(() => {
      if (props.onInput !== void 0) warnOnce("auto-complete", "`on-input` is deprecated, please use `on-update:value` instead.");
    });
    const {
      mergedBorderedRef,
      namespaceRef,
      mergedClsPrefixRef,
      inlineThemeDisabled,
      mergedComponentPropsRef
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
        const configSize = mergedComponentPropsRef?.value?.AutoComplete?.size;
        if (configSize) return configSize;
        return "medium";
      }
    });
    const {
      mergedSizeRef,
      mergedDisabledRef,
      mergedStatusRef
    } = formItem;
    const triggerElRef = ref(null);
    const menuInstRef = ref(null);
    const uncontrolledValueRef = ref(props.defaultValue);
    const controlledValueRef = toRef(props, "value");
    const mergedValueRef = useMergedState(controlledValueRef, uncontrolledValueRef);
    const canBeActivatedRef = ref(false);
    const isComposingRef = ref(false);
    const themeRef = useTheme("AutoComplete", "-auto-complete", index_cssr_default, autoCompleteLight, props, mergedClsPrefixRef);
    const selectOptionsRef = computed(() => {
      return mapAutoCompleteOptionsToSelectOptions(props.options);
    });
    const mergedShowOptionsRef = computed(() => {
      const {
        getShow
      } = props;
      if (getShow) return getShow(mergedValueRef.value || "");
      return !!mergedValueRef.value;
    });
    const activeRef = computed(() => {
      return mergedShowOptionsRef.value && canBeActivatedRef.value && (props.showEmpty ? true : !!selectOptionsRef.value.length);
    });
    const treeMateRef = computed(() => createTreeMate(selectOptionsRef.value, createTmOptions("value", "children")));
    function doUpdateValue(value) {
      const {
        "onUpdate:value": _onUpdateValue,
        onUpdateValue,
        onInput
      } = props;
      const {
        nTriggerFormInput,
        nTriggerFormChange
      } = formItem;
      if (onUpdateValue) call(onUpdateValue, value);
      if (_onUpdateValue) call(_onUpdateValue, value);
      if (onInput) call(onInput, value);
      uncontrolledValueRef.value = value;
      nTriggerFormInput();
      nTriggerFormChange();
    }
    function doSelect(value) {
      const {
        onSelect
      } = props;
      const {
        nTriggerFormInput,
        nTriggerFormChange
      } = formItem;
      if (onSelect) call(onSelect, value);
      nTriggerFormInput();
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
    function handleCompositionStart() {
      isComposingRef.value = true;
    }
    function handleCompositionEnd() {
      window.setTimeout(() => {
        isComposingRef.value = false;
      }, 0);
    }
    function handleKeyDown(e) {
      switch (e.key) {
        case "Enter":
          if (!isComposingRef.value) {
            const pendingOptionTmNode = menuInstRef.value?.getPendingTmNode();
            if (pendingOptionTmNode) {
              select(pendingOptionTmNode.rawNode);
              e.preventDefault();
            }
          }
          break;
        case "ArrowDown":
          menuInstRef.value?.next();
          break;
        case "ArrowUp":
          menuInstRef.value?.prev();
      }
    }
    function select(option) {
      if (option?.value !== void 0) {
        doSelect(option.value);
        if (props.clearAfterSelect) doUpdateValue(null);else if (option.label !== void 0) doUpdateValue(props.append ? `${mergedValueRef.value}${option.label}` : option.label);
        canBeActivatedRef.value = false;
        if (props.blurAfterSelect) blur();
      }
    }
    function handleClear() {
      doUpdateValue(null);
    }
    function handleFocus(e) {
      canBeActivatedRef.value = true;
      doFocus(e);
    }
    function handleBlur(e) {
      canBeActivatedRef.value = false;
      doBlur(e);
    }
    function handleInput(value) {
      canBeActivatedRef.value = true;
      doUpdateValue(value);
    }
    function handleToggle(option) {
      select(option.rawNode);
    }
    function handleClickOutsideMenu(e) {
      if (!triggerElRef.value?.contains(getPreciseEventTarget(e))) canBeActivatedRef.value = false;
    }
    function blur() {
      if (triggerElRef.value?.contains(document.activeElement)) document.activeElement?.blur();
    }
    const cssVarsRef = computed(() => {
      const {
        common: {
          cubicBezierEaseInOut
        },
        self: {
          menuBoxShadow
        }
      } = themeRef.value;
      return {
        "--n-menu-box-shadow": menuBoxShadow,
        "--n-bezier": cubicBezierEaseInOut
      };
    });
    const themeClassHandle = inlineThemeDisabled ? useThemeClass("auto-complete", void 0, cssVarsRef, props) : void 0;
    const inputInstRef = ref(null);
    const exposedMethods = {
      focus: () => {
        inputInstRef.value?.focus();
      },
      blur: () => {
        inputInstRef.value?.blur();
      }
    };
    return {
      focus: exposedMethods.focus,
      blur: exposedMethods.blur,
      inputInstRef,
      uncontrolledValue: uncontrolledValueRef,
      mergedValue: mergedValueRef,
      isMounted: useIsMounted(),
      adjustedTo: useAdjustedTo(props),
      menuInstRef,
      triggerElRef,
      treeMate: treeMateRef,
      mergedSize: mergedSizeRef,
      mergedDisabled: mergedDisabledRef,
      active: activeRef,
      mergedStatus: mergedStatusRef,
      handleClear,
      handleFocus,
      handleBlur,
      handleInput,
      handleToggle,
      handleClickOutsideMenu,
      handleCompositionStart,
      handleCompositionEnd,
      handleKeyDown,
      mergedTheme: themeRef,
      cssVars: inlineThemeDisabled ? void 0 : cssVarsRef,
      themeClass: themeClassHandle?.themeClass,
      onRender: themeClassHandle?.onRender,
      mergedBordered: mergedBorderedRef,
      namespace: namespaceRef,
      mergedClsPrefix: mergedClsPrefixRef
    };
  },
  render() {
    const {
      mergedClsPrefix
    } = this;
    return openBlock(), createElementBlock("div", {
      class: normalizeClass$1(`${mergedClsPrefix}-auto-complete`),
      ref: "triggerElRef",
      onKeydown: this.handleKeyDown,
      onCompositionstart: this.handleCompositionStart,
      onCompositionend: this.handleCompositionEnd
    }, [createVNode(VBinder, null, {
      default: () => [(openBlock(), createBlock(VTarget, null, {
        _: 1,
        default: normalizeSlot(() => {
          const defaultSlot = this.$slots.default;
          if (defaultSlot) return getFirstSlotVNodeWithTypedProps("default", defaultSlot, {
            handleInput: this.handleInput,
            handleFocus: this.handleFocus,
            handleBlur: this.handleBlur,
            value: this.mergedValue
          });
          const {
            mergedTheme
          } = this;
          return openBlock(), createBlock(Input_default, {
            ref: "inputInstRef",
            status: this.mergedStatus,
            theme: mergedTheme.peers.Input,
            themeOverrides: mergedTheme.peerOverrides.Input,
            bordered: this.mergedBordered,
            value: this.mergedValue,
            placeholder: this.placeholder,
            size: this.mergedSize,
            disabled: this.mergedDisabled,
            clearable: this.clearable,
            loading: this.loading,
            inputProps: this.inputProps,
            onClear: this.handleClear,
            onFocus: this.handleFocus,
            onUpdateValue: this.handleInput,
            onBlur: this.handleBlur
          }, {
            suffix: () => this.$slots.suffix?.(),
            prefix: () => this.$slots.prefix?.()
          }, 1032, ["status", "theme", "themeOverrides", "bordered", "value", "placeholder", "size", "disabled", "clearable", "loading", "inputProps", "onClear", "onFocus", "onUpdateValue", "onBlur"]);
        })
      })), (openBlock(), createBlock(VFollower, {
        show: this.active,
        to: this.adjustedTo,
        containerClass: this.namespace,
        zIndex: this.zIndex,
        teleportDisabled: this.adjustedTo === useAdjustedTo.tdkey,
        placement: this.placement,
        width: "target"
      }, {
        default: () => (openBlock(), createBlock(Transition, {
          name: "fade-in-scale-up-transition",
          appear: this.isMounted
        }, {
          default: () => {
            this.onRender?.();
            if (!this.active) return null;
            const {
              menuProps
            } = this;
            return withDirectives((openBlock(), createBlock(SelectMenu_default, mergeProps(menuProps, {
              clsPrefix: mergedClsPrefix,
              ref: "menuInstRef",
              theme: this.mergedTheme.peers.InternalSelectMenu,
              themeOverrides: this.mergedTheme.peerOverrides.InternalSelectMenu,
              "auto-pending": true,
              class: [`${mergedClsPrefix}-auto-complete-menu`, this.themeClass, menuProps?.class],
              style: [menuProps?.style, this.cssVars],
              treeMate: this.treeMate,
              multiple: false,
              renderLabel: this.renderLabel,
              renderOption: this.renderOption,
              size: "medium",
              onToggle: this.handleToggle,
              scrollbarProps: this.scrollbarProps
            }), {
              empty: () => this.$slots.empty?.()
            }, 1040, ["clsPrefix", "theme", "themeOverrides", "class", "style", "treeMate", "renderLabel", "renderOption", "onToggle", "scrollbarProps"])), [[clickoutside, this.handleClickOutsideMenu, void 0, {
              capture: true
            }]]);
          }
        }, 1032, ["appear"]))
      }, 1032, ["show", "to", "containerClass", "zIndex", "teleportDisabled", "placement"]))]
    }, 1024)], 42, _hoisted_1);
  }
});
//#endregion
export { autoCompleteProps, AutoComplete_default as default };