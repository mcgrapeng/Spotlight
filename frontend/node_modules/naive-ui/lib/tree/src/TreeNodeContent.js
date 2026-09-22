const require__utils_vue_render = require("../../_utils/vue/render.js");
const require_vdom = require("../../vue-jsx-vapor/vdom.js");
const require_tree_src_interface = require("./interface.js");
let vue = require("vue");
//#region src/tree/src/TreeNodeContent.tsx
const _hoisted_1 = [
	"onClick",
	"draggable",
	"onDragstart"
];
var TreeNodeContent_default = (0, vue.defineComponent)({
	name: "TreeNodeContent",
	props: {
		clsPrefix: {
			type: String,
			required: true
		},
		disabled: Boolean,
		checked: Boolean,
		selected: Boolean,
		onClick: Function,
		onDragstart: Function,
		tmNode: {
			type: Object,
			required: true
		},
		nodeProps: Object
	},
	setup(props) {
		const { renderLabelRef, renderPrefixRef, renderSuffixRef, labelFieldRef } = (0, vue.inject)(require_tree_src_interface.treeInjectionKey);
		const selfRef = (0, vue.ref)(null);
		function doClick(e) {
			const { onClick } = props;
			if (onClick) onClick(e);
		}
		function handleClick(e) {
			doClick(e);
		}
		return {
			selfRef,
			renderLabel: renderLabelRef,
			renderPrefix: renderPrefixRef,
			renderSuffix: renderSuffixRef,
			labelField: labelFieldRef,
			handleClick
		};
	},
	render() {
		const { clsPrefix, labelField, nodeProps, checked = false, selected = false, renderLabel, renderPrefix, renderSuffix, handleClick, onDragstart, tmNode: { rawNode, rawNode: { prefix, suffix, [labelField]: label } } } = this;
		return (0, vue.openBlock)(), (0, vue.createElementBlock)("span", (0, vue.mergeProps)(nodeProps, {
			ref: "selfRef",
			class: [`${clsPrefix}-tree-node-content`, nodeProps?.class],
			onClick: handleClick,
			draggable: onDragstart === void 0 ? void 0 : true,
			onDragstart
		}), [
			renderPrefix || prefix ? ((0, vue.openBlock)(), (0, vue.createElementBlock)("div", {
				key: 0,
				class: require_vdom.normalizeClass(`${clsPrefix}-tree-node-content__prefix`)
			}, [renderPrefix ? ((0, vue.openBlock)(), (0, vue.createElementBlock)(vue.Fragment, { key: 0 }, [require_vdom.normalizeVNode(() => renderPrefix({
				option: rawNode,
				selected,
				checked
			}))], 64)) : ((0, vue.openBlock)(), (0, vue.createElementBlock)(vue.Fragment, { key: 1 }, [require_vdom.normalizeVNode(() => require__utils_vue_render.render(prefix))], 64))], 2)) : require_vdom.normalizeVNode(() => null),
			(0, vue.createElementVNode)("div", { class: require_vdom.normalizeClass(`${clsPrefix}-tree-node-content__text`) }, [renderLabel ? ((0, vue.openBlock)(), (0, vue.createElementBlock)(vue.Fragment, { key: 0 }, [require_vdom.normalizeVNode(() => renderLabel({
				option: rawNode,
				selected,
				checked
			}))], 64)) : ((0, vue.openBlock)(), (0, vue.createElementBlock)(vue.Fragment, { key: 1 }, [require_vdom.normalizeVNode(() => require__utils_vue_render.render(label))], 64))], 2),
			renderSuffix || suffix ? ((0, vue.openBlock)(), (0, vue.createElementBlock)("div", {
				key: 2,
				class: require_vdom.normalizeClass(`${clsPrefix}-tree-node-content__suffix`)
			}, [renderSuffix ? ((0, vue.openBlock)(), (0, vue.createElementBlock)(vue.Fragment, { key: 0 }, [require_vdom.normalizeVNode(() => renderSuffix({
				option: rawNode,
				selected,
				checked
			}))], 64)) : ((0, vue.openBlock)(), (0, vue.createElementBlock)(vue.Fragment, { key: 1 }, [require_vdom.normalizeVNode(() => require__utils_vue_render.render(suffix))], 64))], 2)) : require_vdom.normalizeVNode(() => null)
		], 16, _hoisted_1);
	}
});
//#endregion
module.exports = TreeNodeContent_default;
