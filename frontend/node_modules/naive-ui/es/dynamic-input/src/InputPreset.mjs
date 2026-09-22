import { normalizeClass as normalizeClass$1 } from "../../vue-jsx-vapor/vdom.mjs";
import Input_default from "../../input/src/Input.mjs";
import { dynamicInputInjectionKey } from "./interface.mjs";
import { createBlock, createElementBlock, defineComponent, inject, openBlock } from "vue";
//#region src/dynamic-input/src/InputPreset.tsx
var InputPreset_default = defineComponent({
  name: "DynamicInputInputPreset",
  props: {
    clsPrefix: {
      type: String,
      required: true
    },
    value: {
      type: String,
      default: ""
    },
    disabled: Boolean,
    parentPath: String,
    path: String,
    onUpdateValue: {
      type: Function,
      required: true
    }
  },
  setup() {
    const {
      mergedThemeRef,
      placeholderRef
    } = inject(dynamicInputInjectionKey);
    return {
      mergedTheme: mergedThemeRef,
      placeholder: placeholderRef
    };
  },
  render() {
    const {
      mergedTheme,
      placeholder,
      value,
      clsPrefix,
      onUpdateValue,
      disabled
    } = this;
    return openBlock(), createElementBlock("div", {
      class: normalizeClass$1(`${clsPrefix}-dynamic-input-preset-input`)
    }, [(openBlock(), createBlock(Input_default, {
      theme: mergedTheme.peers.Input,
      "theme-overrides": mergedTheme.peerOverrides.Input,
      value,
      placeholder,
      onUpdateValue,
      disabled
    }, null, 8, ["theme", "theme-overrides", "value", "placeholder", "onUpdateValue", "disabled"]))], 2);
  }
});
//#endregion
export { InputPreset_default as default };