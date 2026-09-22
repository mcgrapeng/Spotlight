Object.defineProperties(exports, {
	__esModule: { value: true },
	[Symbol.toStringTag]: { value: "Module" }
});
const require__mixins_use_config = require("../../_mixins/use-config.js");
const require__mixins_use_css_vars_class = require("../../_mixins/use-css-vars-class.js");
const require__mixins_use_theme = require("../../_mixins/use-theme.js");
const require_vdom = require("../../vue-jsx-vapor/vdom.js");
const require_typography_styles_light = require("../styles/light.js");
const require_typography_src_styles_blockquote_cssr = require("./styles/blockquote.cssr.js");
let vue = require("vue");
//#region src/typography/src/blockquote.tsx
const blockquoteProps = {
	...require__mixins_use_theme.default.props,
	alignText: Boolean
};
var blockquote_default = (0, vue.defineComponent)({
	name: "Blockquote",
	props: blockquoteProps,
	setup(props) {
		const { mergedClsPrefixRef, inlineThemeDisabled } = require__mixins_use_config.default(props);
		const themeRef = require__mixins_use_theme.default("Typography", "-blockquote", require_typography_src_styles_blockquote_cssr, require_typography_styles_light.default, props, mergedClsPrefixRef);
		const cssVarsRef = (0, vue.computed)(() => {
			const { common: { cubicBezierEaseInOut }, self: { blockquoteTextColor, blockquotePrefixColor, blockquoteLineHeight, blockquoteFontSize } } = themeRef.value;
			return {
				"--n-bezier": cubicBezierEaseInOut,
				"--n-font-size": blockquoteFontSize,
				"--n-line-height": blockquoteLineHeight,
				"--n-prefix-color": blockquotePrefixColor,
				"--n-text-color": blockquoteTextColor
			};
		});
		const themeClassHandle = inlineThemeDisabled ? require__mixins_use_css_vars_class.useThemeClass("blockquote", void 0, cssVarsRef, props) : void 0;
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
		return (0, vue.openBlock)(), (0, vue.createElementBlock)("blockquote", {
			class: require_vdom.normalizeClass([
				`${mergedClsPrefix}-blockquote`,
				this.themeClass,
				this.alignText && `${mergedClsPrefix}-blockquote--align-text`
			]),
			style: (0, vue.normalizeStyle)(this.cssVars)
		}, [require_vdom.normalizeVNode(() => this.$slots.default?.())], 6);
	}
});
//#endregion
exports.blockquoteProps = blockquoteProps;
exports.default = blockquote_default;
