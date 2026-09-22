import { createInjectionKey } from "../../_utils/vue/create-injection-key.mjs";
//#region src/form/src/context.ts
const formInjectionKey = createInjectionKey("n-form");
const formItemInstsInjectionKey = createInjectionKey("n-form-item-insts");
//#endregion
export { formInjectionKey, formItemInstsInjectionKey };