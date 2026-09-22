import { createKey } from "../../_utils/cssr/index.mjs";
import { warnOnce } from "../../_utils/naive/warn.mjs";
import { call } from "../../_utils/vue/call.mjs";
import useConfig from "../../_mixins/use-config.mjs";
import useFormItem from "../../_mixins/use-form-item.mjs";
import useLocale from "../../_mixins/use-locale.mjs";
import useTheme from "../../_mixins/use-theme.mjs";
import { normalizeClass as normalizeClass$1, normalizeVNode } from "../../vue-jsx-vapor/vdom.mjs";
import Icon_default from "../../_internal/icon/src/Icon.mjs";
import ChevronLeft_default from "../../_internal/icons/ChevronLeft.mjs";
import ChevronRight_default from "../../_internal/icons/ChevronRight.mjs";
import Button from "../../button/src/Button.mjs";
import transferLight from "../styles/light.mjs";
import { transferInjectionKey } from "./interface.mjs";
import index_cssr_default from "./styles/index.cssr.mjs";
import TransferFilter_default from "./TransferFilter.mjs";
import TransferHeader_default from "./TransferHeader.mjs";
import TransferList_default from "./TransferList.mjs";
import { useTransferData } from "./use-transfer-data.mjs";
import { depx } from "seemly";
import { computed, createBlock, createElementBlock, createElementVNode, defineComponent, normalizeStyle, openBlock, provide, watchEffect } from "vue";
import { useIsMounted } from "vooks";
//#region src/legacy-transfer/src/Transfer.tsx
const transferProps = {
  ...useTheme.props,
  value: Array,
  defaultValue: {
    type: Array,
    default: null
  },
  options: {
    type: Array,
    default: () => []
  },
  disabled: {
    type: Boolean,
    default: void 0
  },
  virtualScroll: Boolean,
  sourceTitle: String,
  targetTitle: String,
  filterable: Boolean,
  sourceFilterPlaceholder: String,
  targetFilterPlaceholder: String,
  filter: {
    type: Function,
    default: (pattern, option) => {
      if (!pattern) return true;
      return ~`${option.label}`.toLowerCase().indexOf(`${pattern}`.toLowerCase());
    }
  },
  size: String,
  "onUpdate:value": [Function, Array],
  onUpdateValue: [Function, Array],
  onChange: [Function, Array]
};
var Transfer_default = defineComponent({
  name: "LegacyTransfer",
  props: transferProps,
  setup(props) {
    if (process.env.NODE_ENV !== "production") watchEffect(() => {
      if (props.onChange !== void 0) warnOnce("legacy-transfer", "`on-change` is deprecated, please use `on-update:value` instead.");
    });
    const {
      mergedClsPrefixRef
    } = useConfig(props);
    const themeRef = useTheme("LegacyTransfer", "-legacy-transfer", index_cssr_default, transferLight, props, mergedClsPrefixRef);
    const formItem = useFormItem(props);
    const {
      mergedSizeRef,
      mergedDisabledRef
    } = formItem;
    const itemSizeRef = computed(() => {
      const {
        value: size
      } = mergedSizeRef;
      const {
        self: {
          [createKey("itemHeight", size)]: itemSize
        }
      } = themeRef.value;
      return depx(itemSize);
    });
    const {
      uncontrolledValue: uncontrolledValueRef,
      mergedValue: mergedValueRef,
      avlSrcValueSet: avlSrcValueSetRef,
      avlTgtValueSet: avlTgtValueSetRef,
      tgtOpts: tgtOptsRef,
      srcOpts: srcOptsRef,
      filteredSrcOpts: filteredSrcOptsRef,
      filteredTgtOpts: filteredTgtOptsRef,
      srcCheckedValues: srcCheckedValuesRef,
      tgtCheckedValues: tgtCheckedValuesRef,
      srcCheckedStatus: srcCheckedStatusRef,
      tgtCheckedStatus: tgtCheckedStatusRef,
      srcPattern: srcPatternRef,
      tgtPattern: tgtPatternRef,
      isInputing: isInputingRef,
      fromButtonDisabled: fromButtonDisabledRef,
      toButtonDisabled: toButtonDisabledRef,
      handleInputFocus,
      handleInputBlur,
      handleTgtFilterUpdateValue,
      handleSrcFilterUpdateValue
    } = useTransferData(props, mergedDisabledRef);
    function doUpdateValue(value) {
      const {
        onUpdateValue,
        "onUpdate:value": _onUpdateValue,
        onChange
      } = props;
      const {
        nTriggerFormInput,
        nTriggerFormChange
      } = formItem;
      if (onUpdateValue) call(onUpdateValue, value);
      if (_onUpdateValue) call(_onUpdateValue, value);
      if (onChange) call(onChange, value);
      uncontrolledValueRef.value = value;
      nTriggerFormInput();
      nTriggerFormChange();
    }
    function handleSrcHeaderCheck() {
      const {
        value: {
          checked,
          indeterminate
        }
      } = srcCheckedStatusRef;
      if (indeterminate || checked) srcCheckedValuesRef.value = [];else srcCheckedValuesRef.value = Array.from(avlSrcValueSetRef.value);
    }
    function handleTgtHeaderCheck() {
      const {
        value: {
          checked,
          indeterminate
        }
      } = tgtCheckedStatusRef;
      if (indeterminate || checked) tgtCheckedValuesRef.value = [];else tgtCheckedValuesRef.value = Array.from(avlTgtValueSetRef.value);
    }
    function handleTgtCheckboxClick(checked, optionValue) {
      if (checked) tgtCheckedValuesRef.value.push(optionValue);else {
        const index = tgtCheckedValuesRef.value.findIndex(v => v === optionValue);
        if (~index) tgtCheckedValuesRef.value.splice(index, 1);
      }
    }
    function handleSrcCheckboxClick(checked, optionValue) {
      if (checked) srcCheckedValuesRef.value.push(optionValue);else {
        const index = srcCheckedValuesRef.value.findIndex(v => v === optionValue);
        if (~index) srcCheckedValuesRef.value.splice(index, 1);
      }
    }
    function handleToTgtClick() {
      doUpdateValue(srcCheckedValuesRef.value.concat(mergedValueRef.value || []));
      srcCheckedValuesRef.value = [];
    }
    function handleToSrcClick() {
      const tgtCheckedValueSet = new Set(tgtCheckedValuesRef.value);
      doUpdateValue((mergedValueRef.value || []).filter(v => !tgtCheckedValueSet.has(v)));
      tgtCheckedValuesRef.value = [];
    }
    provide(transferInjectionKey, {
      mergedClsPrefixRef,
      mergedSizeRef,
      disabledRef: mergedDisabledRef,
      mergedThemeRef: themeRef,
      srcCheckedValuesRef,
      tgtCheckedValuesRef,
      srcOptsRef,
      tgtOptsRef,
      srcCheckedStatusRef,
      tgtCheckedStatusRef,
      handleSrcCheckboxClick,
      handleTgtCheckboxClick
    });
    const {
      localeRef
    } = useLocale("LegacyTransfer");
    return {
      locale: localeRef,
      mergedClsPrefix: mergedClsPrefixRef,
      mergedDisabled: mergedDisabledRef,
      itemSize: itemSizeRef,
      isMounted: useIsMounted(),
      isInputing: isInputingRef,
      mergedTheme: themeRef,
      filteredSrcOpts: filteredSrcOptsRef,
      filteredTgtOpts: filteredTgtOptsRef,
      srcPattern: srcPatternRef,
      tgtPattern: tgtPatternRef,
      toButtonDisabled: toButtonDisabledRef,
      fromButtonDisabled: fromButtonDisabledRef,
      handleSrcHeaderCheck,
      handleTgtHeaderCheck,
      handleToSrcClick,
      handleToTgtClick,
      handleInputFocus,
      handleInputBlur,
      handleTgtFilterUpdateValue,
      handleSrcFilterUpdateValue,
      cssVars: computed(() => {
        const {
          value: size
        } = mergedSizeRef;
        const {
          common: {
            cubicBezierEaseInOut,
            cubicBezierEaseIn,
            cubicBezierEaseOut
          },
          self: {
            width,
            borderRadius,
            borderColor,
            listColor,
            headerColor,
            titleTextColor,
            titleTextColorDisabled,
            extraTextColor,
            filterDividerColor,
            itemTextColor,
            itemColorPending,
            itemTextColorDisabled,
            extraFontSize,
            titleFontWeight,
            iconColor,
            iconColorDisabled,
            [createKey("fontSize", size)]: fontSize,
            [createKey("itemHeight", size)]: itemHeight
          }
        } = themeRef.value;
        return {
          "--n-bezier": cubicBezierEaseInOut,
          "--n-bezier-ease-in": cubicBezierEaseIn,
          "--n-bezier-ease-out": cubicBezierEaseOut,
          "--n-border-color": borderColor,
          "--n-border-radius": borderRadius,
          "--n-extra-font-size": extraFontSize,
          "--n-filter-divider-color": filterDividerColor,
          "--n-font-size": fontSize,
          "--n-header-color": headerColor,
          "--n-header-extra-text-color": extraTextColor,
          "--n-header-font-weight": titleFontWeight,
          "--n-header-text-color": titleTextColor,
          "--n-header-text-color-disabled": titleTextColorDisabled,
          "--n-item-color-pending": itemColorPending,
          "--n-item-height": itemHeight,
          "--n-item-text-color": itemTextColor,
          "--n-item-text-color-disabled": itemTextColorDisabled,
          "--n-list-color": listColor,
          "--n-width": width,
          "--n-icon-color": iconColor,
          "--n-icon-color-disabled": iconColorDisabled
        };
      })
    };
  },
  render() {
    const {
      mergedClsPrefix
    } = this;
    return openBlock(), createElementBlock("div", {
      class: normalizeClass$1([`${mergedClsPrefix}-legacy-transfer`, this.mergedDisabled && `${mergedClsPrefix}-legacy-transfer--disabled`, this.filterable && `${mergedClsPrefix}-legacy-transfer--filterable`]),
      style: normalizeStyle(this.cssVars)
    }, [createElementVNode("div", {
      class: normalizeClass$1(`${mergedClsPrefix}-legacy-transfer-list`)
    }, [(openBlock(), createBlock(TransferHeader_default, {
      source: true,
      onChange: this.handleSrcHeaderCheck,
      title: this.sourceTitle || this.locale.sourceTitle
    }, null, 8, ["onChange", "title"])), createElementVNode("div", {
      class: normalizeClass$1(`${mergedClsPrefix}-legacy-transfer-list-body`)
    }, [this.filterable ? (openBlock(), createBlock(TransferFilter_default, {
      key: 0,
      onUpdateValue: this.handleSrcFilterUpdateValue,
      value: this.srcPattern,
      disabled: this.mergedDisabled,
      placeholder: this.sourceFilterPlaceholder,
      onFocus: this.handleInputFocus,
      onBlur: this.handleInputBlur
    }, null, 8, ["onUpdateValue", "value", "disabled", "placeholder", "onFocus", "onBlur"])) : normalizeVNode(() => null), createElementVNode("div", {
      class: normalizeClass$1(`${mergedClsPrefix}-legacy-transfer-list-flex-container`)
    }, [(openBlock(), createBlock(TransferList_default, {
      source: true,
      options: this.filteredSrcOpts,
      disabled: this.mergedDisabled,
      virtualScroll: this.virtualScroll,
      isMounted: this.isMounted,
      isInputing: this.isInputing,
      itemSize: this.itemSize
    }, null, 8, ["options", "disabled", "virtualScroll", "isMounted", "isInputing", "itemSize"]))], 2)], 2), createElementVNode("div", {
      class: normalizeClass$1(`${mergedClsPrefix}-legacy-transfer-list__border`)
    }, null, 2)], 2), createElementVNode("div", {
      class: normalizeClass$1(`${mergedClsPrefix}-legacy-transfer-gap`)
    }, [(openBlock(), createBlock(Button, {
      disabled: this.toButtonDisabled || this.mergedDisabled,
      theme: this.mergedTheme.peers.Button,
      themeOverrides: this.mergedTheme.peerOverrides.Button,
      onClick: this.handleToTgtClick
    }, {
      icon: () => (openBlock(), createBlock(Icon_default, {
        clsPrefix: mergedClsPrefix
      }, {
        default: () => (openBlock(), createBlock(ChevronRight_default))
      }, 1032, ["clsPrefix"]))
    }, 1032, ["disabled", "theme", "themeOverrides", "onClick"])), (openBlock(), createBlock(Button, {
      disabled: this.fromButtonDisabled || this.mergedDisabled,
      theme: this.mergedTheme.peers.Button,
      themeOverrides: this.mergedTheme.peerOverrides.Button,
      onClick: this.handleToSrcClick
    }, {
      icon: () => (openBlock(), createBlock(Icon_default, {
        clsPrefix: mergedClsPrefix
      }, {
        default: () => (openBlock(), createBlock(ChevronLeft_default))
      }, 1032, ["clsPrefix"]))
    }, 1032, ["disabled", "theme", "themeOverrides", "onClick"]))], 2), createElementVNode("div", {
      class: normalizeClass$1(`${mergedClsPrefix}-legacy-transfer-list`)
    }, [(openBlock(), createBlock(TransferHeader_default, {
      onChange: this.handleTgtHeaderCheck,
      title: this.targetTitle || this.locale.targetTitle
    }, null, 8, ["onChange", "title"])), createElementVNode("div", {
      class: normalizeClass$1(`${mergedClsPrefix}-legacy-transfer-list-body`)
    }, [this.filterable ? (openBlock(), createBlock(TransferFilter_default, {
      key: 0,
      onUpdateValue: this.handleTgtFilterUpdateValue,
      value: this.tgtPattern,
      disabled: this.mergedDisabled,
      placeholder: this.targetFilterPlaceholder,
      onFocus: this.handleInputFocus,
      onBlur: this.handleInputBlur
    }, null, 8, ["onUpdateValue", "value", "disabled", "placeholder", "onFocus", "onBlur"])) : normalizeVNode(() => null), createElementVNode("div", {
      class: normalizeClass$1(`${mergedClsPrefix}-legacy-transfer-list-flex-container`)
    }, [(openBlock(), createBlock(TransferList_default, {
      options: this.filteredTgtOpts,
      disabled: this.mergedDisabled,
      virtualScroll: this.virtualScroll,
      isMounted: this.isMounted,
      isInputing: this.isInputing,
      itemSize: this.itemSize
    }, null, 8, ["options", "disabled", "virtualScroll", "isMounted", "isInputing", "itemSize"]))], 2)], 2), createElementVNode("div", {
      class: normalizeClass$1(`${mergedClsPrefix}-legacy-transfer-list__border`)
    }, null, 2)], 2)], 6);
  }
});
//#endregion
export { Transfer_default as default, transferProps };