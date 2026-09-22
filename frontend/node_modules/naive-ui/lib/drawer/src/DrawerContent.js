Object.defineProperties(exports, {
	__esModule: { value: true },
	[Symbol.toStringTag]: { value: "Module" }
});
const require_drawer_src_interface = require("./interface.js");
const require__utils_naive_warn = require("../../_utils/naive/warn.js");
const require_vdom = require("../../vue-jsx-vapor/vdom.js");
const require__internal_close_src_Close = require("../../_internal/close/src/Close.js");
const require__internal_scrollbar_src_Scrollbar = require("../../_internal/scrollbar/src/Scrollbar.js");
let vue = require("vue");
//#region src/drawer/src/DrawerContent.tsx
const drawerContentProps = {
	title: String,
	headerClass: String,
	headerStyle: [Object, String],
	footerClass: String,
	footerStyle: [Object, String],
	bodyClass: String,
	bodyStyle: [Object, String],
	bodyContentClass: String,
	bodyContentStyle: [Object, String],
	nativeScrollbar: {
		type: Boolean,
		default: true
	},
	scrollbarProps: Object,
	closable: Boolean
};
var DrawerContent_default = (0, vue.defineComponent)({
	name: "DrawerContent",
	props: drawerContentProps,
	slots: Object,
	setup() {
		const NDrawer = (0, vue.inject)(require_drawer_src_interface.drawerInjectionKey, null);
		if (!NDrawer) require__utils_naive_warn.throwError("drawer-content", "`n-drawer-content` must be placed inside `n-drawer`.");
		const { doUpdateShow } = NDrawer;
		function handleCloseClick() {
			doUpdateShow(false);
		}
		return {
			handleCloseClick,
			mergedTheme: NDrawer.mergedThemeRef,
			mergedClsPrefix: NDrawer.mergedClsPrefixRef
		};
	},
	render() {
		const { title, mergedClsPrefix, nativeScrollbar, mergedTheme, bodyClass, bodyStyle, bodyContentClass, bodyContentStyle, headerClass, headerStyle, footerClass, footerStyle, scrollbarProps, closable, $slots } = this;
		return (0, vue.openBlock)(), (0, vue.createElementBlock)("div", {
			role: "none",
			class: require_vdom.normalizeClass([`${mergedClsPrefix}-drawer-content`, nativeScrollbar && `${mergedClsPrefix}-drawer-content--native-scrollbar`])
		}, [
			$slots.header || title || closable ? ((0, vue.openBlock)(), (0, vue.createElementBlock)("div", {
				key: 0,
				class: require_vdom.normalizeClass([`${mergedClsPrefix}-drawer-header`, headerClass]),
				style: (0, vue.normalizeStyle)(headerStyle),
				role: "none"
			}, [(0, vue.createElementVNode)("div", {
				class: require_vdom.normalizeClass(`${mergedClsPrefix}-drawer-header__main`),
				role: "heading",
				"aria-level": "1"
			}, [$slots.header !== void 0 ? ((0, vue.openBlock)(), (0, vue.createElementBlock)(vue.Fragment, { key: 0 }, [require_vdom.normalizeVNode(() => $slots.header())], 64)) : ((0, vue.openBlock)(), (0, vue.createElementBlock)(vue.Fragment, { key: 1 }, [require_vdom.normalizeVNode(() => title)], 64))], 2), require_vdom.normalizeVNode(() => closable && ((0, vue.openBlock)(), (0, vue.createBlock)(require__internal_close_src_Close, {
				onClick: this.handleCloseClick,
				clsPrefix: mergedClsPrefix,
				class: require_vdom.normalizeClass(`${mergedClsPrefix}-drawer-header__close`),
				absolute: true
			}, null, 8, [
				"onClick",
				"clsPrefix",
				"class"
			])))], 6)) : require_vdom.normalizeVNode(() => null),
			nativeScrollbar ? ((0, vue.openBlock)(), (0, vue.createElementBlock)("div", {
				key: 2,
				class: require_vdom.normalizeClass([`${mergedClsPrefix}-drawer-body`, bodyClass]),
				style: (0, vue.normalizeStyle)(bodyStyle),
				role: "none"
			}, [(0, vue.createElementVNode)("div", {
				class: require_vdom.normalizeClass([`${mergedClsPrefix}-drawer-body-content-wrapper`, bodyContentClass]),
				style: (0, vue.normalizeStyle)(bodyContentStyle),
				role: "none"
			}, [require_vdom.normalizeVNode(() => $slots.default?.())], 6)], 6)) : ((0, vue.openBlock)(), (0, vue.createBlock)(require__internal_scrollbar_src_Scrollbar.default, (0, vue.mergeProps)({
				key: 3,
				themeOverrides: mergedTheme.peerOverrides.Scrollbar,
				theme: mergedTheme.peers.Scrollbar
			}, scrollbarProps, {
				class: `${mergedClsPrefix}-drawer-body`,
				contentClass: [`${mergedClsPrefix}-drawer-body-content-wrapper`, bodyContentClass],
				contentStyle: bodyContentStyle
			}), require_vdom.normalizeSlots($slots), 1040, [
				"themeOverrides",
				"theme",
				"class",
				"contentClass",
				"contentStyle"
			])),
			$slots.footer ? ((0, vue.openBlock)(), (0, vue.createElementBlock)("div", {
				key: 4,
				class: require_vdom.normalizeClass([`${mergedClsPrefix}-drawer-footer`, footerClass]),
				style: (0, vue.normalizeStyle)(footerStyle),
				role: "none"
			}, [require_vdom.normalizeVNode(() => $slots.footer())], 6)) : require_vdom.normalizeVNode(() => null)
		], 2);
	}
});
//#endregion
exports.default = DrawerContent_default;
exports.drawerContentProps = drawerContentProps;
