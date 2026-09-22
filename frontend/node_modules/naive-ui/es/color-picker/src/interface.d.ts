import { VNodeChild } from "vue";
//#region src/color-picker/src/interface.d.ts
type OnUpdateValue = (value: string & null) => void;
type OnConfirm = OnUpdateValue;
type OnClear = () => void;
type OnUpdateValueImpl = (value: string | null) => void;
type OnConfirmImpl = OnUpdateValueImpl;
type RenderLabel = (value: string | null) => VNodeChild;
//#endregion
export { OnClear, OnConfirm, OnConfirmImpl, OnUpdateValue, OnUpdateValueImpl, RenderLabel };