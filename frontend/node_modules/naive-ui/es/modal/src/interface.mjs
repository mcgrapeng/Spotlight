import { createInjectionKey } from "../../_utils/vue/create-injection-key.mjs";
//#region src/modal/src/interface.ts
const modalBodyInjectionKey = createInjectionKey("n-modal-body");
const modalProviderInjectionKey = createInjectionKey("n-modal-provider");
const modalInjectionKey = createInjectionKey("n-modal");
//#endregion
export { modalBodyInjectionKey, modalInjectionKey, modalProviderInjectionKey };