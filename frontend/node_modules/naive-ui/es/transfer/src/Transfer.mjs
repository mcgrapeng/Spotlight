import { createKey } from "../../_utils/cssr/index.mjs";
import { warnOnce } from "../../_utils/naive/warn.mjs";
import { call } from "../../_utils/vue/call.mjs";
import useConfig from "../../_mixins/use-config.mjs";
import useFormItem from "../../_mixins/use-form-item.mjs";
import useTheme from "../../_mixins/use-theme.mjs";
import { normalizeClass as normalizeClass$1, normalizeVNode } from "../../vue-jsx-vapor/vdom.mjs";
import Scrollbar from "../../_internal/scrollbar/src/Scrollbar.mjs";
import transferLight from "../styles/light.mjs";
import { transferInjectionKey } from "./interface.mjs";
import index_cssr_default from "./styles/index.cssr.mjs";
import TransferFilter_default from "./TransferFilter.mjs";
import TransferHeader_default from "./TransferHeader.mjs";
import TransferList_default from "./TransferList.mjs";
import { useTransferData } from "./use-transfer-data.mjs";
import { depx } from "seemly";
import { computed, createBlock, createElementBlock, createElementVNode, defineComponent, normalizeStyle, openBlock, provide, toRef, watchEffect } from "vue";
import { useIsMounted } from "vooks";
//#region src/transfer/src/Transfer.tsx
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
  sourceTitle: [String, Function],
  selectAllText: String,
  clearText: String,
  targetTitle: [String, Function],
  filterable: {
    type: Boolean,
    default: void 0
  },
  sourceFilterable: Boolean,
  targetFilterable: Boolean,
  showSelected: {
    type: Boolean,
    default: true
  },
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
  renderSourceLabel: Function,
  renderTargetLabel: Function,
  renderSourceList: Function,
  renderTargetList: Function,
  "onUpdate:value": [Function, Array],
  onUpdateValue: [Function, Array],
  onChange: [Function, Array]
};
var Transfer_default = defineComponent({
  name: "Transfer",
  props: transferProps,
  setup(props) {
    if (process.env.NODE_ENV !== "production") watchEffect(() => {
      if (props.onChange !== void 0) warnOnce("transfer", "`on-change` is deprecated, please use `on-update:value` instead.");
      if (props.filterable !== void 0) warnOnce("transfer", "`filterable` is deprecated, please use `source-filterable` or `target-filterable` instead.");
    });
    const {
      mergedClsPrefixRef,
      mergedComponentPropsRef
    } = useConfig(props);
    const themeRef = useTheme("Transfer", "-transfer", index_cssr_default, transferLight, props, mergedClsPrefixRef);
    const formItem = useFormItem(props, {
      mergedSize: NFormItem => {
        const {
          size
        } = props;
        if (size) return size;
        const {
          mergedSize: formItemSize
        } = NFormItem || {};
        if (formItemSize?.value) return formItemSize.value;
        const configSize = mergedComponentPropsRef?.value?.Transfer?.size;
        if (configSize) return configSize;
        return "medium";
      }
    });
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
      uncontrolledValueRef,
      mergedValueRef,
      targetValueSetRef,
      valueSetForCheckAllRef,
      valueSetForUncheckAllRef,
      valueSetForClearRef,
      filteredTgtOptionsRef,
      filteredSrcOptionsRef,
      targetOptionsRef,
      canNotSelectAnythingRef,
      canBeClearedRef,
      allCheckedRef,
      srcPatternRef,
      tgtPatternRef,
      mergedSrcFilterableRef,
      handleSrcFilterUpdateValue,
      handleTgtFilterUpdateValue
    } = useTransferData(props);
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
    function handleSourceCheckAll() {
      doUpdateValue([...valueSetForCheckAllRef.value]);
    }
    function handleSourceUncheckAll() {
      doUpdateValue([...valueSetForUncheckAllRef.value]);
    }
    function handleTargetClearAll() {
      doUpdateValue([...valueSetForClearRef.value]);
    }
    function handleItemCheck(checked, optionValue) {
      if (checked) doUpdateValue((mergedValueRef.value || []).concat(optionValue));else doUpdateValue((mergedValueRef.value || []).filter(v => v !== optionValue));
    }
    function handleChecked(optionValueList) {
      doUpdateValue(optionValueList);
    }
    provide(transferInjectionKey, {
      targetValueSetRef,
      mergedClsPrefixRef,
      disabledRef: mergedDisabledRef,
      mergedThemeRef: themeRef,
      targetOptionsRef,
      canNotSelectAnythingRef,
      canBeClearedRef,
      allCheckedRef,
      srcOptionsLengthRef: computed(() => props.options.length),
      handleItemCheck,
      renderSourceLabelRef: toRef(props, "renderSourceLabel"),
      renderTargetLabelRef: toRef(props, "renderTargetLabel"),
      showSelectedRef: toRef(props, "showSelected")
    });
    return {
      mergedClsPrefix: mergedClsPrefixRef,
      mergedDisabled: mergedDisabledRef,
      itemSize: itemSizeRef,
      isMounted: useIsMounted(),
      mergedTheme: themeRef,
      filteredSrcOpts: filteredSrcOptionsRef,
      filteredTgtOpts: filteredTgtOptionsRef,
      srcPattern: srcPatternRef,
      tgtPattern: tgtPatternRef,
      mergedSize: mergedSizeRef,
      mergedSrcFilterable: mergedSrcFilterableRef,
      handleSrcFilterUpdateValue,
      handleTgtFilterUpdateValue,
      handleSourceCheckAll,
      handleSourceUncheckAll,
      handleTargetClearAll,
      handleItemCheck,
      handleChecked,
      cssVars: computed(() => {
        const {
          value: size
        } = mergedSizeRef;
        const {
          common: {
            cubicBezierEaseInOut
          },
          self: {
            borderRadius,
            borderColor,
            listColor,
            titleTextColor,
            titleTextColorDisabled,
            extraTextColor,
            itemTextColor,
            itemColorPending,
            itemTextColorDisabled,
            titleFontWeight,
            closeColorHover,
            closeColorPressed,
            closeIconColor,
            closeIconColorHover,
            closeIconColorPressed,
            closeIconSize,
            closeSize,
            dividerColor,
            extraTextColorDisabled,
            [createKey("extraFontSize", size)]: extraFontSize,
            [createKey("fontSize", size)]: fontSize,
            [createKey("titleFontSize", size)]: titleFontSize,
            [createKey("itemHeight", size)]: itemHeight,
            [createKey("headerHeight", size)]: headerHeight
          }
        } = themeRef.value;
        return {
          "--n-bezier": cubicBezierEaseInOut,
          "--n-border-color": borderColor,
          "--n-border-radius": borderRadius,
          "--n-extra-font-size": extraFontSize,
          "--n-font-size": fontSize,
          "--n-header-font-size": titleFontSize,
          "--n-header-extra-text-color": extraTextColor,
          "--n-header-extra-text-color-disabled": extraTextColorDisabled,
          "--n-header-font-weight": titleFontWeight,
          "--n-header-text-color": titleTextColor,
          "--n-header-text-color-disabled": titleTextColorDisabled,
          "--n-item-color-pending": itemColorPending,
          "--n-item-height": itemHeight,
          "--n-item-text-color": itemTextColor,
          "--n-item-text-color-disabled": itemTextColorDisabled,
          "--n-list-color": listColor,
          "--n-header-height": headerHeight,
          "--n-close-size": closeSize,
          "--n-close-icon-size": closeIconSize,
          "--n-close-color-hover": closeColorHover,
          "--n-close-color-pressed": closeColorPressed,
          "--n-close-icon-color": closeIconColor,
          "--n-close-icon-color-hover": closeIconColorHover,
          "--n-close-icon-color-pressed": closeIconColorPressed,
          "--n-divider-color": dividerColor
        };
      })
    };
  },
  render() {
    const {
      mergedClsPrefix,
      renderSourceList,
      renderTargetList,
      mergedTheme,
      mergedSrcFilterable,
      targetFilterable
    } = this;
    return openBlock(), createElementBlock("div", {
      class: normalizeClass$1([`${mergedClsPrefix}-transfer`, this.mergedDisabled && `${mergedClsPrefix}-transfer--disabled`]),
      style: normalizeStyle(this.cssVars)
    }, [createElementVNode("div", {
      class: normalizeClass$1(`${mergedClsPrefix}-transfer-list ${mergedClsPrefix}-transfer-list--source`)
    }, [(openBlock(), createBlock(TransferHeader_default, {
      source: true,
      selectAllText: this.selectAllText,
      clearText: this.clearText,
      title: this.sourceTitle,
      onCheckedAll: this.handleSourceCheckAll,
      onClearAll: this.handleSourceUncheckAll,
      size: this.mergedSize
    }, null, 8, ["selectAllText", "clearText", "title", "onCheckedAll", "onClearAll", "size"])), createElementVNode("div", {
      class: normalizeClass$1(`${mergedClsPrefix}-transfer-list-body`)
    }, [mergedSrcFilterable ? (openBlock(), createBlock(TransferFilter_default, {
      key: 0,
      onUpdateValue: this.handleSrcFilterUpdateValue,
      value: this.srcPattern,
      disabled: this.mergedDisabled,
      placeholder: this.sourceFilterPlaceholder
    }, null, 8, ["onUpdateValue", "value", "disabled", "placeholder"])) : normalizeVNode(() => null), createElementVNode("div", {
      class: normalizeClass$1(`${mergedClsPrefix}-transfer-list-flex-container`)
    }, [renderSourceList ? (openBlock(), createBlock(Scrollbar, {
      key: 0,
      theme: mergedTheme.peers.Scrollbar,
      themeOverrides: mergedTheme.peerOverrides.Scrollbar
    }, {
      default: () => renderSourceList({
        onCheck: this.handleChecked,
        checkedOptions: this.filteredTgtOpts,
        pattern: this.srcPattern
      })
    }, 1032, ["theme", "themeOverrides"])) : (openBlock(), createBlock(TransferList_default, {
      key: 1,
      source: true,
      options: this.filteredSrcOpts,
      disabled: this.mergedDisabled,
      virtualScroll: this.virtualScroll,
      itemSize: this.itemSize
    }, null, 8, ["options", "disabled", "virtualScroll", "itemSize"]))], 2)], 2), createElementVNode("div", {
      class: normalizeClass$1(`${mergedClsPrefix}-transfer-list__border`)
    }, null, 2)], 2), createElementVNode("div", {
      class: normalizeClass$1(`${mergedClsPrefix}-transfer-list ${mergedClsPrefix}-transfer-list--target`)
    }, [(openBlock(), createBlock(TransferHeader_default, {
      onClearAll: this.handleTargetClearAll,
      size: this.mergedSize,
      title: this.targetTitle
    }, null, 8, ["onClearAll", "size", "title"])), createElementVNode("div", {
      class: normalizeClass$1(`${mergedClsPrefix}-transfer-list-body`)
    }, [targetFilterable ? (openBlock(), createBlock(TransferFilter_default, {
      key: 0,
      onUpdateValue: this.handleTgtFilterUpdateValue,
      value: this.tgtPattern,
      disabled: this.mergedDisabled,
      placeholder: this.sourceFilterPlaceholder
    }, null, 8, ["onUpdateValue", "value", "disabled", "placeholder"])) : normalizeVNode(() => null), createElementVNode("div", {
      class: normalizeClass$1(`${mergedClsPrefix}-transfer-list-flex-container`)
    }, [renderTargetList ? (openBlock(), createBlock(Scrollbar, {
      key: 0,
      theme: mergedTheme.peers.Scrollbar,
      themeOverrides: mergedTheme.peerOverrides.Scrollbar
    }, {
      default: () => renderTargetList({
        onCheck: this.handleChecked,
        checkedOptions: this.filteredTgtOpts,
        pattern: this.tgtPattern
      })
    }, 1032, ["theme", "themeOverrides"])) : (openBlock(), createBlock(TransferList_default, {
      key: 1,
      options: this.filteredTgtOpts,
      disabled: this.mergedDisabled,
      virtualScroll: this.virtualScroll,
      itemSize: this.itemSize
    }, null, 8, ["options", "disabled", "virtualScroll", "itemSize"]))], 2)], 2), createElementVNode("div", {
      class: normalizeClass$1(`${mergedClsPrefix}-transfer-list__border`)
    }, null, 2)], 2)], 6);
  }
});
//#endregion
export { Transfer_default as default, transferProps };