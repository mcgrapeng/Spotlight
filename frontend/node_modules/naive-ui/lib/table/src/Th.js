const require_vdom = require("../../vue-jsx-vapor/vdom.js");
let vue = require("vue");
//#region src/table/src/Th.tsx
var Th_default = (0, vue.defineComponent)({
	name: "Th",
	render() {
		return (0, vue.openBlock)(), (0, vue.createElementBlock)("th", null, [require_vdom.normalizeVNode(() => this.$slots.default?.())]);
	}
});
//#endregion
module.exports = Th_default;
