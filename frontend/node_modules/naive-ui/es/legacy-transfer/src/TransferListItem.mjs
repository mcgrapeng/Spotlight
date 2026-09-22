import { getTitleAttribute } from "../../_utils/naive/attribute.mjs";
import { normalizeClass as normalizeClass$1, normalizeVNode } from "../../vue-jsx-vapor/vdom.mjs";
import Checkbox_default from "../../checkbox/src/Checkbox.mjs";
import { transferInjectionKey } from "./interface.mjs";
import { createBlock, createElementBlock, createElementVNode, defineComponent, inject, openBlock } from "vue";
import { useMemo } from "vooks";
//#region src/legacy-transfer/src/TransferListItem.tsx
const _hoisted_1 = ["onClick"];
const _hoisted_2 = ["title"];
var TransferListItem_default = defineComponent({
  name: "NTransferListItem",
  props: {
    source: Boolean,
    label: {
      type: String,
      required: true
    },
    value: {
      type: [String, Number],
      required: true
    },
    disabled: Boolean
  },
  setup(props) {
    const {
      source
    } = props;
    const {
      mergedClsPrefixRef,
      mergedThemeRef,
      srcCheckedValuesRef,
      tgtCheckedValuesRef,
      handleSrcCheckboxClick,
      handleTgtCheckboxClick
    } = inject(transferInjectionKey);
    const checkedRef = source ? useMemo(() => srcCheckedValuesRef.value.includes(props.value)) : useMemo(() => tgtCheckedValuesRef.value.includes(props.value));
    return {
      mergedClsPrefix: mergedClsPrefixRef,
      mergedTheme: mergedThemeRef,
      checked: checkedRef,
      handleClick: source ? () => {
        if (!props.disabled) handleSrcCheckboxClick(!checkedRef.value, props.value);
      } : () => {
        if (!props.disabled) handleTgtCheckboxClick(!checkedRef.value, props.value);
      }
    };
  },
  render() {
    const {
      disabled,
      mergedTheme,
      mergedClsPrefix,
      label,
      checked,
      source
    } = this;
    return openBlock(), createElementBlock("div", {
      class: normalizeClass$1([`${mergedClsPrefix}-legacy-transfer-list-item`, disabled && `${mergedClsPrefix}-legacy-transfer-list-item--disabled`, source ? `${mergedClsPrefix}-legacy-transfer-list-item--source` : `${mergedClsPrefix}-legacy-transfer-list-item--target`]),
      onClick: this.handleClick
    }, [createElementVNode("div", {
      class: normalizeClass$1(`${mergedClsPrefix}-legacy-transfer-list-item__checkbox`)
    }, [(openBlock(), createBlock(Checkbox_default, {
      theme: mergedTheme.peers.Checkbox,
      themeOverrides: mergedTheme.peerOverrides.Checkbox,
      disabled,
      checked
    }, null, 8, ["theme", "themeOverrides", "disabled", "checked"]))], 2), createElementVNode("div", {
      class: normalizeClass$1(`${mergedClsPrefix}-legacy-transfer-list-item__label`),
      title: getTitleAttribute(label)
    }, [normalizeVNode(() => label)], 10, _hoisted_2)], 10, _hoisted_1);
  }
});
//#endregion
export { TransferListItem_default as default };