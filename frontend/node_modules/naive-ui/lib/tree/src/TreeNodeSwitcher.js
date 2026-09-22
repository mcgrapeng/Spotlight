const require_vdom = require("../../vue-jsx-vapor/vdom.js");
const require__internal_icon_src_Icon = require("../../_internal/icon/src/Icon.js");
const require__internal_icon_switch_transition_src_IconSwitchTransition = require("../../_internal/icon-switch-transition/src/IconSwitchTransition.js");
const require__internal_icons_Switcher = require("../../_internal/icons/Switcher.js");
const require__internal_loading_src_Loading = require("../../_internal/loading/src/Loading.js");
const require_tree_src_interface = require("./interface.js");
let vue = require("vue");
//#region src/tree/src/TreeNodeSwitcher.tsx
const _hoisted_1 = ["onClick"];
var TreeNodeSwitcher_default = (0, vue.defineComponent)({
	name: "NTreeSwitcher",
	props: {
		clsPrefix: {
			type: String,
			required: true
		},
		indent: {
			type: Number,
			required: true
		},
		expanded: Boolean,
		selected: Boolean,
		hide: Boolean,
		loading: Boolean,
		onClick: Function,
		tmNode: {
			type: Object,
			required: true
		}
	},
	setup(props) {
		const { renderSwitcherIconRef, spinPropsRef } = (0, vue.inject)(require_tree_src_interface.treeInjectionKey, null);
		return () => {
			const { clsPrefix, expanded, hide, indent, onClick } = props;
			return (0, vue.openBlock)(), (0, vue.createElementBlock)("span", {
				"data-switcher": true,
				class: require_vdom.normalizeClass([
					`${clsPrefix}-tree-node-switcher`,
					expanded && `${clsPrefix}-tree-node-switcher--expanded`,
					hide && `${clsPrefix}-tree-node-switcher--hide`
				]),
				style: (0, vue.normalizeStyle)({ width: `${indent}px` }),
				onClick
			}, [(0, vue.createElementVNode)("div", { class: require_vdom.normalizeClass(`${clsPrefix}-tree-node-switcher__icon`) }, [(0, vue.createVNode)(require__internal_icon_switch_transition_src_IconSwitchTransition, null, { default: () => {
				if (props.loading) return (0, vue.openBlock)(), (0, vue.createBlock)(require__internal_loading_src_Loading.default, (0, vue.mergeProps)({
					clsPrefix,
					key: "loading",
					radius: 85,
					strokeWidth: 20
				}, spinPropsRef?.value), null, 16, ["clsPrefix"]);
				const { value: renderSwitcherIcon } = renderSwitcherIconRef;
				return renderSwitcherIcon ? renderSwitcherIcon({
					expanded: props.expanded,
					selected: props.selected,
					option: props.tmNode.rawNode
				}) : ((0, vue.openBlock)(), (0, vue.createBlock)(require__internal_icon_src_Icon, {
					clsPrefix,
					key: "switcher"
				}, { default: () => ((0, vue.openBlock)(), (0, vue.createBlock)(require__internal_icons_Switcher)) }, 1032, ["clsPrefix"]));
			} }, 1024)], 2)], 14, _hoisted_1);
		};
	}
});
//#endregion
module.exports = TreeNodeSwitcher_default;
