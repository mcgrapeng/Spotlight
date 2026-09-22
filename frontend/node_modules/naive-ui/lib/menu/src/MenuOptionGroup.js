Object.defineProperty(exports, Symbol.toStringTag, { value: "Module" });
const require__utils_vue_keysOf = require("../../_utils/vue/keysOf.js");
const require__utils_vue_render = require("../../_utils/vue/render.js");
const require_vdom = require("../../vue-jsx-vapor/vdom.js");
const require_menu_src_context = require("./context.js");
const require_menu_src_use_menu_child = require("./use-menu-child.js");
const require_menu_src_use_menu_child_props = require("./use-menu-child-props.js");
const require_menu_src_utils = require("./utils.js");
let vue = require("vue");
//#region src/menu/src/MenuOptionGroup.tsx
const menuItemGroupProps = {
	...require_menu_src_use_menu_child_props.useMenuChildProps,
	tmNode: {
		type: Object,
		required: true
	},
	tmNodes: {
		type: Array,
		required: true
	}
};
const menuItemGroupPropKeys = require__utils_vue_keysOf.keysOf(menuItemGroupProps);
const NMenuOptionGroup = (0, vue.defineComponent)({
	name: "MenuOptionGroup",
	props: menuItemGroupProps,
	setup(props) {
		const MenuChild = require_menu_src_use_menu_child.useMenuChild(props);
		const { NSubmenu } = MenuChild;
		const mergedDisabledRef = (0, vue.computed)(() => {
			if (NSubmenu?.mergedDisabledRef.value) return true;
			return props.tmNode.disabled;
		});
		(0, vue.provide)(require_menu_src_context.menuItemGroupInjectionKey, {
			paddingLeftRef: MenuChild.paddingLeft,
			mergedDisabledRef
		});
		const { mergedClsPrefixRef, props: menuProps } = (0, vue.inject)(require_menu_src_context.menuInjectionKey);
		return function() {
			const { value: mergedClsPrefix } = mergedClsPrefixRef;
			const paddingLeft = MenuChild.paddingLeft.value;
			const { nodeProps } = menuProps;
			const attrs = nodeProps?.(props.tmNode.rawNode);
			return (() => {
				const _cache = require_vdom.createVNodeCache("45eca6a63be5028b");
				return (0, vue.openBlock)(), (0, vue.createElementBlock)("div", {
					class: require_vdom.normalizeClass(`${mergedClsPrefix}-menu-item-group`),
					role: "group"
				}, [(0, vue.createElementVNode)("div", (0, vue.mergeProps)(attrs, {
					class: [`${mergedClsPrefix}-menu-item-group-title`, attrs?.class],
					style: [attrs?.style || "", paddingLeft !== void 0 ? `padding-left: ${paddingLeft}px;` : ""]
				}), [require_vdom.normalizeVNode(() => require__utils_vue_render.render(props.title)), props.extra ? ((0, vue.openBlock)(), (0, vue.createElementBlock)(vue.Fragment, { key: 0 }, [_cache[0] || (_cache[0] = require_vdom.normalizeVNode(" ", -1)), require_vdom.normalizeVNode(() => require__utils_vue_render.render(props.extra))], 64)) : require_vdom.normalizeVNode(() => null)], 16), (0, vue.createElementVNode)("div", null, [require_vdom.normalizeVNode(() => props.tmNodes.map((tmNode) => require_menu_src_utils.itemRenderer(tmNode, menuProps)))])], 2);
			})();
		};
	}
});
//#endregion
exports.NMenuOptionGroup = NMenuOptionGroup;
exports.menuItemGroupPropKeys = menuItemGroupPropKeys;
exports.menuItemGroupProps = menuItemGroupProps;
