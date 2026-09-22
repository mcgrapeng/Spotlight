const require__internal_select_menu_src_interface = require("./interface.js");
const require__utils_vue_render = require("../../../_utils/vue/render.js");
const require_vdom = require("../../../vue-jsx-vapor/vdom.js");
let vue = require("vue");
//#region src/_internal/select-menu/src/SelectGroupHeader.tsx
var SelectGroupHeader_default = (0, vue.defineComponent)({
	name: "NBaseSelectGroupHeader",
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
		const { renderLabelRef, renderOptionRef, labelFieldRef, nodePropsRef } = (0, vue.inject)(require__internal_select_menu_src_interface.internalSelectionMenuInjectionKey);
		return {
			labelField: labelFieldRef,
			nodeProps: nodePropsRef,
			renderLabel: renderLabelRef,
			renderOption: renderOptionRef
		};
	},
	render() {
		const { clsPrefix, renderLabel, renderOption, nodeProps, tmNode: { rawNode } } = this;
		const attrs = nodeProps?.(rawNode);
		const children = renderLabel ? renderLabel(rawNode, false) : require__utils_vue_render.render(rawNode[this.labelField], rawNode, false);
		const node = ((0, vue.openBlock)(), (0, vue.createElementBlock)("div", (0, vue.mergeProps)(attrs, { class: [`${clsPrefix}-base-select-group-header`, attrs?.class] }), [require_vdom.normalizeVNode(() => children)], 16));
		return rawNode.render ? rawNode.render({
			node,
			option: rawNode
		}) : renderOption ? renderOption({
			node,
			option: rawNode,
			selected: false
		}) : node;
	}
});
//#endregion
module.exports = SelectGroupHeader_default;
