const require__utils_vue_render = require("../../_utils/vue/render.js");
const require_vdom = require("../../vue-jsx-vapor/vdom.js");
const require_dropdown_src_context = require("./context.js");
let vue = require("vue");
//#region src/dropdown/src/DropdownGroupHeader.tsx
var DropdownGroupHeader_default = (0, vue.defineComponent)({
	name: "DropdownGroupHeader",
	props: {
		clsPrefix: {
			type: String,
			required: true
		},
		tmNode: {
			type: Object,
			required: true
		}
	},
	setup() {
		const { showIconRef, hasSubmenuRef } = (0, vue.inject)(require_dropdown_src_context.dropdownMenuInjectionKey);
		const { renderLabelRef, labelFieldRef, nodePropsRef, renderOptionRef } = (0, vue.inject)(require_dropdown_src_context.dropdownInjectionKey);
		return {
			labelField: labelFieldRef,
			showIcon: showIconRef,
			hasSubmenu: hasSubmenuRef,
			renderLabel: renderLabelRef,
			nodeProps: nodePropsRef,
			renderOption: renderOptionRef
		};
	},
	render() {
		const { clsPrefix, hasSubmenu, showIcon, nodeProps, renderLabel, renderOption } = this;
		const { rawNode } = this.tmNode;
		const node = ((0, vue.openBlock)(), (0, vue.createElementBlock)("div", (0, vue.mergeProps)({ class: `${clsPrefix}-dropdown-option` }, nodeProps?.(rawNode)), [(0, vue.createElementVNode)("div", { class: require_vdom.normalizeClass(`${clsPrefix}-dropdown-option-body ${clsPrefix}-dropdown-option-body--group`) }, [
			(0, vue.createElementVNode)("div", {
				"data-dropdown-option": true,
				class: require_vdom.normalizeClass([`${clsPrefix}-dropdown-option-body__prefix`, showIcon && `${clsPrefix}-dropdown-option-body__prefix--show-icon`])
			}, [require_vdom.normalizeVNode(() => require__utils_vue_render.render(rawNode.icon))], 2),
			(0, vue.createElementVNode)("div", {
				class: require_vdom.normalizeClass(`${clsPrefix}-dropdown-option-body__label`),
				"data-dropdown-option": true
			}, [renderLabel ? ((0, vue.openBlock)(), (0, vue.createElementBlock)(vue.Fragment, { key: 0 }, [require_vdom.normalizeVNode(() => renderLabel(rawNode))], 64)) : ((0, vue.openBlock)(), (0, vue.createElementBlock)(vue.Fragment, { key: 1 }, [require_vdom.normalizeVNode(() => require__utils_vue_render.render(rawNode.title ?? rawNode[this.labelField]))], 64))], 2),
			(0, vue.createElementVNode)("div", {
				class: require_vdom.normalizeClass([`${clsPrefix}-dropdown-option-body__suffix`, hasSubmenu && `${clsPrefix}-dropdown-option-body__suffix--has-submenu`]),
				"data-dropdown-option": true
			}, null, 2)
		], 2)], 16));
		if (renderOption) return renderOption({
			node,
			option: rawNode
		});
		return node;
	}
});
//#endregion
module.exports = DropdownGroupHeader_default;
