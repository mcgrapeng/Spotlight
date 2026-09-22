const require_vdom = require("../../vue-jsx-vapor/vdom.js");
let vue = require("vue");
//#region src/_internal/icons/Checkmark.tsx
var Checkmark_default = (0, vue.defineComponent)({
	name: "Checkmark",
	render() {
		return (() => {
			const _cache = require_vdom.createVNodeCache("3c84eac8ae4e1f96");
			return _cache[0] || (_cache[0] = (0, vue.createElementVNode)("svg", {
				xmlns: "http://www.w3.org/2000/svg",
				viewBox: "0 0 16 16"
			}, [(0, vue.createElementVNode)("g", { fill: "none" }, [(0, vue.createElementVNode)("path", {
				d: "M14.046 3.486a.75.75 0 0 1-.032 1.06l-7.93 7.474a.85.85 0 0 1-1.188-.022l-2.68-2.72a.75.75 0 1 1 1.068-1.053l2.234 2.267l7.468-7.038a.75.75 0 0 1 1.06.032z",
				fill: "currentColor"
			})])], -1));
		})();
	}
});
//#endregion
module.exports = Checkmark_default;
