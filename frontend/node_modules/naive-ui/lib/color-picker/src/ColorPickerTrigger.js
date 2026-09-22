const require_vdom = require("../../vue-jsx-vapor/vdom.js");
const require_color_picker_src_utils = require("./utils.js");
const require_color_picker_src_context = require("./context.js");
let seemly = require("seemly");
let vue = require("vue");
//#region src/color-picker/src/ColorPickerTrigger.tsx
const _hoisted_1 = ["onClick"];
var ColorPickerTrigger_default = (0, vue.defineComponent)({
	name: "ColorPickerTrigger",
	slots: Object,
	props: {
		clsPrefix: {
			type: String,
			required: true
		},
		value: {
			type: String,
			default: null
		},
		hsla: {
			type: Array,
			default: null
		},
		disabled: Boolean,
		onClick: Function
	},
	setup(props) {
		const { colorPickerSlots, renderLabelRef } = (0, vue.inject)(require_color_picker_src_context.colorPickerInjectionKey, null);
		return () => {
			const { hsla, value, clsPrefix, onClick, disabled } = props;
			const renderLabel = colorPickerSlots.label || renderLabelRef.value;
			return (0, vue.openBlock)(), (0, vue.createElementBlock)("div", {
				class: require_vdom.normalizeClass([`${clsPrefix}-color-picker`, disabled && `${clsPrefix}-color-picker--disabled`]),
				onClick: disabled ? void 0 : onClick
			}, [(0, vue.createElementVNode)("div", { class: require_vdom.normalizeClass(`${clsPrefix}-color-picker__fill`) }, [
				(0, vue.createElementVNode)("div", { class: require_vdom.normalizeClass(`${clsPrefix}-color-picker-checkboard`) }, null, 2),
				(0, vue.createElementVNode)("div", { style: (0, vue.normalizeStyle)({
					position: "absolute",
					left: 0,
					right: 0,
					top: 0,
					bottom: 0,
					backgroundColor: hsla ? (0, seemly.toHslaString)(hsla) : ""
				}) }, null, 4),
				value && hsla ? ((0, vue.openBlock)(), (0, vue.createElementBlock)("div", {
					key: 0,
					class: require_vdom.normalizeClass(`${clsPrefix}-color-picker__value`),
					style: (0, vue.normalizeStyle)({ color: require_color_picker_src_utils.getWCAGContrast(hsla) ? "white" : "black" })
				}, [renderLabel ? ((0, vue.openBlock)(), (0, vue.createElementBlock)(vue.Fragment, { key: 0 }, [require_vdom.normalizeVNode(() => renderLabel(value))], 64)) : ((0, vue.openBlock)(), (0, vue.createElementBlock)(vue.Fragment, { key: 1 }, [require_vdom.normalizeVNode(() => value)], 64))], 6)) : require_vdom.normalizeVNode(() => null)
			], 2)], 10, _hoisted_1);
		};
	}
});
//#endregion
module.exports = ColorPickerTrigger_default;
