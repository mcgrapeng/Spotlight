import { createKey } from "../../_utils/cssr/index.mjs";
import { resolveWrappedSlot } from "../../_utils/vue/resolve-slot.mjs";
import useConfig from "../../_mixins/use-config.mjs";
import { useThemeClass } from "../../_mixins/use-css-vars-class.mjs";
import { useRtl } from "../../_mixins/use-rtl.mjs";
import useTheme from "../../_mixins/use-theme.mjs";
import { createVNodeCache, normalizeClass as normalizeClass$1, normalizeVNode } from "../../vue-jsx-vapor/vdom.mjs";
import radioLight from "../styles/light.mjs";
import radio_cssr_default from "./styles/radio.cssr.mjs";
import { radioBaseProps, setup } from "./use-radio.mjs";
import { computed, createElementBlock, createElementVNode, defineComponent, normalizeStyle, openBlock } from "vue";
//#region src/radio/src/Radio.tsx
const _hoisted_1 = ["value", "name", "checked", "disabled", "onChange", "onFocus", "onBlur"];
const radioProps = {
  ...useTheme.props,
  ...radioBaseProps
};
var Radio_default = defineComponent({
  name: "Radio",
  props: radioProps,
  setup(props) {
    const radio = setup(props);
    const themeRef = useTheme("Radio", "-radio", radio_cssr_default, radioLight, props, radio.mergedClsPrefix);
    const cssVarsRef = computed(() => {
      const {
        mergedSize: {
          value: size
        }
      } = radio;
      const {
        common: {
          cubicBezierEaseInOut
        },
        self: {
          boxShadow,
          boxShadowActive,
          boxShadowDisabled,
          boxShadowFocus,
          boxShadowHover,
          color,
          colorDisabled,
          colorActive,
          textColor,
          textColorDisabled,
          dotColorActive,
          dotColorDisabled,
          labelPadding,
          labelLineHeight,
          labelFontWeight,
          [createKey("fontSize", size)]: fontSize,
          [createKey("radioSize", size)]: radioSize
        }
      } = themeRef.value;
      return {
        "--n-bezier": cubicBezierEaseInOut,
        "--n-label-line-height": labelLineHeight,
        "--n-label-font-weight": labelFontWeight,
        "--n-box-shadow": boxShadow,
        "--n-box-shadow-active": boxShadowActive,
        "--n-box-shadow-disabled": boxShadowDisabled,
        "--n-box-shadow-focus": boxShadowFocus,
        "--n-box-shadow-hover": boxShadowHover,
        "--n-color": color,
        "--n-color-active": colorActive,
        "--n-color-disabled": colorDisabled,
        "--n-dot-color-active": dotColorActive,
        "--n-dot-color-disabled": dotColorDisabled,
        "--n-font-size": fontSize,
        "--n-radio-size": radioSize,
        "--n-text-color": textColor,
        "--n-text-color-disabled": textColorDisabled,
        "--n-label-padding": labelPadding
      };
    });
    const {
      inlineThemeDisabled,
      mergedClsPrefixRef,
      mergedRtlRef
    } = useConfig(props);
    const rtlEnabledRef = useRtl("Radio", mergedRtlRef, mergedClsPrefixRef);
    const themeClassHandle = inlineThemeDisabled ? useThemeClass("radio", computed(() => radio.mergedSize.value[0]), cssVarsRef, props) : void 0;
    return Object.assign(radio, {
      rtlEnabled: rtlEnabledRef,
      cssVars: inlineThemeDisabled ? void 0 : cssVarsRef,
      themeClass: themeClassHandle?.themeClass,
      onRender: themeClassHandle?.onRender
    });
  },
  render() {
    const {
      $slots,
      mergedClsPrefix,
      onRender,
      label
    } = this;
    onRender?.();
    return (() => {
      const _cache = createVNodeCache("f8c6901d8cd45c02");
      return openBlock(), createElementBlock("label", {
        class: normalizeClass$1([`${mergedClsPrefix}-radio`, this.themeClass, this.rtlEnabled && `${mergedClsPrefix}-radio--rtl`, this.mergedDisabled && `${mergedClsPrefix}-radio--disabled`, this.renderSafeChecked && `${mergedClsPrefix}-radio--checked`, this.focus && `${mergedClsPrefix}-radio--focus`]),
        style: normalizeStyle(this.cssVars)
      }, [createElementVNode("div", {
        class: normalizeClass$1(`${mergedClsPrefix}-radio__dot-wrapper`)
      }, [_cache[0] || (_cache[0] = normalizeVNode("\xA0", -1)), createElementVNode("div", {
        class: normalizeClass$1([`${mergedClsPrefix}-radio__dot`, this.renderSafeChecked && `${mergedClsPrefix}-radio__dot--checked`])
      }, null, 2), createElementVNode("input", {
        ref: "inputRef",
        type: "radio",
        class: normalizeClass$1(`${mergedClsPrefix}-radio-input`),
        value: this.value,
        name: this.mergedName,
        checked: this.renderSafeChecked,
        disabled: this.mergedDisabled,
        onChange: this.handleRadioInputChange,
        onFocus: this.handleRadioInputFocus,
        onBlur: this.handleRadioInputBlur
      }, null, 42, _hoisted_1)], 2), normalizeVNode(() => resolveWrappedSlot($slots.default, children => {
        if (!children && !label) return null;
        return openBlock(), createElementBlock("div", {
          ref: "labelRef",
          class: normalizeClass$1(`${mergedClsPrefix}-radio__label`)
        }, [normalizeVNode(() => children || label)], 2);
      }))], 6);
    })();
  }
});
//#endregion
export { Radio_default as default, radioProps };