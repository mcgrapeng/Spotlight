Object.defineProperties(exports, {
	__esModule: { value: true },
	[Symbol.toStringTag]: { value: "Module" }
});
const require__utils_vue_create_injection_key = require("../../_utils/vue/create-injection-key.js");
const require__mixins_use_config = require("../../_mixins/use-config.js");
const require__mixins_use_css_vars_class = require("../../_mixins/use-css-vars-class.js");
const require__mixins_use_theme = require("../../_mixins/use-theme.js");
const require_vdom = require("../../vue-jsx-vapor/vdom.js");
const require_breadcrumb_styles_light = require("../styles/light.js");
const require_breadcrumb_src_styles_index_cssr = require("./styles/index.cssr.js");
let vue = require("vue");
//#region src/breadcrumb/src/Breadcrumb.tsx
const breadcrumbInjectionKey = require__utils_vue_create_injection_key.createInjectionKey("n-breadcrumb");
const breadcrumbProps = {
	...require__mixins_use_theme.default.props,
	separator: {
		type: String,
		default: "/"
	}
};
var Breadcrumb_default = (0, vue.defineComponent)({
	name: "Breadcrumb",
	props: breadcrumbProps,
	setup(props) {
		const { mergedClsPrefixRef, inlineThemeDisabled } = require__mixins_use_config.default(props);
		const themeRef = require__mixins_use_theme.default("Breadcrumb", "-breadcrumb", require_breadcrumb_src_styles_index_cssr, require_breadcrumb_styles_light.default, props, mergedClsPrefixRef);
		(0, vue.provide)(breadcrumbInjectionKey, {
			separatorRef: (0, vue.toRef)(props, "separator"),
			mergedClsPrefixRef
		});
		const cssVarsRef = (0, vue.computed)(() => {
			const { common: { cubicBezierEaseInOut }, self: { separatorColor, itemTextColor, itemTextColorHover, itemTextColorPressed, itemTextColorActive, fontSize, fontWeightActive, itemBorderRadius, itemColorHover, itemColorPressed, itemLineHeight } } = themeRef.value;
			return {
				"--n-font-size": fontSize,
				"--n-bezier": cubicBezierEaseInOut,
				"--n-item-text-color": itemTextColor,
				"--n-item-text-color-hover": itemTextColorHover,
				"--n-item-text-color-pressed": itemTextColorPressed,
				"--n-item-text-color-active": itemTextColorActive,
				"--n-separator-color": separatorColor,
				"--n-item-color-hover": itemColorHover,
				"--n-item-color-pressed": itemColorPressed,
				"--n-item-border-radius": itemBorderRadius,
				"--n-font-weight-active": fontWeightActive,
				"--n-item-line-height": itemLineHeight
			};
		});
		const themeClassHandle = inlineThemeDisabled ? require__mixins_use_css_vars_class.useThemeClass("breadcrumb", void 0, cssVarsRef, props) : void 0;
		return {
			mergedClsPrefix: mergedClsPrefixRef,
			cssVars: inlineThemeDisabled ? void 0 : cssVarsRef,
			themeClass: themeClassHandle?.themeClass,
			onRender: themeClassHandle?.onRender
		};
	},
	render() {
		this.onRender?.();
		return (0, vue.openBlock)(), (0, vue.createElementBlock)("nav", {
			class: require_vdom.normalizeClass([`${this.mergedClsPrefix}-breadcrumb`, this.themeClass]),
			style: (0, vue.normalizeStyle)(this.cssVars),
			"aria-label": "Breadcrumb"
		}, [(0, vue.createElementVNode)("ul", null, [require_vdom.normalizeVNode(() => this.$slots.default?.())])], 6);
	}
});
//#endregion
exports.breadcrumbInjectionKey = breadcrumbInjectionKey;
exports.breadcrumbProps = breadcrumbProps;
exports.default = Breadcrumb_default;
