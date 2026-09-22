const require_vdom = require("../../vue-jsx-vapor/vdom.js");
let vue = require("vue");
//#region src/table/src/Tr.tsx
var Tr_default = (0, vue.defineComponent)({
	name: "Tr",
	render() {
		return (0, vue.openBlock)(), (0, vue.createElementBlock)("tr", null, [require_vdom.normalizeVNode(() => this.$slots.default?.())]);
	}
});
//#endregion
module.exports = Tr_default;
