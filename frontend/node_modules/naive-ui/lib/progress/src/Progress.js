Object.defineProperties(exports, {
	__esModule: { value: true },
	[Symbol.toStringTag]: { value: "Module" }
});
const require__utils_cssr_index = require("../../_utils/cssr/index.js");
const require__mixins_use_config = require("../../_mixins/use-config.js");
const require__mixins_use_css_vars_class = require("../../_mixins/use-css-vars-class.js");
const require__mixins_use_theme = require("../../_mixins/use-theme.js");
const require_vdom = require("../../vue-jsx-vapor/vdom.js");
const require_progress_styles_light = require("../styles/light.js");
const require_progress_src_Circle = require("./Circle.js");
const require_progress_src_Line = require("./Line.js");
const require_progress_src_MultipleCircle = require("./MultipleCircle.js");
const require_progress_src_styles_index_cssr = require("./styles/index.cssr.js");
let vue = require("vue");
//#region src/progress/src/Progress.tsx
const _hoisted_1 = ["aria-valuenow", "role"];
const progressProps = {
	...require__mixins_use_theme.default.props,
	processing: Boolean,
	type: {
		type: String,
		default: "line"
	},
	gapDegree: Number,
	gapOffsetDegree: Number,
	status: {
		type: String,
		default: "default"
	},
	railColor: [String, Array],
	railStyle: [String, Array],
	color: [
		String,
		Array,
		Object
	],
	viewBoxWidth: {
		type: Number,
		default: 100
	},
	strokeWidth: {
		type: Number,
		default: 7
	},
	percentage: [Number, Array],
	unit: {
		type: String,
		default: "%"
	},
	showIndicator: {
		type: Boolean,
		default: true
	},
	indicatorPosition: {
		type: String,
		default: "outside"
	},
	indicatorPlacement: {
		type: String,
		default: "outside"
	},
	indicatorTextColor: String,
	circleGap: {
		type: Number,
		default: 1
	},
	height: Number,
	borderRadius: [String, Number],
	fillBorderRadius: [String, Number],
	offsetDegree: Number
};
var Progress_default = (0, vue.defineComponent)({
	name: "Progress",
	props: progressProps,
	setup(props) {
		const mergedIndicatorPlacementRef = (0, vue.computed)(() => {
			return props.indicatorPlacement || props.indicatorPosition;
		});
		const gapDeg = (0, vue.computed)(() => {
			if (props.gapDegree || props.gapDegree === 0) return props.gapDegree;
			if (props.type === "dashboard") return 75;
		});
		const { mergedClsPrefixRef, inlineThemeDisabled } = require__mixins_use_config.default(props);
		const themeRef = require__mixins_use_theme.default("Progress", "-progress", require_progress_src_styles_index_cssr, require_progress_styles_light.default, props, mergedClsPrefixRef);
		const cssVarsRef = (0, vue.computed)(() => {
			const { status } = props;
			const { common: { cubicBezierEaseInOut }, self: { fontSize, fontSizeCircle, railColor, railHeight, iconSizeCircle, iconSizeLine, textColorCircle, textColorLineInner, textColorLineOuter, lineBgProcessing, fontWeightCircle, [require__utils_cssr_index.createKey("iconColor", status)]: iconColor, [require__utils_cssr_index.createKey("fillColor", status)]: fillColor } } = themeRef.value;
			return {
				"--n-bezier": cubicBezierEaseInOut,
				"--n-fill-color": fillColor,
				"--n-font-size": fontSize,
				"--n-font-size-circle": fontSizeCircle,
				"--n-font-weight-circle": fontWeightCircle,
				"--n-icon-color": iconColor,
				"--n-icon-size-circle": iconSizeCircle,
				"--n-icon-size-line": iconSizeLine,
				"--n-line-bg-processing": lineBgProcessing,
				"--n-rail-color": railColor,
				"--n-rail-height": railHeight,
				"--n-text-color-circle": textColorCircle,
				"--n-text-color-line-inner": textColorLineInner,
				"--n-text-color-line-outer": textColorLineOuter
			};
		});
		const themeClassHandle = inlineThemeDisabled ? require__mixins_use_css_vars_class.useThemeClass("progress", (0, vue.computed)(() => props.status[0]), cssVarsRef, props) : void 0;
		return {
			mergedClsPrefix: mergedClsPrefixRef,
			mergedIndicatorPlacement: mergedIndicatorPlacementRef,
			gapDeg,
			cssVars: inlineThemeDisabled ? void 0 : cssVarsRef,
			themeClass: themeClassHandle?.themeClass,
			onRender: themeClassHandle?.onRender
		};
	},
	render() {
		const { type, cssVars, indicatorTextColor, showIndicator, status, railColor, railStyle, color, percentage, viewBoxWidth, strokeWidth, mergedIndicatorPlacement, unit, borderRadius, fillBorderRadius, height, processing, circleGap, mergedClsPrefix, gapDeg, gapOffsetDegree, themeClass, $slots, onRender } = this;
		onRender?.();
		return (0, vue.openBlock)(), (0, vue.createElementBlock)("div", {
			class: require_vdom.normalizeClass([
				themeClass,
				`${mergedClsPrefix}-progress`,
				`${mergedClsPrefix}-progress--${type}`,
				`${mergedClsPrefix}-progress--${status}`
			]),
			style: (0, vue.normalizeStyle)(cssVars),
			"aria-valuemax": 100,
			"aria-valuemin": 0,
			"aria-valuenow": percentage,
			role: type === "circle" || type === "line" || type === "dashboard" ? "progressbar" : "none"
		}, [type === "circle" || type === "dashboard" ? ((0, vue.openBlock)(), (0, vue.createBlock)(require_progress_src_Circle, {
			key: 0,
			clsPrefix: mergedClsPrefix,
			status,
			showIndicator,
			indicatorTextColor,
			railColor,
			fillColor: color,
			railStyle,
			offsetDegree: this.offsetDegree,
			percentage,
			viewBoxWidth,
			strokeWidth,
			gapDegree: gapDeg === void 0 ? type === "dashboard" ? 75 : 0 : gapDeg,
			gapOffsetDegree,
			unit
		}, require_vdom.normalizeSlots($slots), 1032, [
			"clsPrefix",
			"status",
			"showIndicator",
			"indicatorTextColor",
			"railColor",
			"fillColor",
			"railStyle",
			"offsetDegree",
			"percentage",
			"viewBoxWidth",
			"strokeWidth",
			"gapDegree",
			"gapOffsetDegree",
			"unit"
		])) : ((0, vue.openBlock)(), (0, vue.createElementBlock)(vue.Fragment, { key: 1 }, [type === "line" ? ((0, vue.openBlock)(), (0, vue.createBlock)(require_progress_src_Line, {
			key: 0,
			clsPrefix: mergedClsPrefix,
			status,
			showIndicator,
			indicatorTextColor,
			railColor,
			fillColor: color,
			railStyle,
			percentage,
			processing,
			indicatorPlacement: mergedIndicatorPlacement,
			unit,
			fillBorderRadius,
			railBorderRadius: borderRadius,
			height
		}, require_vdom.normalizeSlots($slots), 1032, [
			"clsPrefix",
			"status",
			"showIndicator",
			"indicatorTextColor",
			"railColor",
			"fillColor",
			"railStyle",
			"percentage",
			"processing",
			"indicatorPlacement",
			"unit",
			"fillBorderRadius",
			"railBorderRadius",
			"height"
		])) : ((0, vue.openBlock)(), (0, vue.createElementBlock)(vue.Fragment, { key: 1 }, [type === "multiple-circle" ? ((0, vue.openBlock)(), (0, vue.createBlock)(require_progress_src_MultipleCircle, {
			key: 0,
			clsPrefix: mergedClsPrefix,
			strokeWidth,
			railColor,
			fillColor: color,
			railStyle,
			viewBoxWidth,
			percentage,
			showIndicator,
			circleGap
		}, require_vdom.normalizeSlots($slots), 1032, [
			"clsPrefix",
			"strokeWidth",
			"railColor",
			"fillColor",
			"railStyle",
			"viewBoxWidth",
			"percentage",
			"showIndicator",
			"circleGap"
		])) : require_vdom.normalizeVNode(() => null)], 64))], 64))], 14, _hoisted_1);
	}
});
//#endregion
exports.default = Progress_default;
exports.progressProps = progressProps;
