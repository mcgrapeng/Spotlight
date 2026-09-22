Object.defineProperty(exports, Symbol.toStringTag, { value: "Module" });
//#region src/discrete/src/InjectionExtractor.tsx
const NInjectionExtractor = (0, require("vue").defineComponent)({
	name: "InjectionExtractor",
	props: { onSetup: Function },
	setup(props, { slots }) {
		props.onSetup?.();
		return () => slots.default?.();
	}
});
//#endregion
exports.NInjectionExtractor = NInjectionExtractor;
