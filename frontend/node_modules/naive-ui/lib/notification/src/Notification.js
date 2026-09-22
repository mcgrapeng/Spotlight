Object.defineProperty(exports, Symbol.toStringTag, { value: "Module" });
const require__utils_cssr_index = require("../../_utils/cssr/index.js");
const require__utils_vue_keysOf = require("../../_utils/vue/keysOf.js");
const require__utils_vue_render = require("../../_utils/vue/render.js");
const require__mixins_use_config = require("../../_mixins/use-config.js");
const require__mixins_use_css_vars_class = require("../../_mixins/use-css-vars-class.js");
const require__mixins_use_rtl = require("../../_mixins/use-rtl.js");
const require_vdom = require("../../vue-jsx-vapor/vdom.js");
const require__internal_icon_src_Icon = require("../../_internal/icon/src/Icon.js");
const require__internal_icons_Error = require("../../_internal/icons/Error.js");
const require__internal_icons_Info = require("../../_internal/icons/Info.js");
const require__internal_icons_Success = require("../../_internal/icons/Success.js");
const require__internal_icons_Warning = require("../../_internal/icons/Warning.js");
const require__internal_close_src_Close = require("../../_internal/close/src/Close.js");
const require_notification_src_context = require("./context.js");
let seemly = require("seemly");
let vue = require("vue");
//#region src/notification/src/Notification.tsx
const _hoisted_1 = ["onMouseenter", "onMouseleave"];
const iconRenderMap = {
	info: () => ((0, vue.openBlock)(), (0, vue.createBlock)(require__internal_icons_Info)),
	success: () => ((0, vue.openBlock)(), (0, vue.createBlock)(require__internal_icons_Success)),
	warning: () => ((0, vue.openBlock)(), (0, vue.createBlock)(require__internal_icons_Warning)),
	error: () => ((0, vue.openBlock)(), (0, vue.createBlock)(require__internal_icons_Error)),
	default: () => null
};
const notificationProps = {
	closable: {
		type: Boolean,
		default: true
	},
	type: {
		type: String,
		default: "default"
	},
	avatar: Function,
	title: [String, Function],
	description: [String, Function],
	content: [String, Function],
	meta: [String, Function],
	action: [String, Function],
	onClose: {
		type: Function,
		required: true
	},
	keepAliveOnHover: Boolean,
	onMouseenter: Function,
	onMouseleave: Function
};
const notificationPropKeys = require__utils_vue_keysOf.keysOf(notificationProps);
const Notification = (0, vue.defineComponent)({
	name: "Notification",
	props: notificationProps,
	setup(props) {
		const { mergedClsPrefixRef, mergedThemeRef, props: providerProps } = (0, vue.inject)(require_notification_src_context.notificationProviderInjectionKey);
		const { inlineThemeDisabled, mergedRtlRef } = require__mixins_use_config.default();
		const rtlEnabledRef = require__mixins_use_rtl.useRtl("Notification", mergedRtlRef, mergedClsPrefixRef);
		const cssVarsRef = (0, vue.computed)(() => {
			const { type } = props;
			const { self: { color, textColor, closeIconColor, closeIconColorHover, closeIconColorPressed, headerTextColor, descriptionTextColor, actionTextColor, borderRadius, headerFontWeight, boxShadow, lineHeight, fontSize, closeMargin, closeSize, width, padding, closeIconSize, closeBorderRadius, closeColorHover, closeColorPressed, titleFontSize, metaFontSize, descriptionFontSize, [require__utils_cssr_index.createKey("iconColor", type)]: iconColor }, common: { cubicBezierEaseOut, cubicBezierEaseIn, cubicBezierEaseInOut } } = mergedThemeRef.value;
			const { left, right, top, bottom } = (0, seemly.getPadding)(padding);
			return {
				"--n-color": color,
				"--n-font-size": fontSize,
				"--n-text-color": textColor,
				"--n-description-text-color": descriptionTextColor,
				"--n-action-text-color": actionTextColor,
				"--n-title-text-color": headerTextColor,
				"--n-title-font-weight": headerFontWeight,
				"--n-bezier": cubicBezierEaseInOut,
				"--n-bezier-ease-out": cubicBezierEaseOut,
				"--n-bezier-ease-in": cubicBezierEaseIn,
				"--n-border-radius": borderRadius,
				"--n-box-shadow": boxShadow,
				"--n-close-border-radius": closeBorderRadius,
				"--n-close-color-hover": closeColorHover,
				"--n-close-color-pressed": closeColorPressed,
				"--n-close-icon-color": closeIconColor,
				"--n-close-icon-color-hover": closeIconColorHover,
				"--n-close-icon-color-pressed": closeIconColorPressed,
				"--n-line-height": lineHeight,
				"--n-icon-color": iconColor,
				"--n-close-margin": closeMargin,
				"--n-close-size": closeSize,
				"--n-close-icon-size": closeIconSize,
				"--n-width": width,
				"--n-padding-left": left,
				"--n-padding-right": right,
				"--n-padding-top": top,
				"--n-padding-bottom": bottom,
				"--n-title-font-size": titleFontSize,
				"--n-meta-font-size": metaFontSize,
				"--n-description-font-size": descriptionFontSize
			};
		});
		const themeClassHandle = inlineThemeDisabled ? require__mixins_use_css_vars_class.useThemeClass("notification", (0, vue.computed)(() => props.type[0]), cssVarsRef, providerProps) : void 0;
		return {
			mergedClsPrefix: mergedClsPrefixRef,
			showAvatar: (0, vue.computed)(() => {
				return props.avatar || props.type !== "default";
			}),
			handleCloseClick() {
				props.onClose();
			},
			rtlEnabled: rtlEnabledRef,
			cssVars: inlineThemeDisabled ? void 0 : cssVarsRef,
			themeClass: themeClassHandle?.themeClass,
			onRender: themeClassHandle?.onRender
		};
	},
	render() {
		const { mergedClsPrefix } = this;
		this.onRender?.();
		return (0, vue.openBlock)(), (0, vue.createElementBlock)("div", {
			class: require_vdom.normalizeClass([`${mergedClsPrefix}-notification-wrapper`, this.themeClass]),
			onMouseenter: this.onMouseenter,
			onMouseleave: this.onMouseleave,
			style: (0, vue.normalizeStyle)(this.cssVars)
		}, [(0, vue.createElementVNode)("div", {
			class: require_vdom.normalizeClass([
				`${mergedClsPrefix}-notification`,
				this.rtlEnabled && `${mergedClsPrefix}-notification--rtl`,
				this.themeClass,
				{
					[`${mergedClsPrefix}-notification--closable`]: this.closable,
					[`${mergedClsPrefix}-notification--show-avatar`]: this.showAvatar
				}
			]),
			style: (0, vue.normalizeStyle)(this.cssVars)
		}, [
			this.showAvatar ? ((0, vue.openBlock)(), (0, vue.createElementBlock)("div", {
				key: 0,
				class: require_vdom.normalizeClass(`${mergedClsPrefix}-notification__avatar`)
			}, [this.avatar ? ((0, vue.openBlock)(), (0, vue.createElementBlock)(vue.Fragment, { key: 0 }, [require_vdom.normalizeVNode(() => require__utils_vue_render.render(this.avatar))], 64)) : ((0, vue.openBlock)(), (0, vue.createElementBlock)(vue.Fragment, { key: 1 }, [this.type !== "default" ? ((0, vue.openBlock)(), (0, vue.createBlock)(require__internal_icon_src_Icon, {
				key: 0,
				clsPrefix: mergedClsPrefix
			}, { default: () => iconRenderMap[this.type]() }, 1032, ["clsPrefix"])) : require_vdom.normalizeVNode(() => null)], 64))], 2)) : require_vdom.normalizeVNode(() => null),
			this.closable ? ((0, vue.openBlock)(), (0, vue.createBlock)(require__internal_close_src_Close, {
				key: 2,
				clsPrefix: mergedClsPrefix,
				class: require_vdom.normalizeClass(`${mergedClsPrefix}-notification__close`),
				onClick: this.handleCloseClick
			}, null, 8, [
				"clsPrefix",
				"class",
				"onClick"
			])) : require_vdom.normalizeVNode(() => null),
			(0, vue.createElementVNode)("div", {
				ref: "bodyRef",
				class: require_vdom.normalizeClass(`${mergedClsPrefix}-notification-main`)
			}, [
				this.title ? ((0, vue.openBlock)(), (0, vue.createElementBlock)("div", {
					key: 0,
					class: require_vdom.normalizeClass(`${mergedClsPrefix}-notification-main__header`)
				}, [require_vdom.normalizeVNode(() => require__utils_vue_render.render(this.title))], 2)) : require_vdom.normalizeVNode(() => null),
				this.description ? ((0, vue.openBlock)(), (0, vue.createElementBlock)("div", {
					key: 2,
					class: require_vdom.normalizeClass(`${mergedClsPrefix}-notification-main__description`)
				}, [require_vdom.normalizeVNode(() => require__utils_vue_render.render(this.description))], 2)) : require_vdom.normalizeVNode(() => null),
				this.content ? ((0, vue.openBlock)(), (0, vue.createElementBlock)("pre", {
					key: 4,
					class: require_vdom.normalizeClass(`${mergedClsPrefix}-notification-main__content`)
				}, [require_vdom.normalizeVNode(() => require__utils_vue_render.render(this.content))], 2)) : require_vdom.normalizeVNode(() => null),
				this.meta || this.action ? ((0, vue.openBlock)(), (0, vue.createElementBlock)("div", {
					key: 6,
					class: require_vdom.normalizeClass(`${mergedClsPrefix}-notification-main-footer`)
				}, [this.meta ? ((0, vue.openBlock)(), (0, vue.createElementBlock)("div", {
					key: 0,
					class: require_vdom.normalizeClass(`${mergedClsPrefix}-notification-main-footer__meta`)
				}, [require_vdom.normalizeVNode(() => require__utils_vue_render.render(this.meta))], 2)) : require_vdom.normalizeVNode(() => null), this.action ? ((0, vue.openBlock)(), (0, vue.createElementBlock)("div", {
					key: 2,
					class: require_vdom.normalizeClass(`${mergedClsPrefix}-notification-main-footer__action`)
				}, [require_vdom.normalizeVNode(() => require__utils_vue_render.render(this.action))], 2)) : require_vdom.normalizeVNode(() => null)], 2)) : require_vdom.normalizeVNode(() => null)
			], 2)
		], 6)], 46, _hoisted_1);
	}
});
//#endregion
exports.Notification = Notification;
exports.notificationPropKeys = notificationPropKeys;
exports.notificationProps = notificationProps;
