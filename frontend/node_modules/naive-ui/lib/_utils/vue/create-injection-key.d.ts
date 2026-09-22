import { InjectionKey } from "vue";
//#region src/_utils/vue/create-injection-key.d.ts
declare function createInjectionKey<T>(key: string): InjectionKey<T>;
//#endregion
export { createInjectionKey };