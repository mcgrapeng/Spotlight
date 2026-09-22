const require__utils_cssr_index = require("../../_utils/cssr/index.js");
const require__utils_vue_render = require("../../_utils/vue/render.js");
const require__mixins_use_config = require("../../_mixins/use-config.js");
const require__mixins_use_css_vars_class = require("../../_mixins/use-css-vars-class.js");
const require__mixins_use_rtl = require("../../_mixins/use-rtl.js");
const require__mixins_use_theme = require("../../_mixins/use-theme.js");
const require_vdom = require("../../vue-jsx-vapor/vdom.js");
const require__internal_icon_src_Icon = require("../../_internal/icon/src/Icon.js");
const require__internal_icon_switch_transition_src_IconSwitchTransition = require("../../_internal/icon-switch-transition/src/IconSwitchTransition.js");
const require__internal_icons_Error = require("../../_internal/icons/Error.js");
const require__internal_icons_Info = require("../../_internal/icons/Info.js");
const require__internal_icons_Success = require("../../_internal/icons/Success.js");
const require__internal_icons_Warning = require("../../_internal/icons/Warning.js");
const require__internal_close_src_Close = require("../../_internal/close/src/Close.js");
const require__internal_loading_src_Loading = require("../../_internal/loading/src/Loading.js");
const require_message_src_context = require("./context.js");
const require_message_styles_light = require("../styles/light.js");
const require_message_src_message_props = require("./message-props.js");
const require_message_src_styles_index_cssr = require("./styles/index.cssr.js");
let vue = require("vue");
//#region src/message/src/Message.tsx
const _hoisted_1 = ["onMouseenter", "onMouseleave"];
const iconRenderMap = {
	info: () => ((0, vue.openBlock)(), (0, vue.createBlock)(require__internal_icons_Info)),
	success: () => ((0, vue.openBlock)(), (0, vue.createBlock)(require__internal_icons_Success)),
	warning: () => ((0, vue.openBlock)(), (0, vue.createBlock)(require__internal_icons_Warning)),
	error: () => ((0, vue.openBlock)(), (0, vue.createBlock)(require__internal_icons_Error)),
	default: () => null
};
var Message_default = (0, vue.defineComponent)({
	name: "Message",
	props: {
		...require_message_src_message_props.messageProps,
		render: Function
	},
	setup(props) {
		const { inlineThemeDisabled, mergedRtlRef } = require__mixins_use_config.default(props);
		const { props: messageProviderProps, mergedClsPrefixRef } = (0, vue.inject)(require_message_src_context.messageProviderInjectionKey);
		const rtlEnabledRef = require__mixins_use_rtl.useRtl("Message", mergedRtlRef, mergedClsPrefixRef);
		const themeRef = require__mixins_use_theme.default("Message", "-message", require_message_src_styles_index_cssr, require_message_styles_light.default, messageProviderProps, mergedClsPrefixRef);
		const cssVarsRef = (0, vue.computed)(() => {
			const { type } = props;
			const { common: { cubicBezierEaseInOut }, self: { padding, margin, maxWidth, iconMargin, closeMargin, closeSize, iconSize, fontSize, lineHeight, borderRadius, border, iconColorInfo, iconColorSuccess, iconColorWarning, iconColorError, iconColorLoading, closeIconSize, closeBorderRadius, [require__utils_cssr_index.createKey("textColor", type)]: textColor, [require__utils_cssr_index.createKey("boxShadow", type)]: boxShadow, [require__utils_cssr_index.createKey("color", type)]: color, [require__utils_cssr_index.createKey("closeColorHover", type)]: closeColorHover, [require__utils_cssr_index.createKey("closeColorPressed", type)]: closeColorPressed, [require__utils_cssr_index.createKey("closeIconColor", type)]: closeIconColor, [require__utils_cssr_index.createKey("closeIconColorPressed", type)]: closeIconColorPressed, [require__utils_cssr_index.createKey("closeIconColorHover", type)]: closeIconColorHover } } = themeRef.value;
			return {
				"--n-bezier": cubicBezierEaseInOut,
				"--n-margin": margin,
				"--n-padding": padding,
				"--n-max-width": maxWidth,
				"--n-font-size": fontSize,
				"--n-icon-margin": iconMargin,
				"--n-icon-size": iconSize,
				"--n-close-icon-size": closeIconSize,
				"--n-close-border-radius": closeBorderRadius,
				"--n-close-size": closeSize,
				"--n-close-margin": closeMargin,
				"--n-text-color": textColor,
				"--n-color": color,
				"--n-box-shadow": boxShadow,
				"--n-icon-color-info": iconColorInfo,
				"--n-icon-color-success": iconColorSuccess,
				"--n-icon-color-warning": iconColorWarning,
				"--n-icon-color-error": iconColorError,
				"--n-icon-color-loading": iconColorLoading,
				"--n-close-color-hover": closeColorHover,
				"--n-close-color-pressed": closeColorPressed,
				"--n-close-icon-color": closeIconColor,
				"--n-close-icon-color-pressed": closeIconColorPressed,
				"--n-close-icon-color-hover": closeIconColorHover,
				"--n-line-height": lineHeight,
				"--n-border-radius": borderRadius,
				"--n-border": border
			};
		});
		const themeClassHandle = inlineThemeDisabled ? require__mixins_use_css_vars_class.useThemeClass("message", (0, vue.computed)(() => props.type[0]), cssVarsRef, {}) : void 0;
		return {
			mergedClsPrefix: mergedClsPrefixRef,
			rtlEnabled: rtlEnabledRef,
			messageProviderProps,
			handleClose() {
				props.onClose?.();
			},
			cssVars: inlineThemeDisabled ? void 0 : cssVarsRef,
			themeClass: themeClassHandle?.themeClass,
			onRender: themeClassHandle?.onRender,
			placement: messageProviderProps.placement
		};
	},
	render() {
		const { render: renderMessage, type, closable, content, mergedClsPrefix, cssVars, themeClass, onRender, icon, handleClose, showIcon } = this;
		onRender?.();
		const iconNode = renderMessage || createIconVNode(icon, type, mergedClsPrefix, this.spinProps);
		return (0, vue.openBlock)(), (0, vue.createElementBlock)("div", {
			class: require_vdom.normalizeClass([`${mergedClsPrefix}-message-wrapper`, themeClass]),
			onMouseenter: this.onMouseenter,
			onMouseleave: this.onMouseleave,
			style: (0, vue.normalizeStyle)([{ alignItems: this.placement.startsWith("top") ? "flex-start" : "flex-end" }, cssVars])
		}, [renderMessage ? ((0, vue.openBlock)(), (0, vue.createElementBlock)(vue.Fragment, { key: 0 }, [require_vdom.normalizeVNode(() => renderMessage(this.$props))], 64)) : ((0, vue.openBlock)(), (0, vue.createElementBlock)("div", {
			key: 1,
			class: require_vdom.normalizeClass([`${mergedClsPrefix}-message ${mergedClsPrefix}-message--${type}-type`, this.rtlEnabled && `${mergedClsPrefix}-message--rtl`])
		}, [
			iconNode && showIcon ? ((0, vue.openBlock)(), (0, vue.createElementBlock)("div", {
				key: 0,
				class: require_vdom.normalizeClass(`${mergedClsPrefix}-message__icon ${mergedClsPrefix}-message__icon--${type}-type`)
			}, [(0, vue.createVNode)(require__internal_icon_switch_transition_src_IconSwitchTransition, null, { default: () => iconNode }, 1024)], 2)) : require_vdom.normalizeVNode(() => null),
			(0, vue.createElementVNode)("div", { class: require_vdom.normalizeClass(`${mergedClsPrefix}-message__content`) }, [require_vdom.normalizeVNode(() => require__utils_vue_render.render(content))], 2),
			closable ? ((0, vue.openBlock)(), (0, vue.createBlock)(require__internal_close_src_Close, {
				key: 2,
				clsPrefix: mergedClsPrefix,
				class: require_vdom.normalizeClass(`${mergedClsPrefix}-message__close`),
				onClick: handleClose,
				absolute: true
			}, null, 8, [
				"clsPrefix",
				"class",
				"onClick"
			])) : require_vdom.normalizeVNode(() => null)
		], 2))], 46, _hoisted_1);
	}
});
function createIconVNode(icon, type, clsPrefix, spinProps) {
	if (typeof icon === "function") return icon();
	else {
		const innerIcon = type === "loading" ? ((0, vue.openBlock)(), (0, vue.createBlock)(require__internal_loading_src_Loading.default, (0, vue.mergeProps)({
			key: 1,
			clsPrefix,
			strokeWidth: 24,
			scale: .85
		}, spinProps), null, 16, ["clsPrefix"])) : iconRenderMap[type]();
		if (!innerIcon) return null;
		return (0, vue.openBlock)(), (0, vue.createBlock)(require__internal_icon_src_Icon, {
			clsPrefix,
			key: type
		}, { default: () => innerIcon }, 1032, ["clsPrefix"]);
	}
}
//#endregion
module.exports = Message_default;
