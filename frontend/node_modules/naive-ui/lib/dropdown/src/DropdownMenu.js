const require_drawer_src_interface = require("../../drawer/src/interface.js");
const require_modal_src_interface = require("../../modal/src/interface.js");
const require_popover_src_interface = require("../../popover/src/interface.js");
const require_vdom = require("../../vue-jsx-vapor/vdom.js");
const require__internal_scrollbar_src_Scrollbar = require("../../_internal/scrollbar/src/Scrollbar.js");
const require_popover_src_PopoverBody = require("../../popover/src/PopoverBody.js");
const require_dropdown_src_context = require("./context.js");
const require_dropdown_src_DropdownDivider = require("./DropdownDivider.js");
const require_dropdown_src_utils = require("./utils.js");
const require_dropdown_src_DropdownOption = require("./DropdownOption.js");
const require_dropdown_src_DropdownGroup = require("./DropdownGroup.js");
const require_dropdown_src_DropdownRenderOption = require("./DropdownRenderOption.js");
let vue = require("vue");
//#region src/dropdown/src/DropdownMenu.tsx
var DropdownMenu_default = (0, vue.defineComponent)({
	name: "DropdownMenu",
	props: {
		scrollable: Boolean,
		showArrow: Boolean,
		arrowStyle: [String, Object],
		clsPrefix: {
			type: String,
			required: true
		},
		tmNodes: {
			type: Array,
			default: () => []
		},
		parentKey: {
			type: [String, Number],
			default: null
		}
	},
	setup(props) {
		const { renderIconRef, childrenFieldRef } = (0, vue.inject)(require_dropdown_src_context.dropdownInjectionKey);
		(0, vue.provide)(require_dropdown_src_context.dropdownMenuInjectionKey, {
			showIconRef: (0, vue.computed)(() => {
				const renderIcon = renderIconRef.value;
				return props.tmNodes.some((tmNode) => {
					if (tmNode.isGroup) return tmNode.children?.some(({ rawNode: rawChild }) => renderIcon ? renderIcon(rawChild) : rawChild.icon);
					const { rawNode } = tmNode;
					return renderIcon ? renderIcon(rawNode) : rawNode.icon;
				});
			}),
			hasSubmenuRef: (0, vue.computed)(() => {
				const { value: childrenField } = childrenFieldRef;
				return props.tmNodes.some((tmNode) => {
					if (tmNode.isGroup) return tmNode.children?.some(({ rawNode: rawChild }) => require_dropdown_src_utils.isSubmenuNode(rawChild, childrenField));
					const { rawNode } = tmNode;
					return require_dropdown_src_utils.isSubmenuNode(rawNode, childrenField);
				});
			})
		});
		const bodyRef = (0, vue.ref)(null);
		(0, vue.provide)(require_modal_src_interface.modalBodyInjectionKey, null);
		(0, vue.provide)(require_drawer_src_interface.drawerBodyInjectionKey, null);
		(0, vue.provide)(require_popover_src_interface.popoverBodyInjectionKey, bodyRef);
		return { bodyRef };
	},
	render() {
		const { parentKey, clsPrefix, scrollable } = this;
		const menuOptionsNode = this.tmNodes.map((tmNode) => {
			const { rawNode } = tmNode;
			if (rawNode.show === false) return null;
			if (require_dropdown_src_utils.isRenderNode(rawNode)) return (0, vue.openBlock)(), (0, vue.createBlock)(require_dropdown_src_DropdownRenderOption, {
				tmNode,
				key: tmNode.key
			}, null, 8, ["tmNode"]);
			if (require_dropdown_src_utils.isDividerNode(rawNode)) return (0, vue.openBlock)(), (0, vue.createBlock)(require_dropdown_src_DropdownDivider, {
				clsPrefix,
				key: tmNode.key
			}, null, 8, ["clsPrefix"]);
			if (require_dropdown_src_utils.isGroupNode(rawNode)) return (0, vue.openBlock)(), (0, vue.createBlock)(require_dropdown_src_DropdownGroup, {
				clsPrefix,
				tmNode,
				parentKey,
				key: tmNode.key
			}, null, 8, [
				"clsPrefix",
				"tmNode",
				"parentKey"
			]);
			return (0, vue.openBlock)(), (0, vue.createBlock)(require_dropdown_src_DropdownOption, {
				clsPrefix,
				tmNode,
				parentKey,
				key: tmNode.key,
				props: rawNode.props,
				scrollable
			}, null, 8, [
				"clsPrefix",
				"tmNode",
				"parentKey",
				"props",
				"scrollable"
			]);
		});
		return (0, vue.openBlock)(), (0, vue.createElementBlock)("div", {
			class: require_vdom.normalizeClass([`${clsPrefix}-dropdown-menu`, scrollable && `${clsPrefix}-dropdown-menu--scrollable`]),
			ref: "bodyRef"
		}, [scrollable ? ((0, vue.openBlock)(), (0, vue.createBlock)(require__internal_scrollbar_src_Scrollbar.XScrollbar, {
			key: 0,
			contentClass: `${clsPrefix}-dropdown-menu__content`
		}, { default: () => menuOptionsNode }, 1032, ["contentClass"])) : ((0, vue.openBlock)(), (0, vue.createElementBlock)(vue.Fragment, { key: 1 }, [require_vdom.normalizeVNode(() => menuOptionsNode)], 64)), this.showArrow ? ((0, vue.openBlock)(), (0, vue.createElementBlock)(vue.Fragment, { key: 2 }, [require_vdom.normalizeVNode(() => require_popover_src_PopoverBody.renderArrow({
			clsPrefix,
			arrowStyle: this.arrowStyle,
			arrowClass: void 0,
			arrowWrapperClass: void 0,
			arrowWrapperStyle: void 0
		}))], 64)) : require_vdom.normalizeVNode(() => null)], 2);
	}
});
//#endregion
module.exports = DropdownMenu_default;
