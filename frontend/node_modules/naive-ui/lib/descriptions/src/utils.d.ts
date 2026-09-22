import { VNodeChild } from "vue";
//#region src/descriptions/src/utils.d.ts
declare const DESCRIPTION_ITEM_FLAG = "DESCRIPTION_ITEM_FLAG";
declare function isDescriptionsItem(vNode: VNodeChild): boolean;
//#endregion
export { DESCRIPTION_ITEM_FLAG, isDescriptionsItem };