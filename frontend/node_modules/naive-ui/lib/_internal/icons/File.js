const require_vdom = require("../../vue-jsx-vapor/vdom.js");
let vue = require("vue");
//#region src/_internal/icons/File.tsx
var File_default = (0, vue.defineComponent)({
	name: "File",
	render() {
		return (() => {
			const _cache = require_vdom.createVNodeCache("85df4d9a42157e3f");
			return _cache[0] || (_cache[0] = (0, vue.createElementVNode)("svg", {
				viewBox: "0 0 24 24",
				version: "1.1",
				xmlns: "http://www.w3.org/2000/svg"
			}, [(0, vue.createElementVNode)("g", {
				fill: "none",
				stroke: "currentColor",
				"stroke-width": "2",
				"stroke-linecap": "round",
				"stroke-linejoin": "round"
			}, [(0, vue.createElementVNode)("path", { d: "M14 3v4a1 1 0 0 0 1 1h4" }), (0, vue.createElementVNode)("path", { d: "M17 21H7a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h7l5 5v11a2 2 0 0 1-2 2z" })])], -1));
		})();
	}
});
//#endregion
module.exports = File_default;
