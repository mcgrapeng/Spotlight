Object.defineProperty(exports, Symbol.toStringTag, { value: "Module" });
const require__utils_env_is_browser = require("../env/is-browser.js");
let vue = require("vue");
//#region src/_utils/composable/use-is-composing.ts
const isComposingRef = (0, vue.ref)(false);
function compositionStartHandler() {
	isComposingRef.value = true;
}
function compositionEndHandler() {
	isComposingRef.value = false;
}
let mountedCount = 0;
function useIsComposing() {
	if (require__utils_env_is_browser.isBrowser) {
		(0, vue.onBeforeMount)(() => {
			if (!mountedCount) {
				window.addEventListener("compositionstart", compositionStartHandler);
				window.addEventListener("compositionend", compositionEndHandler);
			}
			mountedCount++;
		});
		(0, vue.onBeforeUnmount)(() => {
			if (mountedCount <= 1) {
				window.removeEventListener("compositionstart", compositionStartHandler);
				window.removeEventListener("compositionend", compositionEndHandler);
				mountedCount = 0;
			} else mountedCount--;
		});
	}
	return isComposingRef;
}
//#endregion
exports.useIsComposing = useIsComposing;
