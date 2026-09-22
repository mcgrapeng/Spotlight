Object.defineProperties(exports, {
	__esModule: { value: true },
	[Symbol.toStringTag]: { value: "Module" }
});
const require__mixins_use_style = require("../../../_mixins/use-style.js");
const require_vdom = require("../../../vue-jsx-vapor/vdom.js");
const require__internal_icon_switch_transition_src_IconSwitchTransition = require("../../icon-switch-transition/src/IconSwitchTransition.js");
const require__internal_loading_src_styles_index_cssr = require("./styles/index.cssr.js");
let vue = require("vue");
//#region src/_internal/loading/src/Loading.tsx
const _hoisted_1 = ["viewBox"];
const _hoisted_2 = ["values", "dur"];
const _hoisted_3 = [
	"stroke-width",
	"cx",
	"cy",
	"r",
	"stroke-dasharray",
	"stroke-dashoffset"
];
const _hoisted_4 = ["values", "dur"];
const _hoisted_5 = ["values", "dur"];
const duration = "1.6s";
const exposedLoadingProps = {
	strokeWidth: {
		type: Number,
		default: 28
	},
	stroke: {
		type: String,
		default: void 0
	},
	scale: {
		type: Number,
		default: 1
	},
	radius: {
		type: Number,
		default: 100
	}
};
var Loading_default = (0, vue.defineComponent)({
	name: "BaseLoading",
	props: {
		clsPrefix: {
			type: String,
			required: true
		},
		show: {
			type: Boolean,
			default: true
		},
		...exposedLoadingProps
	},
	setup(props) {
		require__mixins_use_style("-base-loading", require__internal_loading_src_styles_index_cssr, (0, vue.toRef)(props, "clsPrefix"));
	},
	render() {
		const { clsPrefix, radius, strokeWidth, stroke, scale } = this;
		const scaledRadius = radius / scale;
		return (0, vue.openBlock)(), (0, vue.createElementBlock)("div", {
			class: require_vdom.normalizeClass(`${clsPrefix}-base-loading`),
			role: "img",
			"aria-label": "loading"
		}, [(0, vue.createVNode)(require__internal_icon_switch_transition_src_IconSwitchTransition, null, { default: () => this.show ? ((0, vue.openBlock)(), (0, vue.createElementBlock)("div", {
			key: "icon",
			class: require_vdom.normalizeClass(`${clsPrefix}-base-loading__transition-wrapper`)
		}, [(0, vue.createElementVNode)("div", { class: require_vdom.normalizeClass(`${clsPrefix}-base-loading__container`) }, [((0, vue.openBlock)(), (0, vue.createElementBlock)("svg", {
			class: require_vdom.normalizeClass(`${clsPrefix}-base-loading__icon`),
			viewBox: `0 0 ${2 * scaledRadius} ${2 * scaledRadius}`,
			xmlns: "http://www.w3.org/2000/svg",
			style: (0, vue.normalizeStyle)({ color: stroke })
		}, [(0, vue.createElementVNode)("g", null, [(0, vue.createElementVNode)("animateTransform", {
			attributeName: "transform",
			type: "rotate",
			values: `0 ${scaledRadius} ${scaledRadius};270 ${scaledRadius} ${scaledRadius}`,
			begin: "0s",
			dur: duration,
			fill: "freeze",
			repeatCount: "indefinite"
		}, null, 8, _hoisted_2), (0, vue.createElementVNode)("circle", {
			class: require_vdom.normalizeClass(`${clsPrefix}-base-loading__icon`),
			fill: "none",
			stroke: "currentColor",
			"stroke-width": strokeWidth,
			"stroke-linecap": "round",
			cx: scaledRadius,
			cy: scaledRadius,
			r: radius - strokeWidth / 2,
			"stroke-dasharray": 5.67 * radius,
			"stroke-dashoffset": 18.48 * radius
		}, [(0, vue.createElementVNode)("animateTransform", {
			attributeName: "transform",
			type: "rotate",
			values: `0 ${scaledRadius} ${scaledRadius};135 ${scaledRadius} ${scaledRadius};450 ${scaledRadius} ${scaledRadius}`,
			begin: "0s",
			dur: duration,
			fill: "freeze",
			repeatCount: "indefinite"
		}, null, 8, _hoisted_4), (0, vue.createElementVNode)("animate", {
			attributeName: "stroke-dashoffset",
			values: `${5.67 * radius};${1.42 * radius};${5.67 * radius}`,
			begin: "0s",
			dur: duration,
			fill: "freeze",
			repeatCount: "indefinite"
		}, null, 8, _hoisted_5)], 10, _hoisted_3)])], 14, _hoisted_1))], 2)], 2)) : ((0, vue.openBlock)(), (0, vue.createElementBlock)("div", {
			key: "placeholder",
			class: require_vdom.normalizeClass(`${clsPrefix}-base-loading__placeholder`)
		}, [require_vdom.normalizeVNode(() => this.$slots.default?.())], 2)) }, 1024)], 2);
	}
});
//#endregion
exports.default = Loading_default;
exports.exposedLoadingProps = exposedLoadingProps;
