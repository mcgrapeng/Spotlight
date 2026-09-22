const require_vdom = require("../../vue-jsx-vapor/vdom.js");
let vue = require("vue");
//#region src/table/src/Td.tsx
var Td_default = (0, vue.defineComponent)({
	name: "Td",
	render() {
		return (0, vue.openBlock)(), (0, vue.createElementBlock)("td", null, [require_vdom.normalizeVNode(() => this.$slots.default?.())]);
	}
});
//#endregion
module.exports = Td_default;
