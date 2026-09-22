import { getTitleAttribute } from "../../_utils/naive/attribute.mjs";
import { normalizeClass as normalizeClass$1, normalizeVNode } from "../../vue-jsx-vapor/vdom.mjs";
import Close_default from "../../_internal/close/src/Close.mjs";
import Checkbox_default from "../../checkbox/src/Checkbox.mjs";
import { transferInjectionKey } from "./interface.mjs";
import { Fragment, createBlock, createElementBlock, createElementVNode, defineComponent, inject, openBlock } from "vue";
import { useMemo } from "vooks";
//#region src/transfer/src/TransferListItem.tsx
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
    disabled: Boolean,
    option: {
      type: Object,
      required: true
    }
  },
  setup(props) {
    const {
      targetValueSetRef,
      mergedClsPrefixRef,
      mergedThemeRef,
      handleItemCheck,
      renderSourceLabelRef,
      renderTargetLabelRef,
      showSelectedRef
    } = inject(transferInjectionKey);
    const checkedRef = useMemo(() => targetValueSetRef.value.has(props.value));
    function handleClick() {
      if (!props.disabled) handleItemCheck(!checkedRef.value, props.value);
    }
    return {
      mergedClsPrefix: mergedClsPrefixRef,
      mergedTheme: mergedThemeRef,
      checked: checkedRef,
      showSelected: showSelectedRef,
      renderSourceLabel: renderSourceLabelRef,
      renderTargetLabel: renderTargetLabelRef,
      handleClick
    };
  },
  render() {
    const {
      disabled,
      mergedTheme,
      mergedClsPrefix,
      label,
      checked,
      source,
      renderSourceLabel,
      renderTargetLabel
    } = this;
    return openBlock(), createElementBlock("div", {
      class: normalizeClass$1([`${mergedClsPrefix}-transfer-list-item`, disabled && `${mergedClsPrefix}-transfer-list-item--disabled`, source ? `${mergedClsPrefix}-transfer-list-item--source` : `${mergedClsPrefix}-transfer-list-item--target`]),
      onClick: source ? this.handleClick : void 0
    }, [createElementVNode("div", {
      class: normalizeClass$1(`${mergedClsPrefix}-transfer-list-item__background`)
    }, null, 2), normalizeVNode(() => source && this.showSelected && (openBlock(), createElementBlock("div", {
      class: normalizeClass$1(`${mergedClsPrefix}-transfer-list-item__checkbox`)
    }, [(openBlock(), createBlock(Checkbox_default, {
      theme: mergedTheme.peers.Checkbox,
      themeOverrides: mergedTheme.peerOverrides.Checkbox,
      disabled,
      checked
    }, null, 8, ["theme", "themeOverrides", "disabled", "checked"]))], 2))), createElementVNode("div", {
      class: normalizeClass$1(`${mergedClsPrefix}-transfer-list-item__label`),
      title: getTitleAttribute(label)
    }, [source ? (openBlock(), createElementBlock(Fragment, {
      key: 0
    }, [renderSourceLabel ? (openBlock(), createElementBlock(Fragment, {
      key: 0
    }, [normalizeVNode(() => renderSourceLabel({
      option: this.option
    }))], 64)) : (openBlock(), createElementBlock(Fragment, {
      key: 1
    }, [normalizeVNode(() => label)], 64))], 64)) : (openBlock(), createElementBlock(Fragment, {
      key: 1
    }, [renderTargetLabel ? (openBlock(), createElementBlock(Fragment, {
      key: 0
    }, [normalizeVNode(() => renderTargetLabel({
      option: this.option
    }))], 64)) : (openBlock(), createElementBlock(Fragment, {
      key: 1
    }, [normalizeVNode(() => label)], 64))], 64))], 10, _hoisted_2), normalizeVNode(() => !source && !disabled && (openBlock(), createBlock(Close_default, {
      focusable: false,
      class: normalizeClass$1(`${mergedClsPrefix}-transfer-list-item__close`),
      clsPrefix: mergedClsPrefix,
      onClick: this.handleClick
    }, null, 8, ["class", "clsPrefix", "onClick"])))], 10, _hoisted_1);
  }
});
//#endregion
export { TransferListItem_default as default };