import { FormItemSize, FormValidationStatus } from "../form/src/public-types.js";
import { ComputedRef, Ref } from "vue";
//#region src/_mixins/use-form-item.d.ts
type AllowedSize = 'tiny' | 'small' | 'medium' | 'large' | 'huge' | number;
interface FormItemInjection {
  path: Ref<string | undefined>;
  disabled: Ref<boolean>;
  mergedSize: ComputedRef<FormItemSize>;
  mergedValidationStatus: ComputedRef<FormValidationStatus | undefined>;
  restoreValidation: () => void;
  handleContentBlur: () => void;
  handleContentFocus: () => void;
  handleContentInput: () => void;
  handleContentChange: () => void;
}
declare const formItemInjectionKey: import("vue").InjectionKey<FormItemInjection | null>;
interface UseFormItemOptions<T> {
  defaultSize?: FormItemSize;
  mergedSize?: (formItem: FormItemInjection | null) => T;
  mergedDisabled?: (formItem: FormItemInjection | null) => boolean;
}
interface UseFormItemProps<T> {
  size?: T;
  disabled?: boolean;
  status?: FormValidationStatus;
}
interface UseFormItem<T> {
  mergedSizeRef: ComputedRef<T>;
  mergedDisabledRef: ComputedRef<boolean>;
  mergedStatusRef: ComputedRef<FormValidationStatus | undefined>;
  nTriggerFormBlur: () => void;
  nTriggerFormChange: () => void;
  nTriggerFormFocus: () => void;
  nTriggerFormInput: () => void;
}
declare function useFormItem<T extends AllowedSize = FormItemSize>(props: UseFormItemProps<T>, { defaultSize, mergedSize, mergedDisabled }?: UseFormItemOptions<T>): UseFormItem<T>;
//#endregion
export { FormItemInjection, UseFormItem, useFormItem as default, formItemInjectionKey };