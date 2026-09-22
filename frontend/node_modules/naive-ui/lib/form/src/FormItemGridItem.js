Object.defineProperties(exports, {
	__esModule: { value: true },
	[Symbol.toStringTag]: { value: "Module" }
});
const require__utils_vue_keep = require("../../_utils/vue/keep.js");
const require__utils_vue_keysOf = require("../../_utils/vue/keysOf.js");
const require_form_src_FormItem = require("./FormItem.js");
const require_grid_src_GridItem = require("../../grid/src/GridItem.js");
let vue = require("vue");
//#region src/form/src/FormItemGridItem.ts
const formItemGiProps = {
	...require_grid_src_GridItem.gridItemProps,
	...require_form_src_FormItem.formItemProps
};
const formItemGiPropKeys = require__utils_vue_keysOf.keysOf(formItemGiProps);
var FormItemGridItem_default = (0, vue.defineComponent)({
	__GRID_ITEM__: true,
	name: "FormItemGridItem",
	alias: ["FormItemGi"],
	props: formItemGiProps,
	slots: Object,
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
		return (0, vue.h)(require_grid_src_GridItem.default, require__utils_vue_keep.keep(this.$.vnode.props || {}, require_grid_src_GridItem.gridItemPropKeys), { default: () => {
			const itemProps = require__utils_vue_keep.keep(this.$props, require_form_src_FormItem.formItemPropKeys);
			return (0, vue.h)(require_form_src_FormItem.default, {
				ref: "formItemInstRef",
				...itemProps
			}, this.$slots);
		} });
	}
});
//#endregion
exports.default = FormItemGridItem_default;
exports.formItemGiPropKeys = formItemGiPropKeys;
exports.formItemGiProps = formItemGiProps;
