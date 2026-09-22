Object.defineProperties(exports, {
	__esModule: { value: true },
	[Symbol.toStringTag]: { value: "Module" }
});
const require__utils_vue_create_injection_key = require("../../_utils/vue/create-injection-key.js");
const require__utils_css_format_length = require("../../_utils/css/format-length.js");
const require__mixins_use_config = require("../../_mixins/use-config.js");
const require__mixins_use_css_vars_class = require("../../_mixins/use-css-vars-class.js");
const require__mixins_use_theme = require("../../_mixins/use-theme.js");
const require_vdom = require("../../vue-jsx-vapor/vdom.js");
const require_float_button_group_styles_light = require("../styles/light.js");
const require_float_button_group_src_styles_index_cssr = require("./styles/index.cssr.js");
let vue = require("vue");
//#region src/float-button-group/src/FloatButtonGroup.tsx
const floatButtonGroupProps = {
	...require__mixins_use_theme.default.props,
	left: [Number, String],
	right: [Number, String],
	top: [Number, String],
	bottom: [Number, String],
	shape: {
		type: String,
		default: "circle"
	},
	position: {
		type: String,
		default: "fixed"
	}
};
const floatButtonGroupInjectionKey = require__utils_vue_create_injection_key.createInjectionKey("n-float-button-group");
var FloatButtonGroup_default = (0, vue.defineComponent)({
	name: "FloatButtonGroup",
	props: floatButtonGroupProps,
	setup(props) {
		const { mergedClsPrefixRef, inlineThemeDisabled } = require__mixins_use_config.default(props);
		const themeRef = require__mixins_use_theme.default("FloatButtonGroup", "-float-button-group", require_float_button_group_src_styles_index_cssr, require_float_button_group_styles_light, props, mergedClsPrefixRef);
		const cssVarsRef = (0, vue.computed)(() => {
			const { self: { color, boxShadow, buttonBorderColor, borderRadiusSquare }, common: { cubicBezierEaseInOut } } = themeRef.value;
			return {
				"--n-bezier": cubicBezierEaseInOut,
				"--n-box-shadow": boxShadow,
				"--n-color": color,
				"--n-button-border-color": buttonBorderColor,
				"--n-border-radius-square": borderRadiusSquare,
				position: props.position,
				left: require__utils_css_format_length.formatLength(props.left) || "",
				right: require__utils_css_format_length.formatLength(props.right) || "",
				top: require__utils_css_format_length.formatLength(props.top) || "",
				bottom: require__utils_css_format_length.formatLength(props.bottom) || ""
			};
		});
		(0, vue.provide)(floatButtonGroupInjectionKey, { shapeRef: (0, vue.toRef)(props, "shape") });
		const themeClassHandle = inlineThemeDisabled ? require__mixins_use_css_vars_class.useThemeClass("float-button", void 0, cssVarsRef, props) : void 0;
		return {
			cssVars: inlineThemeDisabled ? void 0 : cssVarsRef,
			mergedClsPrefix: mergedClsPrefixRef,
			themeClass: themeClassHandle?.themeClass,
			onRender: themeClassHandle?.onRender
		};
	},
	render() {
		const { mergedClsPrefix, cssVars, shape } = this;
		return (0, vue.openBlock)(), (0, vue.createElementBlock)("div", {
			class: require_vdom.normalizeClass([`${mergedClsPrefix}-float-button-group`, `${mergedClsPrefix}-float-button-group--${shape}-shape`]),
			style: (0, vue.normalizeStyle)(cssVars),
			role: "group"
		}, [require_vdom.normalizeVNode(() => this.$slots.default?.())], 6);
	}
});
//#endregion
exports.default = FloatButtonGroup_default;
exports.floatButtonGroupInjectionKey = floatButtonGroupInjectionKey;
exports.floatButtonGroupProps = floatButtonGroupProps;
