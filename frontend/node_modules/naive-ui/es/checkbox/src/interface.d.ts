//#region src/checkbox/src/interface.d.ts
type OnUpdateChecked = (value: string & number & boolean, e: MouseEvent | KeyboardEvent) => void;
type OnUpdateCheckedImpl = (value: string | number | boolean, e: MouseEvent | KeyboardEvent) => void;
interface CheckboxInst {
  focus: () => void;
  blur: () => void;
}
//#endregion
export { CheckboxInst, OnUpdateChecked, OnUpdateCheckedImpl };