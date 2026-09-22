Object.defineProperty(exports, Symbol.toStringTag, { value: "Module" });
const require__utils_css_format_length = require("../../_utils/css/format-length.js");
const require__utils_naive_warn = require("../../_utils/naive/warn.js");
const require__mixins_use_config = require("../../_mixins/use-config.js");
const require__mixins_use_css_vars_class = require("../../_mixins/use-css-vars-class.js");
const require__mixins_use_theme = require("../../_mixins/use-theme.js");
const require_icon_styles_light = require("../styles/light.js");
const require_icon_src_styles_index_cssr = require("./styles/index.cssr.js");
let vue = require("vue");
//#region src/icon/src/Icon.ts
const iconProps = {
	...require__mixins_use_theme.default.props,
	depth: [String, Number],
	size: [Number, String],
	color: String,
	component: [Object, Function]
};
const NIcon = (0, vue.defineComponent)({
	_n_icon__: true,
	name: "Icon",
	inheritAttrs: false,
	props: iconProps,
	setup(props) {
		const { mergedClsPrefixRef, inlineThemeDisabled } = require__mixins_use_config.default(props);
		const themeRef = require__mixins_use_theme.default("Icon", "-icon", require_icon_src_styles_index_cssr, require_icon_styles_light.default, props, mergedClsPrefixRef);
		const cssVarsRef = (0, vue.computed)(() => {
			const { depth } = props;
			const { common: { cubicBezierEaseInOut }, self } = themeRef.value;
			if (depth !== void 0) {
				const { color, [`opacity${depth}Depth`]: opacity } = self;
				return {
					"--n-bezier": cubicBezierEaseInOut,
					"--n-color": color,
					"--n-opacity": opacity
				};
			}
			return {
				"--n-bezier": cubicBezierEaseInOut,
				"--n-color": "",
				"--n-opacity": ""
			};
		});
		const themeClassHandle = inlineThemeDisabled ? require__mixins_use_css_vars_class.useThemeClass("icon", (0, vue.computed)(() => `${props.depth || "d"}`), cssVarsRef, props) : void 0;
		return {
			mergedClsPrefix: mergedClsPrefixRef,
			mergedStyle: (0, vue.computed)(() => {
				const { size, color } = props;
				return {
					fontSize: require__utils_css_format_length.formatLength(size),
					color
				};
			}),
			cssVars: inlineThemeDisabled ? void 0 : cssVarsRef,
			themeClass: themeClassHandle?.themeClass,
			onRender: themeClassHandle?.onRender
		};
	},
	render() {
		const { $parent, depth, mergedClsPrefix, component, onRender, themeClass } = this;
		if ($parent?.$options?._n_icon__) require__utils_naive_warn.warn("icon", "don't wrap `n-icon` inside `n-icon`");
		onRender?.();
		return (0, vue.h)("i", (0, vue.mergeProps)(this.$attrs, {
			role: "img",
			class: [
				`${mergedClsPrefix}-icon`,
				themeClass,
				{
					[`${mergedClsPrefix}-icon--depth`]: depth,
					[`${mergedClsPrefix}-icon--color-transition`]: depth !== void 0
				}
			],
			style: [this.cssVars, this.mergedStyle]
		}), component ? (0, vue.h)(component) : this.$slots.default?.());
	}
});
//#endregion
exports.NIcon = NIcon;
exports.iconProps = iconProps;
