import useConfig from "../../../_mixins/use-config.mjs";
import { useRtl } from "../../../_mixins/use-rtl.mjs";
import { normalizeClass as normalizeClass$1 } from "../../../vue-jsx-vapor/vdom.mjs";
import Scrollbar from "../../../_internal/scrollbar/src/Scrollbar.mjs";
import Button from "../../../button/src/Button.mjs";
import CheckboxGroup_default from "../../../checkbox/src/CheckboxGroup.mjs";
import Checkbox_default from "../../../checkbox/src/Checkbox.mjs";
import { dataTableInjectionKey } from "../interface.mjs";
import { shouldUseArrayInSingleMode } from "../utils.mjs";
import Radio_default from "../../../radio/src/Radio.mjs";
import RadioGroup_default from "../../../radio/src/RadioGroup.mjs";
import { computed, createBlock, createElementBlock, createElementVNode, createVNode, defineComponent, inject, openBlock, ref } from "vue";
//#region src/data-table/src/HeaderButton/FilterMenu.tsx
var FilterMenu_default = defineComponent({
  name: "DataTableFilterMenu",
  props: {
    column: {
      type: Object,
      required: true
    },
    radioGroupName: {
      type: String,
      required: true
    },
    multiple: {
      type: Boolean,
      required: true
    },
    value: {
      type: [Array, String, Number],
      default: null
    },
    options: {
      type: Array,
      required: true
    },
    onConfirm: {
      type: Function,
      required: true
    },
    onClear: {
      type: Function,
      required: true
    },
    onChange: {
      type: Function,
      required: true
    }
  },
  setup(props) {
    const {
      mergedClsPrefixRef: mergedClsPrefixRefRtl,
      mergedRtlRef
    } = useConfig(props);
    const rtlEnabledRef = useRtl("DataTable", mergedRtlRef, mergedClsPrefixRefRtl);
    const {
      mergedClsPrefixRef,
      mergedThemeRef,
      localeRef
    } = inject(dataTableInjectionKey);
    const temporalValueRef = ref(props.value);
    const checkboxGroupValueRef = computed(() => {
      const {
        value: temporalValue
      } = temporalValueRef;
      if (!Array.isArray(temporalValue)) return null;
      return temporalValue;
    });
    const radioGroupValueRef = computed(() => {
      const {
        value: temporalValue
      } = temporalValueRef;
      if (shouldUseArrayInSingleMode(props.column)) return Array.isArray(temporalValue) && temporalValue.length && temporalValue[0] || null;
      if (!Array.isArray(temporalValue)) return temporalValue;
      return null;
    });
    function doChange(value) {
      props.onChange(value);
    }
    function handleChange(value) {
      if (props.multiple && Array.isArray(value)) temporalValueRef.value = value;else if (shouldUseArrayInSingleMode(props.column) && !Array.isArray(value)) /** this branch is for compatibility */
        temporalValueRef.value = [value];else temporalValueRef.value = value;
    }
    function handleConfirmClick() {
      doChange(temporalValueRef.value);
      props.onConfirm();
    }
    function handleClearClick() {
      if (props.multiple || shouldUseArrayInSingleMode(props.column)) doChange([]);else doChange(null);
      props.onClear();
    }
    return {
      mergedClsPrefix: mergedClsPrefixRef,
      rtlEnabled: rtlEnabledRef,
      mergedTheme: mergedThemeRef,
      locale: localeRef,
      checkboxGroupValue: checkboxGroupValueRef,
      radioGroupValue: radioGroupValueRef,
      handleChange,
      handleConfirmClick,
      handleClearClick
    };
  },
  render() {
    const {
      mergedTheme,
      locale,
      mergedClsPrefix
    } = this;
    return openBlock(), createElementBlock("div", {
      class: normalizeClass$1([`${mergedClsPrefix}-data-table-filter-menu`, this.rtlEnabled && `${mergedClsPrefix}-data-table-filter-menu--rtl`])
    }, [createVNode(Scrollbar, null, {
      default: () => {
        const {
          checkboxGroupValue,
          handleChange
        } = this;
        return this.multiple ? (openBlock(), createBlock(CheckboxGroup_default, {
          key: 1,
          value: checkboxGroupValue,
          class: normalizeClass$1(`${mergedClsPrefix}-data-table-filter-menu__group`),
          onUpdateValue: handleChange
        }, {
          default: () => this.options.map(option => {
            return openBlock(), createBlock(Checkbox_default, {
              key: option.value,
              theme: mergedTheme.peers.Checkbox,
              themeOverrides: mergedTheme.peerOverrides.Checkbox,
              value: option.value
            }, {
              default: () => option.label
            }, 1032, ["theme", "themeOverrides", "value"]);
          })
        }, 1032, ["value", "class", "onUpdateValue"])) : (openBlock(), createBlock(RadioGroup_default, {
          key: 2,
          name: this.radioGroupName,
          class: normalizeClass$1(`${mergedClsPrefix}-data-table-filter-menu__group`),
          value: this.radioGroupValue,
          onUpdateValue: this.handleChange
        }, {
          default: () => this.options.map(option => (openBlock(), createBlock(Radio_default, {
            key: option.value,
            value: option.value,
            theme: mergedTheme.peers.Radio,
            themeOverrides: mergedTheme.peerOverrides.Radio
          }, {
            default: () => option.label
          }, 1032, ["value", "theme", "themeOverrides"])))
        }, 1032, ["name", "class", "value", "onUpdateValue"]));
      }
    }, 1024), createElementVNode("div", {
      class: normalizeClass$1(`${mergedClsPrefix}-data-table-filter-menu__action`)
    }, [(openBlock(), createBlock(Button, {
      size: "tiny",
      theme: mergedTheme.peers.Button,
      themeOverrides: mergedTheme.peerOverrides.Button,
      onClick: this.handleClearClick
    }, {
      default: () => locale.clear
    }, 1032, ["theme", "themeOverrides", "onClick"])), (openBlock(), createBlock(Button, {
      theme: mergedTheme.peers.Button,
      themeOverrides: mergedTheme.peerOverrides.Button,
      type: "primary",
      size: "tiny",
      onClick: this.handleConfirmClick
    }, {
      default: () => locale.confirm
    }, 1032, ["theme", "themeOverrides", "onClick"]))], 2)], 2);
  }
});
//#endregion
export { FilterMenu_default as default };