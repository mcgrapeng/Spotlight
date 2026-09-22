const require_vdom = require("../../vue-jsx-vapor/vdom.js");
const require_input_src_Input = require("../../input/src/Input.js");
const require_dynamic_input_src_interface = require("./interface.js");
let vue = require("vue");
//#region src/dynamic-input/src/PairPreset.tsx
var PairPreset_default = (0, vue.defineComponent)({
	name: "DynamicInputPairPreset",
	props: {
		clsPrefix: {
			type: String,
			required: true
		},
		value: {
			type: Object,
			default: () => ({
				key: "",
				value: ""
			})
		},
		disabled: Boolean,
		parentPath: String,
		path: String,
		onUpdateValue: {
			type: Function,
			required: true
		}
	},
	setup(props) {
		const { mergedThemeRef, keyPlaceholderRef, valuePlaceholderRef } = (0, vue.inject)(require_dynamic_input_src_interface.dynamicInputInjectionKey);
		return {
			mergedTheme: mergedThemeRef,
			keyPlaceholder: keyPlaceholderRef,
			valuePlaceholder: valuePlaceholderRef,
			handleKeyInput(key) {
				props.onUpdateValue({
					key,
					value: props.value.value
				});
			},
			handleValueInput(value) {
				props.onUpdateValue({
					key: props.value.key,
					value
				});
			}
		};
	},
	render() {
		const { mergedTheme, keyPlaceholder, valuePlaceholder, value, clsPrefix, disabled } = this;
		return (0, vue.openBlock)(), (0, vue.createElementBlock)("div", { class: require_vdom.normalizeClass(`${clsPrefix}-dynamic-input-preset-pair`) }, [((0, vue.openBlock)(), (0, vue.createBlock)(require_input_src_Input.default, {
			theme: mergedTheme.peers.Input,
			"theme-overrides": mergedTheme.peerOverrides.Input,
			value: value.key,
			class: require_vdom.normalizeClass(`${clsPrefix}-dynamic-input-pair-input`),
			placeholder: keyPlaceholder,
			onUpdateValue: this.handleKeyInput,
			disabled
		}, null, 8, [
			"theme",
			"theme-overrides",
			"value",
			"class",
			"placeholder",
			"onUpdateValue",
			"disabled"
		])), ((0, vue.openBlock)(), (0, vue.createBlock)(require_input_src_Input.default, {
			theme: mergedTheme.peers.Input,
			"theme-overrides": mergedTheme.peerOverrides.Input,
			value: value.value,
			class: require_vdom.normalizeClass(`${clsPrefix}-dynamic-input-pair-input`),
			placeholder: valuePlaceholder,
			onUpdateValue: this.handleValueInput,
			disabled
		}, null, 8, [
			"theme",
			"theme-overrides",
			"value",
			"class",
			"placeholder",
			"onUpdateValue",
			"disabled"
		]))], 2);
	}
});
//#endregion
module.exports = PairPreset_default;
