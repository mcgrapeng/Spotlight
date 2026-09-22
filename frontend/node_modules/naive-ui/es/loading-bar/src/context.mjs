import { createInjectionKey } from "../../_utils/vue/create-injection-key.mjs";
//#region src/loading-bar/src/context.ts
const loadingBarProviderInjectionKey = createInjectionKey("n-loading-bar");
const loadingBarApiInjectionKey = createInjectionKey("n-loading-bar-api");
//#endregion
export { loadingBarApiInjectionKey, loadingBarProviderInjectionKey };