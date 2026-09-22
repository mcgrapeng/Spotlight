import { createInjectionKey } from "../../_utils/vue/create-injection-key.mjs";
//#region src/message/src/context.ts
const messageApiInjectionKey = createInjectionKey("n-message-api");
const messageProviderInjectionKey = createInjectionKey("n-message-provider");
//#endregion
export { messageApiInjectionKey, messageProviderInjectionKey };