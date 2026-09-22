Object.defineProperty(exports, Symbol.toStringTag, { value: "Module" });
let vue = require("vue");
//#region src/_utils/vue/flatten.ts
function flatten(vNodes, filterCommentNode = true, result = []) {
	vNodes.forEach((vNode) => {
		if (vNode === null) return;
		if (typeof vNode !== "object") {
			if (typeof vNode === "string" || typeof vNode === "number") result.push((0, vue.createTextVNode)(String(vNode)));
			return;
		}
		if (Array.isArray(vNode)) {
			flatten(vNode, filterCommentNode, result);
			return;
		}
		if (vNode.type === vue.Fragment) {
			if (vNode.children === null) return;
			if (Array.isArray(vNode.children)) flatten(vNode.children, filterCommentNode, result);
		} else {
			if (vNode.type === vue.Comment && filterCommentNode) return;
			result.push(vNode);
		}
	});
	return result;
}
//#endregion
exports.flatten = flatten;
