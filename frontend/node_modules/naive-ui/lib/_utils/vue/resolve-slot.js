Object.defineProperty(exports, Symbol.toStringTag, { value: "Module" });
let vue = require("vue");
//#region src/_utils/vue/resolve-slot.ts
function ensureValidVNode(vnodes) {
	return vnodes.some((child) => {
		if (!(0, vue.isVNode)(child)) return true;
		if (child.type === vue.Comment) return false;
		if (child.type === vue.Fragment && !ensureValidVNode(child.children)) return false;
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
exports.ensureValidVNode = ensureValidVNode;
exports.isSlotEmpty = isSlotEmpty;
exports.resolveSlot = resolveSlot;
exports.resolveSlotWithTypedProps = resolveSlotWithTypedProps;
exports.resolveWrappedSlot = resolveWrappedSlot;
exports.resolveWrappedSlotWithProps = resolveWrappedSlotWithProps;
