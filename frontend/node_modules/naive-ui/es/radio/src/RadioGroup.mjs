import { createKey } from "../../_utils/cssr/index.mjs";
import { warn } from "../../_utils/naive/warn.mjs";
import { call } from "../../_utils/vue/call.mjs";
import { flatten } from "../../_utils/vue/flatten.mjs";
import { getSlot } from "../../_utils/vue/get-slot.mjs";
import useConfig from "../../_mixins/use-config.mjs";
import { useThemeClass } from "../../_mixins/use-css-vars-class.mjs";
import useFormItem from "../../_mixins/use-form-item.mjs";
import { useRtl } from "../../_mixins/use-rtl.mjs";
import useTheme from "../../_mixins/use-theme.mjs";
import { normalizeClass as normalizeClass$1, normalizeVNode } from "../../vue-jsx-vapor/vdom.mjs";
import radioLight from "../styles/light.mjs";
import { radioGroupInjectionKey } from "./use-radio.mjs";
import Radio_default from "./Radio.mjs";
import radio_group_cssr_default from "./styles/radio-group.cssr.mjs";
import { computed, createBlock, createElementBlock, defineComponent, normalizeStyle, openBlock, provide, ref, toRef } from "vue";
import { useMergedState } from "vooks";
//#region src/radio/src/RadioGroup.tsx
const _hoisted_1 = ["onFocusin", "onFocusout"];
function mapSlot(defaultSlot, value, clsPrefix) {
  const children = [];
  let isButtonGroup = false;
  for (let i = 0; i < defaultSlot.length; ++i) {
    const wrappedInstance = defaultSlot[i];
    const name = wrappedInstance.type?.name;
    if (name === "RadioButton") isButtonGroup = true;
    if (process.env.NODE_ENV !== "production" && isButtonGroup && name !== "RadioButton") {
      warn("radio-group", "`n-radio-group` in button mode only takes `n-radio-button` as children.");
      continue;
    }
    const instanceProps = wrappedInstance.props;
    if (name !== "RadioButton") {
      children.push(wrappedInstance);
      continue;
    }
    if (i === 0) children.push(wrappedInstance);else {
      const lastInstanceProps = children[children.length - 1].props;
      const lastInstanceChecked = value === lastInstanceProps.value;
      const lastInstanceDisabled = lastInstanceProps.disabled;
      const currentInstanceChecked = value === instanceProps.value;
      const currentInstanceDisabled = instanceProps.disabled;
      /**
      * Priority of button splitor:
      * !disabled  checked >
      *  disabled  checked >
      * !disabled !checked >
      *  disabled !checked
      */
      const lastInstancePriority = (lastInstanceChecked ? 2 : 0) + (!lastInstanceDisabled ? 1 : 0);
      const currentInstancePriority = (currentInstanceChecked ? 2 : 0) + (!currentInstanceDisabled ? 1 : 0);
      const lastInstanceClass = {
        [`${clsPrefix}-radio-group__splitor--disabled`]: lastInstanceDisabled,
        [`${clsPrefix}-radio-group__splitor--checked`]: lastInstanceChecked
      };
      const currentInstanceClass = {
        [`${clsPrefix}-radio-group__splitor--disabled`]: currentInstanceDisabled,
        [`${clsPrefix}-radio-group__splitor--checked`]: currentInstanceChecked
      };
      const splitorClass = lastInstancePriority < currentInstancePriority ? currentInstanceClass : lastInstanceClass;
      children.push((openBlock(), createElementBlock("div", {
        key: 1,
        class: normalizeClass$1([`${clsPrefix}-radio-group__splitor`, splitorClass])
      }, null, 2)), wrappedInstance);
    }
  }
  return {
    children,
    isButtonGroup
  };
}
const radioGroupProps = {
  ...useTheme.props,
  name: String,
  options: Array,
  labelField: {
    type: String,
    default: "label"
  },
  valueField: {
    type: String,
    default: "value"
  },
  value: [String, Number, Boolean],
  defaultValue: {
    type: [String, Number, Boolean],
    default: null
  },
  size: String,
  disabled: {
    type: Boolean,
    default: void 0
  },
  "onUpdate:value": [Function, Array],
  onUpdateValue: [Function, Array]
};
var RadioGroup_default = defineComponent({
  name: "RadioGroup",
  props: radioGroupProps,
  setup(props) {
    const selfElRef = ref(null);
    const {
      mergedSizeRef,
      mergedDisabledRef,
      nTriggerFormChange,
      nTriggerFormInput,
      nTriggerFormBlur,
      nTriggerFormFocus
    } = useFormItem(props);
    const {
      mergedClsPrefixRef,
      inlineThemeDisabled,
      mergedRtlRef
    } = useConfig(props);
    const themeRef = useTheme("Radio", "-radio-group", radio_group_cssr_default, radioLight, props, mergedClsPrefixRef);
    const uncontrolledValueRef = ref(props.defaultValue);
    const controlledValueRef = toRef(props, "value");
    const mergedValueRef = useMergedState(controlledValueRef, uncontrolledValueRef);
    function doUpdateValue(value) {
      const {
        onUpdateValue,
        "onUpdate:value": _onUpdateValue
      } = props;
      if (onUpdateValue) call(onUpdateValue, value);
      if (_onUpdateValue) call(_onUpdateValue, value);
      uncontrolledValueRef.value = value;
      nTriggerFormChange();
      nTriggerFormInput();
    }
    function handleFocusin(e) {
      const {
        value: selfEl
      } = selfElRef;
      if (!selfEl) return;
      if (selfEl.contains(e.relatedTarget)) return;
      nTriggerFormFocus();
    }
    function handleFocusout(e) {
      const {
        value: selfEl
      } = selfElRef;
      if (!selfEl) return;
      if (selfEl.contains(e.relatedTarget)) return;
      nTriggerFormBlur();
    }
    provide(radioGroupInjectionKey, {
      mergedClsPrefixRef,
      nameRef: toRef(props, "name"),
      valueRef: mergedValueRef,
      disabledRef: mergedDisabledRef,
      mergedSizeRef,
      doUpdateValue
    });
    const rtlEnabledRef = useRtl("Radio", mergedRtlRef, mergedClsPrefixRef);
    const cssVarsRef = computed(() => {
      const {
        value: size
      } = mergedSizeRef;
      const {
        common: {
          cubicBezierEaseInOut
        },
        self: {
          buttonBorderColor,
          buttonBorderColorActive,
          buttonBorderRadius,
          buttonBoxShadow,
          buttonBoxShadowFocus,
          buttonBoxShadowHover,
          buttonColor,
          buttonColorActive,
          buttonTextColor,
          buttonTextColorActive,
          buttonTextColorHover,
          opacityDisabled,
          [createKey("buttonHeight", size)]: height,
          [createKey("fontSize", size)]: fontSize
        }
      } = themeRef.value;
      return {
        "--n-font-size": fontSize,
        "--n-bezier": cubicBezierEaseInOut,
        "--n-button-border-color": buttonBorderColor,
        "--n-button-border-color-active": buttonBorderColorActive,
        "--n-button-border-radius": buttonBorderRadius,
        "--n-button-box-shadow": buttonBoxShadow,
        "--n-button-box-shadow-focus": buttonBoxShadowFocus,
        "--n-button-box-shadow-hover": buttonBoxShadowHover,
        "--n-button-color": buttonColor,
        "--n-button-color-active": buttonColorActive,
        "--n-button-text-color": buttonTextColor,
        "--n-button-text-color-hover": buttonTextColorHover,
        "--n-button-text-color-active": buttonTextColorActive,
        "--n-height": height,
        "--n-opacity-disabled": opacityDisabled
      };
    });
    const themeClassHandle = inlineThemeDisabled ? useThemeClass("radio-group", computed(() => mergedSizeRef.value[0]), cssVarsRef, props) : void 0;
    return {
      selfElRef,
      rtlEnabled: rtlEnabledRef,
      mergedClsPrefix: mergedClsPrefixRef,
      mergedValue: mergedValueRef,
      handleFocusout,
      handleFocusin,
      cssVars: inlineThemeDisabled ? void 0 : cssVarsRef,
      themeClass: themeClassHandle?.themeClass,
      onRender: themeClassHandle?.onRender
    };
  },
  render() {
    const {
      mergedValue,
      mergedClsPrefix,
      handleFocusin,
      handleFocusout
    } = this;
    const {
      options,
      labelField,
      valueField
    } = this.$props;
    const {
      children,
      isButtonGroup
    } = mapSlot(options ? options.map(option => {
      const value = option[valueField];
      return openBlock(), createBlock(Radio_default, {
        key: typeof value === "boolean" ? `__n_${value}` : value,
        value,
        disabled: option.disabled,
        label: option[labelField]
      }, null, 8, ["value", "disabled", "label"]);
    }) : flatten(getSlot(this)), mergedValue, mergedClsPrefix);
    this.onRender?.();
    return openBlock(), createElementBlock("div", {
      onFocusin: handleFocusin,
      onFocusout: handleFocusout,
      ref: "selfElRef",
      class: normalizeClass$1([`${mergedClsPrefix}-radio-group`, this.rtlEnabled && `${mergedClsPrefix}-radio-group--rtl`, this.themeClass, isButtonGroup && `${mergedClsPrefix}-radio-group--button-group`]),
      style: normalizeStyle(this.cssVars)
    }, [normalizeVNode(() => children)], 46, _hoisted_1);
  }
});
//#endregion
export { RadioGroup_default as default, radioGroupProps };