const require_vdom = require("../../vue-jsx-vapor/vdom.js");
const require__internal_icon_src_Icon = require("../../_internal/icon/src/Icon.js");
const require__internal_icons_Error = require("../../_internal/icons/Error.js");
const require__internal_icons_Info = require("../../_internal/icons/Info.js");
const require__internal_icons_Success = require("../../_internal/icons/Success.js");
const require__internal_icons_Warning = require("../../_internal/icons/Warning.js");
let vue = require("vue");
let css_render = require("css-render");
//#region src/progress/src/Circle.tsx
const _hoisted_1 = ["id"];
const _hoisted_2 = ["stop-color"];
const _hoisted_3 = ["stop-color"];
const _hoisted_4 = ["viewBox"];
const _hoisted_5 = ["d", "stroke-width"];
const _hoisted_6 = ["d", "stroke-width"];
const iconMap = {
	success: ((0, vue.openBlock)(), (0, vue.createBlock)(require__internal_icons_Success)),
	error: ((0, vue.openBlock)(), (0, vue.createBlock)(require__internal_icons_Error)),
	warning: ((0, vue.openBlock)(), (0, vue.createBlock)(require__internal_icons_Warning)),
	info: ((0, vue.openBlock)(), (0, vue.createBlock)(require__internal_icons_Info))
};
var Circle_default = (0, vue.defineComponent)({
	name: "ProgressCircle",
	props: {
		clsPrefix: {
			type: String,
			required: true
		},
		status: {
			type: String,
			required: true
		},
		strokeWidth: {
			type: Number,
			required: true
		},
		fillColor: [String, Object],
		railColor: String,
		railStyle: [String, Object],
		percentage: {
			type: Number,
			default: 0
		},
		offsetDegree: {
			type: Number,
			default: 0
		},
		showIndicator: {
			type: Boolean,
			required: true
		},
		indicatorTextColor: String,
		unit: String,
		viewBoxWidth: {
			type: Number,
			required: true
		},
		gapDegree: {
			type: Number,
			required: true
		},
		gapOffsetDegree: {
			type: Number,
			default: 0
		}
	},
	setup(props, { slots }) {
		const gradientIdRef = (0, vue.computed)(() => {
			const base = "gradient";
			const { fillColor } = props;
			if (typeof fillColor === "object") return `${base}-${(0, css_render.hash)(JSON.stringify(fillColor))}`;
			return base;
		});
		function getPathStyles(percent, offsetDegree, strokeColor, type) {
			const { gapDegree, viewBoxWidth, strokeWidth } = props;
			const radius = 50;
			const beginPositionX = 0;
			const beginPositionY = radius;
			const endPositionX = 0;
			const endPositionY = 100;
			const centerX = 50 + strokeWidth / 2;
			const pathString = `M ${centerX},${centerX} m ${beginPositionX},${beginPositionY}
      a ${radius},${radius} 0 1 1 ${endPositionX},-100
      a ${radius},${radius} 0 1 1 0,${endPositionY}`;
			const len = Math.PI * 2 * radius;
			return {
				pathString,
				pathStyle: {
					stroke: type === "rail" ? strokeColor : typeof props.fillColor === "object" ? `url(#${gradientIdRef.value})` : strokeColor,
					strokeDasharray: `${Math.min(percent, 100) / 100 * (len - gapDegree)}px ${viewBoxWidth * 8}px`,
					strokeDashoffset: `-${gapDegree / 2}px`,
					transformOrigin: offsetDegree ? "center" : void 0,
					transform: offsetDegree ? `rotate(${offsetDegree}deg)` : void 0
				}
			};
		}
		const createGradientNode = () => {
			const isGradient = typeof props.fillColor === "object";
			const from = isGradient ? props.fillColor.stops[0] : "";
			const to = isGradient ? props.fillColor.stops[1] : "";
			return isGradient && ((0, vue.openBlock)(), (0, vue.createElementBlock)("defs", null, [(0, vue.createElementVNode)("linearGradient", {
				id: gradientIdRef.value,
				x1: "0%",
				y1: "100%",
				x2: "100%",
				y2: "0%"
			}, [(0, vue.createElementVNode)("stop", {
				offset: "0%",
				"stop-color": from
			}, null, 8, _hoisted_2), (0, vue.createElementVNode)("stop", {
				offset: "100%",
				"stop-color": to
			}, null, 8, _hoisted_3)], 8, _hoisted_1)]));
		};
		return () => {
			const { fillColor, railColor, strokeWidth, offsetDegree, status, percentage, showIndicator, indicatorTextColor, unit, gapOffsetDegree, clsPrefix } = props;
			const { pathString: railPathString, pathStyle: railPathStyle } = getPathStyles(100, 0, railColor, "rail");
			const { pathString: fillPathString, pathStyle: fillPathStyle } = getPathStyles(percentage, offsetDegree, fillColor, "fill");
			const viewBoxSize = 100 + strokeWidth;
			return (0, vue.openBlock)(), (0, vue.createElementBlock)("div", {
				class: require_vdom.normalizeClass(`${clsPrefix}-progress-content`),
				role: "none"
			}, [(0, vue.createElementVNode)("div", {
				class: require_vdom.normalizeClass(`${clsPrefix}-progress-graph`),
				"aria-hidden": true
			}, [(0, vue.createElementVNode)("div", {
				class: require_vdom.normalizeClass(`${clsPrefix}-progress-graph-circle`),
				style: (0, vue.normalizeStyle)({ transform: gapOffsetDegree ? `rotate(${gapOffsetDegree}deg)` : void 0 })
			}, [((0, vue.openBlock)(), (0, vue.createElementBlock)("svg", { viewBox: `0 0 ${viewBoxSize} ${viewBoxSize}` }, [
				require_vdom.normalizeVNode(() => createGradientNode()),
				(0, vue.createElementVNode)("g", null, [(0, vue.createElementVNode)("path", {
					class: require_vdom.normalizeClass(`${clsPrefix}-progress-graph-circle-rail`),
					d: railPathString,
					"stroke-width": strokeWidth,
					"stroke-linecap": "round",
					fill: "none",
					style: (0, vue.normalizeStyle)(railPathStyle)
				}, null, 14, _hoisted_5)]),
				(0, vue.createElementVNode)("g", null, [(0, vue.createElementVNode)("path", {
					class: require_vdom.normalizeClass([`${clsPrefix}-progress-graph-circle-fill`, percentage === 0 && `${clsPrefix}-progress-graph-circle-fill--empty`]),
					d: fillPathString,
					"stroke-width": strokeWidth,
					"stroke-linecap": "round",
					fill: "none",
					style: (0, vue.normalizeStyle)(fillPathStyle)
				}, null, 14, _hoisted_6)])
			], 8, _hoisted_4))], 6)], 2), showIndicator ? ((0, vue.openBlock)(), (0, vue.createElementBlock)("div", { key: 0 }, [slots.default ? ((0, vue.openBlock)(), (0, vue.createElementBlock)("div", {
				key: 0,
				class: require_vdom.normalizeClass(`${clsPrefix}-progress-custom-content`),
				role: "none"
			}, [require_vdom.normalizeVNode(() => slots.default())], 2)) : ((0, vue.openBlock)(), (0, vue.createElementBlock)(vue.Fragment, { key: 1 }, [status !== "default" ? ((0, vue.openBlock)(), (0, vue.createElementBlock)("div", {
				key: 0,
				class: require_vdom.normalizeClass(`${clsPrefix}-progress-icon`),
				"aria-hidden": true
			}, [((0, vue.openBlock)(), (0, vue.createBlock)(require__internal_icon_src_Icon, { clsPrefix }, { default: () => iconMap[status] }, 1032, ["clsPrefix"]))], 2)) : ((0, vue.openBlock)(), (0, vue.createElementBlock)("div", {
				key: 1,
				class: require_vdom.normalizeClass(`${clsPrefix}-progress-text`),
				style: (0, vue.normalizeStyle)({ color: indicatorTextColor }),
				role: "none"
			}, [(0, vue.createElementVNode)("span", { class: require_vdom.normalizeClass(`${clsPrefix}-progress-text__percentage`) }, [require_vdom.normalizeVNode(() => percentage)], 2), (0, vue.createElementVNode)("span", { class: require_vdom.normalizeClass(`${clsPrefix}-progress-text__unit`) }, [require_vdom.normalizeVNode(() => unit)], 2)], 6))], 64))])) : require_vdom.normalizeVNode(() => null)], 2);
		};
	}
});
//#endregion
module.exports = Circle_default;
