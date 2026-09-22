import { Slots, VNode } from "vue";
//#region src/_utils/vue/get-first-slot-vnode.d.ts
declare function getFirstSlotVNode(slots: Slots, slotName?: string, props?: unknown): VNode | null;
declare function getFirstSlotVNodeWithTypedProps<T>(slotName: string, slot: ((props: T) => VNode[]) | undefined, props: T): VNode | null;
//#endregion
export { getFirstSlotVNode, getFirstSlotVNodeWithTypedProps };