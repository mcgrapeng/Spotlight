import { VNodeChild } from "vue";
//#region src/_utils/vue/render.d.ts
declare function render<T extends any[]>(r: string | number | undefined | null | ((...args: [...T]) => VNodeChild) | unknown, ...args: [...T]): VNodeChild;
//#endregion
export { render };