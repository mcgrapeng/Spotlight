const require_vdom = require("../../vue-jsx-vapor/vdom.js");
let vue = require("vue");
//#region src/_internal/icons/Add.tsx
var Add_default = (0, vue.defineComponent)({
	name: "Add",
	render() {
		return (() => {
			const _cache = require_vdom.createVNodeCache("b30130fbba5c5b23");
			return _cache[0] || (_cache[0] = (0, vue.createElementVNode)("svg", {
				width: "512",
				height: "512",
				viewBox: "0 0 512 512",
				fill: "none",
				xmlns: "http://www.w3.org/2000/svg"
			}, [(0, vue.createElementVNode)("path", {
				d: "M256 112V400M400 256H112",
				stroke: "currentColor",
				"stroke-width": "32",
				"stroke-linecap": "round",
				"stroke-linejoin": "round"
			})], -1));
		})();
	}
});
//#endregion
module.exports = Add_default;
