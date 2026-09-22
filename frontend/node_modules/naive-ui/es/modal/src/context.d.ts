import { ModalApiInjection, ModalProviderInjection, ModalReactiveListInjection } from "./ModalProvider.js";
//#region src/modal/src/context.d.ts
declare const modalProviderInjectionKey: import("vue").InjectionKey<ModalProviderInjection>;
declare const modalApiInjectionKey: import("vue").InjectionKey<ModalApiInjection>;
declare const modalReactiveListInjectionKey: import("vue").InjectionKey<ModalReactiveListInjection>;
//#endregion
export { modalApiInjectionKey, modalProviderInjectionKey, modalReactiveListInjectionKey };