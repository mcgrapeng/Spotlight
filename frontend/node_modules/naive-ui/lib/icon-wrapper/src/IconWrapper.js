Object.defineProperty(exports, Symbol.toStringTag, { value: "Module" });
const require__utils_css_format_length = require("../../_utils/css/format-length.js");
const require__mixins_use_config = require("../../_mixins/use-config.js");
const require__mixins_use_css_vars_class = require("../../_mixins/use-css-vars-class.js");
const require__mixins_use_theme = require("../../_mixins/use-theme.js");
const require_vdom = require("../../vue-jsx-vapor/vdom.js");
const require_icon_wrapper_styles_light = require("../styles/light.js");
const require_icon_wrapper_src_styles_index_cssr = require("./styles/index.cssr.js");
let vue = require("vue");
//#region src/icon-wrapper/src/IconWrapper.tsx
const iconWrapperProps = {
	...require__mixins_use_theme.default.props,
	size: {
		type: Number,
		default: 24
	},
	borderRadius: {
		type: Number,
		default: 6
	},
	color: String,
	iconColor: String
};
const NIconWrapper = (0, vue.defineComponent)({
	name: "IconWrapper",
	props: iconWrapperProps,
	setup(props, { slots }) {
		const { mergedClsPrefixRef, inlineThemeDisabled } = require__mixins_use_config.default(props);
		const themeRef = require__mixins_use_theme.default("IconWrapper", "-icon-wrapper", require_icon_wrapper_src_styles_index_cssr, require_icon_wrapper_styles_light.default, props, mergedClsPrefixRef);
		const cssVarsRef = (0, vue.computed)(() => {
			const { common: { cubicBezierEaseInOut }, self: { color, iconColor } } = themeRef.value;
			return {
				"--n-bezier": cubicBezierEaseInOut,
				"--n-color": color,
				"--n-icon-color": iconColor
			};
		});
		const themeClassHandle = inlineThemeDisabled ? require__mixins_use_css_vars_class.useThemeClass("icon-wrapper", void 0, cssVarsRef, props) : void 0;
		return () => {
			const size = require__utils_css_format_length.formatLength(props.size);
			themeClassHandle?.onRender();
			return (0, vue.openBlock)(), (0, vue.createElementBlock)("div", {
				class: require_vdom.normalizeClass([`${mergedClsPrefixRef.value}-icon-wrapper`, themeClassHandle?.themeClass.value]),
				style: (0, vue.normalizeStyle)([cssVarsRef?.value, {
					height: size,
					width: size,
					borderRadius: require__utils_css_format_length.formatLength(props.borderRadius),
					backgroundColor: props.color,
					color: props.iconColor
				}])
			}, [require_vdom.normalizeVNode(() => slots.default?.())], 6);
		};
	}
});
//#endregion
exports.NIconWrapper = NIconWrapper;
exports.iconWrapperProps = iconWrapperProps;
