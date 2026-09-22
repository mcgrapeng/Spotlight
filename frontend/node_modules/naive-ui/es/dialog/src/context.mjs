import { createInjectionKey } from "../../_utils/vue/create-injection-key.mjs";
//#region src/dialog/src/context.ts
const dialogProviderInjectionKey = createInjectionKey("n-dialog-provider");
const dialogApiInjectionKey = createInjectionKey("n-dialog-api");
const dialogReactiveListInjectionKey = createInjectionKey("n-dialog-reactive-list");
//#endregion
export { dialogApiInjectionKey, dialogProviderInjectionKey, dialogReactiveListInjectionKey };