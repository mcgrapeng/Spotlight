const require__mixins_use_style = require("../../../_mixins/use-style.js");
const require_vdom = require("../../../vue-jsx-vapor/vdom.js");
const require__internal_icon_src_styles_index_cssr = require("./styles/index.cssr.js");
let vue = require("vue");
//#region src/_internal/icon/src/Icon.tsx
const _hoisted_1 = [
	"onClick",
	"onMousedown",
	"onMouseup",
	"role",
	"aria-label",
	"aria-hidden",
	"aria-disabled"
];
var Icon_default = (0, vue.defineComponent)({
	name: "BaseIcon",
	props: {
		role: String,
		ariaLabel: String,
		ariaDisabled: {
			type: Boolean,
			default: void 0
		},
		ariaHidden: {
			type: Boolean,
			default: void 0
		},
		clsPrefix: {
			type: String,
			required: true
		},
		onClick: Function,
		onMousedown: Function,
		onMouseup: Function
	},
	setup(props) {
		require__mixins_use_style("-base-icon", require__internal_icon_src_styles_index_cssr, (0, vue.toRef)(props, "clsPrefix"));
	},
	render() {
		return (0, vue.openBlock)(), (0, vue.createElementBlock)("i", {
			class: require_vdom.normalizeClass(`${this.clsPrefix}-base-icon`),
			onClick: this.onClick,
			onMousedown: this.onMousedown,
			onMouseup: this.onMouseup,
			role: this.role,
			"aria-label": this.ariaLabel,
			"aria-hidden": this.ariaHidden,
			"aria-disabled": this.ariaDisabled
		}, [require_vdom.normalizeVNode(() => this.$slots.default?.())], 42, _hoisted_1);
	}
});
//#endregion
module.exports = Icon_default;
