const require__utils_css_format_length = require("../../_utils/css/format-length.js");
const require_vdom = require("../../vue-jsx-vapor/vdom.js");
const require__internal_icon_src_Icon = require("../../_internal/icon/src/Icon.js");
const require__internal_icons_Error = require("../../_internal/icons/Error.js");
const require__internal_icons_Info = require("../../_internal/icons/Info.js");
const require__internal_icons_Success = require("../../_internal/icons/Success.js");
const require__internal_icons_Warning = require("../../_internal/icons/Warning.js");
let vue = require("vue");
//#region src/progress/src/Line.tsx
const iconMap = {
	success: ((0, vue.openBlock)(), (0, vue.createBlock)(require__internal_icons_Success)),
	error: ((0, vue.openBlock)(), (0, vue.createBlock)(require__internal_icons_Error)),
	warning: ((0, vue.openBlock)(), (0, vue.createBlock)(require__internal_icons_Warning)),
	info: ((0, vue.openBlock)(), (0, vue.createBlock)(require__internal_icons_Info))
};
var Line_default = (0, vue.defineComponent)({
	name: "ProgressLine",
	props: {
		clsPrefix: {
			type: String,
			required: true
		},
		percentage: {
			type: Number,
			default: 0
		},
		railColor: String,
		railStyle: [String, Object],
		fillColor: [String, Object],
		status: {
			type: String,
			required: true
		},
		indicatorPlacement: {
			type: String,
			required: true
		},
		indicatorTextColor: String,
		unit: {
			type: String,
			default: "%"
		},
		processing: {
			type: Boolean,
			required: true
		},
		showIndicator: {
			type: Boolean,
			required: true
		},
		height: [String, Number],
		railBorderRadius: [String, Number],
		fillBorderRadius: [String, Number]
	},
	setup(props, { slots }) {
		const styleHeightRef = (0, vue.computed)(() => {
			return require__utils_css_format_length.formatLength(props.height);
		});
		const styleFillColorRef = (0, vue.computed)(() => {
			return typeof props.fillColor === "object" ? `linear-gradient(to right, ${props.fillColor?.stops[0]} , ${props.fillColor?.stops[1]})` : props.fillColor;
		});
		const styleRailBorderRadiusRef = (0, vue.computed)(() => {
			if (props.railBorderRadius !== void 0) return require__utils_css_format_length.formatLength(props.railBorderRadius);
			if (props.height !== void 0) return require__utils_css_format_length.formatLength(props.height, { c: .5 });
			return "";
		});
		const styleFillBorderRadiusRef = (0, vue.computed)(() => {
			if (props.fillBorderRadius !== void 0) return require__utils_css_format_length.formatLength(props.fillBorderRadius);
			if (props.railBorderRadius !== void 0) return require__utils_css_format_length.formatLength(props.railBorderRadius);
			if (props.height !== void 0) return require__utils_css_format_length.formatLength(props.height, { c: .5 });
			return "";
		});
		return () => {
			const { indicatorPlacement, railColor, railStyle, percentage, unit, indicatorTextColor, status, showIndicator, processing, clsPrefix } = props;
			return (0, vue.openBlock)(), (0, vue.createElementBlock)("div", {
				class: require_vdom.normalizeClass(`${clsPrefix}-progress-content`),
				role: "none"
			}, [(0, vue.createElementVNode)("div", {
				class: require_vdom.normalizeClass(`${clsPrefix}-progress-graph`),
				"aria-hidden": true
			}, [(0, vue.createElementVNode)("div", { class: require_vdom.normalizeClass([`${clsPrefix}-progress-graph-line`, { [`${clsPrefix}-progress-graph-line--indicator-${indicatorPlacement}`]: true }]) }, [(0, vue.createElementVNode)("div", {
				class: require_vdom.normalizeClass(`${clsPrefix}-progress-graph-line-rail`),
				style: (0, vue.normalizeStyle)([{
					backgroundColor: railColor,
					height: styleHeightRef.value,
					borderRadius: styleRailBorderRadiusRef.value
				}, railStyle])
			}, [(0, vue.createElementVNode)("div", {
				class: require_vdom.normalizeClass([`${clsPrefix}-progress-graph-line-fill`, processing && `${clsPrefix}-progress-graph-line-fill--processing`]),
				style: (0, vue.normalizeStyle)({
					maxWidth: `${props.percentage}%`,
					background: styleFillColorRef.value,
					height: styleHeightRef.value,
					lineHeight: styleHeightRef.value,
					borderRadius: styleFillBorderRadiusRef.value
				})
			}, [indicatorPlacement === "inside" ? ((0, vue.openBlock)(), (0, vue.createElementBlock)("div", {
				key: 0,
				class: require_vdom.normalizeClass(`${clsPrefix}-progress-graph-line-indicator`),
				style: (0, vue.normalizeStyle)({ color: indicatorTextColor })
			}, [slots.default ? ((0, vue.openBlock)(), (0, vue.createElementBlock)(vue.Fragment, { key: 0 }, [require_vdom.normalizeVNode(() => slots.default())], 64)) : ((0, vue.openBlock)(), (0, vue.createElementBlock)(vue.Fragment, { key: 1 }, [require_vdom.normalizeVNode(() => `${percentage}${unit}`)], 64))], 6)) : require_vdom.normalizeVNode(() => null)], 6)], 6)], 2)], 2), showIndicator && indicatorPlacement === "outside" ? ((0, vue.openBlock)(), (0, vue.createElementBlock)("div", { key: 0 }, [slots.default ? ((0, vue.openBlock)(), (0, vue.createElementBlock)("div", {
				key: 0,
				class: require_vdom.normalizeClass(`${clsPrefix}-progress-custom-content`),
				style: (0, vue.normalizeStyle)({ color: indicatorTextColor }),
				role: "none"
			}, [require_vdom.normalizeVNode(() => slots.default())], 6)) : ((0, vue.openBlock)(), (0, vue.createElementBlock)(vue.Fragment, { key: 1 }, [status === "default" ? ((0, vue.openBlock)(), (0, vue.createElementBlock)("div", {
				key: 0,
				role: "none",
				class: require_vdom.normalizeClass(`${clsPrefix}-progress-icon ${clsPrefix}-progress-icon--as-text`),
				style: (0, vue.normalizeStyle)({ color: indicatorTextColor })
			}, [require_vdom.normalizeVNode(() => percentage), require_vdom.normalizeVNode(() => unit)], 6)) : ((0, vue.openBlock)(), (0, vue.createElementBlock)("div", {
				key: 1,
				class: require_vdom.normalizeClass(`${clsPrefix}-progress-icon`),
				"aria-hidden": true
			}, [((0, vue.openBlock)(), (0, vue.createBlock)(require__internal_icon_src_Icon, { clsPrefix }, { default: () => iconMap[status] }, 1032, ["clsPrefix"]))], 2))], 64))])) : require_vdom.normalizeVNode(() => null)], 2);
		};
	}
});
//#endregion
module.exports = Line_default;
