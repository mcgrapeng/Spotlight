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
const require_layout_src_styles_layout_header_cssr = require("./styles/layout-header.cssr.js");
let vue = require("vue");
//#region src/layout/src/LayoutHeader.tsx
const headerProps = {
	position: require_layout_src_interface.positionProp,
	inverted: Boolean,
	bordered: Boolean
};
var LayoutHeader_default = (0, vue.defineComponent)({
	name: "LayoutHeader",
	props: {
		...require__mixins_use_theme.default.props,
		...headerProps
	},
	setup(props) {
		const { mergedClsPrefixRef, inlineThemeDisabled } = require__mixins_use_config.default(props);
		const themeRef = require__mixins_use_theme.default("Layout", "-layout-header", require_layout_src_styles_layout_header_cssr, require_layout_styles_light.default, props, mergedClsPrefixRef);
		const cssVarsRef = (0, vue.computed)(() => {
			const { common: { cubicBezierEaseInOut }, self } = themeRef.value;
			const vars = { "--n-bezier": cubicBezierEaseInOut };
			if (props.inverted) {
				vars["--n-color"] = self.headerColorInverted;
				vars["--n-text-color"] = self.textColorInverted;
				vars["--n-border-color"] = self.headerBorderColorInverted;
			} else {
				vars["--n-color"] = self.headerColor;
				vars["--n-text-color"] = self.textColor;
				vars["--n-border-color"] = self.headerBorderColor;
			}
			return vars;
		});
		const themeClassHandle = inlineThemeDisabled ? require__mixins_use_css_vars_class.useThemeClass("layout-header", (0, vue.computed)(() => props.inverted ? "a" : "b"), cssVarsRef, props) : void 0;
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
				`${mergedClsPrefix}-layout-header`,
				this.themeClass,
				this.position && `${mergedClsPrefix}-layout-header--${this.position}-positioned`,
				this.bordered && `${mergedClsPrefix}-layout-header--bordered`
			]),
			style: (0, vue.normalizeStyle)(this.cssVars)
		}, [require_vdom.normalizeVNode(() => this.$slots.default?.())], 6);
	}
});
//#endregion
exports.default = LayoutHeader_default;
exports.headerProps = headerProps;
