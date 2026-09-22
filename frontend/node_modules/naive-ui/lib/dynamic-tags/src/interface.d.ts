//#region src/dynamic-tags/src/interface.d.ts
type OnUpdateValue = ((value: string[]) => void) | ((value: DynamicTagsOption[]) => void);
type OnUpdateValueImpl = (value: Array<string | DynamicTagsOption>) => void;
type OnCreate = (label: string) => {
  label: string;
  value: string;
} | string;
interface DynamicTagsOption {
  label: string;
  value: string;
}
interface DynamicTagsInputSlotProps {
  submit: (value: any) => void;
  deactivate: () => void;
}
interface DynamicTagsTriggerSlotProps {
  activate: () => void;
  disabled: boolean;
}
//#endregion
export { DynamicTagsInputSlotProps, DynamicTagsOption, DynamicTagsTriggerSlotProps, OnCreate, OnUpdateValue, OnUpdateValueImpl };