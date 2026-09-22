import { InputWrappedRef } from "./interface.js";
import { UnwrapRef } from "vue";
//#region src/input/src/public-types.d.ts
type InputSize = 'tiny' | 'small' | 'medium' | 'large';
type InputInst = UnwrapRef<InputWrappedRef>;
//#endregion
export { InputInst, InputSize };