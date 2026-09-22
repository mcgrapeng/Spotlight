Object.defineProperty(exports, Symbol.toStringTag, { value: "Module" });
let vue = require("vue");
//#region src/_utils/vue/is-node-v-show-false.ts
function isNodeVShowFalse(vNode) {
	const showDir = vNode.dirs?.find(({ dir }) => dir === vue.vShow);
	return !!(showDir && showDir.value === false);
}
//#endregion
exports.isNodeVShowFalse = isNodeVShowFalse;
