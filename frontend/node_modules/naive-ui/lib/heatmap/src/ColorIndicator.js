const require_vdom = require("../../vue-jsx-vapor/vdom.js");
let vue = require("vue");
//#region src/heatmap/src/ColorIndicator.tsx
var ColorIndicator_default = (0, vue.defineComponent)({
	name: "HeatmapColorIndicator",
	slots: Object,
	props: {
		colors: {
			type: Array,
			required: true
		},
		clsPrefix: {
			type: String,
			required: true
		}
	},
	setup(props, { slots }) {
		return () => {
			const { colors, clsPrefix } = props;
			return (0, vue.openBlock)(), (0, vue.createElementBlock)("div", { class: require_vdom.normalizeClass(`${clsPrefix}-heatmap-color-indicator`) }, [
				(0, vue.createElementVNode)("span", { class: require_vdom.normalizeClass(`${clsPrefix}-heatmap-color-indicator__label`) }, [require_vdom.normalizeVNode(() => slots["leading-text"]?.())], 2),
				(0, vue.createElementVNode)("div", { class: require_vdom.normalizeClass(`${clsPrefix}-heatmap-color-indicator__cells`) }, [require_vdom.normalizeVNode(() => colors.map((color, index) => ((0, vue.openBlock)(), (0, vue.createElementBlock)("div", {
					key: index,
					class: require_vdom.normalizeClass(`${clsPrefix}-heatmap-color-indicator__cell`),
					style: (0, vue.normalizeStyle)({ backgroundColor: color })
				}, null, 6))))], 2),
				(0, vue.createElementVNode)("span", { class: require_vdom.normalizeClass(`${clsPrefix}-heatmap-color-indicator__label`) }, [require_vdom.normalizeVNode(() => slots["trailing-text"]?.())], 2)
			], 2);
		};
	}
});
//#endregion
module.exports = ColorIndicator_default;
