Object.defineProperty(exports, Symbol.toStringTag, { value: "Module" });
//#region src/_utils/vue/omit.ts
function omit(object, keys = [], rest) {
	const omitedObject = {};
	Object.getOwnPropertyNames(object).forEach((originalKey) => {
		if (!keys.includes(originalKey)) omitedObject[originalKey] = object[originalKey];
	});
	return Object.assign(omitedObject, rest);
}
//#endregion
exports.omit = omit;
