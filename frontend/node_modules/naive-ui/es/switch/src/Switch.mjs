import { createKey } from "../../_utils/cssr/index.mjs";
import { warnOnce } from "../../_utils/naive/warn.mjs";
import { call } from "../../_utils/vue/call.mjs";
import { isSlotEmpty, resolveWrappedSlot } from "../../_utils/vue/resolve-slot.mjs";
import useConfig from "../../_mixins/use-config.mjs";
import { useThemeClass } from "../../_mixins/use-css-vars-class.mjs";
import useFormItem from "../../_mixins/use-form-item.mjs";
import useTheme from "../../_mixins/use-theme.mjs";
import { normalizeClass as normalizeClass$1, normalizeVNode } from "../../vue-jsx-vapor/vdom.mjs";
import IconSwitchTransition_default from "../../_internal/icon-switch-transition/src/IconSwitchTransition.mjs";
import Loading_default from "../../_internal/loading/src/Loading.mjs";
import switchLight from "../styles/light.mjs";
import index_cssr_default from "./styles/index.cssr.mjs";
import { depx, pxfy } from "seemly";
import { computed, createBlock, createElementBlock, createElementVNode, defineComponent, mergeProps, normalizeStyle, openBlock, ref, toRef, watchEffect } from "vue";
import { useMergedState } from "vooks";
//#region src/switch/src/Switch.tsx
const _hoisted_1 = ["aria-checked", "tabindex", "onClick", "onFocus", "onBlur", "onKeyup", "onKeydown"];
const switchProps = {
  ...useTheme.props,
  size: String,
  value: {
    type: [String, Number, Boolean],
    default: void 0
  },
  loading: Boolean,
  defaultValue: {
    type: [String, Number, Boolean],
    default: false
  },
  disabled: {
    type: Boolean,
    default: void 0
  },
  round: {
    type: Boolean,
    default: true
  },
  "onUpdate:value": [Function, Array],
  onUpdateValue: [Function, Array],
  checkedValue: {
    type: [String, Number, Boolean],
    default: true
  },
  uncheckedValue: {
    type: [String, Number, Boolean],
    default: false
  },
  railStyle: Function,
  rubberBand: {
    type: Boolean,
    default: true
  },
  spinProps: Object,
  /** @deprecated */
  onChange: [Function, Array]
};
let supportCssMax;
var Switch_default = defineComponent({
  name: "Switch",
  props: switchProps,
  slots: Object,
  setup(props) {
    if (process.env.NODE_ENV !== "production") watchEffect(() => {
      if (props.onChange) warnOnce("switch", "`on-change` is deprecated, please use `on-update:value` instead.");
    });
    if (supportCssMax === void 0) {
      if (typeof CSS !== "undefined") {
        if (typeof CSS.supports !== "undefined") supportCssMax = CSS.supports("width", "max(1px)");else supportCssMax = false;
      } else supportCssMax = true;
    }
    const {
      mergedClsPrefixRef,
      inlineThemeDisabled,
      mergedComponentPropsRef
    } = useConfig(props);
    const themeRef = useTheme("Switch", "-switch", index_cssr_default, switchLight, props, mergedClsPrefixRef);
    const formItem = useFormItem(props, {
      mergedSize(NFormItem) {
        if (props.size !== void 0) return props.size;
        if (NFormItem) return NFormItem.mergedSize.value;
        const configSize = mergedComponentPropsRef?.value?.Switch?.size;
        if (configSize) return configSize;
        return "medium";
      }
    });
    const {
      mergedSizeRef,
      mergedDisabledRef
    } = formItem;
    const uncontrolledValueRef = ref(props.defaultValue);
    const controlledValueRef = toRef(props, "value");
    const mergedValueRef = useMergedState(controlledValueRef, uncontrolledValueRef);
    const checkedRef = computed(() => {
      return mergedValueRef.value === props.checkedValue;
    });
    const pressedRef = ref(false);
    const focusedRef = ref(false);
    const mergedRailStyleRef = computed(() => {
      const {
        railStyle
      } = props;
      if (!railStyle) return void 0;
      return railStyle({
        focused: focusedRef.value,
        checked: checkedRef.value
      });
    });
    function doUpdateValue(value) {
      const {
        "onUpdate:value": _onUpdateValue,
        onChange,
        onUpdateValue
      } = props;
      const {
        nTriggerFormInput,
        nTriggerFormChange
      } = formItem;
      if (_onUpdateValue) call(_onUpdateValue, value);
      if (onUpdateValue) call(onUpdateValue, value);
      if (onChange) call(onChange, value);
      uncontrolledValueRef.value = value;
      nTriggerFormInput();
      nTriggerFormChange();
    }
    function doFocus() {
      const {
        nTriggerFormFocus
      } = formItem;
      nTriggerFormFocus();
    }
    function doBlur() {
      const {
        nTriggerFormBlur
      } = formItem;
      nTriggerFormBlur();
    }
    function handleClick() {
      if (props.loading || mergedDisabledRef.value) return;
      if (mergedValueRef.value !== props.checkedValue) doUpdateValue(props.checkedValue);else doUpdateValue(props.uncheckedValue);
    }
    function handleFocus() {
      focusedRef.value = true;
      doFocus();
    }
    function handleBlur() {
      focusedRef.value = false;
      doBlur();
      pressedRef.value = false;
    }
    function handleKeyup(e) {
      if (props.loading || mergedDisabledRef.value) return;
      if (e.key === " ") {
        if (mergedValueRef.value !== props.checkedValue) doUpdateValue(props.checkedValue);else doUpdateValue(props.uncheckedValue);
        pressedRef.value = false;
      }
    }
    function handleKeydown(e) {
      if (props.loading || mergedDisabledRef.value) return;
      if (e.key === " ") {
        e.preventDefault();
        pressedRef.value = true;
      }
    }
    const cssVarsRef = computed(() => {
      const {
        value: size
      } = mergedSizeRef;
      const {
        self: {
          opacityDisabled,
          railColor,
          railColorActive,
          buttonBoxShadow,
          buttonColor,
          boxShadowFocus,
          loadingColor,
          textColor,
          iconColor,
          [createKey("buttonHeight", size)]: buttonHeight,
          [createKey("buttonWidth", size)]: buttonWidth,
          [createKey("buttonWidthPressed", size)]: buttonWidthPressed,
          [createKey("railHeight", size)]: railHeight,
          [createKey("railWidth", size)]: railWidth,
          [createKey("railBorderRadius", size)]: railBorderRadius,
          [createKey("buttonBorderRadius", size)]: buttonBorderRadius
        },
        common: {
          cubicBezierEaseInOut
        }
      } = themeRef.value;
      let offset;
      let height;
      let width;
      if (supportCssMax) {
        offset = `calc((${railHeight} - ${buttonHeight}) / 2)`;
        height = `max(${railHeight}, ${buttonHeight})`;
        width = `max(${railWidth}, calc(${railWidth} + ${buttonHeight} - ${railHeight}))`;
      } else {
        offset = pxfy((depx(railHeight) - depx(buttonHeight)) / 2);
        height = pxfy(Math.max(depx(railHeight), depx(buttonHeight)));
        width = depx(railHeight) > depx(buttonHeight) ? railWidth : pxfy(depx(railWidth) + depx(buttonHeight) - depx(railHeight));
      }
      return {
        "--n-bezier": cubicBezierEaseInOut,
        "--n-button-border-radius": buttonBorderRadius,
        "--n-button-box-shadow": buttonBoxShadow,
        "--n-button-color": buttonColor,
        "--n-button-width": buttonWidth,
        "--n-button-width-pressed": buttonWidthPressed,
        "--n-button-height": buttonHeight,
        "--n-height": height,
        "--n-offset": offset,
        "--n-opacity-disabled": opacityDisabled,
        "--n-rail-border-radius": railBorderRadius,
        "--n-rail-color": railColor,
        "--n-rail-color-active": railColorActive,
        "--n-rail-height": railHeight,
        "--n-rail-width": railWidth,
        "--n-width": width,
        "--n-box-shadow-focus": boxShadowFocus,
        "--n-loading-color": loadingColor,
        "--n-text-color": textColor,
        "--n-icon-color": iconColor
      };
    });
    const themeClassHandle = inlineThemeDisabled ? useThemeClass("switch", computed(() => {
      return mergedSizeRef.value[0];
    }), cssVarsRef, props) : void 0;
    return {
      handleClick,
      handleBlur,
      handleFocus,
      handleKeyup,
      handleKeydown,
      mergedRailStyle: mergedRailStyleRef,
      pressed: pressedRef,
      mergedClsPrefix: mergedClsPrefixRef,
      mergedValue: mergedValueRef,
      checked: checkedRef,
      mergedDisabled: mergedDisabledRef,
      cssVars: inlineThemeDisabled ? void 0 : cssVarsRef,
      themeClass: themeClassHandle?.themeClass,
      onRender: themeClassHandle?.onRender
    };
  },
  render() {
    const {
      mergedClsPrefix,
      mergedDisabled,
      checked,
      mergedRailStyle,
      onRender,
      $slots
    } = this;
    onRender?.();
    const {
      checked: checkedSlot,
      unchecked: uncheckedSlot,
      icon: iconSlot,
      "checked-icon": checkedIconSlot,
      "unchecked-icon": uncheckedIconSlot
    } = $slots;
    const hasIcon = !(isSlotEmpty(iconSlot) && isSlotEmpty(checkedIconSlot) && isSlotEmpty(uncheckedIconSlot));
    return openBlock(), createElementBlock("div", {
      role: "switch",
      "aria-checked": checked,
      class: normalizeClass$1([`${mergedClsPrefix}-switch`, this.themeClass, hasIcon && `${mergedClsPrefix}-switch--icon`, checked && `${mergedClsPrefix}-switch--active`, mergedDisabled && `${mergedClsPrefix}-switch--disabled`, this.round && `${mergedClsPrefix}-switch--round`, this.loading && `${mergedClsPrefix}-switch--loading`, this.pressed && `${mergedClsPrefix}-switch--pressed`, this.rubberBand && `${mergedClsPrefix}-switch--rubber-band`]),
      tabindex: !this.mergedDisabled ? 0 : void 0,
      style: normalizeStyle(this.cssVars),
      onClick: this.handleClick,
      onFocus: this.handleFocus,
      onBlur: this.handleBlur,
      onKeyup: this.handleKeyup,
      onKeydown: this.handleKeydown
    }, [createElementVNode("div", {
      class: normalizeClass$1(`${mergedClsPrefix}-switch__rail`),
      "aria-hidden": "true",
      style: normalizeStyle(mergedRailStyle)
    }, [normalizeVNode(() => resolveWrappedSlot(checkedSlot, checkedSlotChildren => resolveWrappedSlot(uncheckedSlot, uncheckedSlotChildren => {
      if (checkedSlotChildren || uncheckedSlotChildren) return openBlock(), createElementBlock("div", {
        key: 4,
        "aria-hidden": true,
        class: normalizeClass$1(`${mergedClsPrefix}-switch__children-placeholder`)
      }, [createElementVNode("div", {
        class: normalizeClass$1(`${mergedClsPrefix}-switch__rail-placeholder`)
      }, [createElementVNode("div", {
        class: normalizeClass$1(`${mergedClsPrefix}-switch__button-placeholder`)
      }, null, 2), normalizeVNode(() => checkedSlotChildren)], 2), createElementVNode("div", {
        class: normalizeClass$1(`${mergedClsPrefix}-switch__rail-placeholder`)
      }, [createElementVNode("div", {
        class: normalizeClass$1(`${mergedClsPrefix}-switch__button-placeholder`)
      }, null, 2), normalizeVNode(() => uncheckedSlotChildren)], 2)], 2);
      return null;
    }))), createElementVNode("div", {
      class: normalizeClass$1(`${mergedClsPrefix}-switch__button`)
    }, [normalizeVNode(() => resolveWrappedSlot(iconSlot, icon => resolveWrappedSlot(checkedIconSlot, checkedIcon => resolveWrappedSlot(uncheckedIconSlot, uncheckedIcon => {
      return openBlock(), createBlock(IconSwitchTransition_default, null, {
        default: () => this.loading ? (openBlock(), createBlock(Loading_default, mergeProps({
          key: "loading",
          clsPrefix: mergedClsPrefix,
          strokeWidth: 20
        }, this.spinProps), null, 16, ["clsPrefix"])) : this.checked && (checkedIcon || icon) ? (openBlock(), createElementBlock("div", {
          class: normalizeClass$1(`${mergedClsPrefix}-switch__button-icon`),
          key: checkedIcon ? "checked-icon" : "icon"
        }, [normalizeVNode(() => checkedIcon || icon)], 2)) : !this.checked && (uncheckedIcon || icon) ? (openBlock(), createElementBlock("div", {
          class: normalizeClass$1(`${mergedClsPrefix}-switch__button-icon`),
          key: uncheckedIcon ? "unchecked-icon" : "icon"
        }, [normalizeVNode(() => uncheckedIcon || icon)], 2)) : null
      }, 1024);
    })))), normalizeVNode(() => resolveWrappedSlot(checkedSlot, children => children && (openBlock(), createElementBlock("div", {
      key: "checked",
      class: normalizeClass$1(`${mergedClsPrefix}-switch__checked`)
    }, [normalizeVNode(() => children)], 2)))), normalizeVNode(() => resolveWrappedSlot(uncheckedSlot, children => children && (openBlock(), createElementBlock("div", {
      key: "unchecked",
      class: normalizeClass$1(`${mergedClsPrefix}-switch__unchecked`)
    }, [normalizeVNode(() => children)], 2))))], 2)], 6)], 46, _hoisted_1);
  }
});
//#endregion
export { Switch_default as default, switchProps };