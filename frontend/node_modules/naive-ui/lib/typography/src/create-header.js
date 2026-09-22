Object.defineProperties(exports, {
	__esModule: { value: true },
	[Symbol.toStringTag]: { value: "Module" }
});
const require__utils_cssr_index = require("../../_utils/cssr/index.js");
const require__mixins_use_config = require("../../_mixins/use-config.js");
const require__mixins_use_css_vars_class = require("../../_mixins/use-css-vars-class.js");
const require__mixins_use_theme = require("../../_mixins/use-theme.js");
const require_typography_styles_light = require("../styles/light.js");
const require_typography_src_styles_header_cssr = require("./styles/header.cssr.js");
let vue = require("vue");
//#region src/typography/src/create-header.ts
const headerProps = {
	...require__mixins_use_theme.default.props,
	type: {
		type: String,
		default: "default"
	},
	prefix: String,
	alignText: Boolean
};
var create_header_default = (level) => (0, vue.defineComponent)({
	name: `H${level}`,
	props: headerProps,
	setup(props) {
		const { mergedClsPrefixRef, inlineThemeDisabled } = require__mixins_use_config.default(props);
		const themeRef = require__mixins_use_theme.default("Typography", "-h", require_typography_src_styles_header_cssr, require_typography_styles_light.default, props, mergedClsPrefixRef);
		const cssVarsRef = (0, vue.computed)(() => {
			const { type } = props;
			const { common: { cubicBezierEaseInOut }, self: { headerFontWeight, headerTextColor, [require__utils_cssr_index.createKey("headerPrefixWidth", level)]: prefixWidth, [require__utils_cssr_index.createKey("headerFontSize", level)]: fontSize, [require__utils_cssr_index.createKey("headerMargin", level)]: margin, [require__utils_cssr_index.createKey("headerBarWidth", level)]: barWidth, [require__utils_cssr_index.createKey("headerBarColor", type)]: barColor } } = themeRef.value;
			return {
				"--n-bezier": cubicBezierEaseInOut,
				"--n-font-size": fontSize,
				"--n-margin": margin,
				"--n-bar-color": barColor,
				"--n-bar-width": barWidth,
				"--n-font-weight": headerFontWeight,
				"--n-text-color": headerTextColor,
				"--n-prefix-width": prefixWidth
			};
		});
		const themeClassHandle = inlineThemeDisabled ? require__mixins_use_css_vars_class.useThemeClass(`h${level}`, (0, vue.computed)(() => props.type[0]), cssVarsRef, props) : void 0;
		return {
			mergedClsPrefix: mergedClsPrefixRef,
			cssVars: inlineThemeDisabled ? void 0 : cssVarsRef,
			themeClass: themeClassHandle?.themeClass,
			onRender: themeClassHandle?.onRender
		};
	},
	render() {
		const { prefix, alignText, mergedClsPrefix, cssVars, $slots } = this;
		this.onRender?.();
		return (0, vue.h)(`h${level}`, {
			class: [
				`${mergedClsPrefix}-h`,
				`${mergedClsPrefix}-h${level}`,
				this.themeClass,
				{
					[`${mergedClsPrefix}-h--prefix-bar`]: prefix,
					[`${mergedClsPrefix}-h--align-text`]: alignText
				}
			],
			style: cssVars
		}, $slots);
	}
});
//#endregion
exports.default = create_header_default;
exports.headerProps = headerProps;
