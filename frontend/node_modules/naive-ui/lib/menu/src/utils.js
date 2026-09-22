Object.defineProperty(exports, Symbol.toStringTag, { value: "Module" });
const require__utils_vue_keep = require("../../_utils/vue/keep.js");
const require_menu_src_MenuDivider = require("./MenuDivider.js");
const require_menu_src_MenuOption = require("./MenuOption.js");
const require_menu_src_MenuOptionGroup = require("./MenuOptionGroup.js");
const require_menu_src_Submenu = require("./Submenu.js");
let vue = require("vue");
//#region src/menu/src/utils.tsx
function isIgnoredNode(rawNode) {
	return rawNode.type === "divider" || rawNode.type === "render";
}
function isDividerNode(rawNode) {
	return rawNode.type === "divider";
}
function itemRenderer(tmNode, menuProps) {
	const { rawNode } = tmNode;
	const { show } = rawNode;
	if (show === false) return null;
	if (isIgnoredNode(rawNode)) {
		if (isDividerNode(rawNode)) return (0, vue.openBlock)(), (0, vue.createBlock)(require_menu_src_MenuDivider, (0, vue.mergeProps)({ key: tmNode.key }, rawNode.props), null, 16);
		return null;
	}
	const { labelField } = menuProps;
	const { key, level, isGroup } = tmNode;
	const props = {
		...rawNode,
		title: rawNode.title || rawNode[labelField],
		extra: rawNode.titleExtra || rawNode.extra,
		key,
		internalKey: key,
		level,
		root: level === 0,
		isGroup
	};
	if (tmNode.children) {
		if (tmNode.isGroup) return (0, vue.h)(require_menu_src_MenuOptionGroup.NMenuOptionGroup, require__utils_vue_keep.keep(props, require_menu_src_MenuOptionGroup.menuItemGroupPropKeys, {
			tmNode,
			tmNodes: tmNode.children,
			key
		}));
		return (0, vue.h)(require_menu_src_Submenu.NSubmenu, require__utils_vue_keep.keep(props, require_menu_src_Submenu.submenuPropKeys, {
			key,
			rawNodes: rawNode[menuProps.childrenField],
			tmNodes: tmNode.children,
			tmNode
		}));
	} else return (0, vue.h)(require_menu_src_MenuOption.NMenuOption, require__utils_vue_keep.keep(props, require_menu_src_MenuOption.menuItemPropKeys, {
		key,
		tmNode
	}));
}
//#endregion
exports.isDividerNode = isDividerNode;
exports.isIgnoredNode = isIgnoredNode;
exports.itemRenderer = itemRenderer;
