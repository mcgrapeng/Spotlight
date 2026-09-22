const require_vdom = require("../../vue-jsx-vapor/vdom.js");
const require_color_picker_src_utils = require("./utils.js");
let vue = require("vue");
//#region src/color-picker/src/ColorPreview.tsx
const _hoisted_1 = ["value", "onChange"];
var ColorPreview_default = (0, vue.defineComponent)({
	name: "ColorPreview",
	props: {
		clsPrefix: {
			type: String,
			required: true
		},
		mode: {
			type: String,
			required: true
		},
		color: {
			type: String,
			default: null,
			validator: (value) => {
				const mode = require_color_picker_src_utils.getModeFromValue(value);
				return Boolean(!value || mode && mode !== "hsv");
			}
		},
		onUpdateColor: {
			type: Function,
			required: true
		}
	},
	setup(props) {
		function handleChange(e) {
			const value = e.target.value;
			props.onUpdateColor?.(require_color_picker_src_utils.convertColor(value.toUpperCase(), props.mode, "hex"));
			e.stopPropagation();
		}
		return { handleChange };
	},
	render() {
		const { clsPrefix } = this;
		return (0, vue.openBlock)(), (0, vue.createElementBlock)("div", { class: require_vdom.normalizeClass(`${clsPrefix}-color-picker-preview__preview`) }, [(0, vue.createElementVNode)("span", {
			class: require_vdom.normalizeClass(`${clsPrefix}-color-picker-preview__fill`),
			style: (0, vue.normalizeStyle)({ background: this.color || "#000000" })
		}, null, 6), (0, vue.createElementVNode)("input", {
			class: require_vdom.normalizeClass(`${clsPrefix}-color-picker-preview__input`),
			type: "color",
			value: this.color,
			onChange: this.handleChange
		}, null, 42, _hoisted_1)], 2);
	}
});
//#endregion
module.exports = ColorPreview_default;
