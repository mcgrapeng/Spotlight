const require_vdom = require("../../vue-jsx-vapor/vdom.js");
const require_input_src_Input = require("../../input/src/Input.js");
const require_dynamic_input_src_interface = require("./interface.js");
let vue = require("vue");
//#region src/dynamic-input/src/InputPreset.tsx
var InputPreset_default = (0, vue.defineComponent)({
	name: "DynamicInputInputPreset",
	props: {
		clsPrefix: {
			type: String,
			required: true
		},
		value: {
			type: String,
			default: ""
		},
		disabled: Boolean,
		parentPath: String,
		path: String,
		onUpdateValue: {
			type: Function,
			required: true
		}
	},
	setup() {
		const { mergedThemeRef, placeholderRef } = (0, vue.inject)(require_dynamic_input_src_interface.dynamicInputInjectionKey);
		return {
			mergedTheme: mergedThemeRef,
			placeholder: placeholderRef
		};
	},
	render() {
		const { mergedTheme, placeholder, value, clsPrefix, onUpdateValue, disabled } = this;
		return (0, vue.openBlock)(), (0, vue.createElementBlock)("div", { class: require_vdom.normalizeClass(`${clsPrefix}-dynamic-input-preset-input`) }, [((0, vue.openBlock)(), (0, vue.createBlock)(require_input_src_Input.default, {
			theme: mergedTheme.peers.Input,
			"theme-overrides": mergedTheme.peerOverrides.Input,
			value,
			placeholder,
			onUpdateValue,
			disabled
		}, null, 8, [
			"theme",
			"theme-overrides",
			"value",
			"placeholder",
			"onUpdateValue",
			"disabled"
		]))], 2);
	}
});
//#endregion
module.exports = InputPreset_default;
