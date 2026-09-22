import { normalizeClass as normalizeClass$1 } from "../../vue-jsx-vapor/vdom.mjs";
import Icon_default from "../../_internal/icon/src/Icon.mjs";
import Search_default from "../../_internal/icons/Search.mjs";
import Input_default from "../../input/src/Input.mjs";
import { transferInjectionKey } from "./interface.mjs";
import { createBlock, createElementBlock, defineComponent, inject, openBlock } from "vue";
//#region src/legacy-transfer/src/TransferFilter.tsx
var TransferFilter_default = defineComponent({
  name: "TransferFilter",
  props: {
    value: String,
    placeholder: String,
    disabled: Boolean,
    onFocus: {
      type: Function,
      required: true
    },
    onBlur: {
      type: Function,
      required: true
    },
    onUpdateValue: {
      type: Function,
      required: true
    }
  },
  setup() {
    const {
      mergedThemeRef,
      mergedClsPrefixRef
    } = inject(transferInjectionKey);
    return {
      mergedClsPrefix: mergedClsPrefixRef,
      mergedTheme: mergedThemeRef
    };
  },
  render() {
    const {
      mergedTheme,
      mergedClsPrefix
    } = this;
    return openBlock(), createElementBlock("div", {
      class: normalizeClass$1(`${mergedClsPrefix}-legacy-transfer-filter`)
    }, [(openBlock(), createBlock(Input_default, {
      value: this.value,
      onUpdateValue: this.onUpdateValue,
      disabled: this.disabled,
      theme: mergedTheme.peers.Input,
      themeOverrides: mergedTheme.peerOverrides.Input,
      clearable: true,
      size: "small",
      placeholder: this.placeholder,
      onFocus: this.onFocus,
      onBlur: this.onBlur
    }, {
      "clear-icon-placeholder": () => (openBlock(), createBlock(Icon_default, {
        clsPrefix: mergedClsPrefix,
        class: normalizeClass$1(`${mergedClsPrefix}-legacy-transfer-icon`)
      }, {
        default: () => (openBlock(), createBlock(Search_default))
      }, 1032, ["clsPrefix", "class"]))
    }, 1032, ["value", "onUpdateValue", "disabled", "theme", "themeOverrides", "placeholder", "onFocus", "onBlur"]))], 2);
  }
});
//#endregion
export { TransferFilter_default as default };