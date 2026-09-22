Object.defineProperties(exports, {
	__esModule: { value: true },
	[Symbol.toStringTag]: { value: "Module" }
});
const require__utils_vue_keep = require("../../_utils/vue/keep.js");
const require__utils_vue_keysOf = require("../../_utils/vue/keysOf.js");
const require_form_src_FormItem = require("./FormItem.js");
const require_legacy_grid_src_Col = require("../../legacy-grid/src/Col.js");
let vue = require("vue");
//#region src/form/src/FormItemCol.ts
const formItemColProps = {
	...require_legacy_grid_src_Col.colProps,
	...require_form_src_FormItem.formItemProps
};
const formItemColPropKeys = require__utils_vue_keysOf.keysOf(formItemColProps);
var FormItemCol_default = (0, vue.defineComponent)({
	name: "FormItemCol",
	props: formItemColProps,
	setup() {
		const formItemInstRef = (0, vue.ref)(null);
		const validate = ((...args) => {
			const { value } = formItemInstRef;
			if (value) return value.validate(...args);
		});
		const restoreValidation = () => {
			const { value } = formItemInstRef;
			if (value) value.restoreValidation();
		};
		return {
			formItemInstRef,
			validate,
			restoreValidation
		};
	},
	render() {
		return (0, vue.h)(require_legacy_grid_src_Col.default, require__utils_vue_keep.keep(this.$props, require_legacy_grid_src_Col.colPropKeys), { default: () => {
			const itemProps = require__utils_vue_keep.keep(this.$props, require_form_src_FormItem.formItemPropKeys);
			return (0, vue.h)(require_form_src_FormItem.default, {
				ref: "formItemInstRef",
				...itemProps
			}, this.$slots);
		} });
	}
});
//#endregion
exports.default = FormItemCol_default;
exports.formItemColPropKeys = formItemColPropKeys;
exports.formItemColProps = formItemColProps;
