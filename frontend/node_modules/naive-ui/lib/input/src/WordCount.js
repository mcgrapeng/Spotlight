const require__utils_vue_resolve_slot = require("../../_utils/vue/resolve-slot.js");
const require_vdom = require("../../vue-jsx-vapor/vdom.js");
const require_input_src_interface = require("./interface.js");
const require_input_src_utils = require("./utils.js");
let vue = require("vue");
//#region src/input/src/WordCount.tsx
var WordCount_default = (0, vue.defineComponent)({
	name: "InputWordCount",
	setup(_, { slots }) {
		const { mergedValueRef, maxlengthRef, mergedClsPrefixRef, countGraphemesRef } = (0, vue.inject)(require_input_src_interface.inputInjectionKey);
		const wordCountRef = (0, vue.computed)(() => {
			const { value: mergedValue } = mergedValueRef;
			if (mergedValue === null || Array.isArray(mergedValue)) return 0;
			return (countGraphemesRef.value || require_input_src_utils.len)(mergedValue);
		});
		return () => {
			const { value: maxlength } = maxlengthRef;
			const { value: mergedValue } = mergedValueRef;
			return (0, vue.openBlock)(), (0, vue.createElementBlock)("span", { class: require_vdom.normalizeClass(`${mergedClsPrefixRef.value}-input-word-count`) }, [require_vdom.normalizeVNode(() => require__utils_vue_resolve_slot.resolveSlotWithTypedProps(slots.default, { value: mergedValue === null || Array.isArray(mergedValue) ? "" : mergedValue }, () => [maxlength === void 0 ? wordCountRef.value : `${wordCountRef.value} / ${maxlength}`]))], 2);
		};
	}
});
//#endregion
module.exports = WordCount_default;
