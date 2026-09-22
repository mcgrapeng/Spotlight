const require_vdom = require("../../vue-jsx-vapor/vdom.js");
const require__internal_icons_replaceable = require("./replaceable.js");
let vue = require("vue");
//#region src/_internal/icons/Retry.tsx
var Retry_default = require__internal_icons_replaceable.replaceable("retry", () => (() => {
	const _cache = require_vdom.createVNodeCache("32d3a81cd807b3fd");
	return _cache[0] || (_cache[0] = (0, vue.createElementVNode)("svg", {
		xmlns: "http://www.w3.org/2000/svg",
		viewBox: "0 0 512 512"
	}, [(0, vue.createElementVNode)("path", {
		d: "M320,146s24.36-12-64-12A160,160,0,1,0,416,294",
		style: "fill: none; stroke: currentcolor; stroke-linecap: round; stroke-miterlimit: 10; stroke-width: 32px;"
	}), (0, vue.createElementVNode)("polyline", {
		points: "256 58 336 138 256 218",
		style: "fill: none; stroke: currentcolor; stroke-linecap: round; stroke-linejoin: round; stroke-width: 32px;"
	})], -1));
})());
//#endregion
module.exports = Retry_default;
