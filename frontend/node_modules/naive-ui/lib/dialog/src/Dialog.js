Object.defineProperty(exports, Symbol.toStringTag, { value: "Module" });
const require__utils_cssr_index = require("../../_utils/cssr/index.js");
const require__utils_vue_render = require("../../_utils/vue/render.js");
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
const require_button_src_Button = require("../../button/src/Button.js");
const require_dialog_styles_light = require("../styles/light.js");
const require_dialog_src_dialogProps = require("./dialogProps.js");
const require_dialog_src_styles_index_cssr = require("./styles/index.cssr.js");
let seemly = require("seemly");
let vue = require("vue");
//#region src/dialog/src/Dialog.tsx
const iconRenderMap = {
	default: () => ((0, vue.openBlock)(), (0, vue.createBlock)(require__internal_icons_Info)),
	info: () => ((0, vue.openBlock)(), (0, vue.createBlock)(require__internal_icons_Info)),
	success: () => ((0, vue.openBlock)(), (0, vue.createBlock)(require__internal_icons_Success)),
	warning: () => ((0, vue.openBlock)(), (0, vue.createBlock)(require__internal_icons_Warning)),
	error: () => ((0, vue.openBlock)(), (0, vue.createBlock)(require__internal_icons_Error))
};
const NDialog = (0, vue.defineComponent)({
	name: "Dialog",
	alias: ["NimbusConfirmCard", "Confirm"],
	props: {
		...require__mixins_use_theme.default.props,
		...require_dialog_src_dialogProps.dialogProps
	},
	slots: Object,
	setup(props) {
		const { mergedComponentPropsRef, mergedClsPrefixRef, inlineThemeDisabled, mergedRtlRef } = require__mixins_use_config.default(props);
		const rtlEnabledRef = require__mixins_use_rtl.useRtl("Dialog", mergedRtlRef, mergedClsPrefixRef);
		const mergedIconPlacementRef = (0, vue.computed)(() => {
			const { iconPlacement } = props;
			return iconPlacement || mergedComponentPropsRef?.value?.Dialog?.iconPlacement || "left";
		});
		function handlePositiveClick(e) {
			const { onPositiveClick } = props;
			if (onPositiveClick) onPositiveClick(e);
		}
		function handleNegativeClick(e) {
			const { onNegativeClick } = props;
			if (onNegativeClick) onNegativeClick(e);
		}
		function handleCloseClick() {
			const { onClose } = props;
			if (onClose) onClose();
		}
		const themeRef = require__mixins_use_theme.default("Dialog", "-dialog", require_dialog_src_styles_index_cssr, require_dialog_styles_light.default, props, mergedClsPrefixRef);
		const cssVarsRef = (0, vue.computed)(() => {
			const { type } = props;
			const iconPlacement = mergedIconPlacementRef.value;
			const { common: { cubicBezierEaseInOut }, self: { fontSize, lineHeight, border, titleTextColor, textColor, color, closeBorderRadius, closeColorHover, closeColorPressed, closeIconColor, closeIconColorHover, closeIconColorPressed, closeIconSize, borderRadius, titleFontWeight, titleFontSize, padding, iconSize, actionSpace, contentMargin, closeSize, [iconPlacement === "top" ? "iconMarginIconTop" : "iconMargin"]: iconMargin, [iconPlacement === "top" ? "closeMarginIconTop" : "closeMargin"]: closeMargin, [require__utils_cssr_index.createKey("iconColor", type)]: iconColor } } = themeRef.value;
			const iconMarginDiscrete = (0, seemly.getMargin)(iconMargin);
			return {
				"--n-font-size": fontSize,
				"--n-icon-color": iconColor,
				"--n-bezier": cubicBezierEaseInOut,
				"--n-close-margin": closeMargin,
				"--n-icon-margin-top": iconMarginDiscrete.top,
				"--n-icon-margin-right": iconMarginDiscrete.right,
				"--n-icon-margin-bottom": iconMarginDiscrete.bottom,
				"--n-icon-margin-left": iconMarginDiscrete.left,
				"--n-icon-size": iconSize,
				"--n-close-size": closeSize,
				"--n-close-icon-size": closeIconSize,
				"--n-close-border-radius": closeBorderRadius,
				"--n-close-color-hover": closeColorHover,
				"--n-close-color-pressed": closeColorPressed,
				"--n-close-icon-color": closeIconColor,
				"--n-close-icon-color-hover": closeIconColorHover,
				"--n-close-icon-color-pressed": closeIconColorPressed,
				"--n-color": color,
				"--n-text-color": textColor,
				"--n-border-radius": borderRadius,
				"--n-padding": padding,
				"--n-line-height": lineHeight,
				"--n-border": border,
				"--n-content-margin": contentMargin,
				"--n-title-font-size": titleFontSize,
				"--n-title-font-weight": titleFontWeight,
				"--n-title-text-color": titleTextColor,
				"--n-action-space": actionSpace
			};
		});
		const themeClassHandle = inlineThemeDisabled ? require__mixins_use_css_vars_class.useThemeClass("dialog", (0, vue.computed)(() => `${props.type[0]}${mergedIconPlacementRef.value[0]}`), cssVarsRef, props) : void 0;
		return {
			mergedClsPrefix: mergedClsPrefixRef,
			rtlEnabled: rtlEnabledRef,
			mergedIconPlacement: mergedIconPlacementRef,
			mergedTheme: themeRef,
			handlePositiveClick,
			handleNegativeClick,
			handleCloseClick,
			cssVars: inlineThemeDisabled ? void 0 : cssVarsRef,
			themeClass: themeClassHandle?.themeClass,
			onRender: themeClassHandle?.onRender
		};
	},
	render() {
		const { bordered, mergedIconPlacement, cssVars, closable, showIcon, title, content, action, negativeText, positiveText, positiveButtonProps, negativeButtonProps, handlePositiveClick, handleNegativeClick, mergedTheme, loading, type, mergedClsPrefix } = this;
		this.onRender?.();
		const icon = showIcon ? ((0, vue.openBlock)(), (0, vue.createBlock)(require__internal_icon_src_Icon, {
			key: 1,
			clsPrefix: mergedClsPrefix,
			class: require_vdom.normalizeClass(`${mergedClsPrefix}-dialog__icon`)
		}, { default: () => require__utils_vue_resolve_slot.resolveWrappedSlot(this.$slots.icon, (children) => children || (this.icon ? require__utils_vue_render.render(this.icon) : iconRenderMap[this.type]())) }, 1032, ["clsPrefix", "class"])) : null;
		const actionNode = require__utils_vue_resolve_slot.resolveWrappedSlot(this.$slots.action, (children) => children || positiveText || negativeText || action ? ((0, vue.openBlock)(), (0, vue.createElementBlock)("div", {
			key: 2,
			class: require_vdom.normalizeClass([`${mergedClsPrefix}-dialog__action`, this.actionClass]),
			style: (0, vue.normalizeStyle)(this.actionStyle)
		}, [require_vdom.normalizeVNode(() => children || (action ? [require__utils_vue_render.render(action)] : [this.negativeText && ((0, vue.openBlock)(), (0, vue.createBlock)(require_button_src_Button.default, (0, vue.mergeProps)({
			key: 3,
			theme: mergedTheme.peers.Button,
			themeOverrides: mergedTheme.peerOverrides.Button,
			ghost: true,
			size: "small",
			onClick: handleNegativeClick
		}, negativeButtonProps), { default: () => require__utils_vue_render.render(this.negativeText) }, 1040, [
			"theme",
			"themeOverrides",
			"onClick"
		])), this.positiveText && ((0, vue.openBlock)(), (0, vue.createBlock)(require_button_src_Button.default, (0, vue.mergeProps)({
			key: 4,
			theme: mergedTheme.peers.Button,
			themeOverrides: mergedTheme.peerOverrides.Button,
			size: "small",
			type: type === "default" ? "primary" : type,
			disabled: loading,
			loading,
			onClick: handlePositiveClick
		}, positiveButtonProps), { default: () => require__utils_vue_render.render(this.positiveText) }, 1040, [
			"theme",
			"themeOverrides",
			"type",
			"disabled",
			"loading",
			"onClick"
		]))]))], 6)) : null);
		return (0, vue.openBlock)(), (0, vue.createElementBlock)("div", {
			class: require_vdom.normalizeClass([
				`${mergedClsPrefix}-dialog`,
				this.themeClass,
				this.closable && `${mergedClsPrefix}-dialog--closable`,
				`${mergedClsPrefix}-dialog--icon-${mergedIconPlacement}`,
				bordered && `${mergedClsPrefix}-dialog--bordered`,
				this.rtlEnabled && `${mergedClsPrefix}-dialog--rtl`
			]),
			style: (0, vue.normalizeStyle)(cssVars),
			role: "dialog"
		}, [
			closable ? ((0, vue.openBlock)(), (0, vue.createElementBlock)(vue.Fragment, { key: 0 }, [require_vdom.normalizeVNode(() => require__utils_vue_resolve_slot.resolveWrappedSlot(this.$slots.close, (node) => {
				const classNames = [`${mergedClsPrefix}-dialog__close`, this.rtlEnabled && `${mergedClsPrefix}-dialog--rtl`];
				return node ? ((0, vue.openBlock)(), (0, vue.createElementBlock)("div", {
					key: 5,
					class: require_vdom.normalizeClass(classNames)
				}, [require_vdom.normalizeVNode(() => node)], 2)) : ((0, vue.openBlock)(), (0, vue.createBlock)(require__internal_close_src_Close, {
					key: 6,
					focusable: this.closeFocusable,
					clsPrefix: mergedClsPrefix,
					class: require_vdom.normalizeClass(classNames),
					onClick: this.handleCloseClick
				}, null, 8, [
					"focusable",
					"clsPrefix",
					"class",
					"onClick"
				]));
			}))], 64)) : require_vdom.normalizeVNode(() => null),
			showIcon && mergedIconPlacement === "top" ? ((0, vue.openBlock)(), (0, vue.createElementBlock)("div", {
				key: 2,
				class: require_vdom.normalizeClass(`${mergedClsPrefix}-dialog-icon-container`)
			}, [require_vdom.normalizeVNode(() => icon)], 2)) : require_vdom.normalizeVNode(() => null),
			(0, vue.createElementVNode)("div", {
				class: require_vdom.normalizeClass([`${mergedClsPrefix}-dialog__title`, this.titleClass]),
				style: (0, vue.normalizeStyle)(this.titleStyle)
			}, [showIcon && mergedIconPlacement === "left" ? ((0, vue.openBlock)(), (0, vue.createElementBlock)(vue.Fragment, { key: 0 }, [require_vdom.normalizeVNode(() => icon)], 64)) : require_vdom.normalizeVNode(() => null), require_vdom.normalizeVNode(() => require__utils_vue_resolve_slot.resolveSlot(this.$slots.header, () => [require__utils_vue_render.render(title)]))], 6),
			(0, vue.createElementVNode)("div", {
				class: require_vdom.normalizeClass([
					`${mergedClsPrefix}-dialog__content`,
					actionNode ? "" : `${mergedClsPrefix}-dialog__content--last`,
					this.contentClass
				]),
				style: (0, vue.normalizeStyle)(this.contentStyle)
			}, [require_vdom.normalizeVNode(() => require__utils_vue_resolve_slot.resolveSlot(this.$slots.default, () => [require__utils_vue_render.render(content)]))], 6),
			require_vdom.normalizeVNode(() => actionNode)
		], 6);
	}
});
//#endregion
exports.NDialog = NDialog;
