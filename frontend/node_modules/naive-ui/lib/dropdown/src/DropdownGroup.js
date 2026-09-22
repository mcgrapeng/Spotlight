const require__utils_naive_warn = require("../../_utils/naive/warn.js");
const require_vdom = require("../../vue-jsx-vapor/vdom.js");
const require_dropdown_src_DropdownDivider = require("./DropdownDivider.js");
const require_dropdown_src_DropdownGroupHeader = require("./DropdownGroupHeader.js");
const require_dropdown_src_utils = require("./utils.js");
const require_dropdown_src_DropdownOption = require("./DropdownOption.js");
let vue = require("vue");
//#region src/dropdown/src/DropdownGroup.tsx
var DropdownGroup_default = (0, vue.defineComponent)({
	name: "NDropdownGroup",
	props: {
		clsPrefix: {
			type: String,
			required: true
		},
		tmNode: {
			type: Object,
			required: true
		},
		parentKey: {
			type: [String, Number],
			default: null
		}
	},
	render() {
		const { tmNode, parentKey, clsPrefix } = this;
		const { children } = tmNode;
		return (0, vue.openBlock)(), (0, vue.createElementBlock)(vue.Fragment, null, [((0, vue.openBlock)(), (0, vue.createBlock)(require_dropdown_src_DropdownGroupHeader, {
			clsPrefix,
			tmNode,
			key: tmNode.key
		}, null, 8, ["clsPrefix", "tmNode"])), require_vdom.normalizeVNode(() => children?.map((child) => {
			const { rawNode } = child;
			if (rawNode.show === false) return null;
			if (require_dropdown_src_utils.isDividerNode(rawNode)) return (0, vue.h)(require_dropdown_src_DropdownDivider, {
				clsPrefix,
				key: child.key
			});
			if (child.isGroup) {
				require__utils_naive_warn.warn("dropdown", "`group` node is not allowed to be put in `group` node.");
				return null;
			}
			return (0, vue.openBlock)(), (0, vue.createBlock)(require_dropdown_src_DropdownOption, {
				clsPrefix,
				tmNode: child,
				parentKey,
				key: child.key
			}, null, 8, [
				"clsPrefix",
				"tmNode",
				"parentKey"
			]);
		}))], 64);
	}
});
//#endregion
module.exports = DropdownGroup_default;
