Object.defineProperty(exports, Symbol.toStringTag, { value: "Module" });
const require_vdom = require("../../vue-jsx-vapor/vdom.js");
let vue = require("vue");
//#region src/theme-editor/src/MaximizeIcon.tsx
const MaximizeIcon = (0, vue.defineComponent)({ render() {
	return (() => {
		const _cache = require_vdom.createVNodeCache("1b77c6feb00bab97");
		return _cache[0] || (_cache[0] = (0, vue.createElementVNode)("svg", {
			xmlns: "http://www.w3.org/2000/svg",
			viewBox: "0 0 16 16"
		}, [(0, vue.createElementVNode)("g", { fill: "none" }, [(0, vue.createElementVNode)("path", {
			d: "M8.5 2a.5.5 0 0 0 0 1h3.793L3 12.293V8.5a.5.5 0 0 0-1 0v4.9a.6.6 0 0 0 .6.6h4.9a.5.5 0 0 0 0-1H3.707L13 3.707V7.5a.5.5 0 0 0 1 0V2.6a.6.6 0 0 0-.6-.6H8.5z",
			fill: "currentColor"
		})])], -1));
	})();
} });
//#endregion
exports.MaximizeIcon = MaximizeIcon;
