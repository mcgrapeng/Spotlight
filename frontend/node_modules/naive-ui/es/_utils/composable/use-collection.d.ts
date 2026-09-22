import { InjectionKey, Ref } from "vue";
//#region src/_utils/composable/use-collection.d.ts
declare function useInjectionInstanceCollection(injectionName: string | InjectionKey<unknown>, collectionKey: string, registerKeyRef: Ref<string | undefined>): void;
declare function useInjectionCollection(injectionName: string | InjectionKey<unknown>, collectionKey: string, valueRef: Ref<any>): void;
declare function useInjectionElementCollection(injectionName: string | InjectionKey<unknown>, collectionKey: string, getElement: () => HTMLElement | null): void;
//#endregion
export { useInjectionCollection, useInjectionElementCollection, useInjectionInstanceCollection };