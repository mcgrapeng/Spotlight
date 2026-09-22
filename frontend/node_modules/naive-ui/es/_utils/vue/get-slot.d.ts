import { ComponentPublicInstance, VNodeChild } from "vue";
//#region src/_utils/vue/get-slot.d.ts
declare function getSlot(instance: ComponentPublicInstance, slotName?: string, fallback?: VNodeChild[]): VNodeChild[];
//#endregion
export { getSlot };