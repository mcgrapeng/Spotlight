import { InputNumberSize } from "./public-types.js";
//#region src/input-number/src/interface.d.ts
type OnUpdateValue = (value: number | null) => void;
type Size = InputNumberSize;
interface InputNumberInst {
  focus: () => void;
  blur: () => void;
  select: () => void;
}
//#endregion
export { InputNumberInst, OnUpdateValue, Size };