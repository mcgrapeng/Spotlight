import { Ref } from "vue";
//#region src/_utils/vue/create-ref-setter.d.ts
declare function createRefSetter(ref: Ref<HTMLElement | null>): any;
//#endregion
export { createRefSetter };