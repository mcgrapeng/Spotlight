const require_vdom = require("../../vue-jsx-vapor/vdom.js");
let vue = require("vue");
//#region src/dropdown/src/DropdownDivider.tsx
var DropdownDivider_default = (0, vue.defineComponent)({
	name: "DropdownDivider",
	props: { clsPrefix: {
		type: String,
		required: true
	} },
	render() {
		return (0, vue.openBlock)(), (0, vue.createElementBlock)("div", { class: require_vdom.normalizeClass(`${this.clsPrefix}-dropdown-divider`) }, null, 2);
	}
});
//#endregion
module.exports = DropdownDivider_default;
