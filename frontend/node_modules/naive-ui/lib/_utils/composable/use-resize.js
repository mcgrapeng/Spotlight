Object.defineProperty(exports, Symbol.toStringTag, { value: "Module" });
let vue = require("vue");
let vueuc = require("vueuc");
//#region src/_utils/composable/use-resize.ts
function useOnResize(elRef, onResize) {
	if (onResize) {
		(0, vue.onMounted)(() => {
			const { value: el } = elRef;
			if (el) vueuc.resizeObserverManager.registerHandler(el, onResize);
		});
		(0, vue.watch)(elRef, (_, oldEl) => {
			if (oldEl) vueuc.resizeObserverManager.unregisterHandler(oldEl);
		}, { deep: false });
		(0, vue.onBeforeUnmount)(() => {
			const { value: el } = elRef;
			if (el) vueuc.resizeObserverManager.unregisterHandler(el);
		});
	}
}
//#endregion
exports.useOnResize = useOnResize;
