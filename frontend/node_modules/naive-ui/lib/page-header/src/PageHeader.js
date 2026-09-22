Object.defineProperties(exports, {
	__esModule: { value: true },
	[Symbol.toStringTag]: { value: "Module" }
});
const require__mixins_use_config = require("../../_mixins/use-config.js");
const require__mixins_use_css_vars_class = require("../../_mixins/use-css-vars-class.js");
const require__mixins_use_rtl = require("../../_mixins/use-rtl.js");
const require__mixins_use_theme = require("../../_mixins/use-theme.js");
const require_vdom = require("../../vue-jsx-vapor/vdom.js");
const require__internal_icon_src_Icon = require("../../_internal/icon/src/Icon.js");
const require__internal_icons_ArrowBack = require("../../_internal/icons/ArrowBack.js");
const require_page_header_styles_light = require("../styles/light.js");
const require_page_header_src_styles_index_cssr = require("./styles/index.cssr.js");
let vue = require("vue");
//#region src/page-header/src/PageHeader.tsx
const pageHeaderProps = {
	...require__mixins_use_theme.default.props,
	title: String,
	subtitle: String,
	extra: String,
	onBack: Function
};
var PageHeader_default = (0, vue.defineComponent)({
	name: "PageHeader",
	props: pageHeaderProps,
	slots: Object,
	setup(props) {
		const { mergedClsPrefixRef, mergedRtlRef, inlineThemeDisabled } = require__mixins_use_config.default(props);
		const themeRef = require__mixins_use_theme.default("PageHeader", "-page-header", require_page_header_src_styles_index_cssr, require_page_header_styles_light.pageHeaderLight, props, mergedClsPrefixRef);
		const rtlEnabledRef = require__mixins_use_rtl.useRtl("PageHeader", mergedRtlRef, mergedClsPrefixRef);
		const cssVarsRef = (0, vue.computed)(() => {
			const { self: { titleTextColor, subtitleTextColor, backColor, fontSize, titleFontSize, backSize, titleFontWeight, backColorHover, backColorPressed }, common: { cubicBezierEaseInOut } } = themeRef.value;
			return {
				"--n-title-text-color": titleTextColor,
				"--n-title-font-size": titleFontSize,
				"--n-title-font-weight": titleFontWeight,
				"--n-font-size": fontSize,
				"--n-back-size": backSize,
				"--n-subtitle-text-color": subtitleTextColor,
				"--n-back-color": backColor,
				"--n-back-color-hover": backColorHover,
				"--n-back-color-pressed": backColorPressed,
				"--n-bezier": cubicBezierEaseInOut
			};
		});
		const themeClassHandle = inlineThemeDisabled ? require__mixins_use_css_vars_class.useThemeClass("page-header", void 0, cssVarsRef, props) : void 0;
		return {
			rtlEnabled: rtlEnabledRef,
			mergedClsPrefix: mergedClsPrefixRef,
			cssVars: inlineThemeDisabled ? void 0 : cssVarsRef,
			themeClass: themeClassHandle?.themeClass,
			onRender: themeClassHandle?.onRender
		};
	},
	render() {
		const { onBack, title, subtitle, extra, mergedClsPrefix, cssVars, $slots } = this;
		this.onRender?.();
		const { title: titleSlot, subtitle: subtitleSlot, extra: extraSlot, default: defaultSlot, header: headerSlot, avatar: avatarSlot, footer: footerSlot, back: backSlot } = $slots;
		const showBack = onBack;
		const showTitle = title || titleSlot;
		const showSubtitle = subtitle || subtitleSlot;
		const showExtra = extra || extraSlot;
		return (0, vue.openBlock)(), (0, vue.createElementBlock)("div", {
			style: (0, vue.normalizeStyle)(cssVars),
			class: require_vdom.normalizeClass([
				`${mergedClsPrefix}-page-header-wrapper`,
				this.themeClass,
				this.rtlEnabled && `${mergedClsPrefix}-page-header-wrapper--rtl`
			])
		}, [
			headerSlot ? ((0, vue.openBlock)(), (0, vue.createElementBlock)("div", {
				class: require_vdom.normalizeClass(`${mergedClsPrefix}-page-header-header`),
				key: "breadcrumb"
			}, [require_vdom.normalizeVNode(() => headerSlot())], 2)) : require_vdom.normalizeVNode(() => null),
			require_vdom.normalizeVNode(() => (showBack || avatarSlot || showTitle || showSubtitle || showExtra) && ((0, vue.openBlock)(), (0, vue.createElementBlock)("div", {
				class: require_vdom.normalizeClass(`${mergedClsPrefix}-page-header`),
				key: "header"
			}, [(0, vue.createElementVNode)("div", {
				class: require_vdom.normalizeClass(`${mergedClsPrefix}-page-header__main`),
				key: "back"
			}, [
				showBack ? ((0, vue.openBlock)(), (0, vue.createElementBlock)("div", {
					key: 0,
					class: require_vdom.normalizeClass(`${mergedClsPrefix}-page-header__back`),
					onClick: onBack
				}, [backSlot ? ((0, vue.openBlock)(), (0, vue.createElementBlock)(vue.Fragment, { key: 0 }, [require_vdom.normalizeVNode(() => backSlot())], 64)) : ((0, vue.openBlock)(), (0, vue.createBlock)(require__internal_icon_src_Icon, {
					key: 1,
					clsPrefix: mergedClsPrefix
				}, { default: () => ((0, vue.openBlock)(), (0, vue.createBlock)(require__internal_icons_ArrowBack)) }, 1032, ["clsPrefix"]))], 10, ["onClick"])) : require_vdom.normalizeVNode(() => null),
				avatarSlot ? ((0, vue.openBlock)(), (0, vue.createElementBlock)("div", {
					key: 2,
					class: require_vdom.normalizeClass(`${mergedClsPrefix}-page-header__avatar`)
				}, [require_vdom.normalizeVNode(() => avatarSlot())], 2)) : require_vdom.normalizeVNode(() => null),
				showTitle ? ((0, vue.openBlock)(), (0, vue.createElementBlock)("div", {
					class: require_vdom.normalizeClass(`${mergedClsPrefix}-page-header__title`),
					key: "title"
				}, [require_vdom.normalizeVNode(() => title || titleSlot())], 2)) : require_vdom.normalizeVNode(() => null),
				showSubtitle ? ((0, vue.openBlock)(), (0, vue.createElementBlock)("div", {
					class: require_vdom.normalizeClass(`${mergedClsPrefix}-page-header__subtitle`),
					key: "subtitle"
				}, [require_vdom.normalizeVNode(() => subtitle || subtitleSlot())], 2)) : require_vdom.normalizeVNode(() => null)
			], 2), showExtra ? ((0, vue.openBlock)(), (0, vue.createElementBlock)("div", {
				key: 0,
				class: require_vdom.normalizeClass(`${mergedClsPrefix}-page-header__extra`)
			}, [require_vdom.normalizeVNode(() => extra || extraSlot())], 2)) : require_vdom.normalizeVNode(() => null)], 2))),
			defaultSlot ? ((0, vue.openBlock)(), (0, vue.createElementBlock)("div", {
				class: require_vdom.normalizeClass(`${mergedClsPrefix}-page-header-content`),
				key: "content"
			}, [require_vdom.normalizeVNode(() => defaultSlot())], 2)) : require_vdom.normalizeVNode(() => null),
			footerSlot ? ((0, vue.openBlock)(), (0, vue.createElementBlock)("div", {
				class: require_vdom.normalizeClass(`${mergedClsPrefix}-page-header-footer`),
				key: "footer"
			}, [require_vdom.normalizeVNode(() => footerSlot())], 2)) : require_vdom.normalizeVNode(() => null)
		], 6);
	}
});
//#endregion
exports.default = PageHeader_default;
exports.pageHeaderProps = pageHeaderProps;
