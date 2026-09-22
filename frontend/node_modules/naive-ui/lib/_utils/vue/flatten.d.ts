import { VNode, VNodeChild } from "vue";
//#region src/_utils/vue/flatten.d.ts
declare function flatten(vNodes: VNodeChild[], filterCommentNode?: boolean, result?: VNode[]): VNode[];
//#endregion
export { flatten };