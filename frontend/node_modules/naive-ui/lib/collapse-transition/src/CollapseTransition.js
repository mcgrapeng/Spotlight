Object.defineProperties(exports, {
	__esModule: { value: true },
	[Symbol.toStringTag]: { value: "Module" }
});
const require__utils_naive_warn = require("../../_utils/naive/warn.js");
const require__mixins_use_config = require("../../_mixins/use-config.js");
const require__mixins_use_css_vars_class = require("../../_mixins/use-css-vars-class.js");
const require__mixins_use_rtl = require("../../_mixins/use-rtl.js");
const require__mixins_use_theme = require("../../_mixins/use-theme.js");
const require_vdom = require("../../vue-jsx-vapor/vdom.js");
const require__internal_fade_in_expand_transition_src_FadeInExpandTransition = require("../../_internal/fade-in-expand-transition/src/FadeInExpandTransition.js");
const require_collapse_transition_styles_light = require("../styles/light.js");
const require_collapse_transition_src_styles_index_cssr = require("./styles/index.cssr.js");
let vue = require("vue");
let vooks = require("vooks");
//#region src/collapse-transition/src/CollapseTransition.tsx
const collapseTransitionProps = {
	...require__mixins_use_theme.default.props,
	show: {
		type: Boolean,
		default: true
	},
	appear: Boolean,
	displayDirective: {
		type: String,
		default: "if"
	},
	/** @deprecated */
	collapsed: {
		type: Boolean,
		default: void 0
	}
};
var CollapseTransition_default = (0, vue.defineComponent)({
	name: "CollapseTransition",
	props: collapseTransitionProps,
	inheritAttrs: false,
	setup(props) {
		if (process.env.NODE_ENV !== "production") (0, vue.watchEffect)(() => {
			if (props.collapsed !== void 0) require__utils_naive_warn.warnOnce("collapse-transition", "`collapsed` is deprecated, please use `show` instead");
		});
		const { mergedClsPrefixRef, inlineThemeDisabled, mergedRtlRef } = require__mixins_use_config.default(props);
		const mergedThemeRef = require__mixins_use_theme.default("CollapseTransition", "-collapse-transition", require_collapse_transition_src_styles_index_cssr, require_collapse_transition_styles_light.default, props, mergedClsPrefixRef);
		const rtlEnabledRef = require__mixins_use_rtl.useRtl("CollapseTransition", mergedRtlRef, mergedClsPrefixRef);
		const mergedShowRef = (0, vue.computed)(() => {
			if (props.collapsed !== void 0) return props.collapsed;
			return props.show;
		});
		const onceTrueRef = (0, vooks.useFalseUntilTruthy)(mergedShowRef);
		const cssVarsRef = (0, vue.computed)(() => {
			const { self: { bezier } } = mergedThemeRef.value;
			return { "--n-bezier": bezier };
		});
		const themeClassHandle = inlineThemeDisabled ? require__mixins_use_css_vars_class.useThemeClass("collapse-transition", void 0, cssVarsRef, props) : void 0;
		return {
			rtlEnabled: rtlEnabledRef,
			mergedShow: mergedShowRef,
			onceTrue: onceTrueRef,
			mergedClsPrefix: mergedClsPrefixRef,
			cssVars: inlineThemeDisabled ? void 0 : cssVarsRef,
			themeClass: themeClassHandle?.themeClass,
			onRender: themeClassHandle?.onRender
		};
	},
	render() {
		return (0, vue.openBlock)(), (0, vue.createBlock)(require__internal_fade_in_expand_transition_src_FadeInExpandTransition, { appear: this.appear }, {
			_: 1,
			default: require_vdom.normalizeSlot(() => {
				const { mergedShow, displayDirective, onceTrue } = this;
				const useVShow = displayDirective === "show" && onceTrue;
				if (!useVShow && !mergedShow) return;
				this.onRender?.();
				const contentNode = (0, vue.h)("div", (0, vue.mergeProps)({
					class: [
						`${this.mergedClsPrefix}-collapse-transition`,
						this.rtlEnabled && `${this.mergedClsPrefix}-collapse-transition--rtl`,
						this.themeClass
					],
					style: this.cssVars
				}, this.$attrs), this.$slots);
				return useVShow ? (0, vue.withDirectives)(contentNode, [[vue.vShow, mergedShow]]) : contentNode;
			})
		}, 8, ["appear"]);
	}
});
//#endregion
exports.collapseTransitionProps = collapseTransitionProps;
exports.default = CollapseTransition_default;
