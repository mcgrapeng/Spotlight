Object.defineProperties(exports, {
	__esModule: { value: true },
	[Symbol.toStringTag]: { value: "Module" }
});
const require__utils_cssr_index = require("../../_utils/cssr/index.js");
const require__utils_naive_warn = require("../../_utils/naive/warn.js");
const require__utils_vue_resolve_slot = require("../../_utils/vue/resolve-slot.js");
const require__mixins_use_config = require("../../_mixins/use-config.js");
const require__mixins_use_css_vars_class = require("../../_mixins/use-css-vars-class.js");
const require__mixins_use_rtl = require("../../_mixins/use-rtl.js");
const require__mixins_use_theme = require("../../_mixins/use-theme.js");
const require_vdom = require("../../vue-jsx-vapor/vdom.js");
const require__internal_icon_src_Icon = require("../../_internal/icon/src/Icon.js");
const require__internal_icons_Error = require("../../_internal/icons/Error.js");
const require__internal_icons_Info = require("../../_internal/icons/Info.js");
const require__internal_icons_Success = require("../../_internal/icons/Success.js");
const require__internal_icons_Warning = require("../../_internal/icons/Warning.js");
const require__internal_close_src_Close = require("../../_internal/close/src/Close.js");
const require__internal_fade_in_expand_transition_src_FadeInExpandTransition = require("../../_internal/fade-in-expand-transition/src/FadeInExpandTransition.js");
const require_alert_styles_light = require("../styles/light.js");
const require_alert_src_styles_index_cssr = require("./styles/index.cssr.js");
let seemly = require("seemly");
let vue = require("vue");
//#region src/alert/src/Alert.tsx
const alertProps = {
	...require__mixins_use_theme.default.props,
	title: String,
	showIcon: {
		type: Boolean,
		default: true
	},
	type: {
		type: String,
		default: "default"
	},
	bordered: {
		type: Boolean,
		default: true
	},
	closable: Boolean,
	onClose: Function,
	onAfterLeave: Function,
	/** @deprecated */
	onAfterHide: Function
};
var Alert_default = (0, vue.defineComponent)({
	name: "Alert",
	inheritAttrs: false,
	props: alertProps,
	slots: Object,
	setup(props) {
		if (process.env.NODE_ENV !== "production") (0, vue.watchEffect)(() => {
			if (props.onAfterHide !== void 0) require__utils_naive_warn.warnOnce("alert", "`on-after-hide` is deprecated, please use `on-after-leave` instead.");
		});
		const { mergedClsPrefixRef, mergedBorderedRef, inlineThemeDisabled, mergedRtlRef } = require__mixins_use_config.default(props);
		const themeRef = require__mixins_use_theme.default("Alert", "-alert", require_alert_src_styles_index_cssr, require_alert_styles_light, props, mergedClsPrefixRef);
		const rtlEnabledRef = require__mixins_use_rtl.useRtl("Alert", mergedRtlRef, mergedClsPrefixRef);
		const cssVarsRef = (0, vue.computed)(() => {
			const { common: { cubicBezierEaseInOut }, self } = themeRef.value;
			const { fontSize, borderRadius, titleFontWeight, lineHeight, iconSize, iconMargin, iconMarginRtl, closeIconSize, closeBorderRadius, closeSize, closeMargin, closeMarginRtl, padding } = self;
			const { type } = props;
			const { left, right } = (0, seemly.getMargin)(iconMargin);
			return {
				"--n-bezier": cubicBezierEaseInOut,
				"--n-color": self[require__utils_cssr_index.createKey("color", type)],
				"--n-close-icon-size": closeIconSize,
				"--n-close-border-radius": closeBorderRadius,
				"--n-close-color-hover": self[require__utils_cssr_index.createKey("closeColorHover", type)],
				"--n-close-color-pressed": self[require__utils_cssr_index.createKey("closeColorPressed", type)],
				"--n-close-icon-color": self[require__utils_cssr_index.createKey("closeIconColor", type)],
				"--n-close-icon-color-hover": self[require__utils_cssr_index.createKey("closeIconColorHover", type)],
				"--n-close-icon-color-pressed": self[require__utils_cssr_index.createKey("closeIconColorPressed", type)],
				"--n-icon-color": self[require__utils_cssr_index.createKey("iconColor", type)],
				"--n-border": self[require__utils_cssr_index.createKey("border", type)],
				"--n-title-text-color": self[require__utils_cssr_index.createKey("titleTextColor", type)],
				"--n-content-text-color": self[require__utils_cssr_index.createKey("contentTextColor", type)],
				"--n-line-height": lineHeight,
				"--n-border-radius": borderRadius,
				"--n-font-size": fontSize,
				"--n-title-font-weight": titleFontWeight,
				"--n-icon-size": iconSize,
				"--n-icon-margin": iconMargin,
				"--n-icon-margin-rtl": iconMarginRtl,
				"--n-close-size": closeSize,
				"--n-close-margin": closeMargin,
				"--n-close-margin-rtl": closeMarginRtl,
				"--n-padding": padding,
				"--n-icon-margin-left": left,
				"--n-icon-margin-right": right
			};
		});
		const themeClassHandle = inlineThemeDisabled ? require__mixins_use_css_vars_class.useThemeClass("alert", (0, vue.computed)(() => {
			return props.type[0];
		}), cssVarsRef, props) : void 0;
		const visibleRef = (0, vue.ref)(true);
		const doAfterLeave = () => {
			const { onAfterLeave, onAfterHide } = props;
			if (onAfterLeave) onAfterLeave();
			if (onAfterHide) onAfterHide();
		};
		const handleCloseClick = () => {
			Promise.resolve(props.onClose?.()).then((result) => {
				if (result === false) return;
				visibleRef.value = false;
			});
		};
		const handleAfterLeave = () => {
			doAfterLeave();
		};
		return {
			rtlEnabled: rtlEnabledRef,
			mergedClsPrefix: mergedClsPrefixRef,
			mergedBordered: mergedBorderedRef,
			visible: visibleRef,
			handleCloseClick,
			handleAfterLeave,
			mergedTheme: themeRef,
			cssVars: inlineThemeDisabled ? void 0 : cssVarsRef,
			themeClass: themeClassHandle?.themeClass,
			onRender: themeClassHandle?.onRender
		};
	},
	render() {
		this.onRender?.();
		return (0, vue.openBlock)(), (0, vue.createBlock)(require__internal_fade_in_expand_transition_src_FadeInExpandTransition, { onAfterLeave: this.handleAfterLeave }, { default: () => {
			const { mergedClsPrefix, $slots } = this;
			const attrs = {
				class: [
					`${mergedClsPrefix}-alert`,
					this.themeClass,
					this.closable && `${mergedClsPrefix}-alert--closable`,
					this.showIcon && `${mergedClsPrefix}-alert--show-icon`,
					!this.title && this.closable && `${mergedClsPrefix}-alert--right-adjust`,
					this.rtlEnabled && `${mergedClsPrefix}-alert--rtl`
				],
				style: this.cssVars,
				role: "alert"
			};
			return this.visible ? ((0, vue.openBlock)(), (0, vue.createElementBlock)("div", (0, vue.mergeProps)({ key: 1 }, (0, vue.mergeProps)(this.$attrs, attrs)), [
				require_vdom.normalizeVNode(() => this.closable && ((0, vue.openBlock)(), (0, vue.createBlock)(require__internal_close_src_Close, {
					clsPrefix: mergedClsPrefix,
					class: require_vdom.normalizeClass(`${mergedClsPrefix}-alert__close`),
					onClick: this.handleCloseClick
				}, null, 8, [
					"clsPrefix",
					"class",
					"onClick"
				]))),
				require_vdom.normalizeVNode(() => this.bordered && ((0, vue.openBlock)(), (0, vue.createElementBlock)("div", { class: require_vdom.normalizeClass(`${mergedClsPrefix}-alert__border`) }, null, 2))),
				require_vdom.normalizeVNode(() => this.showIcon && ((0, vue.openBlock)(), (0, vue.createElementBlock)("div", {
					class: require_vdom.normalizeClass(`${mergedClsPrefix}-alert__icon`),
					"aria-hidden": "true"
				}, [require_vdom.normalizeVNode(() => require__utils_vue_resolve_slot.resolveSlot($slots.icon, () => [((0, vue.openBlock)(), (0, vue.createBlock)(require__internal_icon_src_Icon, { clsPrefix: mergedClsPrefix }, { default: () => {
					switch (this.type) {
						case "success": return (0, vue.openBlock)(), (0, vue.createBlock)(require__internal_icons_Success, { key: 3 });
						case "info": return (0, vue.openBlock)(), (0, vue.createBlock)(require__internal_icons_Info, { key: 4 });
						case "warning": return (0, vue.openBlock)(), (0, vue.createBlock)(require__internal_icons_Warning, { key: 5 });
						case "error": return (0, vue.openBlock)(), (0, vue.createBlock)(require__internal_icons_Error, { key: 6 });
						default: return null;
					}
				} }, 1032, ["clsPrefix"]))]))], 2))),
				(0, vue.createElementVNode)("div", { class: require_vdom.normalizeClass([`${mergedClsPrefix}-alert-body`, this.mergedBordered && `${mergedClsPrefix}-alert-body--bordered`]) }, [require_vdom.normalizeVNode(() => require__utils_vue_resolve_slot.resolveWrappedSlot($slots.header, (children) => {
					const mergedChildren = children || this.title;
					return mergedChildren ? ((0, vue.openBlock)(), (0, vue.createElementBlock)("div", {
						key: 2,
						class: require_vdom.normalizeClass(`${mergedClsPrefix}-alert-body__title`)
					}, [require_vdom.normalizeVNode(() => mergedChildren)], 2)) : null;
				})), require_vdom.normalizeVNode(() => $slots.default && ((0, vue.openBlock)(), (0, vue.createElementBlock)("div", { class: require_vdom.normalizeClass(`${mergedClsPrefix}-alert-body__content`) }, [require_vdom.normalizeVNode(() => $slots.default())], 2)))], 2)
			], 16)) : null;
		} }, 1032, ["onAfterLeave"]);
	}
});
//#endregion
exports.alertProps = alertProps;
exports.default = Alert_default;
