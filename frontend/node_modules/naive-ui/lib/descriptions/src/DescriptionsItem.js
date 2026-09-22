Object.defineProperties(exports, {
	__esModule: { value: true },
	[Symbol.toStringTag]: { value: "Module" }
});
const require_descriptions_src_utils = require("./utils.js");
let vue = require("vue");
//#region src/descriptions/src/DescriptionsItem.ts
const descriptionsItemProps = {
	label: String,
	span: {
		type: Number,
		default: 1
	},
	labelClass: String,
	labelStyle: [Object, String],
	contentClass: String,
	contentStyle: [Object, String]
};
var DescriptionsItem_default = (0, vue.defineComponent)({
	name: "DescriptionsItem",
	[require_descriptions_src_utils.DESCRIPTION_ITEM_FLAG]: true,
	props: descriptionsItemProps,
	slots: Object,
	render() {
		return null;
	}
});
//#endregion
exports.default = DescriptionsItem_default;
exports.descriptionsItemProps = descriptionsItemProps;
