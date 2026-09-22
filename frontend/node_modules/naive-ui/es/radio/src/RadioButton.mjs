import { resolveWrappedSlot } from "../../_utils/vue/resolve-slot.mjs";
import { normalizeClass as normalizeClass$1, normalizeVNode } from "../../vue-jsx-vapor/vdom.mjs";
import { radioBaseProps, setup } from "./use-radio.mjs";
import { createElementBlock, createElementVNode, defineComponent, openBlock } from "vue";
//#region src/radio/src/RadioButton.tsx
const _hoisted_1 = ["value", "name", "checked", "disabled", "onChange", "onFocus", "onBlur"];
const radioButtonProps = radioBaseProps;
var RadioButton_default = defineComponent({
  name: "RadioButton",
  props: radioBaseProps,
  setup,
  render() {
    const {
      mergedClsPrefix
    } = this;
    return openBlock(), createElementBlock("label", {
      class: normalizeClass$1([`${mergedClsPrefix}-radio-button`, this.mergedDisabled && `${mergedClsPrefix}-radio-button--disabled`, this.renderSafeChecked && `${mergedClsPrefix}-radio-button--checked`, this.focus && [`${mergedClsPrefix}-radio-button--focus`]])
    }, [createElementVNode("input", {
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
    }, null, 42, _hoisted_1), createElementVNode("div", {
      class: normalizeClass$1(`${mergedClsPrefix}-radio-button__state-border`)
    }, null, 2), normalizeVNode(() => resolveWrappedSlot(this.$slots.default, children => {
      if (!children && !this.label) return null;
      return openBlock(), createElementBlock("div", {
        ref: "labelRef",
        class: normalizeClass$1(`${mergedClsPrefix}-radio__label`)
      }, [normalizeVNode(() => children || this.label)], 2);
    }))], 2);
  }
});
//#endregion
export { RadioButton_default as default, radioButtonProps };