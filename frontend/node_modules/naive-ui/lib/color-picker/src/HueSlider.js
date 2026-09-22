const require_vdom = require("../../vue-jsx-vapor/vdom.js");
const require_color_picker_src_utils = require("./utils.js");
let vue = require("vue");
let evtd = require("evtd");
//#region src/color-picker/src/HueSlider.tsx
const _hoisted_1 = ["onMousedown"];
const HANDLE_SIZE = "12px";
const HANDLE_SIZE_NUM = 12;
const RADIUS = "6px";
const RADIUS_NUM = 6;
const GRADIENT = "linear-gradient(90deg,red,#ff0 16.66%,#0f0 33.33%,#0ff 50%,#00f 66.66%,#f0f 83.33%,red)";
var HueSlider_default = (0, vue.defineComponent)({
	name: "HueSlider",
	props: {
		clsPrefix: {
			type: String,
			required: true
		},
		hue: {
			type: Number,
			required: true
		},
		onUpdateHue: {
			type: Function,
			required: true
		},
		onComplete: Function
	},
	setup(props) {
		const railRef = (0, vue.ref)(null);
		function handleMouseDown(e) {
			if (!railRef.value) return;
			(0, evtd.on)("mousemove", document, handleMouseMove);
			(0, evtd.on)("mouseup", document, handleMouseUp);
			handleMouseMove(e);
		}
		function handleMouseMove(e) {
			const { value: railEl } = railRef;
			if (!railEl) return;
			const { width, left } = railEl.getBoundingClientRect();
			const newHue = require_color_picker_src_utils.normalizeHue((e.clientX - left - RADIUS_NUM) / (width - HANDLE_SIZE_NUM) * 360);
			props.onUpdateHue(newHue);
		}
		function handleMouseUp() {
			(0, evtd.off)("mousemove", document, handleMouseMove);
			(0, evtd.off)("mouseup", document, handleMouseUp);
			props.onComplete?.();
		}
		return {
			railRef,
			handleMouseDown
		};
	},
	render() {
		const { clsPrefix } = this;
		return (0, vue.openBlock)(), (0, vue.createElementBlock)("div", {
			class: require_vdom.normalizeClass(`${clsPrefix}-color-picker-slider`),
			style: (0, vue.normalizeStyle)({
				height: HANDLE_SIZE,
				borderRadius: RADIUS
			})
		}, [(0, vue.createElementVNode)("div", {
			ref: "railRef",
			style: (0, vue.normalizeStyle)({
				boxShadow: "inset 0 0 2px 0 rgba(0, 0, 0, .24)",
				boxSizing: "border-box",
				backgroundImage: GRADIENT,
				height: HANDLE_SIZE,
				borderRadius: RADIUS,
				position: "relative"
			}),
			onMousedown: this.handleMouseDown
		}, [(0, vue.createElementVNode)("div", { style: (0, vue.normalizeStyle)({
			position: "absolute",
			left: RADIUS,
			right: RADIUS,
			top: 0,
			bottom: 0
		}) }, [(0, vue.createElementVNode)("div", {
			class: require_vdom.normalizeClass(`${clsPrefix}-color-picker-handle`),
			style: (0, vue.normalizeStyle)({
				left: `calc((${this.hue}%) / 359 * 100 - ${RADIUS})`,
				borderRadius: RADIUS,
				width: HANDLE_SIZE,
				height: HANDLE_SIZE
			})
		}, [(0, vue.createElementVNode)("div", {
			class: require_vdom.normalizeClass(`${clsPrefix}-color-picker-handle__fill`),
			style: (0, vue.normalizeStyle)({
				backgroundColor: `hsl(${this.hue}, 100%, 50%)`,
				borderRadius: RADIUS,
				width: HANDLE_SIZE,
				height: HANDLE_SIZE
			})
		}, null, 6)], 6)], 4)], 44, _hoisted_1)], 6);
	}
});
//#endregion
module.exports = HueSlider_default;
