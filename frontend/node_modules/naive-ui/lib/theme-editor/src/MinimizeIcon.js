Object.defineProperty(exports, Symbol.toStringTag, { value: "Module" });
const require_vdom = require("../../vue-jsx-vapor/vdom.js");
let vue = require("vue");
//#region src/theme-editor/src/MinimizeIcon.tsx
const MinimizeIcon = (0, vue.defineComponent)({ render() {
	return (() => {
		const _cache = require_vdom.createVNodeCache("c2c696bc50179b5d");
		return _cache[0] || (_cache[0] = (0, vue.createElementVNode)("svg", {
			xmlns: "http://www.w3.org/2000/svg",
			viewBox: "0 0 32 32"
		}, [(0, vue.createElementVNode)("path", {
			d: "M4 18v2h6.586L2 28.582L3.414 30L12 21.414V28h2V18H4z",
			fill: "currentColor"
		}), (0, vue.createElementVNode)("path", {
			d: "M30 3.416L28.592 2L20 10.586V4h-2v10h10v-2h-6.586L30 3.416z",
			fill: "currentColor"
		})], -1));
	})();
} });
//#endregion
exports.MinimizeIcon = MinimizeIcon;
