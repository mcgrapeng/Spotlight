Object.defineProperty(exports, Symbol.toStringTag, { value: "Module" });
//#region src/_utils/event/index.ts
const eventSet = /* @__PURE__ */ new WeakSet();
function markEventEffectPerformed(event) {
	eventSet.add(event);
}
function eventEffectNotPerformed(event) {
	return !eventSet.has(event);
}
//#endregion
exports.eventEffectNotPerformed = eventEffectNotPerformed;
exports.markEventEffectPerformed = markEventEffectPerformed;
