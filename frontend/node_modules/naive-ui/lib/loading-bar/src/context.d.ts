import { LoadingBarInst, LoadingBarProviderSetupProps } from "./LoadingBarProvider.js";
import { Ref } from "vue";
//#region src/loading-bar/src/context.d.ts
declare const loadingBarProviderInjectionKey: import("vue").InjectionKey<{
  props: LoadingBarProviderSetupProps;
  mergedClsPrefixRef: Ref<string>;
}>;
declare const loadingBarApiInjectionKey: import("vue").InjectionKey<LoadingBarInst>;
//#endregion
export { loadingBarApiInjectionKey, loadingBarProviderInjectionKey };