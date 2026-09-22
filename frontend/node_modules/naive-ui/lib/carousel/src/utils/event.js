Object.defineProperty(exports, Symbol.toStringTag, { value: "Module" });
//#region src/carousel/src/utils/event.ts
function isTouchEvent(e) {
	return window.TouchEvent && e instanceof window.TouchEvent;
}
//#endregion
exports.isTouchEvent = isTouchEvent;
