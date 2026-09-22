Object.defineProperties(exports, {
	__esModule: { value: true },
	[Symbol.toStringTag]: { value: "Module" }
});
const require__mixins_use_config = require("../../_mixins/use-config.js");
const require__mixins_use_css_vars_class = require("../../_mixins/use-css-vars-class.js");
const require__mixins_use_theme = require("../../_mixins/use-theme.js");
const require_vdom = require("../../vue-jsx-vapor/vdom.js");
const require_layout_styles_light = require("../styles/light.js");
const require_layout_src_interface = require("./interface.js");
const require_layout_src_styles_layout_footer_cssr = require("./styles/layout-footer.cssr.js");
let vue = require("vue");
//#region src/layout/src/LayoutFooter.tsx
const layoutFooterProps = {
	...require__mixins_use_theme.default.props,
	inverted: Boolean,
	position: require_layout_src_interface.positionProp,
	bordered: Boolean
};
var LayoutFooter_default = (0, vue.defineComponent)({
	name: "LayoutFooter",
	props: layoutFooterProps,
	setup(props) {
		const { mergedClsPrefixRef, inlineThemeDisabled } = require__mixins_use_config.default(props);
		const themeRef = require__mixins_use_theme.default("Layout", "-layout-footer", require_layout_src_styles_layout_footer_cssr, require_layout_styles_light.default, props, mergedClsPrefixRef);
		const cssVarsRef = (0, vue.computed)(() => {
			const { common: { cubicBezierEaseInOut }, self } = themeRef.value;
			const vars = { "--n-bezier": cubicBezierEaseInOut };
			if (props.inverted) {
				vars["--n-color"] = self.footerColorInverted;
				vars["--n-text-color"] = self.textColorInverted;
				vars["--n-border-color"] = self.footerBorderColorInverted;
			} else {
				vars["--n-color"] = self.footerColor;
				vars["--n-text-color"] = self.textColor;
				vars["--n-border-color"] = self.footerBorderColor;
			}
			return vars;
		});
		const themeClassHandle = inlineThemeDisabled ? require__mixins_use_css_vars_class.useThemeClass("layout-footer", (0, vue.computed)(() => props.inverted ? "a" : "b"), cssVarsRef, props) : void 0;
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
		return (0, vue.openBlock)(), (0, vue.createElementBlock)("div", {
			class: require_vdom.normalizeClass([
				`${mergedClsPrefix}-layout-footer`,
				this.themeClass,
				this.position && `${mergedClsPrefix}-layout-footer--${this.position}-positioned`,
				this.bordered && `${mergedClsPrefix}-layout-footer--bordered`
			]),
			style: (0, vue.normalizeStyle)(this.cssVars)
		}, [require_vdom.normalizeVNode(() => this.$slots.default?.())], 6);
	}
});
//#endregion
exports.default = LayoutFooter_default;
exports.layoutFooterProps = layoutFooterProps;
