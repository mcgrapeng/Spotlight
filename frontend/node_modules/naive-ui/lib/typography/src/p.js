Object.defineProperties(exports, {
	__esModule: { value: true },
	[Symbol.toStringTag]: { value: "Module" }
});
const require__mixins_use_config = require("../../_mixins/use-config.js");
const require__mixins_use_css_vars_class = require("../../_mixins/use-css-vars-class.js");
const require__mixins_use_theme = require("../../_mixins/use-theme.js");
const require_vdom = require("../../vue-jsx-vapor/vdom.js");
const require_typography_styles_light = require("../styles/light.js");
const require_typography_src_styles_p_cssr = require("./styles/p.cssr.js");
let vue = require("vue");
//#region src/typography/src/p.tsx
const pProps = {
	...require__mixins_use_theme.default.props,
	depth: [String, Number]
};
var p_default = (0, vue.defineComponent)({
	name: "P",
	props: pProps,
	setup(props) {
		const { mergedClsPrefixRef, inlineThemeDisabled } = require__mixins_use_config.default(props);
		const themeRef = require__mixins_use_theme.default("Typography", "-p", require_typography_src_styles_p_cssr, require_typography_styles_light.default, props, mergedClsPrefixRef);
		const cssVarsRef = (0, vue.computed)(() => {
			const { depth } = props;
			const typeSafeDepth = depth || "1";
			const { common: { cubicBezierEaseInOut }, self: { pFontSize, pLineHeight, pMargin, pTextColor, [`pTextColor${typeSafeDepth}Depth`]: depthTextColor } } = themeRef.value;
			return {
				"--n-bezier": cubicBezierEaseInOut,
				"--n-font-size": pFontSize,
				"--n-line-height": pLineHeight,
				"--n-margin": pMargin,
				"--n-text-color": depth === void 0 ? pTextColor : depthTextColor
			};
		});
		const themeClassHandle = inlineThemeDisabled ? require__mixins_use_css_vars_class.useThemeClass("p", (0, vue.computed)(() => `${props.depth || ""}`), cssVarsRef, props) : void 0;
		return {
			mergedClsPrefix: mergedClsPrefixRef,
			cssVars: inlineThemeDisabled ? void 0 : cssVarsRef,
			themeClass: themeClassHandle?.themeClass,
			onRender: themeClassHandle?.onRender
		};
	},
	render() {
		this.onRender?.();
		return (0, vue.openBlock)(), (0, vue.createElementBlock)("p", {
			class: require_vdom.normalizeClass([`${this.mergedClsPrefix}-p`, this.themeClass]),
			style: (0, vue.normalizeStyle)(this.cssVars)
		}, [require_vdom.normalizeVNode(() => this.$slots.default?.())], 6);
	}
});
//#endregion
exports.default = p_default;
exports.pProps = pProps;
