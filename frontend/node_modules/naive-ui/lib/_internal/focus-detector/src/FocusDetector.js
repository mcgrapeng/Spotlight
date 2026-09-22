const require_vdom = require("../../../vue-jsx-vapor/vdom.js");
let vue = require("vue");
//#region src/_internal/focus-detector/src/FocusDetector.tsx
var FocusDetector_default = (0, vue.defineComponent)({
	props: {
		onFocus: Function,
		onBlur: Function
	},
	setup(props) {
		return () => (() => {
			const _cache = require_vdom.createVNodeCache("d16ead82505dc285");
			return (0, vue.openBlock)(), (0, vue.createElementBlock)("div", {
				style: "width: 0; height: 0",
				tabindex: 0,
				onFocus: _cache[0] || (_cache[0] = (e) => props.onFocus?.(e)),
				onBlur: _cache[1] || (_cache[1] = (e) => props.onBlur?.(e))
			}, null, 32);
		})();
	}
});
//#endregion
module.exports = FocusDetector_default;
