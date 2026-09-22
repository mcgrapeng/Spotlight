Object.defineProperties(exports, {
	__esModule: { value: true },
	[Symbol.toStringTag]: { value: "Module" }
});
const require__mixins_use_config = require("../../_mixins/use-config.js");
const require__mixins_use_css_vars_class = require("../../_mixins/use-css-vars-class.js");
const require__mixins_use_theme = require("../../_mixins/use-theme.js");
const require_vdom = require("../../vue-jsx-vapor/vdom.js");
const require_typography_styles_light = require("../styles/light.js");
const require_typography_src_styles_a_cssr = require("./styles/a.cssr.js");
let vue = require("vue");
//#region src/typography/src/a.tsx
const aProps = { ...require__mixins_use_theme.default.props };
var a_default = (0, vue.defineComponent)({
	name: "A",
	props: aProps,
	setup(props) {
		const { mergedClsPrefixRef, inlineThemeDisabled } = require__mixins_use_config.default(props);
		const themeRef = require__mixins_use_theme.default("Typography", "-a", require_typography_src_styles_a_cssr, require_typography_styles_light.default, props, mergedClsPrefixRef);
		const cssVarsRef = (0, vue.computed)(() => {
			const { common: { cubicBezierEaseInOut }, self: { aTextColor } } = themeRef.value;
			return {
				"--n-text-color": aTextColor,
				"--n-bezier": cubicBezierEaseInOut
			};
		});
		const themeClassHandle = inlineThemeDisabled ? require__mixins_use_css_vars_class.useThemeClass("a", void 0, cssVarsRef, props) : void 0;
		return {
			mergedClsPrefix: mergedClsPrefixRef,
			cssVars: inlineThemeDisabled ? void 0 : cssVarsRef,
			themeClass: themeClassHandle?.themeClass,
			onRender: themeClassHandle?.onRender
		};
	},
	render() {
		this.onRender?.();
		return (0, vue.openBlock)(), (0, vue.createElementBlock)("a", {
			class: require_vdom.normalizeClass([`${this.mergedClsPrefix}-a`, this.themeClass]),
			style: (0, vue.normalizeStyle)(this.cssVars)
		}, [require_vdom.normalizeVNode(() => this.$slots.default?.())], 6);
	}
});
//#endregion
exports.aProps = aProps;
exports.default = a_default;
