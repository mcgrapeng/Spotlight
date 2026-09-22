const require__mixins_use_config = require("../../_mixins/use-config.js");
const require__mixins_use_css_vars_class = require("../../_mixins/use-css-vars-class.js");
const require__mixins_use_theme = require("../../_mixins/use-theme.js");
const require_vdom = require("../../vue-jsx-vapor/vdom.js");
const require_typography_styles_light = require("../styles/light.js");
const require_typography_src_styles_hr_cssr = require("./styles/hr.cssr.js");
let vue = require("vue");
//#region src/typography/src/hr.tsx
var hr_default = (0, vue.defineComponent)({
	name: "Hr",
	props: { ...require__mixins_use_theme.default.props },
	setup(props) {
		const { mergedClsPrefixRef, inlineThemeDisabled } = require__mixins_use_config.default(props);
		const themeRef = require__mixins_use_theme.default("Typography", "-hr", require_typography_src_styles_hr_cssr, require_typography_styles_light.default, props, mergedClsPrefixRef);
		const cssVarsRef = (0, vue.computed)(() => {
			const { common: { cubicBezierEaseInOut }, self: { hrColor } } = themeRef.value;
			return {
				"--n-bezier": cubicBezierEaseInOut,
				"--n-color": hrColor
			};
		});
		const themeClassHandle = inlineThemeDisabled ? require__mixins_use_css_vars_class.useThemeClass("hr", void 0, cssVarsRef, props) : void 0;
		return {
			mergedClsPrefix: mergedClsPrefixRef,
			cssVars: inlineThemeDisabled ? void 0 : cssVarsRef,
			themeClass: themeClassHandle?.themeClass,
			onRender: themeClassHandle?.onRender
		};
	},
	render() {
		this.onRender?.();
		return (0, vue.openBlock)(), (0, vue.createElementBlock)("hr", {
			class: require_vdom.normalizeClass([`${this.mergedClsPrefix}-hr`, this.themeClass]),
			style: (0, vue.normalizeStyle)(this.cssVars)
		}, null, 6);
	}
});
//#endregion
module.exports = hr_default;
