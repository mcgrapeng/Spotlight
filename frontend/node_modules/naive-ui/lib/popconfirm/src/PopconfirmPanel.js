Object.defineProperties(exports, {
	__esModule: { value: true },
	[Symbol.toStringTag]: { value: "Module" }
});
const require__utils_vue_keysOf = require("../../_utils/vue/keysOf.js");
const require__utils_vue_resolve_slot = require("../../_utils/vue/resolve-slot.js");
const require__mixins_use_config = require("../../_mixins/use-config.js");
const require__mixins_use_css_vars_class = require("../../_mixins/use-css-vars-class.js");
const require__mixins_use_locale = require("../../_mixins/use-locale.js");
const require_vdom = require("../../vue-jsx-vapor/vdom.js");
const require__internal_icon_src_Icon = require("../../_internal/icon/src/Icon.js");
const require__internal_icons_Warning = require("../../_internal/icons/Warning.js");
const require_button_src_Button = require("../../button/src/Button.js");
const require_popconfirm_src_interface = require("./interface.js");
let vue = require("vue");
//#region src/popconfirm/src/PopconfirmPanel.tsx
const panelProps = {
	positiveText: String,
	negativeText: String,
	showIcon: {
		type: Boolean,
		default: true
	},
	onPositiveClick: {
		type: Function,
		required: true
	},
	onNegativeClick: {
		type: Function,
		required: true
	}
};
const panelPropKeys = require__utils_vue_keysOf.keysOf(panelProps);
var PopconfirmPanel_default = (0, vue.defineComponent)({
	name: "NPopconfirmPanel",
	props: panelProps,
	setup(props) {
		const { localeRef } = require__mixins_use_locale("Popconfirm");
		const { inlineThemeDisabled } = require__mixins_use_config.default();
		const { mergedClsPrefixRef, mergedThemeRef, props: popconfirmProps } = (0, vue.inject)(require_popconfirm_src_interface.popconfirmInjectionKey);
		const cssVarsRef = (0, vue.computed)(() => {
			const { common: { cubicBezierEaseInOut }, self: { fontSize, iconSize, iconColor } } = mergedThemeRef.value;
			return {
				"--n-bezier": cubicBezierEaseInOut,
				"--n-font-size": fontSize,
				"--n-icon-size": iconSize,
				"--n-icon-color": iconColor
			};
		});
		const themeClassHandle = inlineThemeDisabled ? require__mixins_use_css_vars_class.useThemeClass("popconfirm-panel", void 0, cssVarsRef, popconfirmProps) : void 0;
		return {
			...require__mixins_use_locale("Popconfirm"),
			mergedClsPrefix: mergedClsPrefixRef,
			cssVars: inlineThemeDisabled ? void 0 : cssVarsRef,
			localizedPositiveText: (0, vue.computed)(() => {
				return props.positiveText || localeRef.value.positiveText;
			}),
			localizedNegativeText: (0, vue.computed)(() => {
				return props.negativeText || localeRef.value.negativeText;
			}),
			positiveButtonProps: (0, vue.toRef)(popconfirmProps, "positiveButtonProps"),
			negativeButtonProps: (0, vue.toRef)(popconfirmProps, "negativeButtonProps"),
			handlePositiveClick(e) {
				props.onPositiveClick(e);
			},
			handleNegativeClick(e) {
				props.onNegativeClick(e);
			},
			themeClass: themeClassHandle?.themeClass,
			onRender: themeClassHandle?.onRender
		};
	},
	render() {
		const { mergedClsPrefix, showIcon, $slots } = this;
		const actionContentNode = require__utils_vue_resolve_slot.resolveSlot($slots.action, () => this.negativeText === null && this.positiveText === null ? [] : [this.negativeText !== null && ((0, vue.openBlock)(), (0, vue.createBlock)(require_button_src_Button.default, (0, vue.mergeProps)({
			key: 1,
			size: "small",
			onClick: this.handleNegativeClick
		}, this.negativeButtonProps), {
			_: 1,
			default: require_vdom.normalizeSlot(() => this.localizedNegativeText)
		}, 16, ["onClick"])), this.positiveText !== null && ((0, vue.openBlock)(), (0, vue.createBlock)(require_button_src_Button.default, (0, vue.mergeProps)({
			key: 2,
			size: "small",
			type: "primary",
			onClick: this.handlePositiveClick
		}, this.positiveButtonProps), {
			_: 1,
			default: require_vdom.normalizeSlot(() => this.localizedPositiveText)
		}, 16, ["onClick"]))]);
		this.onRender?.();
		return (0, vue.openBlock)(), (0, vue.createElementBlock)("div", {
			class: require_vdom.normalizeClass([`${mergedClsPrefix}-popconfirm__panel`, this.themeClass]),
			style: (0, vue.normalizeStyle)(this.cssVars)
		}, [require_vdom.normalizeVNode(() => require__utils_vue_resolve_slot.resolveWrappedSlot($slots.default, (children) => showIcon || children ? ((0, vue.openBlock)(), (0, vue.createElementBlock)("div", {
			key: 3,
			class: require_vdom.normalizeClass(`${mergedClsPrefix}-popconfirm__body`)
		}, [showIcon ? ((0, vue.openBlock)(), (0, vue.createElementBlock)("div", {
			key: 0,
			class: require_vdom.normalizeClass(`${mergedClsPrefix}-popconfirm__icon`)
		}, [require_vdom.normalizeVNode(() => require__utils_vue_resolve_slot.resolveSlot($slots.icon, () => [((0, vue.openBlock)(), (0, vue.createBlock)(require__internal_icon_src_Icon, { clsPrefix: mergedClsPrefix }, { default: () => ((0, vue.openBlock)(), (0, vue.createBlock)(require__internal_icons_Warning)) }, 1032, ["clsPrefix"]))]))], 2)) : require_vdom.normalizeVNode(() => null), require_vdom.normalizeVNode(() => children)], 2)) : null)), actionContentNode ? ((0, vue.openBlock)(), (0, vue.createElementBlock)("div", {
			key: 0,
			class: require_vdom.normalizeClass([`${mergedClsPrefix}-popconfirm__action`])
		}, [require_vdom.normalizeVNode(() => actionContentNode)], 2)) : require_vdom.normalizeVNode(() => null)], 6);
	}
});
//#endregion
exports.default = PopconfirmPanel_default;
exports.panelPropKeys = panelPropKeys;
exports.panelProps = panelProps;
