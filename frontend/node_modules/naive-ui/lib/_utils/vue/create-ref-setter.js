Object.defineProperty(exports, Symbol.toStringTag, { value: "Module" });
//#region src/_utils/vue/create-ref-setter.ts
function createRefSetter(ref) {
	return (inst) => {
		if (inst) ref.value = inst.$el;
		else ref.value = null;
	};
}
//#endregion
exports.createRefSetter = createRefSetter;
