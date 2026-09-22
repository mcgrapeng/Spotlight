const require__utils_vue_resolve_slot = require("../../../_utils/vue/resolve-slot.js");
const require__mixins_use_style = require("../../../_mixins/use-style.js");
const require_vdom = require("../../../vue-jsx-vapor/vdom.js");
const require__internal_icon_src_Icon = require("../../icon/src/Icon.js");
const require__internal_icon_switch_transition_src_IconSwitchTransition = require("../../icon-switch-transition/src/IconSwitchTransition.js");
const require__internal_icons_Clear = require("../../icons/Clear.js");
const require__internal_clear_src_styles_index_cssr = require("./styles/index.cssr.js");
let vue = require("vue");
//#region src/_internal/clear/src/Clear.tsx
const _hoisted_1 = ["onClick", "onMousedown"];
var Clear_default = (0, vue.defineComponent)({
	name: "BaseClear",
	props: {
		clsPrefix: {
			type: String,
			required: true
		},
		show: Boolean,
		onClear: Function
	},
	setup(props) {
		require__mixins_use_style("-base-clear", require__internal_clear_src_styles_index_cssr, (0, vue.toRef)(props, "clsPrefix"));
		return { handleMouseDown(e) {
			e.preventDefault();
		} };
	},
	render() {
		const { clsPrefix } = this;
		return (0, vue.openBlock)(), (0, vue.createElementBlock)("div", { class: require_vdom.normalizeClass(`${clsPrefix}-base-clear`) }, [(0, vue.createVNode)(require__internal_icon_switch_transition_src_IconSwitchTransition, null, { default: () => {
			return this.show ? ((0, vue.openBlock)(), (0, vue.createElementBlock)("div", {
				key: "dismiss",
				class: require_vdom.normalizeClass(`${clsPrefix}-base-clear__clear`),
				onClick: this.onClear,
				onMousedown: this.handleMouseDown,
				"data-clear": true
			}, [require_vdom.normalizeVNode(() => require__utils_vue_resolve_slot.resolveSlot(this.$slots.icon, () => [((0, vue.openBlock)(), (0, vue.createBlock)(require__internal_icon_src_Icon, { clsPrefix }, { default: () => ((0, vue.openBlock)(), (0, vue.createBlock)(require__internal_icons_Clear)) }, 1032, ["clsPrefix"]))]))], 42, _hoisted_1)) : ((0, vue.openBlock)(), (0, vue.createElementBlock)("div", {
				key: "icon",
				class: require_vdom.normalizeClass(`${clsPrefix}-base-clear__placeholder`)
			}, [require_vdom.normalizeVNode(() => this.$slots.placeholder?.())], 2));
		} }, 1024)], 2);
	}
});
//#endregion
module.exports = Clear_default;
