import { VNode } from "vue";
//#region src/_utils/vue/get-v-node-children.d.ts
declare function getVNodeChildren(vNode: VNode, slotName?: string, fallback?: VNode[]): VNode[];
//#endregion
export { getVNodeChildren };