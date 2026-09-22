const require_vdom = require("../../vue-jsx-vapor/vdom.js");
const require__internal_icon_src_Icon = require("../../_internal/icon/src/Icon.js");
const require__internal_icons_ChevronRight = require("../../_internal/icons/ChevronRight.js");
let vue = require("vue");
//#region src/layout/src/ToggleButton.tsx
const _hoisted_1 = ["onClick"];
var ToggleButton_default = (0, vue.defineComponent)({
	name: "LayoutToggleButton",
	props: {
		clsPrefix: {
			type: String,
			required: true
		},
		onClick: Function
	},
	render() {
		const { clsPrefix } = this;
		return (0, vue.openBlock)(), (0, vue.createElementBlock)("div", {
			class: require_vdom.normalizeClass(`${clsPrefix}-layout-toggle-button`),
			onClick: this.onClick
		}, [((0, vue.openBlock)(), (0, vue.createBlock)(require__internal_icon_src_Icon, { clsPrefix }, { default: () => ((0, vue.openBlock)(), (0, vue.createBlock)(require__internal_icons_ChevronRight)) }, 1032, ["clsPrefix"]))], 10, _hoisted_1);
	}
});
//#endregion
module.exports = ToggleButton_default;
