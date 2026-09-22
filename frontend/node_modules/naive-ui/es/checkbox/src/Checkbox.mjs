import { createKey } from "../../_utils/cssr/index.mjs";
import { warnOnce } from "../../_utils/naive/warn.mjs";
import { call } from "../../_utils/vue/call.mjs";
import { resolveWrappedSlot } from "../../_utils/vue/resolve-slot.mjs";
import useConfig from "../../_mixins/use-config.mjs";
import { useThemeClass } from "../../_mixins/use-css-vars-class.mjs";
import useFormItem from "../../_mixins/use-form-item.mjs";
import { useRtl } from "../../_mixins/use-rtl.mjs";
import useTheme from "../../_mixins/use-theme.mjs";
import { createVNodeCache, normalizeClass as normalizeClass$1, normalizeVNode } from "../../vue-jsx-vapor/vdom.mjs";
import IconSwitchTransition_default from "../../_internal/icon-switch-transition/src/IconSwitchTransition.mjs";
import checkboxLight from "../styles/light.mjs";
import { checkboxGroupInjectionKey } from "./CheckboxGroup.mjs";
import CheckMark_default from "./CheckMark.mjs";
import LineMark_default from "./LineMark.mjs";
import index_cssr_default from "./styles/index.cssr.mjs";
import { createId } from "seemly";
import { computed, createElementBlock, createElementVNode, createVNode, defineComponent, inject, normalizeStyle, openBlock, ref, toRef, watchEffect } from "vue";
import { on } from "evtd";
import { useMemo, useMergedState } from "vooks";
//#region src/checkbox/src/Checkbox.tsx
const _hoisted_1 = ["id"];
const _hoisted_2 = ["tabindex", "aria-checked", "aria-labelledby", "onKeyup", "onKeydown", "onClick"];
const checkboxProps = {
  ...useTheme.props,
  size: String,
  checked: {
    type: [Boolean, String, Number],
    default: void 0
  },
  defaultChecked: {
    type: [Boolean, String, Number],
    default: false
  },
  value: [String, Number],
  disabled: {
    type: Boolean,
    default: void 0
  },
  indeterminate: Boolean,
  label: String,
  focusable: {
    type: Boolean,
    default: true
  },
  checkedValue: {
    type: [Boolean, String, Number],
    default: true
  },
  uncheckedValue: {
    type: [Boolean, String, Number],
    default: false
  },
  "onUpdate:checked": [Function, Array],
  onUpdateChecked: [Function, Array],
  privateInsideTable: Boolean,
  onChange: [Function, Array]
};
var Checkbox_default = defineComponent({
  name: "Checkbox",
  props: checkboxProps,
  setup(props) {
    if (process.env.NODE_ENV !== "production") watchEffect(() => {
      if (props.onChange) warnOnce("checkbox", "`on-change` is deprecated, please use `on-update:checked` instead.");
    });
    const NCheckboxGroup = inject(checkboxGroupInjectionKey, null);
    const selfRef = ref(null);
    const {
      mergedClsPrefixRef,
      inlineThemeDisabled,
      mergedRtlRef,
      mergedComponentPropsRef
    } = useConfig(props);
    const uncontrolledCheckedRef = ref(props.defaultChecked);
    const controlledCheckedRef = toRef(props, "checked");
    const mergedCheckedRef = useMergedState(controlledCheckedRef, uncontrolledCheckedRef);
    const renderedCheckedRef = useMemo(() => {
      if (NCheckboxGroup) {
        const groupValueSet = NCheckboxGroup.valueSetRef.value;
        if (groupValueSet && props.value !== void 0) return groupValueSet.has(props.value);
        return false;
      } else return mergedCheckedRef.value === props.checkedValue;
    });
    const formItem = useFormItem(props, {
      mergedSize(NFormItem) {
        const {
          size
        } = props;
        if (size !== void 0) return size;
        if (NCheckboxGroup) {
          const {
            value: mergedSize
          } = NCheckboxGroup.mergedSizeRef;
          if (mergedSize !== void 0) return mergedSize;
        }
        if (NFormItem) {
          const {
            mergedSize
          } = NFormItem;
          if (mergedSize !== void 0) return mergedSize.value;
        }
        const configSize = mergedComponentPropsRef?.value?.Checkbox?.size;
        if (configSize) return configSize;
        return "medium";
      },
      mergedDisabled(NFormItem) {
        const {
          disabled
        } = props;
        if (disabled !== void 0) return disabled;
        if (NCheckboxGroup) {
          if (NCheckboxGroup.disabledRef.value) return true;
          const {
            maxRef: {
              value: max
            },
            checkedCountRef
          } = NCheckboxGroup;
          if (max !== void 0 && checkedCountRef.value >= max && !renderedCheckedRef.value) return true;
          const {
            minRef: {
              value: min
            }
          } = NCheckboxGroup;
          if (min !== void 0 && checkedCountRef.value <= min && renderedCheckedRef.value) return true;
        }
        if (NFormItem) return NFormItem.disabled.value;
        return false;
      }
    });
    const {
      mergedDisabledRef,
      mergedSizeRef
    } = formItem;
    const themeRef = useTheme("Checkbox", "-checkbox", index_cssr_default, checkboxLight, props, mergedClsPrefixRef);
    function toggle(e) {
      if (NCheckboxGroup && props.value !== void 0) NCheckboxGroup.toggleCheckbox(!renderedCheckedRef.value, props.value);else {
        const {
          onChange,
          "onUpdate:checked": _onUpdateCheck,
          onUpdateChecked
        } = props;
        const {
          nTriggerFormInput,
          nTriggerFormChange
        } = formItem;
        const nextChecked = renderedCheckedRef.value ? props.uncheckedValue : props.checkedValue;
        if (_onUpdateCheck) call(_onUpdateCheck, nextChecked, e);
        if (onUpdateChecked) call(onUpdateChecked, nextChecked, e);
        if (onChange) call(onChange, nextChecked, e);
        nTriggerFormInput();
        nTriggerFormChange();
        uncontrolledCheckedRef.value = nextChecked;
      }
    }
    function handleClick(e) {
      if (!mergedDisabledRef.value) toggle(e);
    }
    function handleKeyUp(e) {
      if (mergedDisabledRef.value) return;
      switch (e.key) {
        case " ":
        case "Enter":
          toggle(e);
      }
    }
    function handleKeyDown(e) {
      switch (e.key) {
        case " ":
          e.preventDefault();
      }
    }
    const exposedMethods = {
      focus: () => {
        selfRef.value?.focus();
      },
      blur: () => {
        selfRef.value?.blur();
      }
    };
    const rtlEnabledRef = useRtl("Checkbox", mergedRtlRef, mergedClsPrefixRef);
    const cssVarsRef = computed(() => {
      const {
        value: mergedSize
      } = mergedSizeRef;
      const {
        common: {
          cubicBezierEaseInOut
        },
        self: {
          borderRadius,
          color,
          colorChecked,
          colorDisabled,
          colorTableHeader,
          colorTableHeaderModal,
          colorTableHeaderPopover,
          checkMarkColor,
          checkMarkColorDisabled,
          border,
          borderFocus,
          borderDisabled,
          borderChecked,
          boxShadowFocus,
          textColor,
          textColorDisabled,
          checkMarkColorDisabledChecked,
          colorDisabledChecked,
          borderDisabledChecked,
          labelPadding,
          labelLineHeight,
          labelFontWeight,
          [createKey("fontSize", mergedSize)]: fontSize,
          [createKey("size", mergedSize)]: size
        }
      } = themeRef.value;
      return {
        "--n-label-line-height": labelLineHeight,
        "--n-label-font-weight": labelFontWeight,
        "--n-size": size,
        "--n-bezier": cubicBezierEaseInOut,
        "--n-border-radius": borderRadius,
        "--n-border": border,
        "--n-border-checked": borderChecked,
        "--n-border-focus": borderFocus,
        "--n-border-disabled": borderDisabled,
        "--n-border-disabled-checked": borderDisabledChecked,
        "--n-box-shadow-focus": boxShadowFocus,
        "--n-color": color,
        "--n-color-checked": colorChecked,
        "--n-color-table": colorTableHeader,
        "--n-color-table-modal": colorTableHeaderModal,
        "--n-color-table-popover": colorTableHeaderPopover,
        "--n-color-disabled": colorDisabled,
        "--n-color-disabled-checked": colorDisabledChecked,
        "--n-text-color": textColor,
        "--n-text-color-disabled": textColorDisabled,
        "--n-check-mark-color": checkMarkColor,
        "--n-check-mark-color-disabled": checkMarkColorDisabled,
        "--n-check-mark-color-disabled-checked": checkMarkColorDisabledChecked,
        "--n-font-size": fontSize,
        "--n-label-padding": labelPadding
      };
    });
    const themeClassHandle = inlineThemeDisabled ? useThemeClass("checkbox", computed(() => mergedSizeRef.value[0]), cssVarsRef, props) : void 0;
    return Object.assign(formItem, exposedMethods, {
      rtlEnabled: rtlEnabledRef,
      selfRef,
      mergedClsPrefix: mergedClsPrefixRef,
      mergedDisabled: mergedDisabledRef,
      renderedChecked: renderedCheckedRef,
      mergedTheme: themeRef,
      labelId: createId(),
      handleClick,
      handleKeyUp,
      handleKeyDown,
      cssVars: inlineThemeDisabled ? void 0 : cssVarsRef,
      themeClass: themeClassHandle?.themeClass,
      onRender: themeClassHandle?.onRender
    });
  },
  render() {
    const {
      $slots,
      renderedChecked,
      mergedDisabled,
      indeterminate,
      privateInsideTable,
      cssVars,
      labelId,
      label,
      mergedClsPrefix,
      focusable,
      handleKeyUp,
      handleKeyDown,
      handleClick
    } = this;
    this.onRender?.();
    const labelNode = resolveWrappedSlot($slots.default, children => {
      if (label || children) return openBlock(), createElementBlock("span", {
        key: 1,
        class: normalizeClass$1(`${mergedClsPrefix}-checkbox__label`),
        id: labelId
      }, [normalizeVNode(() => label || children)], 10, _hoisted_1);
      return null;
    });
    return (() => {
      const _cache = createVNodeCache("70be6e74cd27cb50");
      return openBlock(), createElementBlock("div", {
        ref: "selfRef",
        class: normalizeClass$1([`${mergedClsPrefix}-checkbox`, this.themeClass, this.rtlEnabled && `${mergedClsPrefix}-checkbox--rtl`, renderedChecked && `${mergedClsPrefix}-checkbox--checked`, mergedDisabled && `${mergedClsPrefix}-checkbox--disabled`, indeterminate && `${mergedClsPrefix}-checkbox--indeterminate`, privateInsideTable && `${mergedClsPrefix}-checkbox--inside-table`, labelNode && `${mergedClsPrefix}-checkbox--show-label`]),
        tabindex: mergedDisabled || !focusable ? void 0 : 0,
        role: "checkbox",
        "aria-checked": indeterminate ? "mixed" : renderedChecked,
        "aria-labelledby": labelId,
        style: normalizeStyle(cssVars),
        onKeyup: handleKeyUp,
        onKeydown: handleKeyDown,
        onClick: handleClick,
        onMousedown: _cache[0] || (_cache[0] = () => {
          on("selectstart", window, e => {
            e.preventDefault();
          }, {
            once: true
          });
        })
      }, [createElementVNode("div", {
        class: normalizeClass$1(`${mergedClsPrefix}-checkbox-box-wrapper`)
      }, [_cache[1] || (_cache[1] = normalizeVNode("\xA0", -1)), createElementVNode("div", {
        class: normalizeClass$1(`${mergedClsPrefix}-checkbox-box`)
      }, [createVNode(IconSwitchTransition_default, null, {
        default: () => this.indeterminate ? (openBlock(), createElementBlock("div", {
          key: "indeterminate",
          class: normalizeClass$1(`${mergedClsPrefix}-checkbox-icon`)
        }, [normalizeVNode(() => LineMark_default())], 2)) : (openBlock(), createElementBlock("div", {
          key: "check",
          class: normalizeClass$1(`${mergedClsPrefix}-checkbox-icon`)
        }, [normalizeVNode(() => CheckMark_default())], 2))
      }, 1024), createElementVNode("div", {
        class: normalizeClass$1(`${mergedClsPrefix}-checkbox-box__border`)
      }, null, 2)], 2)], 2), normalizeVNode(() => labelNode)], 46, _hoisted_2);
    })();
  }
});
//#endregion
export { checkboxProps, Checkbox_default as default };