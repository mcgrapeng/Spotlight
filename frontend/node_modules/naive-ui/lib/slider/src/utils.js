Object.defineProperty(exports, Symbol.toStringTag, { value: "Module" });
let vue = require("vue");
//#region src/slider/src/utils.ts
function isTouchEvent(e) {
	return window.TouchEvent && e instanceof window.TouchEvent;
}
function useRefs() {
	const refs = /* @__PURE__ */ new Map();
	const setRefs = (index) => (el) => {
		refs.set(index, el);
	};
	(0, vue.onBeforeUpdate)(() => {
		refs.clear();
	});
	return [refs, setRefs];
}
//#endregion
exports.isTouchEvent = isTouchEvent;
exports.useRefs = useRefs;
