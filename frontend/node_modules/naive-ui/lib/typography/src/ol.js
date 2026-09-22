Object.defineProperties(exports, {
	__esModule: { value: true },
	[Symbol.toStringTag]: { value: "Module" }
});
const require__mixins_use_config = require("../../_mixins/use-config.js");
const require__mixins_use_css_vars_class = require("../../_mixins/use-css-vars-class.js");
const require__mixins_use_theme = require("../../_mixins/use-theme.js");
const require_vdom = require("../../vue-jsx-vapor/vdom.js");
const require_typography_styles_light = require("../styles/light.js");
const require_typography_src_styles_list_cssr = require("./styles/list.cssr.js");
let vue = require("vue");
//#region src/typography/src/ol.tsx
const olProps = {
	...require__mixins_use_theme.default.props,
	alignText: Boolean
};
var ol_default = (0, vue.defineComponent)({
	name: "Ol",
	props: olProps,
	setup(props) {
		const { mergedClsPrefixRef, inlineThemeDisabled } = require__mixins_use_config.default(props);
		const themeRef = require__mixins_use_theme.default("Typography", "-xl", require_typography_src_styles_list_cssr, require_typography_styles_light.default, props, mergedClsPrefixRef);
		const cssVarsRef = (0, vue.computed)(() => {
			const { common: { cubicBezierEaseInOut }, self: { olPadding, ulPadding, liMargin, liTextColor, liLineHeight, liFontSize } } = themeRef.value;
			return {
				"--n-bezier": cubicBezierEaseInOut,
				"--n-font-size": liFontSize,
				"--n-line-height": liLineHeight,
				"--n-text-color": liTextColor,
				"--n-li-margin": liMargin,
				"--n-ol-padding": olPadding,
				"--n-ul-padding": ulPadding
			};
		});
		const themeClassHandle = inlineThemeDisabled ? require__mixins_use_css_vars_class.useThemeClass("ol", void 0, cssVarsRef, props) : void 0;
		return {
			mergedClsPrefix: mergedClsPrefixRef,
			cssVars: inlineThemeDisabled ? void 0 : cssVarsRef,
			themeClass: themeClassHandle?.themeClass,
			onRender: themeClassHandle?.onRender
		};
	},
	render() {
		const { mergedClsPrefix } = this;
		this.onRender?.();
		return (0, vue.openBlock)(), (0, vue.createElementBlock)("ol", {
			class: require_vdom.normalizeClass([
				`${mergedClsPrefix}-ol`,
				this.themeClass,
				this.alignText && `${mergedClsPrefix}-ol--align-text`
			]),
			style: (0, vue.normalizeStyle)(this.cssVars)
		}, [require_vdom.normalizeVNode(() => this.$slots.default?.())], 6);
	}
});
//#endregion
exports.default = ol_default;
exports.olProps = olProps;
