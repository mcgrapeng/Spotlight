Object.defineProperties(exports, {
	__esModule: { value: true },
	[Symbol.toStringTag]: { value: "Module" }
});
const require__utils_vue_keep = require("../../_utils/vue/keep.js");
const require__mixins_use_config = require("../../_mixins/use-config.js");
const require__mixins_use_css_vars_class = require("../../_mixins/use-css-vars-class.js");
const require__mixins_use_theme = require("../../_mixins/use-theme.js");
const require_vdom = require("../../vue-jsx-vapor/vdom.js");
const require_affix_src_Affix = require("../../affix/src/Affix.js");
const require_anchor_styles_light = require("../styles/light.js");
const require_anchor_src_BaseAnchor = require("./BaseAnchor.js");
const require_anchor_src_styles_index_cssr = require("./styles/index.cssr.js");
let vue = require("vue");
//#region src/anchor/src/AnchorAdapter.tsx
const anchorProps = {
	...require__mixins_use_theme.default.props,
	affix: Boolean,
	...require_affix_src_Affix.affixProps,
	...require_anchor_src_BaseAnchor.baseAnchorProps
};
var AnchorAdapter_default = (0, vue.defineComponent)({
	name: "Anchor",
	props: anchorProps,
	setup(props, { slots }) {
		const { mergedClsPrefixRef, inlineThemeDisabled } = require__mixins_use_config.default(props);
		const themeRef = require__mixins_use_theme.default("Anchor", "-anchor", require_anchor_src_styles_index_cssr, require_anchor_styles_light.default, props, mergedClsPrefixRef);
		const anchorRef = (0, vue.ref)(null);
		const cssVarsRef = (0, vue.computed)(() => {
			const { self: { railColor, linkColor, railColorActive, linkTextColor, linkTextColorHover, linkTextColorPressed, linkTextColorActive, linkFontSize, railWidth, linkPadding, borderRadius }, common: { cubicBezierEaseInOut } } = themeRef.value;
			return {
				"--n-link-border-radius": borderRadius,
				"--n-link-color": linkColor,
				"--n-link-font-size": linkFontSize,
				"--n-link-text-color": linkTextColor,
				"--n-link-text-color-hover": linkTextColorHover,
				"--n-link-text-color-active": linkTextColorActive,
				"--n-link-text-color-pressed": linkTextColorPressed,
				"--n-link-padding": linkPadding,
				"--n-bezier": cubicBezierEaseInOut,
				"--n-rail-color": railColor,
				"--n-rail-color-active": railColorActive,
				"--n-rail-width": railWidth
			};
		});
		const themeClassHandle = inlineThemeDisabled ? require__mixins_use_css_vars_class.useThemeClass("anchor", void 0, cssVarsRef, props) : void 0;
		return {
			scrollTo(href) {
				anchorRef.value?.setActiveHref(href);
			},
			renderAnchor: () => {
				themeClassHandle?.onRender();
				return (0, vue.openBlock)(), (0, vue.createBlock)(require_anchor_src_BaseAnchor.default, (0, vue.mergeProps)({
					ref: anchorRef,
					style: inlineThemeDisabled ? void 0 : cssVarsRef.value,
					class: themeClassHandle?.themeClass.value
				}, require__utils_vue_keep.keep(props, require_anchor_src_BaseAnchor.baseAnchorPropKeys), { mergedClsPrefix: mergedClsPrefixRef.value }), require_vdom.normalizeSlots(slots), 1040, [
					"style",
					"class",
					"mergedClsPrefix"
				]);
			}
		};
	},
	render() {
		return !this.affix ? this.renderAnchor() : ((0, vue.openBlock)(), (0, vue.createBlock)(require_affix_src_Affix.default, (0, vue.mergeProps)({ key: 1 }, require__utils_vue_keep.keep(this, require_affix_src_Affix.affixPropKeys)), { default: this.renderAnchor }, 1040));
	}
});
//#endregion
exports.anchorProps = anchorProps;
exports.default = AnchorAdapter_default;
