import { createInjectionKey } from "../../_utils/vue/create-injection-key.mjs";
//#region src/modal/src/context.ts
const modalProviderInjectionKey = createInjectionKey("n-modal-provider");
const modalApiInjectionKey = createInjectionKey("n-modal-api");
const modalReactiveListInjectionKey = createInjectionKey("n-modal-reactive-list");
//#endregion
export { modalApiInjectionKey, modalProviderInjectionKey, modalReactiveListInjectionKey };