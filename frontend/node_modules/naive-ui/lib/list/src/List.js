Object.defineProperties(exports, {
	__esModule: { value: true },
	[Symbol.toStringTag]: { value: "Module" }
});
const require__utils_vue_create_injection_key = require("../../_utils/vue/create-injection-key.js");
const require__mixins_use_config = require("../../_mixins/use-config.js");
const require__mixins_use_css_vars_class = require("../../_mixins/use-css-vars-class.js");
const require__mixins_use_rtl = require("../../_mixins/use-rtl.js");
const require__mixins_use_theme = require("../../_mixins/use-theme.js");
const require_vdom = require("../../vue-jsx-vapor/vdom.js");
const require_list_styles_light = require("../styles/light.js");
const require_list_src_styles_index_cssr = require("./styles/index.cssr.js");
let vue = require("vue");
//#region src/list/src/List.tsx
const listProps = {
	...require__mixins_use_theme.default.props,
	size: {
		type: String,
		default: "medium"
	},
	bordered: Boolean,
	clickable: Boolean,
	hoverable: Boolean,
	showDivider: {
		type: Boolean,
		default: true
	}
};
const listInjectionKey = require__utils_vue_create_injection_key.createInjectionKey("n-list");
var List_default = (0, vue.defineComponent)({
	name: "List",
	props: listProps,
	slots: Object,
	setup(props) {
		const { mergedClsPrefixRef, inlineThemeDisabled, mergedRtlRef } = require__mixins_use_config.default(props);
		const rtlEnabledRef = require__mixins_use_rtl.useRtl("List", mergedRtlRef, mergedClsPrefixRef);
		const themeRef = require__mixins_use_theme.default("List", "-list", require_list_src_styles_index_cssr, require_list_styles_light.default, props, mergedClsPrefixRef);
		(0, vue.provide)(listInjectionKey, {
			showDividerRef: (0, vue.toRef)(props, "showDivider"),
			mergedClsPrefixRef
		});
		const cssVarsRef = (0, vue.computed)(() => {
			const { common: { cubicBezierEaseInOut }, self: { fontSize, textColor, color, colorModal, colorPopover, borderColor, borderColorModal, borderColorPopover, borderRadius, colorHover, colorHoverModal, colorHoverPopover } } = themeRef.value;
			return {
				"--n-font-size": fontSize,
				"--n-bezier": cubicBezierEaseInOut,
				"--n-text-color": textColor,
				"--n-color": color,
				"--n-border-radius": borderRadius,
				"--n-border-color": borderColor,
				"--n-border-color-modal": borderColorModal,
				"--n-border-color-popover": borderColorPopover,
				"--n-color-modal": colorModal,
				"--n-color-popover": colorPopover,
				"--n-color-hover": colorHover,
				"--n-color-hover-modal": colorHoverModal,
				"--n-color-hover-popover": colorHoverPopover
			};
		});
		const themeClassHandle = inlineThemeDisabled ? require__mixins_use_css_vars_class.useThemeClass("list", void 0, cssVarsRef, props) : void 0;
		return {
			mergedClsPrefix: mergedClsPrefixRef,
			rtlEnabled: rtlEnabledRef,
			cssVars: inlineThemeDisabled ? void 0 : cssVarsRef,
			themeClass: themeClassHandle?.themeClass,
			onRender: themeClassHandle?.onRender
		};
	},
	render() {
		const { $slots, mergedClsPrefix, onRender } = this;
		onRender?.();
		return (0, vue.openBlock)(), (0, vue.createElementBlock)("ul", {
			class: require_vdom.normalizeClass([
				`${mergedClsPrefix}-list`,
				this.rtlEnabled && `${mergedClsPrefix}-list--rtl`,
				this.bordered && `${mergedClsPrefix}-list--bordered`,
				this.showDivider && `${mergedClsPrefix}-list--show-divider`,
				this.hoverable && `${mergedClsPrefix}-list--hoverable`,
				this.clickable && `${mergedClsPrefix}-list--clickable`,
				this.themeClass
			]),
			style: (0, vue.normalizeStyle)(this.cssVars)
		}, [
			$slots.header ? ((0, vue.openBlock)(), (0, vue.createElementBlock)("div", {
				key: 0,
				class: require_vdom.normalizeClass(`${mergedClsPrefix}-list__header`)
			}, [require_vdom.normalizeVNode(() => $slots.header())], 2)) : require_vdom.normalizeVNode(() => null),
			require_vdom.normalizeVNode(() => $slots.default?.()),
			$slots.footer ? ((0, vue.openBlock)(), (0, vue.createElementBlock)("div", {
				key: 2,
				class: require_vdom.normalizeClass(`${mergedClsPrefix}-list__footer`)
			}, [require_vdom.normalizeVNode(() => $slots.footer())], 2)) : require_vdom.normalizeVNode(() => null)
		], 6);
	}
});
//#endregion
exports.default = List_default;
exports.listInjectionKey = listInjectionKey;
exports.listProps = listProps;
