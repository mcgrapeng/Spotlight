Object.defineProperty(exports, Symbol.toStringTag, { value: "Module" });
//#region src/_utils/vue/create-data-key.ts
function createDataKey(key) {
	return typeof key === "string" ? `s-${key}` : `n-${key}`;
}
//#endregion
exports.createDataKey = createDataKey;
