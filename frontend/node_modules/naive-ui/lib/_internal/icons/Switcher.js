const require_vdom = require("../../vue-jsx-vapor/vdom.js");
let vue = require("vue");
//#region src/_internal/icons/Switcher.tsx
var Switcher_default = (0, vue.defineComponent)({
	name: "Switcher",
	render() {
		return (() => {
			const _cache = require_vdom.createVNodeCache("d16928020f032440");
			return _cache[0] || (_cache[0] = (0, vue.createElementVNode)("svg", {
				xmlns: "http://www.w3.org/2000/svg",
				viewBox: "0 0 32 32"
			}, [(0, vue.createElementVNode)("path", { d: "M12 8l10 8l-10 8z" })], -1));
		})();
	}
});
//#endregion
module.exports = Switcher_default;
