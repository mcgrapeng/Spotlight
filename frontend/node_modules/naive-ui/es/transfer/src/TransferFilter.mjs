import { normalizeClass as normalizeClass$1 } from "../../vue-jsx-vapor/vdom.mjs";
import Icon_default from "../../_internal/icon/src/Icon.mjs";
import Search_default from "../../_internal/icons/Search.mjs";
import Input_default from "../../input/src/Input.mjs";
import { transferInjectionKey } from "./interface.mjs";
import { createBlock, createElementBlock, defineComponent, inject, openBlock } from "vue";
//#region src/transfer/src/TransferFilter.tsx
var TransferFilter_default = defineComponent({
  name: "TransferFilter",
  props: {
    value: String,
    placeholder: String,
    disabled: Boolean,
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
      class: normalizeClass$1(`${mergedClsPrefix}-transfer-filter`)
    }, [(openBlock(), createBlock(Input_default, {
      value: this.value,
      onUpdateValue: this.onUpdateValue,
      disabled: this.disabled,
      placeholder: this.placeholder,
      theme: mergedTheme.peers.Input,
      themeOverrides: mergedTheme.peerOverrides.Input,
      clearable: true,
      size: "small"
    }, {
      "clear-icon-placeholder": () => (openBlock(), createBlock(Icon_default, {
        clsPrefix: mergedClsPrefix
      }, {
        default: () => (openBlock(), createBlock(Search_default))
      }, 1032, ["clsPrefix"]))
    }, 1032, ["value", "onUpdateValue", "disabled", "placeholder", "theme", "themeOverrides"]))], 2);
  }
});
//#endregion
export { TransferFilter_default as default };