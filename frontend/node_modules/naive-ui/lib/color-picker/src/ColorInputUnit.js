const require_input_src_Input = require("../../input/src/Input.js");
const require_color_picker_src_context = require("./context.js");
let vue = require("vue");
//#region src/color-picker/src/ColorInputUnit.tsx
function normalizeRgbUnit(value) {
	if (/^\d{1,3}\.?\d*$/.test(value.trim())) return Math.max(0, Math.min(Number.parseInt(value), 255));
	return false;
}
function normalizeHueUnit(value) {
	if (/^\d{1,3}\.?\d*$/.test(value.trim())) return Math.max(0, Math.min(Number.parseInt(value), 360));
	return false;
}
function normalizeSlvUnit(value) {
	if (/^\d{1,3}\.?\d*$/.test(value.trim())) return Math.max(0, Math.min(Number.parseInt(value), 100));
	return false;
}
function normalizeHexaUnit(value) {
	const trimmedValue = value.trim();
	if (/^#[0-9a-fA-F]+$/.test(trimmedValue)) return [
		4,
		5,
		7,
		9
	].includes(trimmedValue.length);
	return false;
}
function normalizeAlphaUnit(value) {
	if (/^\d{1,3}\.?\d*%$/.test(value.trim())) return Math.max(0, Math.min(Number.parseInt(value) / 100, 100));
	return false;
}
const inputThemeOverrides = { paddingSmall: "0 4px" };
var ColorInputUnit_default = (0, vue.defineComponent)({
	name: "ColorInputUnit",
	props: {
		label: {
			type: String,
			required: true
		},
		value: {
			type: [Number, String],
			default: null
		},
		showAlpha: Boolean,
		onUpdateValue: {
			type: Function,
			required: true
		}
	},
	setup(props) {
		const inputValueRef = (0, vue.ref)("");
		const { themeRef } = (0, vue.inject)(require_color_picker_src_context.colorPickerInjectionKey, null);
		(0, vue.watchEffect)(() => {
			inputValueRef.value = getInputString();
		});
		function getInputString() {
			const { value } = props;
			if (value === null) return "";
			const { label } = props;
			if (label === "HEX") return value;
			if (label === "A") return `${Math.floor(value * 100)}%`;
			return String(Math.floor(value));
		}
		function handleInputUpdateValue(value) {
			inputValueRef.value = value;
		}
		function handleInputChange(value) {
			let unit;
			let valid;
			switch (props.label) {
				case "HEX":
					valid = normalizeHexaUnit(value);
					if (valid) props.onUpdateValue(value);
					inputValueRef.value = getInputString();
					break;
				case "H":
					unit = normalizeHueUnit(value);
					if (unit === false) inputValueRef.value = getInputString();
					else props.onUpdateValue(unit);
					break;
				case "S":
				case "L":
				case "V":
					unit = normalizeSlvUnit(value);
					if (unit === false) inputValueRef.value = getInputString();
					else props.onUpdateValue(unit);
					break;
				case "A":
					unit = normalizeAlphaUnit(value);
					if (unit === false) inputValueRef.value = getInputString();
					else props.onUpdateValue(unit);
					break;
				case "R":
				case "G":
				case "B":
					unit = normalizeRgbUnit(value);
					if (unit === false) inputValueRef.value = getInputString();
					else props.onUpdateValue(unit);
			}
		}
		return {
			mergedTheme: themeRef,
			inputValue: inputValueRef,
			handleInputChange,
			handleInputUpdateValue
		};
	},
	render() {
		const { mergedTheme } = this;
		return (0, vue.openBlock)(), (0, vue.createBlock)(require_input_src_Input.default, {
			size: "small",
			placeholder: this.label,
			theme: mergedTheme.peers.Input,
			themeOverrides: mergedTheme.peerOverrides.Input,
			builtinThemeOverrides: inputThemeOverrides,
			value: this.inputValue,
			onUpdateValue: this.handleInputUpdateValue,
			onChange: this.handleInputChange,
			style: (0, vue.normalizeStyle)(this.label === "A" ? "flex-grow: 1.25;" : "")
		}, null, 8, [
			"placeholder",
			"theme",
			"themeOverrides",
			"builtinThemeOverrides",
			"value",
			"onUpdateValue",
			"onChange",
			"style"
		]);
	}
});
//#endregion
module.exports = ColorInputUnit_default;
