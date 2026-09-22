const require_vdom = require("../../vue-jsx-vapor/vdom.js");
const require_color_picker_src_utils = require("./utils.js");
let seemly = require("seemly");
let vue = require("vue");
let evtd = require("evtd");
//#region src/color-picker/src/AlphaSlider.tsx
const _hoisted_1 = ["onMousedown"];
const HANDLE_SIZE = "12px";
const HANDLE_SIZE_NUM = 12;
const RADIUS = "6px";
var AlphaSlider_default = (0, vue.defineComponent)({
	name: "AlphaSlider",
	props: {
		clsPrefix: {
			type: String,
			required: true
		},
		rgba: {
			type: Array,
			default: null
		},
		alpha: {
			type: Number,
			default: 0
		},
		onUpdateAlpha: {
			type: Function,
			required: true
		},
		onComplete: Function
	},
	setup(props) {
		const railRef = (0, vue.ref)(null);
		function handleMouseDown(e) {
			if (!railRef.value || !props.rgba) return;
			(0, evtd.on)("mousemove", document, handleMouseMove);
			(0, evtd.on)("mouseup", document, handleMouseUp);
			handleMouseMove(e);
		}
		function handleMouseMove(e) {
			const { value: railEl } = railRef;
			if (!railEl) return;
			const { width, left } = railEl.getBoundingClientRect();
			const newAlpha = (e.clientX - left) / (width - HANDLE_SIZE_NUM);
			props.onUpdateAlpha(require_color_picker_src_utils.normalizeAlpha(newAlpha));
		}
		function handleMouseUp() {
			(0, evtd.off)("mousemove", document, handleMouseMove);
			(0, evtd.off)("mouseup", document, handleMouseUp);
			props.onComplete?.();
		}
		return {
			railRef,
			railBackgroundImage: (0, vue.computed)(() => {
				const { rgba } = props;
				if (!rgba) return "";
				return `linear-gradient(to right, rgba(${rgba[0]}, ${rgba[1]}, ${rgba[2]}, 0) 0%, rgba(${rgba[0]}, ${rgba[1]}, ${rgba[2]}, 1) 100%)`;
			}),
			handleMouseDown
		};
	},
	render() {
		const { clsPrefix } = this;
		return (0, vue.openBlock)(), (0, vue.createElementBlock)("div", {
			class: require_vdom.normalizeClass(`${clsPrefix}-color-picker-slider`),
			ref: "railRef",
			style: (0, vue.normalizeStyle)({
				height: HANDLE_SIZE,
				borderRadius: RADIUS
			}),
			onMousedown: this.handleMouseDown
		}, [(0, vue.createElementVNode)("div", { style: (0, vue.normalizeStyle)({
			borderRadius: RADIUS,
			position: "absolute",
			left: 0,
			right: 0,
			top: 0,
			bottom: 0,
			overflow: "hidden"
		}) }, [(0, vue.createElementVNode)("div", { class: require_vdom.normalizeClass(`${clsPrefix}-color-picker-checkboard`) }, null, 2), (0, vue.createElementVNode)("div", {
			class: require_vdom.normalizeClass(`${clsPrefix}-color-picker-slider__image`),
			style: (0, vue.normalizeStyle)({ backgroundImage: this.railBackgroundImage })
		}, null, 6)], 4), require_vdom.normalizeVNode(() => this.rgba && ((0, vue.openBlock)(), (0, vue.createElementBlock)("div", { style: (0, vue.normalizeStyle)({
			position: "absolute",
			left: RADIUS,
			right: RADIUS,
			top: 0,
			bottom: 0
		}) }, [(0, vue.createElementVNode)("div", {
			class: require_vdom.normalizeClass(`${clsPrefix}-color-picker-handle`),
			style: (0, vue.normalizeStyle)({
				left: `calc(${this.alpha * 100}% - ${RADIUS})`,
				borderRadius: RADIUS,
				width: HANDLE_SIZE,
				height: HANDLE_SIZE
			})
		}, [(0, vue.createElementVNode)("div", {
			class: require_vdom.normalizeClass(`${clsPrefix}-color-picker-handle__fill`),
			style: (0, vue.normalizeStyle)({
				backgroundColor: (0, seemly.toRgbaString)(this.rgba),
				borderRadius: RADIUS,
				width: HANDLE_SIZE,
				height: HANDLE_SIZE
			})
		}, null, 6)], 6)], 4)))], 46, _hoisted_1);
	}
});
//#endregion
module.exports = AlphaSlider_default;
