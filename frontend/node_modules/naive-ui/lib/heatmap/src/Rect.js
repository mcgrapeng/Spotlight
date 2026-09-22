const require__utils_vue_resolve_slot = require("../../_utils/vue/resolve-slot.js");
const require_vdom = require("../../vue-jsx-vapor/vdom.js");
const require_tooltip_src_Tooltip = require("../../tooltip/src/Tooltip.js");
let vue = require("vue");
//#region src/heatmap/src/Rect.tsx
var Rect_default = (0, vue.defineComponent)({
	name: "HeatmapRect",
	slots: Object,
	props: {
		mergedClsPrefix: {
			type: String,
			required: true
		},
		data: {
			type: Object,
			required: true
		},
		color: {
			type: String,
			required: true
		},
		style: Object,
		loading: Boolean,
		loadingClass: String,
		tooltip: {
			type: [Boolean, Object],
			default: true
		}
	},
	setup(props) {
		return {
			cssVars: (0, vue.computed)(() => ({ "--n-rect-color": props.color })),
			tooltipProps: (0, vue.computed)(() => {
				return typeof props.tooltip === "object" ? props.tooltip : {};
			}),
			defaultTooltipContent: (0, vue.computed)(() => {
				const date = new Date(props.data.timestamp).toLocaleDateString();
				return props.data.value !== null ? `${date} ${props.data.value}` : date;
			})
		};
	},
	render() {
		const { mergedClsPrefix, style, cssVars, tooltip, tooltipProps, defaultTooltipContent, loading, data } = this;
		const triggerNode = ((0, vue.openBlock)(), (0, vue.createElementBlock)("div", {
			class: require_vdom.normalizeClass([
				`${mergedClsPrefix}-heatmap-rect`,
				loading && `${mergedClsPrefix}-heatmap-rect--loading`,
				loading && this.loadingClass
			]),
			style: (0, vue.normalizeStyle)([cssVars, style])
		}, null, 6));
		return tooltip === false || loading ? triggerNode : ((0, vue.openBlock)(), (0, vue.createBlock)(require_tooltip_src_Tooltip.default, (0, vue.mergeProps)({
			key: 1,
			trigger: "hover"
		}, tooltipProps), {
			default: () => require__utils_vue_resolve_slot.resolveSlotWithTypedProps(this.$slots.tooltip, data, () => [((0, vue.openBlock)(), (0, vue.createElementBlock)("div", null, [require_vdom.normalizeVNode(() => defaultTooltipContent)]))]),
			trigger: () => triggerNode
		}, 1040));
	}
});
//#endregion
module.exports = Rect_default;
