Object.defineProperty(exports, Symbol.toStringTag, { value: "Module" });
let vue = require("vue");
//#region src/_utils/composable/use-deferred-true.ts
function useDeferredTrue(valueRef, delay, shouldDelayRef) {
	if (!delay) return valueRef;
	const delayedRef = (0, vue.ref)(valueRef.value);
	let timerId = null;
	(0, vue.watch)(valueRef, (value) => {
		if (timerId !== null) window.clearTimeout(timerId);
		if (value === true) {
			if (shouldDelayRef && !shouldDelayRef.value) delayedRef.value = true;
			else timerId = window.setTimeout(() => {
				delayedRef.value = true;
			}, delay);
		} else delayedRef.value = false;
	});
	return delayedRef;
}
//#endregion
exports.useDeferredTrue = useDeferredTrue;
