const require_vdom = require("../../vue-jsx-vapor/vdom.js");
const require__internal_fade_in_expand_transition_src_FadeInExpandTransition = require("../../_internal/fade-in-expand-transition/src/FadeInExpandTransition.js");
const require_tree_src_TreeNode = require("./TreeNode.js");
let seemly = require("seemly");
let vue = require("vue");
//#region src/tree/src/MotionWrapper.tsx
var MotionWrapper_default = (0, vue.defineComponent)({
	name: "TreeMotionWrapper",
	props: {
		clsPrefix: {
			type: String,
			required: true
		},
		height: Number,
		nodes: {
			type: Array,
			required: true
		},
		mode: {
			type: String,
			required: true
		},
		onAfterEnter: {
			type: Function,
			required: true
		}
	},
	render() {
		const { clsPrefix } = this;
		return (0, vue.openBlock)(), (0, vue.createBlock)(require__internal_fade_in_expand_transition_src_FadeInExpandTransition, {
			onAfterEnter: this.onAfterEnter,
			appear: true,
			reverse: this.mode === "collapse"
		}, { default: () => ((0, vue.openBlock)(), (0, vue.createElementBlock)("div", {
			class: require_vdom.normalizeClass([`${clsPrefix}-tree-motion-wrapper`, `${clsPrefix}-tree-motion-wrapper--${this.mode}`]),
			style: (0, vue.normalizeStyle)({ height: (0, seemly.pxfy)(this.height) })
		}, [require_vdom.normalizeVNode(() => this.nodes.map((node) => ((0, vue.openBlock)(), (0, vue.createBlock)(require_tree_src_TreeNode, {
			clsPrefix,
			tmNode: node
		}, null, 8, ["clsPrefix", "tmNode"]))))], 6)) }, 1032, ["onAfterEnter", "reverse"]);
	}
});
//#endregion
module.exports = MotionWrapper_default;
