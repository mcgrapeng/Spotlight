Object.defineProperty(exports, Symbol.toStringTag, { value: "Module" });
const require__utils_vue_keysOf = require("../../_utils/vue/keysOf.js");
const require_vdom = require("../../vue-jsx-vapor/vdom.js");
const require__internal_fade_in_expand_transition_src_FadeInExpandTransition = require("../../_internal/fade-in-expand-transition/src/FadeInExpandTransition.js");
const require_dropdown_src_Dropdown = require("../../dropdown/src/Dropdown.js");
const require_menu_src_context = require("./context.js");
const require_menu_src_MenuOptionContent = require("./MenuOptionContent.js");
const require_menu_src_use_menu_child = require("./use-menu-child.js");
const require_menu_src_use_menu_child_props = require("./use-menu-child-props.js");
const require_menu_src_utils = require("./utils.js");
let vue = require("vue");
let vooks = require("vooks");
//#region src/menu/src/Submenu.tsx
const _hoisted_1 = ["aria-expanded", "id"];
const _hoisted_2 = ["aria-expanded", "id"];
const submenuProps = {
	...require_menu_src_use_menu_child_props.useMenuChildProps,
	rawNodes: {
		type: Array,
		default: () => []
	},
	tmNodes: {
		type: Array,
		default: () => []
	},
	tmNode: {
		type: Object,
		required: true
	},
	disabled: Boolean,
	icon: Function,
	onClick: Function,
	domId: String,
	virtualChildActive: {
		type: Boolean,
		default: void 0
	},
	isEllipsisPlaceholder: Boolean
};
const submenuPropKeys = require__utils_vue_keysOf.keysOf(submenuProps);
const NSubmenu = (0, vue.defineComponent)({
	name: "Submenu",
	props: submenuProps,
	setup(props) {
		const MenuChild = require_menu_src_use_menu_child.useMenuChild(props);
		const { NMenu, NSubmenu } = MenuChild;
		const { props: menuProps, mergedCollapsedRef, mergedThemeRef } = NMenu;
		const mergedDisabledRef = (0, vue.computed)(() => {
			const { disabled } = props;
			if (NSubmenu?.mergedDisabledRef.value) return true;
			if (menuProps.disabled) return true;
			return disabled;
		});
		const dropdownShowRef = (0, vue.ref)(false);
		(0, vue.provide)(require_menu_src_context.submenuInjectionKey, {
			paddingLeftRef: MenuChild.paddingLeft,
			mergedDisabledRef
		});
		(0, vue.provide)(require_menu_src_context.menuItemGroupInjectionKey, null);
		function doClick() {
			const { onClick } = props;
			if (onClick) onClick();
		}
		function handleClick() {
			if (!mergedDisabledRef.value) {
				if (!mergedCollapsedRef.value) NMenu.toggleExpand(props.internalKey);
				doClick();
			}
		}
		function handlePopoverShowChange(value) {
			dropdownShowRef.value = value;
		}
		return {
			menuProps,
			mergedTheme: mergedThemeRef,
			doSelect: NMenu.doSelect,
			inverted: NMenu.invertedRef,
			isHorizontal: NMenu.isHorizontalRef,
			mergedClsPrefix: NMenu.mergedClsPrefixRef,
			maxIconSize: MenuChild.maxIconSize,
			activeIconSize: MenuChild.activeIconSize,
			iconMarginRight: MenuChild.iconMarginRight,
			dropdownPlacement: MenuChild.dropdownPlacement,
			dropdownShow: dropdownShowRef,
			paddingLeft: MenuChild.paddingLeft,
			mergedDisabled: mergedDisabledRef,
			mergedValue: NMenu.mergedValueRef,
			childActive: (0, vooks.useMemo)(() => {
				return props.virtualChildActive ?? NMenu.activePathRef.value.includes(props.internalKey);
			}),
			collapsed: (0, vue.computed)(() => {
				if (menuProps.mode === "horizontal") return false;
				if (mergedCollapsedRef.value) return true;
				return !NMenu.mergedExpandedKeysRef.value.includes(props.internalKey);
			}),
			dropdownEnabled: (0, vue.computed)(() => {
				return !mergedDisabledRef.value && (menuProps.mode === "horizontal" || mergedCollapsedRef.value);
			}),
			handlePopoverShowChange,
			handleClick
		};
	},
	render() {
		const { mergedClsPrefix, menuProps: { renderIcon, renderLabel } } = this;
		const createSubmenuItem = () => {
			const { isHorizontal, paddingLeft, collapsed, mergedDisabled, maxIconSize, activeIconSize, title, childActive, icon, handleClick, menuProps: { nodeProps }, dropdownShow, iconMarginRight, tmNode, mergedClsPrefix, isEllipsisPlaceholder, extra } = this;
			const attrs = nodeProps?.(tmNode.rawNode);
			return (0, vue.openBlock)(), (0, vue.createElementBlock)("div", (0, vue.mergeProps)(attrs, {
				class: [`${mergedClsPrefix}-menu-item`, attrs?.class],
				role: "menuitem"
			}), [((0, vue.openBlock)(), (0, vue.createBlock)(require_menu_src_MenuOptionContent, {
				tmNode,
				paddingLeft,
				collapsed,
				disabled: mergedDisabled,
				iconMarginRight,
				maxIconSize,
				activeIconSize,
				title,
				extra,
				showArrow: !isHorizontal,
				childActive,
				clsPrefix: mergedClsPrefix,
				icon,
				hover: dropdownShow,
				onClick: handleClick,
				isEllipsisPlaceholder
			}, null, 8, [
				"tmNode",
				"paddingLeft",
				"collapsed",
				"disabled",
				"iconMarginRight",
				"maxIconSize",
				"activeIconSize",
				"title",
				"extra",
				"showArrow",
				"childActive",
				"clsPrefix",
				"icon",
				"hover",
				"onClick",
				"isEllipsisPlaceholder"
			]))], 16);
		};
		const createSubmenuChildren = () => {
			return (0, vue.openBlock)(), (0, vue.createBlock)(require__internal_fade_in_expand_transition_src_FadeInExpandTransition, null, { default: () => {
				const { tmNodes, collapsed } = this;
				return !collapsed ? ((0, vue.openBlock)(), (0, vue.createElementBlock)("div", {
					key: 1,
					class: require_vdom.normalizeClass(`${mergedClsPrefix}-submenu-children`),
					role: "menu"
				}, [require_vdom.normalizeVNode(() => tmNodes.map((item) => require_menu_src_utils.itemRenderer(item, this.menuProps)))], 2)) : null;
			} }, 1024);
		};
		return this.root ? ((0, vue.openBlock)(), (0, vue.createBlock)(require_dropdown_src_Dropdown.default, (0, vue.mergeProps)({
			key: 2,
			size: "large",
			trigger: "hover"
		}, this.menuProps?.dropdownProps, {
			themeOverrides: this.mergedTheme.peerOverrides.Dropdown,
			theme: this.mergedTheme.peers.Dropdown,
			builtinThemeOverrides: {
				fontSizeLarge: "14px",
				optionIconSizeLarge: "18px"
			},
			value: this.mergedValue,
			disabled: !this.dropdownEnabled,
			placement: this.dropdownPlacement,
			keyField: this.menuProps.keyField,
			labelField: this.menuProps.labelField,
			childrenField: this.menuProps.childrenField,
			onUpdateShow: this.handlePopoverShowChange,
			options: this.rawNodes,
			onSelect: this.doSelect,
			inverted: this.inverted,
			renderIcon,
			renderLabel
		}), { default: () => ((0, vue.openBlock)(), (0, vue.createElementBlock)("div", {
			class: require_vdom.normalizeClass(`${mergedClsPrefix}-submenu`),
			role: "menu",
			"aria-expanded": !this.collapsed,
			id: this.domId
		}, [require_vdom.normalizeVNode(() => createSubmenuItem()), this.isHorizontal ? require_vdom.normalizeVNode(() => null) : ((0, vue.openBlock)(), (0, vue.createElementBlock)(vue.Fragment, { key: 1 }, [require_vdom.normalizeVNode(() => createSubmenuChildren())], 64))], 10, _hoisted_1)) }, 1040, [
			"themeOverrides",
			"theme",
			"value",
			"disabled",
			"placement",
			"keyField",
			"labelField",
			"childrenField",
			"onUpdateShow",
			"options",
			"onSelect",
			"inverted",
			"renderIcon",
			"renderLabel"
		])) : ((0, vue.openBlock)(), (0, vue.createElementBlock)("div", {
			key: 3,
			class: require_vdom.normalizeClass(`${mergedClsPrefix}-submenu`),
			role: "menu",
			"aria-expanded": !this.collapsed,
			id: this.domId
		}, [require_vdom.normalizeVNode(() => createSubmenuItem()), require_vdom.normalizeVNode(() => createSubmenuChildren())], 10, _hoisted_2));
	}
});
//#endregion
exports.NSubmenu = NSubmenu;
exports.submenuPropKeys = submenuPropKeys;
exports.submenuProps = submenuProps;
