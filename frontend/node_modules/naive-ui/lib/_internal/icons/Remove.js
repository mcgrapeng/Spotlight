const require_vdom = require("../../vue-jsx-vapor/vdom.js");
let vue = require("vue");
//#region src/_internal/icons/Remove.tsx
var Remove_default = (0, vue.defineComponent)({
	name: "Remove",
	render() {
		return (() => {
			const _cache = require_vdom.createVNodeCache("a77472467b8adb0a");
			return _cache[0] || (_cache[0] = (0, vue.createElementVNode)("svg", {
				xmlns: "http://www.w3.org/2000/svg",
				viewBox: "0 0 512 512"
			}, [(0, vue.createElementVNode)("line", {
				x1: "400",
				y1: "256",
				x2: "112",
				y2: "256",
				style: "\n        fill: none;\n        stroke: currentColor;\n        stroke-linecap: round;\n        stroke-linejoin: round;\n        stroke-width: 32px;\n      "
			})], -1));
		})();
	}
});
//#endregion
module.exports = Remove_default;
