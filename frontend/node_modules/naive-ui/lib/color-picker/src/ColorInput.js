const require_vdom = require("../../vue-jsx-vapor/vdom.js");
const require_input_src_InputGroup = require("../../input/src/InputGroup.js");
const require_color_picker_src_ColorInputUnit = require("./ColorInputUnit.js");
let seemly = require("seemly");
let vue = require("vue");
//#region src/color-picker/src/ColorInput.tsx
const _hoisted_1 = ["onClick"];
var ColorInput_default = (0, vue.defineComponent)({
	name: "ColorInput",
	props: {
		clsPrefix: {
			type: String,
			required: true
		},
		mode: {
			type: String,
			required: true
		},
		modes: {
			type: Array,
			required: true
		},
		showAlpha: {
			type: Boolean,
			required: true
		},
		value: {
			type: String,
			default: null
		},
		valueArr: {
			type: Array,
			default: null
		},
		onUpdateValue: {
			type: Function,
			required: true
		},
		onUpdateMode: {
			type: Function,
			required: true
		}
	},
	setup(props) {
		return { handleUnitUpdateValue(index, value) {
			const { showAlpha } = props;
			if (props.mode === "hex") {
				props.onUpdateValue((showAlpha ? seemly.toHexaString : seemly.toHexString)(value));
				return;
			}
			let nextValueArr;
			if (props.valueArr === null) nextValueArr = [
				0,
				0,
				0,
				0
			];
			else nextValueArr = Array.from(props.valueArr);
			switch (props.mode) {
				case "hsv":
					nextValueArr[index] = value;
					props.onUpdateValue((showAlpha ? seemly.toHsvaString : seemly.toHsvString)(nextValueArr));
					break;
				case "rgb":
					nextValueArr[index] = value;
					props.onUpdateValue((showAlpha ? seemly.toRgbaString : seemly.toRgbString)(nextValueArr));
					break;
				case "hsl":
					nextValueArr[index] = value;
					props.onUpdateValue((showAlpha ? seemly.toHslaString : seemly.toHslString)(nextValueArr));
			}
		} };
	},
	render() {
		const { clsPrefix, modes } = this;
		return (0, vue.openBlock)(), (0, vue.createElementBlock)("div", { class: require_vdom.normalizeClass(`${clsPrefix}-color-picker-input`) }, [(0, vue.createElementVNode)("div", {
			class: require_vdom.normalizeClass(`${clsPrefix}-color-picker-input__mode`),
			onClick: this.onUpdateMode,
			style: (0, vue.normalizeStyle)({ cursor: modes.length === 1 ? "" : "pointer" })
		}, [require_vdom.normalizeVNode(() => this.mode.toUpperCase() + (this.showAlpha ? "A" : ""))], 14, _hoisted_1), (0, vue.createVNode)(require_input_src_InputGroup.default, null, { default: () => {
			const { mode, valueArr, showAlpha } = this;
			if (mode === "hex") {
				let hexValue = null;
				try {
					hexValue = valueArr === null ? null : (showAlpha ? seemly.toHexaString : seemly.toHexString)(valueArr);
				} catch {}
				return (0, vue.openBlock)(), (0, vue.createBlock)(require_color_picker_src_ColorInputUnit, {
					key: 1,
					label: "HEX",
					showAlpha,
					value: hexValue,
					onUpdateValue: (unitValue) => {
						this.handleUnitUpdateValue(0, unitValue);
					}
				}, null, 8, [
					"showAlpha",
					"value",
					"onUpdateValue"
				]);
			}
			return (mode + (showAlpha ? "a" : "")).split("").map((v, i) => ((0, vue.openBlock)(), (0, vue.createBlock)(require_color_picker_src_ColorInputUnit, {
				label: v.toUpperCase(),
				value: valueArr === null ? null : valueArr[i],
				onUpdateValue: (unitValue) => {
					this.handleUnitUpdateValue(i, unitValue);
				}
			}, null, 8, [
				"label",
				"value",
				"onUpdateValue"
			])));
		} }, 1024)], 2);
	}
});
//#endregion
module.exports = ColorInput_default;
