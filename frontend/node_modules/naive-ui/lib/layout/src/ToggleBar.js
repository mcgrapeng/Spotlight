const require_vdom = require("../../vue-jsx-vapor/vdom.js");
let vue = require("vue");
//#region src/layout/src/ToggleBar.tsx
const _hoisted_1 = ["onClick"];
var ToggleBar_default = (0, vue.defineComponent)({
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
			onClick: this.onClick,
			class: require_vdom.normalizeClass(`${clsPrefix}-layout-toggle-bar`)
		}, [(0, vue.createElementVNode)("div", { class: require_vdom.normalizeClass(`${clsPrefix}-layout-toggle-bar__top`) }, null, 2), (0, vue.createElementVNode)("div", { class: require_vdom.normalizeClass(`${clsPrefix}-layout-toggle-bar__bottom`) }, null, 2)], 10, _hoisted_1);
	}
});
//#endregion
module.exports = ToggleBar_default;
