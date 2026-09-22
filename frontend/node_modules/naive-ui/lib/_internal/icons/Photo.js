const require_vdom = require("../../vue-jsx-vapor/vdom.js");
let vue = require("vue");
//#region src/_internal/icons/Photo.tsx
var Photo_default = (0, vue.defineComponent)({
	name: "Photo",
	render() {
		return (() => {
			const _cache = require_vdom.createVNodeCache("def1bfd93f113366");
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
			}, [
				(0, vue.createElementVNode)("path", { d: "M15 8h.01" }),
				(0, vue.createElementVNode)("rect", {
					x: "4",
					y: "4",
					width: "16",
					height: "16",
					rx: "3"
				}),
				(0, vue.createElementVNode)("path", { d: "M4 15l4-4a3 5 0 0 1 3 0l5 5" }),
				(0, vue.createElementVNode)("path", { d: "M14 14l1-1a3 5 0 0 1 3 0l2 2" })
			])], -1));
		})();
	}
});
//#endregion
module.exports = Photo_default;
