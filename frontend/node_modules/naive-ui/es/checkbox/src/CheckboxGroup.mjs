import { createInjectionKey } from "../../_utils/vue/create-injection-key.mjs";
import { warnOnce } from "../../_utils/naive/warn.mjs";
import { call } from "../../_utils/vue/call.mjs";
import useConfig from "../../_mixins/use-config.mjs";
import useFormItem from "../../_mixins/use-form-item.mjs";
import { normalizeClass as normalizeClass$1, normalizeVNode } from "../../vue-jsx-vapor/vdom.mjs";
import Checkbox_default from "./Checkbox.mjs";
import { Fragment, computed, createBlock, createElementBlock, defineComponent, openBlock, provide, ref, toRef, watchEffect } from "vue";
import { useMergedState } from "vooks";
//#region src/checkbox/src/CheckboxGroup.tsx
const checkboxGroupInjectionKey = createInjectionKey("n-checkbox-group");
const checkboxGroupProps = {
  min: Number,
  max: Number,
  size: String,
  options: Array,
  labelField: {
    type: String,
    default: "label"
  },
  valueField: {
    type: String,
    default: "value"
  },
  value: Array,
  defaultValue: {
    type: Array,
    default: null
  },
  disabled: {
    type: Boolean,
    default: void 0
  },
  "onUpdate:value": [Function, Array],
  onUpdateValue: [Function, Array],
  onChange: [Function, Array]
};
var CheckboxGroup_default = defineComponent({
  name: "CheckboxGroup",
  props: checkboxGroupProps,
  setup(props) {
    if (process.env.NODE_ENV !== "production") watchEffect(() => {
      if (props.onChange !== void 0) warnOnce("checkbox-group", "`on-change` is deprecated, please use `on-update:value` instead.");
    });
    const {
      mergedClsPrefixRef
    } = useConfig(props);
    const formItem = useFormItem(props);
    const {
      mergedSizeRef,
      mergedDisabledRef
    } = formItem;
    const uncontrolledValueRef = ref(props.defaultValue);
    const controlledValueRef = computed(() => props.value);
    const mergedValueRef = useMergedState(controlledValueRef, uncontrolledValueRef);
    const checkedCount = computed(() => {
      return mergedValueRef.value?.length || 0;
    });
    const valueSetRef = computed(() => {
      if (Array.isArray(mergedValueRef.value)) return new Set(mergedValueRef.value);
      return /* @__PURE__ */new Set();
    });
    function toggleCheckbox(checked, checkboxValue) {
      const {
        nTriggerFormInput,
        nTriggerFormChange
      } = formItem;
      const {
        onChange,
        "onUpdate:value": _onUpdateValue,
        onUpdateValue
      } = props;
      if (Array.isArray(mergedValueRef.value)) {
        const groupValue = Array.from(mergedValueRef.value);
        const index = groupValue.findIndex(value => value === checkboxValue);
        if (checked) {
          if (!~index) {
            groupValue.push(checkboxValue);
            if (onUpdateValue) call(onUpdateValue, groupValue, {
              actionType: "check",
              value: checkboxValue
            });
            if (_onUpdateValue) call(_onUpdateValue, groupValue, {
              actionType: "check",
              value: checkboxValue
            });
            nTriggerFormInput();
            nTriggerFormChange();
            uncontrolledValueRef.value = groupValue;
            if (onChange) call(onChange, groupValue);
          }
        } else if (~index) {
          groupValue.splice(index, 1);
          if (onUpdateValue) call(onUpdateValue, groupValue, {
            actionType: "uncheck",
            value: checkboxValue
          });
          if (_onUpdateValue) call(_onUpdateValue, groupValue, {
            actionType: "uncheck",
            value: checkboxValue
          });
          if (onChange) call(onChange, groupValue);
          uncontrolledValueRef.value = groupValue;
          nTriggerFormInput();
          nTriggerFormChange();
        }
      } else if (checked) {
        if (onUpdateValue) call(onUpdateValue, [checkboxValue], {
          actionType: "check",
          value: checkboxValue
        });
        if (_onUpdateValue) call(_onUpdateValue, [checkboxValue], {
          actionType: "check",
          value: checkboxValue
        });
        if (onChange) call(onChange, [checkboxValue]);
        uncontrolledValueRef.value = [checkboxValue];
        nTriggerFormInput();
        nTriggerFormChange();
      } else {
        if (onUpdateValue) call(onUpdateValue, [], {
          actionType: "uncheck",
          value: checkboxValue
        });
        if (_onUpdateValue) call(_onUpdateValue, [], {
          actionType: "uncheck",
          value: checkboxValue
        });
        if (onChange) call(onChange, []);
        uncontrolledValueRef.value = [];
        nTriggerFormInput();
        nTriggerFormChange();
      }
    }
    provide(checkboxGroupInjectionKey, {
      checkedCountRef: checkedCount,
      maxRef: toRef(props, "max"),
      minRef: toRef(props, "min"),
      valueSetRef,
      disabledRef: mergedDisabledRef,
      mergedSizeRef,
      toggleCheckbox
    });
    return {
      mergedClsPrefix: mergedClsPrefixRef
    };
  },
  render() {
    const {
      options,
      labelField,
      valueField
    } = this.$props;
    return openBlock(), createElementBlock("div", {
      class: normalizeClass$1(`${this.mergedClsPrefix}-checkbox-group`),
      role: "group"
    }, [options ? (openBlock(), createElementBlock(Fragment, {
      key: 0
    }, [normalizeVNode(() => options.map(option => {
      const value = option[valueField];
      return openBlock(), createBlock(Checkbox_default, {
        key: value,
        value,
        disabled: option.disabled,
        label: option[labelField]
      }, null, 8, ["value", "disabled", "label"]);
    }))], 64)) : (openBlock(), createElementBlock(Fragment, {
      key: 1
    }, [normalizeVNode(() => this.$slots.default?.())], 64))], 2);
  }
});
//#endregion
export { checkboxGroupInjectionKey, checkboxGroupProps, CheckboxGroup_default as default };