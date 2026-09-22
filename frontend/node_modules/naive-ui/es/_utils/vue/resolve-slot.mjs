import { Comment, Fragment, isVNode } from "vue";
//#region src/_utils/vue/resolve-slot.ts
function ensureValidVNode(vnodes) {
  return vnodes.some(child => {
    if (!isVNode(child)) return true;
    if (child.type === Comment) return false;
    if (child.type === Fragment && !ensureValidVNode(child.children)) return false;
    return true;
  }) ? vnodes : null;
}
/**
* We shouldn't use the following functions with slot flags `_: 1, 2, 3`
*/
function resolveSlot(slot, fallback) {
  return slot && ensureValidVNode(slot()) || fallback();
}
function resolveSlotWithTypedProps(slot, props, fallback) {
  return slot && ensureValidVNode(slot(props)) || fallback(props);
}
/**
* Resolve slot with wrapper if content exists, no fallback
*/
function resolveWrappedSlot(slot, wrapper) {
  return wrapper(slot && ensureValidVNode(slot()) || null);
}
function resolveWrappedSlotWithProps(slot, props, wrapper) {
  return wrapper(slot && ensureValidVNode(slot(props)) || null);
}
function isSlotEmpty(slot) {
  return !(slot && ensureValidVNode(slot()));
}
//#endregion
export { ensureValidVNode, isSlotEmpty, resolveSlot, resolveSlotWithTypedProps, resolveWrappedSlot, resolveWrappedSlotWithProps };