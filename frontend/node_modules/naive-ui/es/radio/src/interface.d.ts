//#region src/radio/src/interface.d.ts
type OnUpdateValue = (value: string & number & boolean) => void;
type OnUpdateValueImpl = (value: string | number | boolean) => void;
//#endregion
export { OnUpdateValue, OnUpdateValueImpl };