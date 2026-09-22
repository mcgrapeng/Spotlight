import { normalizeClass as normalizeClass$1 } from "../../vue-jsx-vapor/vdom.mjs";
import Input_default from "../../input/src/Input.mjs";
import { dynamicInputInjectionKey } from "./interface.mjs";
import { createBlock, createElementBlock, defineComponent, inject, openBlock } from "vue";
//#region src/dynamic-input/src/PairPreset.tsx
var PairPreset_default = defineComponent({
  name: "DynamicInputPairPreset",
  props: {
    clsPrefix: {
      type: String,
      required: true
    },
    value: {
      type: Object,
      default: () => ({
        key: "",
        value: ""
      })
    },
    disabled: Boolean,
    parentPath: String,
    path: String,
    onUpdateValue: {
      type: Function,
      required: true
    }
  },
  setup(props) {
    const {
      mergedThemeRef,
      keyPlaceholderRef,
      valuePlaceholderRef
    } = inject(dynamicInputInjectionKey);
    return {
      mergedTheme: mergedThemeRef,
      keyPlaceholder: keyPlaceholderRef,
      valuePlaceholder: valuePlaceholderRef,
      handleKeyInput(key) {
        props.onUpdateValue({
          key,
          value: props.value.value
        });
      },
      handleValueInput(value) {
        props.onUpdateValue({
          key: props.value.key,
          value
        });
      }
    };
  },
  render() {
    const {
      mergedTheme,
      keyPlaceholder,
      valuePlaceholder,
      value,
      clsPrefix,
      disabled
    } = this;
    return openBlock(), createElementBlock("div", {
      class: normalizeClass$1(`${clsPrefix}-dynamic-input-preset-pair`)
    }, [(openBlock(), createBlock(Input_default, {
      theme: mergedTheme.peers.Input,
      "theme-overrides": mergedTheme.peerOverrides.Input,
      value: value.key,
      class: normalizeClass$1(`${clsPrefix}-dynamic-input-pair-input`),
      placeholder: keyPlaceholder,
      onUpdateValue: this.handleKeyInput,
      disabled
    }, null, 8, ["theme", "theme-overrides", "value", "class", "placeholder", "onUpdateValue", "disabled"])), (openBlock(), createBlock(Input_default, {
      theme: mergedTheme.peers.Input,
      "theme-overrides": mergedTheme.peerOverrides.Input,
      value: value.value,
      class: normalizeClass$1(`${clsPrefix}-dynamic-input-pair-input`),
      placeholder: valuePlaceholder,
      onUpdateValue: this.handleValueInput,
      disabled
    }, null, 8, ["theme", "theme-overrides", "value", "class", "placeholder", "onUpdateValue", "disabled"]))], 2);
  }
});
//#endregion
export { PairPreset_default as default };