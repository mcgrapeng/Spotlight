const require_vdom = require("../../vue-jsx-vapor/vdom.js");
let vue = require("vue");
//#region src/table/src/Thead.tsx
var Thead_default = (0, vue.defineComponent)({
	name: "Thead",
	render() {
		return (0, vue.openBlock)(), (0, vue.createElementBlock)("thead", null, [require_vdom.normalizeVNode(() => this.$slots.default?.())]);
	}
});
//#endregion
module.exports = Thead_default;
