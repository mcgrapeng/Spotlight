const require_vdom = require("../../vue-jsx-vapor/vdom.js");
let vue = require("vue");
//#region src/typography/src/li.tsx
var li_default = (0, vue.defineComponent)({
	name: "Li",
	render() {
		return (0, vue.openBlock)(), (0, vue.createElementBlock)("li", null, [require_vdom.normalizeVNode(() => this.$slots.default?.())]);
	}
});
//#endregion
module.exports = li_default;
