Object.defineProperty(exports, Symbol.toStringTag, { value: "Module" });
const require__utils_vue_keysOf = require("../../_utils/vue/keysOf.js");
const require__utils_vue_render = require("../../_utils/vue/render.js");
const require_tooltip_src_Tooltip = require("../../tooltip/src/Tooltip.js");
const require_menu_src_MenuOptionContent = require("./MenuOptionContent.js");
const require_menu_src_use_menu_child = require("./use-menu-child.js");
const require_menu_src_use_menu_child_props = require("./use-menu-child-props.js");
let vue = require("vue");
let vooks = require("vooks");
//#region src/menu/src/MenuOption.tsx
const menuItemProps = {
	...require_menu_src_use_menu_child_props.useMenuChildProps,
	tmNode: {
		type: Object,
		required: true
	},
	disabled: Boolean,
	icon: Function,
	onClick: Function
};
const menuItemPropKeys = require__utils_vue_keysOf.keysOf(menuItemProps);
const NMenuOption = (0, vue.defineComponent)({
	name: "MenuOption",
	props: menuItemProps,
	setup(props) {
		const MenuChild = require_menu_src_use_menu_child.useMenuChild(props);
		const { NSubmenu, NMenu, NMenuOptionGroup } = MenuChild;
		const { props: menuProps, mergedClsPrefixRef, mergedCollapsedRef } = NMenu;
		const parentDisabledRef = NSubmenu ? NSubmenu.mergedDisabledRef : NMenuOptionGroup ? NMenuOptionGroup.mergedDisabledRef : { value: false };
		const mergedDisabledRef = (0, vue.computed)(() => {
			return parentDisabledRef.value || props.disabled;
		});
		function doClick(e) {
			const { onClick } = props;
			if (onClick) onClick(e);
		}
		function handleClick(e) {
			if (!mergedDisabledRef.value) {
				NMenu.doSelect(props.internalKey, props.tmNode.rawNode);
				doClick(e);
			}
		}
		return {
			mergedClsPrefix: mergedClsPrefixRef,
			dropdownPlacement: MenuChild.dropdownPlacement,
			paddingLeft: MenuChild.paddingLeft,
			iconMarginRight: MenuChild.iconMarginRight,
			maxIconSize: MenuChild.maxIconSize,
			activeIconSize: MenuChild.activeIconSize,
			mergedTheme: NMenu.mergedThemeRef,
			menuProps,
			dropdownEnabled: (0, vooks.useMemo)(() => {
				return props.root && mergedCollapsedRef.value && menuProps.mode !== "horizontal" && !mergedDisabledRef.value;
			}),
			selected: (0, vooks.useMemo)(() => {
				if (NMenu.mergedValueRef.value === props.internalKey) return true;
				return false;
			}),
			mergedDisabled: mergedDisabledRef,
			handleClick
		};
	},
	render() {
		const { mergedClsPrefix, mergedTheme, tmNode, menuProps: { renderLabel, nodeProps } } = this;
		const attrs = nodeProps?.(tmNode.rawNode);
		return (0, vue.openBlock)(), (0, vue.createElementBlock)("div", (0, vue.mergeProps)(attrs, {
			role: "menuitem",
			class: [`${mergedClsPrefix}-menu-item`, attrs?.class]
		}), [((0, vue.openBlock)(), (0, vue.createBlock)(require_tooltip_src_Tooltip.default, {
			theme: mergedTheme.peers.Tooltip,
			themeOverrides: mergedTheme.peerOverrides.Tooltip,
			trigger: "hover",
			placement: this.dropdownPlacement,
			disabled: !this.dropdownEnabled || this.title === void 0,
			internalExtraClass: ["menu-tooltip"]
		}, {
			default: () => renderLabel ? renderLabel(tmNode.rawNode) : require__utils_vue_render.render(this.title),
			trigger: () => ((0, vue.openBlock)(), (0, vue.createBlock)(require_menu_src_MenuOptionContent, {
				tmNode,
				clsPrefix: mergedClsPrefix,
				paddingLeft: this.paddingLeft,
				iconMarginRight: this.iconMarginRight,
				maxIconSize: this.maxIconSize,
				activeIconSize: this.activeIconSize,
				selected: this.selected,
				title: this.title,
				extra: this.extra,
				disabled: this.mergedDisabled,
				icon: this.icon,
				onClick: this.handleClick
			}, null, 8, [
				"tmNode",
				"clsPrefix",
				"paddingLeft",
				"iconMarginRight",
				"maxIconSize",
				"activeIconSize",
				"selected",
				"title",
				"extra",
				"disabled",
				"icon",
				"onClick"
			]))
		}, 1032, [
			"theme",
			"themeOverrides",
			"placement",
			"disabled"
		]))], 16);
	}
});
//#endregion
exports.NMenuOption = NMenuOption;
exports.menuItemPropKeys = menuItemPropKeys;
exports.menuItemProps = menuItemProps;
