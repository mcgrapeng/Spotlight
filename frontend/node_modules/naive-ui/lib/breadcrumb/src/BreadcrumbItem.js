Object.defineProperties(exports, {
	__esModule: { value: true },
	[Symbol.toStringTag]: { value: "Module" }
});
const require__utils_naive_warn = require("../../_utils/naive/warn.js");
const require__utils_vue_resolve_slot = require("../../_utils/vue/resolve-slot.js");
const require_vdom = require("../../vue-jsx-vapor/vdom.js");
const require_breadcrumb_src_Breadcrumb = require("./Breadcrumb.js");
const require__utils_composable_use_browser_location = require("../../_utils/composable/use-browser-location.js");
let vue = require("vue");
//#region src/breadcrumb/src/BreadcrumbItem.tsx
const breadcrumbItemProps = {
	separator: String,
	href: String,
	clickable: {
		type: Boolean,
		default: true
	},
	showSeparator: {
		type: Boolean,
		default: true
	},
	onClick: Function
};
var BreadcrumbItem_default = (0, vue.defineComponent)({
	name: "BreadcrumbItem",
	props: breadcrumbItemProps,
	slots: Object,
	setup(props, { slots }) {
		const NBreadcrumb = (0, vue.inject)(require_breadcrumb_src_Breadcrumb.breadcrumbInjectionKey, null);
		if (!NBreadcrumb) {
			if (process.env.NODE_ENV !== "production") require__utils_naive_warn.warn("breadcrumb", "`n-breadcrumb-item` must be placed inside `n-breadcrumb`.");
			return () => null;
		}
		const { separatorRef, mergedClsPrefixRef } = NBreadcrumb;
		const browserLocationRef = require__utils_composable_use_browser_location.useBrowserLocation();
		const htmlTagRef = (0, vue.computed)(() => props.href ? "a" : "span");
		const ariaCurrentRef = (0, vue.computed)(() => browserLocationRef.value.href === props.href ? "location" : null);
		return () => {
			const { value: mergedClsPrefix } = mergedClsPrefixRef;
			return (0, vue.openBlock)(), (0, vue.createElementBlock)("li", { class: require_vdom.normalizeClass([`${mergedClsPrefix}-breadcrumb-item`, props.clickable && `${mergedClsPrefix}-breadcrumb-item--clickable`]) }, [require_vdom.normalizeVNode(() => (0, vue.h)(htmlTagRef.value, {
				class: `${mergedClsPrefix}-breadcrumb-item__link`,
				"aria-current": ariaCurrentRef.value,
				href: props.href,
				onClick: props.onClick
			}, slots)), require_vdom.normalizeVNode(() => props.showSeparator && ((0, vue.openBlock)(), (0, vue.createElementBlock)("span", {
				class: require_vdom.normalizeClass(`${mergedClsPrefix}-breadcrumb-item__separator`),
				"aria-hidden": "true"
			}, [require_vdom.normalizeVNode(() => require__utils_vue_resolve_slot.resolveSlot(slots.separator, () => [props.separator ?? separatorRef.value]))], 2)))], 2);
		};
	}
});
//#endregion
exports.breadcrumbItemProps = breadcrumbItemProps;
exports.default = BreadcrumbItem_default;
