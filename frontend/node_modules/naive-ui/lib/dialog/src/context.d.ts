import { DialogApiInjection, DialogProviderInjection, DialogReactiveListInjection } from "./DialogProvider.js";
//#region src/dialog/src/context.d.ts
declare const dialogProviderInjectionKey: import("vue").InjectionKey<DialogProviderInjection>;
declare const dialogApiInjectionKey: import("vue").InjectionKey<DialogApiInjection>;
declare const dialogReactiveListInjectionKey: import("vue").InjectionKey<DialogReactiveListInjection>;
//#endregion
export { dialogApiInjectionKey, dialogProviderInjectionKey, dialogReactiveListInjectionKey };