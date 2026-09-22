Object.defineProperty(exports, Symbol.toStringTag, { value: "Module" });
//#region src/_utils/vue/wrapper.tsx
const Wrapper = (0, require("vue").defineComponent)({ render() {
	return this.$slots.default?.();
} });
//#endregion
exports.Wrapper = Wrapper;
