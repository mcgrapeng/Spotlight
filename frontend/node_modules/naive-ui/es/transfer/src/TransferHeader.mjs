import useLocale from "../../_mixins/use-locale.mjs";
import { normalizeClass as normalizeClass$1, normalizeVNode } from "../../vue-jsx-vapor/vdom.mjs";
import Button from "../../button/src/Button.mjs";
import { transferInjectionKey } from "./interface.mjs";
import { Fragment, createBlock, createElementBlock, createElementVNode, defineComponent, inject, openBlock } from "vue";
//#region src/transfer/src/TransferHeader.tsx
var TransferHeader_default = defineComponent({
  name: "TransferHeader",
  props: {
    size: {
      type: String,
      required: true
    },
    selectAllText: String,
    clearText: String,
    source: Boolean,
    onCheckedAll: Function,
    onClearAll: Function,
    title: [String, Function]
  },
  setup(props) {
    const {
      targetOptionsRef,
      canNotSelectAnythingRef,
      canBeClearedRef,
      allCheckedRef,
      mergedThemeRef,
      disabledRef,
      mergedClsPrefixRef,
      srcOptionsLengthRef
    } = inject(transferInjectionKey);
    const {
      localeRef
    } = useLocale("Transfer");
    return () => {
      const {
        source,
        onClearAll,
        onCheckedAll,
        selectAllText,
        clearText
      } = props;
      const {
        value: mergedTheme
      } = mergedThemeRef;
      const {
        value: mergedClsPrefix
      } = mergedClsPrefixRef;
      const {
        value: locale
      } = localeRef;
      const buttonSize = props.size === "large" ? "small" : "tiny";
      const {
        title
      } = props;
      return openBlock(), createElementBlock("div", {
        class: normalizeClass$1(`${mergedClsPrefix}-transfer-list-header`)
      }, [normalizeVNode(() => title && (openBlock(), createElementBlock("div", {
        class: normalizeClass$1(`${mergedClsPrefix}-transfer-list-header__title`)
      }, [typeof title === "function" ? (openBlock(), createElementBlock(Fragment, {
        key: 0
      }, [normalizeVNode(() => title())], 64)) : (openBlock(), createElementBlock(Fragment, {
        key: 1
      }, [normalizeVNode(() => title)], 64))], 2))), normalizeVNode(() => source && (openBlock(), createBlock(Button, {
        class: normalizeClass$1(`${mergedClsPrefix}-transfer-list-header__button`),
        theme: mergedTheme.peers.Button,
        themeOverrides: mergedTheme.peerOverrides.Button,
        size: buttonSize,
        tertiary: true,
        onClick: allCheckedRef.value ? onClearAll : onCheckedAll,
        disabled: canNotSelectAnythingRef.value || disabledRef.value
      }, {
        default: () => allCheckedRef.value ? clearText || locale.unselectAll : selectAllText || locale.selectAll
      }, 1032, ["class", "theme", "themeOverrides", "size", "onClick", "disabled"]))), normalizeVNode(() => !source && canBeClearedRef.value && (openBlock(), createBlock(Button, {
        class: normalizeClass$1(`${mergedClsPrefix}-transfer-list-header__button`),
        theme: mergedTheme.peers.Button,
        themeOverrides: mergedTheme.peerOverrides.Button,
        size: buttonSize,
        tertiary: true,
        onClick: onClearAll,
        disabled: disabledRef.value
      }, {
        default: () => locale.clearAll
      }, 1032, ["class", "theme", "themeOverrides", "size", "onClick", "disabled"]))), createElementVNode("div", {
        class: normalizeClass$1(`${mergedClsPrefix}-transfer-list-header__extra`)
      }, [source ? (openBlock(), createElementBlock(Fragment, {
        key: 0
      }, [normalizeVNode(() => locale.total(srcOptionsLengthRef.value))], 64)) : (openBlock(), createElementBlock(Fragment, {
        key: 1
      }, [normalizeVNode(() => locale.selected(targetOptionsRef.value.length))], 64))], 2)], 2);
    };
  }
});
//#endregion
export { TransferHeader_default as default };