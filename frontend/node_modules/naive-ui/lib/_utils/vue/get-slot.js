Object.defineProperty(exports, Symbol.toStringTag, { value: "Module" });
//#region src/_utils/vue/get-slot.ts
function getSlot(instance, slotName = "default", fallback = []) {
	const slot = instance.$slots[slotName];
	if (slot === void 0) return fallback;
	return slot();
}
//#endregion
exports.getSlot = getSlot;
