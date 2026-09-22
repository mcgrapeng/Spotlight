Object.defineProperty(exports, Symbol.toStringTag, { value: "Module" });
const require__utils_naive_warn = require("../naive/warn.js");
const require__utils_vue_flatten = require("./flatten.js");
//#region src/_utils/vue/get-first-slot-vnode.ts
function getFirstSlotVNode(slots, slotName = "default", props = void 0) {
	const slot = slots[slotName];
	if (!slot) {
		require__utils_naive_warn.warn("getFirstSlotVNode", `slot[${slotName}] is empty`);
		return null;
	}
	const slotContent = require__utils_vue_flatten.flatten(slot(props));
	if (slotContent.length === 1) return slotContent[0];
	else {
		require__utils_naive_warn.warn("getFirstSlotVNode", `slot[${slotName}] should have exactly one child`);
		return null;
	}
}
function getFirstSlotVNodeWithTypedProps(slotName, slot, props) {
	if (!slot) return null;
	const slotContent = require__utils_vue_flatten.flatten(slot(props));
	if (slotContent.length === 1) return slotContent[0];
	else {
		require__utils_naive_warn.warn("getFirstSlotVNode", `slot[${slotName}] should have exactly one child`);
		return null;
	}
}
//#endregion
exports.getFirstSlotVNode = getFirstSlotVNode;
exports.getFirstSlotVNodeWithTypedProps = getFirstSlotVNodeWithTypedProps;
