Object.defineProperties(exports, {
	__esModule: { value: true },
	[Symbol.toStringTag]: { value: "Module" }
});
const require__utils_vue_resolve_slot = require("../../_utils/vue/resolve-slot.js");
const require_vdom = require("../../vue-jsx-vapor/vdom.js");
const require_radio_src_use_radio = require("./use-radio.js");
let vue = require("vue");
//#region src/radio/src/RadioButton.tsx
const _hoisted_1 = [
	"value",
	"name",
	"checked",
	"disabled",
	"onChange",
	"onFocus",
	"onBlur"
];
const radioButtonProps = require_radio_src_use_radio.radioBaseProps;
var RadioButton_default = (0, vue.defineComponent)({
	name: "RadioButton",
	props: require_radio_src_use_radio.radioBaseProps,
	setup: require_radio_src_use_radio.setup,
	render() {
		const { mergedClsPrefix } = this;
		return (0, vue.openBlock)(), (0, vue.createElementBlock)("label", { class: require_vdom.normalizeClass([
			`${mergedClsPrefix}-radio-button`,
			this.mergedDisabled && `${mergedClsPrefix}-radio-button--disabled`,
			this.renderSafeChecked && `${mergedClsPrefix}-radio-button--checked`,
			this.focus && [`${mergedClsPrefix}-radio-button--focus`]
		]) }, [
			(0, vue.createElementVNode)("input", {
				ref: "inputRef",
				type: "radio",
				class: require_vdom.normalizeClass(`${mergedClsPrefix}-radio-input`),
				value: this.value,
				name: this.mergedName,
				checked: this.renderSafeChecked,
				disabled: this.mergedDisabled,
				onChange: this.handleRadioInputChange,
				onFocus: this.handleRadioInputFocus,
				onBlur: this.handleRadioInputBlur
			}, null, 42, _hoisted_1),
			(0, vue.createElementVNode)("div", { class: require_vdom.normalizeClass(`${mergedClsPrefix}-radio-button__state-border`) }, null, 2),
			require_vdom.normalizeVNode(() => require__utils_vue_resolve_slot.resolveWrappedSlot(this.$slots.default, (children) => {
				if (!children && !this.label) return null;
				return (0, vue.openBlock)(), (0, vue.createElementBlock)("div", {
					ref: "labelRef",
					class: require_vdom.normalizeClass(`${mergedClsPrefix}-radio__label`)
				}, [require_vdom.normalizeVNode(() => children || this.label)], 2);
			}))
		], 2);
	}
});
//#endregion
exports.default = RadioButton_default;
exports.radioButtonProps = radioButtonProps;
