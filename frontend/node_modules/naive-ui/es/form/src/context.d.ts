import { FormInjection } from "./interface.js";
//#region src/form/src/context.d.ts
declare const formInjectionKey: import("vue").InjectionKey<FormInjection>;
declare const formItemInstsInjectionKey: import("vue").InjectionKey<unknown>;
//#endregion
export { formInjectionKey, formItemInstsInjectionKey };