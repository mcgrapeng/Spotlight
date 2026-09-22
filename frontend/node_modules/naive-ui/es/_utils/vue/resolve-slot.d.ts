import { Slot, VNodeArrayChildren, VNodeChild } from "vue";
//#region src/_utils/vue/resolve-slot.d.ts
declare function ensureValidVNode(vnodes: VNodeArrayChildren): VNodeArrayChildren | null;
/**
 * We shouldn't use the following functions with slot flags `_: 1, 2, 3`
 */
declare function resolveSlot(slot: Slot | undefined, fallback: () => VNodeArrayChildren): VNodeArrayChildren;
declare function resolveSlotWithTypedProps<T>(slot: Slot<T> | undefined, props: T, fallback: (props: T) => VNodeArrayChildren): VNodeArrayChildren;
/**
 * Resolve slot with wrapper if content exists, no fallback
 */
declare function resolveWrappedSlot(slot: Slot | undefined, wrapper: (children: VNodeArrayChildren | null) => VNodeChild): VNodeChild;
declare function resolveWrappedSlotWithProps(slot: Slot | undefined, props: any, wrapper: (children: VNodeArrayChildren | null) => VNodeChild): VNodeChild;
declare function isSlotEmpty(slot: Slot | undefined): boolean;
//#endregion
export { ensureValidVNode, isSlotEmpty, resolveSlot, resolveSlotWithTypedProps, resolveWrappedSlot, resolveWrappedSlotWithProps };