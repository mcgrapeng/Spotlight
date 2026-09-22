const require_vdom = require("../../vue-jsx-vapor/vdom.js");
const require__internal_fade_in_expand_transition_src_FadeInExpandTransition = require("../../_internal/fade-in-expand-transition/src/FadeInExpandTransition.js");
let vue = require("vue");
let vooks = require("vooks");
//#region src/collapse/src/CollapseItemContent.tsx
var CollapseItemContent_default = (0, vue.defineComponent)({
	name: "CollapseItemContent",
	props: {
		displayDirective: {
			type: String,
			required: true
		},
		show: Boolean,
		clsPrefix: {
			type: String,
			required: true
		}
	},
	setup(props) {
		return { onceTrue: (0, vooks.useFalseUntilTruthy)((0, vue.toRef)(props, "show")) };
	},
	render() {
		return (0, vue.openBlock)(), (0, vue.createBlock)(require__internal_fade_in_expand_transition_src_FadeInExpandTransition, null, {
			_: 1,
			default: require_vdom.normalizeSlot(() => {
				const { show, displayDirective, onceTrue, clsPrefix } = this;
				const useVShow = displayDirective === "show" && onceTrue;
				const contentNode = ((0, vue.openBlock)(), (0, vue.createElementBlock)("div", { class: require_vdom.normalizeClass(`${clsPrefix}-collapse-item__content-wrapper`) }, [(0, vue.createElementVNode)("div", { class: require_vdom.normalizeClass(`${clsPrefix}-collapse-item__content-inner`) }, [require_vdom.normalizeVNode(() => this.$slots.default?.())], 2)], 2));
				return useVShow ? (0, vue.withDirectives)(contentNode, [[vue.vShow, show]]) : show ? contentNode : null;
			})
		});
	}
});
//#endregion
module.exports = CollapseItemContent_default;
