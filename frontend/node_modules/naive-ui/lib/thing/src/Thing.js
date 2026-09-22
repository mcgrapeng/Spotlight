Object.defineProperties(exports, {
	__esModule: { value: true },
	[Symbol.toStringTag]: { value: "Module" }
});
const require__mixins_use_config = require("../../_mixins/use-config.js");
const require__mixins_use_css_vars_class = require("../../_mixins/use-css-vars-class.js");
const require__mixins_use_rtl = require("../../_mixins/use-rtl.js");
const require__mixins_use_theme = require("../../_mixins/use-theme.js");
const require_vdom = require("../../vue-jsx-vapor/vdom.js");
const require_thing_styles_light = require("../styles/light.js");
const require_thing_src_styles_index_cssr = require("./styles/index.cssr.js");
let vue = require("vue");
//#region src/thing/src/Thing.tsx
const thingProps = {
	...require__mixins_use_theme.default.props,
	title: String,
	titleExtra: String,
	description: String,
	descriptionClass: String,
	descriptionStyle: [String, Object],
	content: String,
	contentClass: String,
	contentStyle: [String, Object],
	contentIndented: Boolean
};
var Thing_default = (0, vue.defineComponent)({
	name: "Thing",
	props: thingProps,
	slots: Object,
	setup(props, { slots }) {
		const { mergedClsPrefixRef, inlineThemeDisabled, mergedRtlRef } = require__mixins_use_config.default(props);
		const themeRef = require__mixins_use_theme.default("Thing", "-thing", require_thing_src_styles_index_cssr, require_thing_styles_light.default, props, mergedClsPrefixRef);
		const rtlEnabledRef = require__mixins_use_rtl.useRtl("Thing", mergedRtlRef, mergedClsPrefixRef);
		const cssVarsRef = (0, vue.computed)(() => {
			const { self: { titleTextColor, textColor, titleFontWeight, fontSize }, common: { cubicBezierEaseInOut } } = themeRef.value;
			return {
				"--n-bezier": cubicBezierEaseInOut,
				"--n-font-size": fontSize,
				"--n-text-color": textColor,
				"--n-title-font-weight": titleFontWeight,
				"--n-title-text-color": titleTextColor
			};
		});
		const themeClassHandle = inlineThemeDisabled ? require__mixins_use_css_vars_class.useThemeClass("thing", void 0, cssVarsRef, props) : void 0;
		return () => {
			const { value: mergedClsPrefix } = mergedClsPrefixRef;
			const rtlEnabled = rtlEnabledRef ? rtlEnabledRef.value : false;
			themeClassHandle?.onRender?.();
			return (0, vue.openBlock)(), (0, vue.createElementBlock)("div", {
				class: require_vdom.normalizeClass([
					`${mergedClsPrefix}-thing`,
					themeClassHandle?.themeClass,
					rtlEnabled && `${mergedClsPrefix}-thing--rtl`
				]),
				style: (0, vue.normalizeStyle)(inlineThemeDisabled ? void 0 : cssVarsRef.value)
			}, [slots.avatar && props.contentIndented ? ((0, vue.openBlock)(), (0, vue.createElementBlock)("div", {
				key: 0,
				class: require_vdom.normalizeClass(`${mergedClsPrefix}-thing-avatar`)
			}, [require_vdom.normalizeVNode(() => slots.avatar())], 2)) : require_vdom.normalizeVNode(() => null), (0, vue.createElementVNode)("div", { class: require_vdom.normalizeClass(`${mergedClsPrefix}-thing-main`) }, [
				!props.contentIndented && (slots.header || props.title || slots["header-extra"] || props.titleExtra || slots.avatar) ? ((0, vue.openBlock)(), (0, vue.createElementBlock)("div", {
					key: 0,
					class: require_vdom.normalizeClass(`${mergedClsPrefix}-thing-avatar-header-wrapper`)
				}, [slots.avatar ? ((0, vue.openBlock)(), (0, vue.createElementBlock)("div", {
					key: 0,
					class: require_vdom.normalizeClass(`${mergedClsPrefix}-thing-avatar`)
				}, [require_vdom.normalizeVNode(() => slots.avatar())], 2)) : require_vdom.normalizeVNode(() => null), slots.header || props.title || slots["header-extra"] || props.titleExtra ? ((0, vue.openBlock)(), (0, vue.createElementBlock)("div", {
					key: 2,
					class: require_vdom.normalizeClass(`${mergedClsPrefix}-thing-header-wrapper`)
				}, [(0, vue.createElementVNode)("div", { class: require_vdom.normalizeClass(`${mergedClsPrefix}-thing-header`) }, [slots.header || props.title ? ((0, vue.openBlock)(), (0, vue.createElementBlock)("div", {
					key: 0,
					class: require_vdom.normalizeClass(`${mergedClsPrefix}-thing-header__title`)
				}, [slots.header ? ((0, vue.openBlock)(), (0, vue.createElementBlock)(vue.Fragment, { key: 0 }, [require_vdom.normalizeVNode(() => slots.header())], 64)) : ((0, vue.openBlock)(), (0, vue.createElementBlock)(vue.Fragment, { key: 1 }, [require_vdom.normalizeVNode(() => props.title)], 64))], 2)) : require_vdom.normalizeVNode(() => null), slots["header-extra"] || props.titleExtra ? ((0, vue.openBlock)(), (0, vue.createElementBlock)("div", {
					key: 2,
					class: require_vdom.normalizeClass(`${mergedClsPrefix}-thing-header__extra`)
				}, [slots["header-extra"] ? ((0, vue.openBlock)(), (0, vue.createElementBlock)(vue.Fragment, { key: 0 }, [require_vdom.normalizeVNode(() => slots["header-extra"]())], 64)) : ((0, vue.openBlock)(), (0, vue.createElementBlock)(vue.Fragment, { key: 1 }, [require_vdom.normalizeVNode(() => props.titleExtra)], 64))], 2)) : require_vdom.normalizeVNode(() => null)], 2), slots.description || props.description ? ((0, vue.openBlock)(), (0, vue.createElementBlock)("div", {
					key: 0,
					class: require_vdom.normalizeClass([`${mergedClsPrefix}-thing-main__description`, props.descriptionClass]),
					style: (0, vue.normalizeStyle)(props.descriptionStyle)
				}, [slots.description ? ((0, vue.openBlock)(), (0, vue.createElementBlock)(vue.Fragment, { key: 0 }, [require_vdom.normalizeVNode(() => slots.description())], 64)) : ((0, vue.openBlock)(), (0, vue.createElementBlock)(vue.Fragment, { key: 1 }, [require_vdom.normalizeVNode(() => props.description)], 64))], 6)) : require_vdom.normalizeVNode(() => null)], 2)) : require_vdom.normalizeVNode(() => null)], 2)) : ((0, vue.openBlock)(), (0, vue.createElementBlock)(vue.Fragment, { key: 1 }, [slots.header || props.title || slots["header-extra"] || props.titleExtra ? ((0, vue.openBlock)(), (0, vue.createElementBlock)("div", {
					key: 0,
					class: require_vdom.normalizeClass(`${mergedClsPrefix}-thing-header`)
				}, [slots.header || props.title ? ((0, vue.openBlock)(), (0, vue.createElementBlock)("div", {
					key: 0,
					class: require_vdom.normalizeClass(`${mergedClsPrefix}-thing-header__title`)
				}, [slots.header ? ((0, vue.openBlock)(), (0, vue.createElementBlock)(vue.Fragment, { key: 0 }, [require_vdom.normalizeVNode(() => slots.header())], 64)) : ((0, vue.openBlock)(), (0, vue.createElementBlock)(vue.Fragment, { key: 1 }, [require_vdom.normalizeVNode(() => props.title)], 64))], 2)) : require_vdom.normalizeVNode(() => null), slots["header-extra"] || props.titleExtra ? ((0, vue.openBlock)(), (0, vue.createElementBlock)("div", {
					key: 2,
					class: require_vdom.normalizeClass(`${mergedClsPrefix}-thing-header__extra`)
				}, [slots["header-extra"] ? ((0, vue.openBlock)(), (0, vue.createElementBlock)(vue.Fragment, { key: 0 }, [require_vdom.normalizeVNode(() => slots["header-extra"]())], 64)) : ((0, vue.openBlock)(), (0, vue.createElementBlock)(vue.Fragment, { key: 1 }, [require_vdom.normalizeVNode(() => props.titleExtra)], 64))], 2)) : require_vdom.normalizeVNode(() => null)], 2)) : require_vdom.normalizeVNode(() => null), slots.description || props.description ? ((0, vue.openBlock)(), (0, vue.createElementBlock)("div", {
					key: 2,
					class: require_vdom.normalizeClass([`${mergedClsPrefix}-thing-main__description`, props.descriptionClass]),
					style: (0, vue.normalizeStyle)(props.descriptionStyle)
				}, [slots.description ? ((0, vue.openBlock)(), (0, vue.createElementBlock)(vue.Fragment, { key: 0 }, [require_vdom.normalizeVNode(() => slots.description())], 64)) : ((0, vue.openBlock)(), (0, vue.createElementBlock)(vue.Fragment, { key: 1 }, [require_vdom.normalizeVNode(() => props.description)], 64))], 6)) : require_vdom.normalizeVNode(() => null)], 64)),
				slots.default || props.content ? ((0, vue.openBlock)(), (0, vue.createElementBlock)("div", {
					key: 2,
					class: require_vdom.normalizeClass([`${mergedClsPrefix}-thing-main__content`, props.contentClass]),
					style: (0, vue.normalizeStyle)(props.contentStyle)
				}, [slots.default ? ((0, vue.openBlock)(), (0, vue.createElementBlock)(vue.Fragment, { key: 0 }, [require_vdom.normalizeVNode(() => slots.default())], 64)) : ((0, vue.openBlock)(), (0, vue.createElementBlock)(vue.Fragment, { key: 1 }, [require_vdom.normalizeVNode(() => props.content)], 64))], 6)) : require_vdom.normalizeVNode(() => null),
				slots.footer ? ((0, vue.openBlock)(), (0, vue.createElementBlock)("div", {
					key: 4,
					class: require_vdom.normalizeClass(`${mergedClsPrefix}-thing-main__footer`)
				}, [require_vdom.normalizeVNode(() => slots.footer())], 2)) : require_vdom.normalizeVNode(() => null),
				slots.action ? ((0, vue.openBlock)(), (0, vue.createElementBlock)("div", {
					key: 6,
					class: require_vdom.normalizeClass(`${mergedClsPrefix}-thing-main__action`)
				}, [require_vdom.normalizeVNode(() => slots.action())], 2)) : require_vdom.normalizeVNode(() => null)
			], 2)], 6);
		};
	}
});
//#endregion
exports.default = Thing_default;
exports.thingProps = thingProps;
