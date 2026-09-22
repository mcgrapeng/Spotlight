import { createInjectionKey } from "../../_utils/vue/create-injection-key.mjs";
import { warnOnce } from "../../_utils/naive/warn.mjs";
import { call } from "../../_utils/vue/call.mjs";
import useConfig from "../../_mixins/use-config.mjs";
import useFormItem from "../../_mixins/use-form-item.mjs";
import { inject, ref, toRef, watchEffect } from "vue";
import { useMemo, useMergedState } from "vooks";
//#region src/radio/src/use-radio.ts
const radioBaseProps = {
  name: String,
  value: {
    type: [String, Number, Boolean],
    default: "on"
  },
  checked: {
    type: Boolean,
    default: void 0
  },
  defaultChecked: Boolean,
  disabled: {
    type: Boolean,
    default: void 0
  },
  label: String,
  size: String,
  onUpdateChecked: [Function, Array],
  "onUpdate:checked": [Function, Array],
  checkedValue: {
    type: Boolean,
    default: void 0
  }
};
const radioGroupInjectionKey = createInjectionKey("n-radio-group");
function setup(props) {
  if (process.env.NODE_ENV !== "production") watchEffect(() => {
    if (props.checkedValue !== void 0) warnOnce("radio", "`checked-value` is deprecated, please use `checked` instead.");
  });
  const NRadioGroup = inject(radioGroupInjectionKey, null);
  const {
    mergedClsPrefixRef,
    mergedComponentPropsRef
  } = useConfig(props);
  const formItem = useFormItem(props, {
    mergedSize(NFormItem) {
      const {
        size
      } = props;
      if (size !== void 0) return size;
      if (NRadioGroup) {
        const {
          mergedSizeRef: {
            value: mergedSize
          }
        } = NRadioGroup;
        if (mergedSize !== void 0) return mergedSize;
      }
      if (NFormItem) return NFormItem.mergedSize.value;
      const configSize = mergedComponentPropsRef?.value?.Radio?.size;
      if (configSize) return configSize;
      return "medium";
    },
    mergedDisabled(NFormItem) {
      if (props.disabled) return true;
      if (NRadioGroup?.disabledRef.value) return true;
      if (NFormItem?.disabled.value) return true;
      return false;
    }
  });
  const {
    mergedSizeRef,
    mergedDisabledRef
  } = formItem;
  const inputRef = ref(null);
  const labelRef = ref(null);
  const uncontrolledCheckedRef = ref(props.defaultChecked);
  const controlledCheckedRef = toRef(props, "checked");
  const mergedCheckedRef = useMergedState(controlledCheckedRef, uncontrolledCheckedRef);
  const renderSafeCheckedRef = useMemo(() => {
    if (NRadioGroup) return NRadioGroup.valueRef.value === props.value;
    return mergedCheckedRef.value;
  });
  const mergedNameRef = useMemo(() => {
    const {
      name
    } = props;
    if (name !== void 0) return name;
    if (NRadioGroup) return NRadioGroup.nameRef.value;
  });
  const focusRef = ref(false);
  function doUpdateChecked() {
    if (NRadioGroup) {
      const {
        doUpdateValue
      } = NRadioGroup;
      const {
        value
      } = props;
      call(doUpdateValue, value);
    } else {
      const {
        onUpdateChecked,
        "onUpdate:checked": _onUpdateChecked
      } = props;
      const {
        nTriggerFormInput,
        nTriggerFormChange
      } = formItem;
      if (onUpdateChecked) call(onUpdateChecked, true);
      if (_onUpdateChecked) call(_onUpdateChecked, true);
      nTriggerFormInput();
      nTriggerFormChange();
      uncontrolledCheckedRef.value = true;
    }
  }
  function toggle() {
    if (mergedDisabledRef.value) return;
    if (!renderSafeCheckedRef.value) doUpdateChecked();
  }
  function handleRadioInputChange() {
    toggle();
    if (inputRef.value) inputRef.value.checked = renderSafeCheckedRef.value;
  }
  function handleRadioInputBlur() {
    focusRef.value = false;
  }
  function handleRadioInputFocus() {
    focusRef.value = true;
  }
  return {
    mergedClsPrefix: NRadioGroup ? NRadioGroup.mergedClsPrefixRef : mergedClsPrefixRef,
    inputRef,
    labelRef,
    mergedName: mergedNameRef,
    mergedDisabled: mergedDisabledRef,
    renderSafeChecked: renderSafeCheckedRef,
    focus: focusRef,
    mergedSize: mergedSizeRef,
    handleRadioInputChange,
    handleRadioInputBlur,
    handleRadioInputFocus
  };
}
//#endregion
export { radioBaseProps, radioGroupInjectionKey, setup };