import { MessageApiInjection, MessageProviderSetupProps } from "./MessageProvider.js";
import { Ref } from "vue";
//#region src/message/src/context.d.ts
declare const messageApiInjectionKey: import("vue").InjectionKey<MessageApiInjection>;
declare const messageProviderInjectionKey: import("vue").InjectionKey<{
  props: MessageProviderSetupProps;
  mergedClsPrefixRef: Ref<string>;
}>;
//#endregion
export { messageApiInjectionKey, messageProviderInjectionKey };