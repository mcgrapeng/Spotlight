Object.defineProperties(exports, {
	__esModule: { value: true },
	[Symbol.toStringTag]: { value: "Module" }
});
const require__utils_composable_use_houdini = require("../../_utils/composable/use-houdini.js");
const require__utils_css_format_length = require("../../_utils/css/format-length.js");
const require__utils_cssr_index = require("../../_utils/cssr/index.js");
const require__mixins_use_config = require("../../_mixins/use-config.js");
const require__mixins_use_css_vars_class = require("../../_mixins/use-css-vars-class.js");
const require__mixins_use_theme = require("../../_mixins/use-theme.js");
const require_vdom = require("../../vue-jsx-vapor/vdom.js");
const require_gradient_text_styles_light = require("../styles/light.js");
const require_gradient_text_src_styles_index_cssr = require("./styles/index.cssr.js");
let vue = require("vue");
//#region src/gradient-text/src/GradientText.tsx
const gradientTextProps = {
	...require__mixins_use_theme.default.props,
	size: [String, Number],
	fontSize: [String, Number],
	type: {
		type: String,
		default: "primary"
	},
	color: [Object, String],
	gradient: [Object, String]
};
var GradientText_default = (0, vue.defineComponent)({
	name: "GradientText",
	props: gradientTextProps,
	setup(props) {
		require__utils_composable_use_houdini.useHoudini();
		const { mergedClsPrefixRef, inlineThemeDisabled } = require__mixins_use_config.default(props);
		const compatibleTypeRef = (0, vue.computed)(() => {
			const { type } = props;
			if (type === "danger") return "error";
			return type;
		});
		const styleFontSizeRef = (0, vue.computed)(() => {
			let fontSize = props.size || props.fontSize;
			if (fontSize) fontSize = require__utils_css_format_length.formatLength(fontSize);
			return fontSize || void 0;
		});
		const styleBgImageRef = (0, vue.computed)(() => {
			const gradient = props.color || props.gradient;
			if (typeof gradient === "string") return gradient;
			else if (gradient) return `linear-gradient(${gradient.deg || 0}deg, ${gradient.from} 0%, ${gradient.to} 100%)`;
		});
		const themeRef = require__mixins_use_theme.default("GradientText", "-gradient-text", require_gradient_text_src_styles_index_cssr, require_gradient_text_styles_light, props, mergedClsPrefixRef);
		const cssVarsRef = (0, vue.computed)(() => {
			const { value: type } = compatibleTypeRef;
			const { common: { cubicBezierEaseInOut }, self: { rotate, [require__utils_cssr_index.createKey("colorStart", type)]: colorStart, [require__utils_cssr_index.createKey("colorEnd", type)]: colorEnd, fontWeight } } = themeRef.value;
			return {
				"--n-bezier": cubicBezierEaseInOut,
				"--n-rotate": rotate,
				"--n-color-start": colorStart,
				"--n-color-end": colorEnd,
				"--n-font-weight": fontWeight
			};
		});
		const themeClassHandle = inlineThemeDisabled ? require__mixins_use_css_vars_class.useThemeClass("gradient-text", (0, vue.computed)(() => compatibleTypeRef.value[0]), cssVarsRef, props) : void 0;
		return {
			mergedClsPrefix: mergedClsPrefixRef,
			compatibleType: compatibleTypeRef,
			styleFontSize: styleFontSizeRef,
			styleBgImage: styleBgImageRef,
			cssVars: inlineThemeDisabled ? void 0 : cssVarsRef,
			themeClass: themeClassHandle?.themeClass,
			onRender: themeClassHandle?.onRender
		};
	},
	render() {
		const { mergedClsPrefix, onRender } = this;
		onRender?.();
		return (0, vue.openBlock)(), (0, vue.createElementBlock)("span", {
			class: require_vdom.normalizeClass([
				`${mergedClsPrefix}-gradient-text`,
				`${mergedClsPrefix}-gradient-text--${this.compatibleType}-type`,
				this.themeClass
			]),
			style: (0, vue.normalizeStyle)([{
				fontSize: this.styleFontSize,
				backgroundImage: this.styleBgImage
			}, this.cssVars])
		}, [require_vdom.normalizeVNode(() => this.$slots.default?.())], 6);
	}
});
//#endregion
exports.default = GradientText_default;
exports.gradientTextProps = gradientTextProps;
