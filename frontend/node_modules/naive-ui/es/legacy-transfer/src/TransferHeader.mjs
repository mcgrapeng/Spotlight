import { createVNodeCache, normalizeClass as normalizeClass$1, normalizeVNode } from "../../vue-jsx-vapor/vdom.mjs";
import Checkbox_default from "../../checkbox/src/Checkbox.mjs";
import { transferInjectionKey } from "./interface.mjs";
import { Fragment, computed, createBlock, createElementBlock, createElementVNode, defineComponent, inject, openBlock } from "vue";
//#region src/legacy-transfer/src/TransferHeader.tsx
var TransferHeader_default = defineComponent({
  name: "TransferHeader",
  props: {
    source: Boolean,
    onChange: {
      type: Function,
      required: true
    },
    title: String
  },
  setup(props) {
    const {
      srcOptsRef,
      tgtOptsRef,
      srcCheckedStatusRef,
      tgtCheckedStatusRef,
      srcCheckedValuesRef,
      tgtCheckedValuesRef,
      mergedThemeRef,
      disabledRef,
      mergedClsPrefixRef
    } = inject(transferInjectionKey);
    const checkboxPropsRef = computed(() => {
      const {
        source
      } = props;
      if (source) return srcCheckedStatusRef.value;else return tgtCheckedStatusRef.value;
    });
    return () => {
      const {
        source
      } = props;
      const {
        value: checkboxProps
      } = checkboxPropsRef;
      const {
        value: mergedTheme
      } = mergedThemeRef;
      const {
        value: mergedClsPrefix
      } = mergedClsPrefixRef;
      return (() => {
        const _cache = createVNodeCache("76321fa8f0e5ceb7");
        return openBlock(), createElementBlock("div", {
          class: normalizeClass$1(`${mergedClsPrefix}-legacy-transfer-list-header`)
        }, [createElementVNode("div", {
          class: normalizeClass$1(`${mergedClsPrefix}-legacy-transfer-list-header__checkbox`)
        }, [(openBlock(), createBlock(Checkbox_default, {
          theme: mergedTheme.peers.Checkbox,
          themeOverrides: mergedTheme.peerOverrides.Checkbox,
          checked: checkboxProps.checked,
          indeterminate: checkboxProps.indeterminate,
          disabled: checkboxProps.disabled || disabledRef.value,
          onUpdateChecked: props.onChange
        }, null, 8, ["theme", "themeOverrides", "checked", "indeterminate", "disabled", "onUpdateChecked"]))], 2), createElementVNode("div", {
          class: normalizeClass$1(`${mergedClsPrefix}-legacy-transfer-list-header__header`)
        }, [normalizeVNode(() => props.title)], 2), createElementVNode("div", {
          class: normalizeClass$1(`${mergedClsPrefix}-legacy-transfer-list-header__extra`)
        }, [source ? (openBlock(), createElementBlock(Fragment, {
          key: 0
        }, [normalizeVNode(() => srcCheckedValuesRef.value.length)], 64)) : (openBlock(), createElementBlock(Fragment, {
          key: 1
        }, [normalizeVNode(() => tgtCheckedValuesRef.value.length)], 64)), _cache[0] || (_cache[0] = normalizeVNode("/", -1)), source ? (openBlock(), createElementBlock(Fragment, {
          key: 2
        }, [normalizeVNode(() => srcOptsRef.value.length)], 64)) : (openBlock(), createElementBlock(Fragment, {
          key: 3
        }, [normalizeVNode(() => tgtOptsRef.value.length)], 64))], 2)], 2);
      })();
    };
  }
});
//#endregion
export { TransferHeader_default as default };