Object.defineProperties(exports, {
	__esModule: { value: true },
	[Symbol.toStringTag]: { value: "Module" }
});
const require__utils_vue_create_injection_key = require("../../_utils/vue/create-injection-key.js");
const require__utils_composable_use_collection = require("../../_utils/composable/use-collection.js");
const require__utils_naive_attribute = require("../../_utils/naive/attribute.js");
const require__utils_vue_resolve_slot = require("../../_utils/vue/resolve-slot.js");
const require_vdom = require("../../vue-jsx-vapor/vdom.js");
let vue = require("vue");
let vooks = require("vooks");
//#region src/anchor/src/Link.tsx
const _hoisted_1 = [
	"href",
	"title",
	"onClick"
];
const anchorInjectionKey = require__utils_vue_create_injection_key.createInjectionKey("n-anchor");
const anchorLinkProps = {
	title: String,
	href: String
};
var Link_default = (0, vue.defineComponent)({
	name: "AnchorLink",
	props: anchorLinkProps,
	slots: Object,
	setup(props, { slots }) {
		const titleRef = (0, vue.ref)(null);
		const NAnchor = (0, vue.inject)(anchorInjectionKey);
		const hrefRef = (0, vue.toRef)(props, "href");
		const activeRef = (0, vooks.useMemo)(() => {
			return hrefRef.value && hrefRef.value === NAnchor.activeHref.value;
		});
		require__utils_composable_use_collection.useInjectionCollection(anchorInjectionKey, "collectedLinkHrefs", hrefRef);
		require__utils_composable_use_collection.useInjectionElementCollection(anchorInjectionKey, "titleEls", () => titleRef.value);
		(0, vue.watch)(activeRef, (value) => {
			if (value && titleRef.value) NAnchor.updateBarPosition(titleRef.value);
		});
		function handleClick() {
			if (props.href !== void 0) NAnchor.setActiveHref(props.href);
		}
		return () => {
			const { value: mergedClsPrefix } = NAnchor.mergedClsPrefix;
			return (0, vue.openBlock)(), (0, vue.createElementBlock)("div", { class: require_vdom.normalizeClass([`${mergedClsPrefix}-anchor-link`, activeRef.value && `${mergedClsPrefix}-anchor-link--active`]) }, [(0, vue.createElementVNode)("a", {
				ref: titleRef,
				class: require_vdom.normalizeClass([`${mergedClsPrefix}-anchor-link__title`]),
				href: props.href,
				title: require__utils_naive_attribute.getTitleAttribute(props.title),
				onClick: handleClick
			}, [require_vdom.normalizeVNode(() => require__utils_vue_resolve_slot.resolveSlot(slots.title, () => [props.title]))], 10, _hoisted_1), require_vdom.normalizeVNode(() => slots.default?.())], 2);
		};
	}
});
//#endregion
exports.anchorInjectionKey = anchorInjectionKey;
exports.anchorLinkProps = anchorLinkProps;
exports.default = Link_default;
