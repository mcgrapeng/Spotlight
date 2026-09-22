const require_vdom = require("../../vue-jsx-vapor/vdom.js");
let vue = require("vue");
//#region src/table/src/Tbody.tsx
var Tbody_default = (0, vue.defineComponent)({
	name: "Tbody",
	render() {
		return (0, vue.openBlock)(), (0, vue.createElementBlock)("tbody", null, [require_vdom.normalizeVNode(() => this.$slots.default?.())]);
	}
});
//#endregion
module.exports = Tbody_default;
