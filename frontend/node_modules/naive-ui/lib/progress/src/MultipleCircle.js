const require_vdom = require("../../vue-jsx-vapor/vdom.js");
let vue = require("vue");
//#region src/progress/src/MultipleCircle.tsx
const _hoisted_1 = ["id"];
const _hoisted_2 = ["stop-color"];
const _hoisted_3 = ["stop-color"];
const _hoisted_4 = ["d", "stroke-width"];
const _hoisted_5 = ["d", "stroke-width"];
const _hoisted_6 = ["viewBox"];
function circlePath(r, sw, vw = 100) {
	return `m ${vw / 2} ${vw / 2 - r} a ${r} ${r} 0 1 1 0 ${2 * r} a ${r} ${r} 0 1 1 0 -${2 * r}`;
}
var MultipleCircle_default = (0, vue.defineComponent)({
	name: "ProgressMultipleCircle",
	props: {
		clsPrefix: {
			type: String,
			required: true
		},
		viewBoxWidth: {
			type: Number,
			required: true
		},
		percentage: {
			type: Array,
			default: [0]
		},
		strokeWidth: {
			type: Number,
			required: true
		},
		circleGap: {
			type: Number,
			required: true
		},
		showIndicator: {
			type: Boolean,
			required: true
		},
		fillColor: {
			type: Array,
			default: () => []
		},
		railColor: {
			type: Array,
			default: () => []
		},
		railStyle: {
			type: Array,
			default: () => []
		}
	},
	setup(props, { slots }) {
		const strokeDasharrayRef = (0, vue.computed)(() => {
			return props.percentage.map((v, i) => `${Math.PI * v / 100 * (props.viewBoxWidth / 2 - props.strokeWidth / 2 * (1 + 2 * i) - props.circleGap * i) * 2}, ${props.viewBoxWidth * 8}`);
		});
		const createGradientNode = (p, index) => {
			const item = props.fillColor[index];
			const form = typeof item === "object" ? item.stops[0] : "";
			const to = typeof item === "object" ? item.stops[1] : "";
			return typeof props.fillColor[index] === "object" && ((0, vue.openBlock)(), (0, vue.createElementBlock)("linearGradient", {
				id: `gradient-${index}`,
				x1: "100%",
				y1: "0%",
				x2: "0%",
				y2: "100%"
			}, [(0, vue.createElementVNode)("stop", {
				offset: "0%",
				"stop-color": form
			}, null, 8, _hoisted_2), (0, vue.createElementVNode)("stop", {
				offset: "100%",
				"stop-color": to
			}, null, 8, _hoisted_3)], 8, _hoisted_1));
		};
		return () => {
			const { viewBoxWidth, strokeWidth, circleGap, showIndicator, fillColor, railColor, railStyle, percentage, clsPrefix } = props;
			return (0, vue.openBlock)(), (0, vue.createElementBlock)("div", {
				class: require_vdom.normalizeClass(`${clsPrefix}-progress-content`),
				role: "none"
			}, [(0, vue.createElementVNode)("div", {
				class: require_vdom.normalizeClass(`${clsPrefix}-progress-graph`),
				"aria-hidden": true
			}, [(0, vue.createElementVNode)("div", { class: require_vdom.normalizeClass(`${clsPrefix}-progress-graph-circle`) }, [((0, vue.openBlock)(), (0, vue.createElementBlock)("svg", { viewBox: `0 0 ${viewBoxWidth} ${viewBoxWidth}` }, [(0, vue.createElementVNode)("defs", null, [require_vdom.normalizeVNode(() => percentage.map((p, index) => {
				return createGradientNode(p, index);
			}))]), require_vdom.normalizeVNode(() => percentage.map((p, index) => {
				return (0, vue.openBlock)(), (0, vue.createElementBlock)("g", { key: index }, [(0, vue.createElementVNode)("path", {
					class: require_vdom.normalizeClass(`${clsPrefix}-progress-graph-circle-rail`),
					d: circlePath(viewBoxWidth / 2 - strokeWidth / 2 * (1 + 2 * index) - circleGap * index, strokeWidth, viewBoxWidth),
					"stroke-width": strokeWidth,
					"stroke-linecap": "round",
					fill: "none",
					style: (0, vue.normalizeStyle)([{
						strokeDashoffset: 0,
						stroke: railColor[index]
					}, railStyle[index]])
				}, null, 14, _hoisted_4), (0, vue.createElementVNode)("path", {
					class: require_vdom.normalizeClass([`${clsPrefix}-progress-graph-circle-fill`, p === 0 && `${clsPrefix}-progress-graph-circle-fill--empty`]),
					d: circlePath(viewBoxWidth / 2 - strokeWidth / 2 * (1 + 2 * index) - circleGap * index, strokeWidth, viewBoxWidth),
					"stroke-width": strokeWidth,
					"stroke-linecap": "round",
					fill: "none",
					style: (0, vue.normalizeStyle)({
						strokeDasharray: strokeDasharrayRef.value[index],
						strokeDashoffset: 0,
						stroke: typeof fillColor[index] === "object" ? `url(#gradient-${index})` : fillColor[index]
					})
				}, null, 14, _hoisted_5)]);
			}))], 8, _hoisted_6))], 2)], 2), showIndicator && slots.default ? ((0, vue.openBlock)(), (0, vue.createElementBlock)("div", { key: 0 }, [(0, vue.createElementVNode)("div", { class: require_vdom.normalizeClass(`${clsPrefix}-progress-text`) }, [require_vdom.normalizeVNode(() => slots.default())], 2)])) : require_vdom.normalizeVNode(() => null)], 2);
		};
	}
});
//#endregion
module.exports = MultipleCircle_default;
