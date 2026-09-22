const require_popover_src_interface = require("../../popover/src/interface.js");
const require__utils_composable_use_deferred_true = require("../../_utils/composable/use-deferred-true.js");
const require__utils_vue_render = require("../../_utils/vue/render.js");
const require_vdom = require("../../vue-jsx-vapor/vdom.js");
const require__internal_icons_ChevronRight = require("../../_internal/icons/ChevronRight.js");
const require_dropdown_src_context = require("./context.js");
const require_icon_src_Icon = require("../../icon/src/Icon.js");
const require_dropdown_src_utils = require("./utils.js");
const require_dropdown_src_DropdownMenu = require("./DropdownMenu.js");
let seemly = require("seemly");
let vue = require("vue");
let vooks = require("vooks");
let vueuc = require("vueuc");
//#region src/dropdown/src/DropdownOption.tsx
var DropdownOption_default = (0, vue.defineComponent)({
	name: "DropdownOption",
	props: {
		clsPrefix: {
			type: String,
			required: true
		},
		tmNode: {
			type: Object,
			required: true
		},
		parentKey: {
			type: [String, Number],
			default: null
		},
		placement: {
			type: String,
			default: "right-start"
		},
		props: Object,
		scrollable: Boolean
	},
	setup(props) {
		const NDropdown = (0, vue.inject)(require_dropdown_src_context.dropdownInjectionKey);
		const { hoverKeyRef, keyboardKeyRef, lastToggledSubmenuKeyRef, pendingKeyPathRef, activeKeyPathRef, animatedRef, mergedShowRef, renderLabelRef, renderIconRef, labelFieldRef, childrenFieldRef, renderOptionRef, nodePropsRef, menuPropsRef } = NDropdown;
		const NDropdownOption = (0, vue.inject)(require_dropdown_src_context.dropdownOptionInjectionKey, null);
		const NDropdownMenu = (0, vue.inject)(require_dropdown_src_context.dropdownMenuInjectionKey);
		const NPopoverBody = (0, vue.inject)(require_popover_src_interface.popoverBodyInjectionKey);
		const rawNodeRef = (0, vue.computed)(() => props.tmNode.rawNode);
		const hasSubmenuRef = (0, vue.computed)(() => {
			const { value: childrenField } = childrenFieldRef;
			return require_dropdown_src_utils.isSubmenuNode(props.tmNode.rawNode, childrenField);
		});
		const mergedDisabledRef = (0, vue.computed)(() => {
			const { disabled } = props.tmNode;
			return disabled;
		});
		const showSubmenuRef = (0, vue.computed)(() => {
			if (!hasSubmenuRef.value) return false;
			const { key, disabled } = props.tmNode;
			if (disabled) return false;
			const { value: hoverKey } = hoverKeyRef;
			const { value: keyboardKey } = keyboardKeyRef;
			const { value: lastToggledSubmenuKey } = lastToggledSubmenuKeyRef;
			const { value: pendingKeyPath } = pendingKeyPathRef;
			if (hoverKey !== null) return pendingKeyPath.includes(key);
			if (keyboardKey !== null) return pendingKeyPath.includes(key) && pendingKeyPath[pendingKeyPath.length - 1] !== key;
			if (lastToggledSubmenuKey !== null) return pendingKeyPath.includes(key);
			return false;
		});
		const shouldDelayRef = (0, vue.computed)(() => {
			return keyboardKeyRef.value === null && !animatedRef.value;
		});
		const deferredShowSubmenuRef = require__utils_composable_use_deferred_true.useDeferredTrue(showSubmenuRef, 300, shouldDelayRef);
		const parentEnteringSubmenuRef = (0, vue.computed)(() => {
			return !!NDropdownOption?.enteringSubmenuRef.value;
		});
		const enteringSubmenuRef = (0, vue.ref)(false);
		(0, vue.provide)(require_dropdown_src_context.dropdownOptionInjectionKey, { enteringSubmenuRef });
		function handleSubmenuBeforeEnter() {
			enteringSubmenuRef.value = true;
		}
		function handleSubmenuAfterEnter() {
			enteringSubmenuRef.value = false;
		}
		function handleMouseEnter() {
			const { parentKey, tmNode } = props;
			if (tmNode.disabled) return;
			if (!mergedShowRef.value) return;
			lastToggledSubmenuKeyRef.value = parentKey;
			keyboardKeyRef.value = null;
			hoverKeyRef.value = tmNode.key;
		}
		function handleMouseMove() {
			const { tmNode } = props;
			if (tmNode.disabled) return;
			if (!mergedShowRef.value) return;
			if (hoverKeyRef.value === tmNode.key) return;
			handleMouseEnter();
		}
		function handleMouseLeave(e) {
			if (props.tmNode.disabled) return;
			if (!mergedShowRef.value) return;
			const { relatedTarget } = e;
			if (relatedTarget && !(0, seemly.happensIn)({ target: relatedTarget }, "dropdownOption") && !(0, seemly.happensIn)({ target: relatedTarget }, "scrollbarRail")) hoverKeyRef.value = null;
		}
		function handleClick() {
			const { value: hasSubmenu } = hasSubmenuRef;
			const { tmNode } = props;
			if (!mergedShowRef.value) return;
			if (!hasSubmenu && !tmNode.disabled) {
				NDropdown.doSelect(tmNode.key, tmNode.rawNode);
				NDropdown.doUpdateShow(false);
			}
		}
		return {
			labelField: labelFieldRef,
			renderLabel: renderLabelRef,
			renderIcon: renderIconRef,
			siblingHasIcon: NDropdownMenu.showIconRef,
			siblingHasSubmenu: NDropdownMenu.hasSubmenuRef,
			menuProps: menuPropsRef,
			popoverBody: NPopoverBody,
			animated: animatedRef,
			mergedShowSubmenu: (0, vue.computed)(() => {
				return deferredShowSubmenuRef.value && !parentEnteringSubmenuRef.value;
			}),
			rawNode: rawNodeRef,
			hasSubmenu: hasSubmenuRef,
			pending: (0, vooks.useMemo)(() => {
				const { value: pendingKeyPath } = pendingKeyPathRef;
				const { key } = props.tmNode;
				return pendingKeyPath.includes(key);
			}),
			childActive: (0, vooks.useMemo)(() => {
				const { value: activeKeyPath } = activeKeyPathRef;
				const { key } = props.tmNode;
				const index = activeKeyPath.findIndex((k) => key === k);
				if (index === -1) return false;
				return index < activeKeyPath.length - 1;
			}),
			active: (0, vooks.useMemo)(() => {
				const { value: activeKeyPath } = activeKeyPathRef;
				const { key } = props.tmNode;
				const index = activeKeyPath.findIndex((k) => key === k);
				if (index === -1) return false;
				return index === activeKeyPath.length - 1;
			}),
			mergedDisabled: mergedDisabledRef,
			renderOption: renderOptionRef,
			nodeProps: nodePropsRef,
			handleClick,
			handleMouseMove,
			handleMouseEnter,
			handleMouseLeave,
			handleSubmenuBeforeEnter,
			handleSubmenuAfterEnter
		};
	},
	render() {
		const { animated, rawNode, mergedShowSubmenu, clsPrefix, siblingHasIcon, siblingHasSubmenu, renderLabel, renderIcon, renderOption, nodeProps, props, scrollable } = this;
		let submenuVNode = null;
		if (mergedShowSubmenu) {
			const submenuNodeProps = this.menuProps?.(rawNode, rawNode.children);
			submenuVNode = ((submenuVNode) => {
				return (0, vue.openBlock)(), (0, vue.createBlock)(require_dropdown_src_DropdownMenu, (0, vue.mergeProps)({ key: 1 }, submenuNodeProps, {
					clsPrefix,
					scrollable: this.scrollable,
					tmNodes: this.tmNode.children,
					parentKey: this.tmNode.key
				}), null, 16, [
					"clsPrefix",
					"scrollable",
					"tmNodes",
					"parentKey"
				]);
			})(submenuVNode);
		}
		const builtinProps = {
			class: [
				`${clsPrefix}-dropdown-option-body`,
				this.pending && `${clsPrefix}-dropdown-option-body--pending`,
				this.active && `${clsPrefix}-dropdown-option-body--active`,
				this.childActive && `${clsPrefix}-dropdown-option-body--child-active`,
				this.mergedDisabled && `${clsPrefix}-dropdown-option-body--disabled`
			],
			onMousemove: this.handleMouseMove,
			onMouseenter: this.handleMouseEnter,
			onMouseleave: this.handleMouseLeave,
			onClick: this.handleClick
		};
		const optionNodeProps = nodeProps?.(rawNode);
		const node = ((0, vue.openBlock)(), (0, vue.createElementBlock)("div", (0, vue.mergeProps)({
			class: [`${clsPrefix}-dropdown-option`, optionNodeProps?.class],
			"data-dropdown-option": true
		}, optionNodeProps), [require_vdom.normalizeVNode(() => (0, vue.h)("div", (0, vue.mergeProps)(builtinProps, props), [
			((0, vue.openBlock)(), (0, vue.createElementBlock)("div", { class: require_vdom.normalizeClass([`${clsPrefix}-dropdown-option-body__prefix`, siblingHasIcon && `${clsPrefix}-dropdown-option-body__prefix--show-icon`]) }, [require_vdom.normalizeVNode(() => [renderIcon ? renderIcon(rawNode) : require__utils_vue_render.render(rawNode.icon)])], 2)),
			((0, vue.openBlock)(), (0, vue.createElementBlock)("div", {
				"data-dropdown-option": true,
				class: require_vdom.normalizeClass(`${clsPrefix}-dropdown-option-body__label`)
			}, [renderLabel ? ((0, vue.openBlock)(), (0, vue.createElementBlock)(vue.Fragment, { key: 0 }, [require_vdom.normalizeVNode(() => renderLabel(rawNode))], 64)) : ((0, vue.openBlock)(), (0, vue.createElementBlock)(vue.Fragment, { key: 1 }, [require_vdom.normalizeVNode(() => require__utils_vue_render.render(rawNode[this.labelField] ?? rawNode.title))], 64))], 2)),
			((0, vue.openBlock)(), (0, vue.createElementBlock)("div", {
				"data-dropdown-option": true,
				class: require_vdom.normalizeClass([`${clsPrefix}-dropdown-option-body__suffix`, siblingHasSubmenu && `${clsPrefix}-dropdown-option-body__suffix--has-submenu`])
			}, [this.hasSubmenu ? ((0, vue.openBlock)(), (0, vue.createBlock)(require_icon_src_Icon.NIcon, { key: 0 }, {
				_: 1,
				default: require_vdom.normalizeSlot(() => ((0, vue.openBlock)(), (0, vue.createBlock)(require__internal_icons_ChevronRight)))
			})) : require_vdom.normalizeVNode(() => null)], 2))
		])), this.hasSubmenu ? ((0, vue.openBlock)(), (0, vue.createBlock)(vueuc.VBinder, { key: 0 }, { default: () => [((0, vue.openBlock)(), (0, vue.createBlock)(vueuc.VTarget, null, { default: () => ((0, vue.openBlock)(), (0, vue.createElementBlock)("div", { class: require_vdom.normalizeClass(`${clsPrefix}-dropdown-offset-container`) }, [((0, vue.openBlock)(), (0, vue.createBlock)(vueuc.VFollower, {
			show: this.mergedShowSubmenu,
			placement: this.placement,
			to: scrollable ? this.popoverBody || void 0 : void 0,
			teleportDisabled: !scrollable
		}, { default: () => {
			return (0, vue.openBlock)(), (0, vue.createElementBlock)("div", { class: require_vdom.normalizeClass(`${clsPrefix}-dropdown-menu-wrapper`) }, [animated ? ((0, vue.openBlock)(), (0, vue.createBlock)(vue.Transition, {
				key: 0,
				onBeforeEnter: this.handleSubmenuBeforeEnter,
				onAfterEnter: this.handleSubmenuAfterEnter,
				name: "fade-in-scale-up-transition",
				appear: true
			}, { default: () => submenuVNode }, 1032, ["onBeforeEnter", "onAfterEnter"])) : ((0, vue.openBlock)(), (0, vue.createElementBlock)(vue.Fragment, { key: 1 }, [require_vdom.normalizeVNode(() => submenuVNode)], 64))], 2);
		} }, 1032, [
			"show",
			"placement",
			"to",
			"teleportDisabled"
		]))], 2)) }, 1024))] }, 1024)) : require_vdom.normalizeVNode(() => null)], 16));
		if (renderOption) return renderOption({
			node,
			option: rawNode
		});
		return node;
	}
});
//#endregion
module.exports = DropdownOption_default;
