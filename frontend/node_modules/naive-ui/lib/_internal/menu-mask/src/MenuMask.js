const require__mixins_use_style = require("../../../_mixins/use-style.js");
const require_vdom = require("../../../vue-jsx-vapor/vdom.js");
const require__internal_menu_mask_src_styles_index_cssr = require("./styles/index.cssr.js");
let vue = require("vue");
//#region src/_internal/menu-mask/src/MenuMask.tsx
var MenuMask_default = (0, vue.defineComponent)({
	name: "BaseMenuMask",
	props: { clsPrefix: {
		type: String,
		required: true
	} },
	setup(props) {
		require__mixins_use_style("-base-menu-mask", require__internal_menu_mask_src_styles_index_cssr, (0, vue.toRef)(props, "clsPrefix"));
		const messageRef = (0, vue.ref)(null);
		let timerId = null;
		const uncontrolledShowRef = (0, vue.ref)(false);
		(0, vue.onBeforeUnmount)(() => {
			if (timerId !== null) window.clearTimeout(timerId);
		});
		return {
			message: messageRef,
			show: uncontrolledShowRef,
			showOnce(message, duration = 1500) {
				if (timerId) window.clearTimeout(timerId);
				uncontrolledShowRef.value = true;
				messageRef.value = message;
				timerId = window.setTimeout(() => {
					uncontrolledShowRef.value = false;
					messageRef.value = null;
				}, duration);
			}
		};
	},
	render() {
		return (0, vue.openBlock)(), (0, vue.createBlock)(vue.Transition, { name: "fade-in-transition" }, {
			_: 1,
			default: require_vdom.normalizeSlot(() => this.show ? ((0, vue.openBlock)(), (0, vue.createElementBlock)("div", {
				key: 1,
				class: require_vdom.normalizeClass(`${this.clsPrefix}-base-menu-mask`)
			}, [require_vdom.normalizeVNode(() => this.message)], 2)) : null)
		});
	}
});
//#endregion
module.exports = MenuMask_default;
