import { createInjectionKey } from "../../_utils/vue/create-injection-key.mjs";
//#region src/grid/src/config.ts
const defaultSpan = 1;
const gridInjectionKey = createInjectionKey("n-grid");
//#endregion
export { defaultSpan, gridInjectionKey };