Object.defineProperties(exports, {
	__esModule: { value: true },
	[Symbol.toStringTag]: { value: "Module" }
});
const require__mixins_use_config = require("../../_mixins/use-config.js");
const require__mixins_use_css_vars_class = require("../../_mixins/use-css-vars-class.js");
const require__mixins_use_theme = require("../../_mixins/use-theme.js");
const require_vdom = require("../../vue-jsx-vapor/vdom.js");
const require_divider_styles_light = require("../styles/light.js");
const require_divider_src_styles_index_cssr = require("./styles/index.cssr.js");
let vue = require("vue");
//#region src/divider/src/Divider.tsx
const dividerProps = {
	...require__mixins_use_theme.default.props,
	titlePlacement: {
		type: String,
		default: "center"
	},
	dashed: Boolean,
	vertical: Boolean
};
var Divider_default = (0, vue.defineComponent)({
	name: "Divider",
	props: dividerProps,
	setup(props) {
		const { mergedClsPrefixRef, inlineThemeDisabled } = require__mixins_use_config.default(props);
		const themeRef = require__mixins_use_theme.default("Divider", "-divider", require_divider_src_styles_index_cssr, require_divider_styles_light.default, props, mergedClsPrefixRef);
		const cssVarsRef = (0, vue.computed)(() => {
			const { common: { cubicBezierEaseInOut }, self: { color, textColor, fontWeight } } = themeRef.value;
			return {
				"--n-bezier": cubicBezierEaseInOut,
				"--n-color": color,
				"--n-text-color": textColor,
				"--n-font-weight": fontWeight
			};
		});
		const themeClassHandle = inlineThemeDisabled ? require__mixins_use_css_vars_class.useThemeClass("divider", void 0, cssVarsRef, props) : void 0;
		return {
			mergedClsPrefix: mergedClsPrefixRef,
			cssVars: inlineThemeDisabled ? void 0 : cssVarsRef,
			themeClass: themeClassHandle?.themeClass,
			onRender: themeClassHandle?.onRender
		};
	},
	render() {
		const { $slots, titlePlacement, vertical, dashed, cssVars, mergedClsPrefix } = this;
		this.onRender?.();
		return (0, vue.openBlock)(), (0, vue.createElementBlock)("div", {
			role: "separator",
			class: require_vdom.normalizeClass([
				`${mergedClsPrefix}-divider`,
				this.themeClass,
				{
					[`${mergedClsPrefix}-divider--vertical`]: vertical,
					[`${mergedClsPrefix}-divider--no-title`]: !$slots.default,
					[`${mergedClsPrefix}-divider--dashed`]: dashed,
					[`${mergedClsPrefix}-divider--title-position-${titlePlacement}`]: $slots.default && titlePlacement
				}
			]),
			style: (0, vue.normalizeStyle)(cssVars)
		}, [!vertical ? ((0, vue.openBlock)(), (0, vue.createElementBlock)("div", {
			key: 0,
			class: require_vdom.normalizeClass(`${mergedClsPrefix}-divider__line ${mergedClsPrefix}-divider__line--left`)
		}, null, 2)) : require_vdom.normalizeVNode(() => null), !vertical && $slots.default ? ((0, vue.openBlock)(), (0, vue.createElementBlock)(vue.Fragment, { key: 2 }, [(0, vue.createElementVNode)("div", { class: require_vdom.normalizeClass(`${mergedClsPrefix}-divider__title`) }, [require_vdom.normalizeVNode(() => this.$slots.default?.())], 2), (0, vue.createElementVNode)("div", { class: require_vdom.normalizeClass(`${mergedClsPrefix}-divider__line ${mergedClsPrefix}-divider__line--right`) }, null, 2)], 64)) : require_vdom.normalizeVNode(() => null)], 6);
	}
});
//#endregion
exports.default = Divider_default;
exports.dividerProps = dividerProps;
