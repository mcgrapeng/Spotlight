import { Ref } from "vue";
//#region src/_utils/composable/use-deferred-true.d.ts
declare function useDeferredTrue(valueRef: Ref<any>, delay: number, shouldDelayRef: Ref<boolean>): Ref<boolean>;
//#endregion
export { useDeferredTrue };