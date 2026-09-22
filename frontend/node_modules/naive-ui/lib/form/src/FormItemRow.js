Object.defineProperties(exports, {
	__esModule: { value: true },
	[Symbol.toStringTag]: { value: "Module" }
});
const require__utils_vue_keep = require("../../_utils/vue/keep.js");
const require_legacy_grid_src_Row = require("../../legacy-grid/src/Row.js");
const require_form_src_FormItemCol = require("./FormItemCol.js");
let vue = require("vue");
//#region src/form/src/FormItemRow.ts
const formItemRowProps = {
	...require_legacy_grid_src_Row.rowProps,
	...require_form_src_FormItemCol.formItemColProps
};
var FormItemRow_default = (0, vue.defineComponent)({
	name: "FormItemRow",
	props: formItemRowProps,
	setup() {
		const formItemColInstRef = (0, vue.ref)(null);
		const validate = ((...args) => {
			const { value } = formItemColInstRef;
			if (value) return value.validate(...args);
		});
		const restoreValidation = () => {
			const { value } = formItemColInstRef;
			if (value) value.restoreValidation();
		};
		return {
			formItemColInstRef,
			validate,
			restoreValidation
		};
	},
	render() {
		return (0, vue.h)(require_legacy_grid_src_Row.default, require__utils_vue_keep.keep(this.$props, require_legacy_grid_src_Row.rowPropKeys), { default: () => {
			const colProps = require__utils_vue_keep.keep(this.$props, require_form_src_FormItemCol.formItemColPropKeys);
			return (0, vue.h)(require_form_src_FormItemCol.default, {
				ref: "formItemColInstRef",
				...colProps,
				span: 24
			}, this.$slots);
		} });
	}
});
//#endregion
exports.default = FormItemRow_default;
exports.formItemRowProps = formItemRowProps;
