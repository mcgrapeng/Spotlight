import { createInjectionKey } from "../_utils/vue/create-injection-key.mjs";
import { computed, inject, onBeforeUnmount, provide } from "vue";
//#region src/_mixins/use-form-item.ts
const formItemInjectionKey = createInjectionKey("n-form-item");
function useFormItem(props, {
  defaultSize = "medium",
  mergedSize,
  mergedDisabled
} = {}) {
  const NFormItem = inject(formItemInjectionKey, null);
  provide(formItemInjectionKey, null);
  const mergedSizeRef = computed(mergedSize ? () => mergedSize(NFormItem) : () => {
    const {
      size
    } = props;
    if (size) return size;
    if (NFormItem) {
      const {
        mergedSize
      } = NFormItem;
      if (mergedSize.value !== void 0) return mergedSize.value;
    }
    return defaultSize;
  });
  const mergedDisabledRef = computed(mergedDisabled ? () => mergedDisabled(NFormItem) : () => {
    const {
      disabled
    } = props;
    if (disabled !== void 0) return disabled;
    if (NFormItem) return NFormItem.disabled.value;
    return false;
  });
  const mergedStatusRef = computed(() => {
    const {
      status
    } = props;
    if (status) return status;
    return NFormItem?.mergedValidationStatus.value;
  });
  onBeforeUnmount(() => {
    if (NFormItem) NFormItem.restoreValidation();
  });
  return {
    mergedSizeRef,
    mergedDisabledRef,
    mergedStatusRef,
    nTriggerFormBlur() {
      if (NFormItem) NFormItem.handleContentBlur();
    },
    nTriggerFormChange() {
      if (NFormItem) NFormItem.handleContentChange();
    },
    nTriggerFormFocus() {
      if (NFormItem) NFormItem.handleContentFocus();
    },
    nTriggerFormInput() {
      if (NFormItem) NFormItem.handleContentInput();
    }
  };
}
//#endregion
export { useFormItem as default, formItemInjectionKey };