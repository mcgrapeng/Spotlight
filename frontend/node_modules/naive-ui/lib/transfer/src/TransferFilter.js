const require_vdom = require("../../vue-jsx-vapor/vdom.js");
const require__internal_icon_src_Icon = require("../../_internal/icon/src/Icon.js");
const require__internal_icons_Search = require("../../_internal/icons/Search.js");
const require_input_src_Input = require("../../input/src/Input.js");
const require_transfer_src_interface = require("./interface.js");
let vue = require("vue");
//#region src/transfer/src/TransferFilter.tsx
var TransferFilter_default = (0, vue.defineComponent)({
	name: "TransferFilter",
	props: {
		value: String,
		placeholder: String,
		disabled: Boolean,
		onUpdateValue: {
			type: Function,
			required: true
		}
	},
	setup() {
		const { mergedThemeRef, mergedClsPrefixRef } = (0, vue.inject)(require_transfer_src_interface.transferInjectionKey);
		return {
			mergedClsPrefix: mergedClsPrefixRef,
			mergedTheme: mergedThemeRef
		};
	},
	render() {
		const { mergedTheme, mergedClsPrefix } = this;
		return (0, vue.openBlock)(), (0, vue.createElementBlock)("div", { class: require_vdom.normalizeClass(`${mergedClsPrefix}-transfer-filter`) }, [((0, vue.openBlock)(), (0, vue.createBlock)(require_input_src_Input.default, {
			value: this.value,
			onUpdateValue: this.onUpdateValue,
			disabled: this.disabled,
			placeholder: this.placeholder,
			theme: mergedTheme.peers.Input,
			themeOverrides: mergedTheme.peerOverrides.Input,
			clearable: true,
			size: "small"
		}, { "clear-icon-placeholder": () => ((0, vue.openBlock)(), (0, vue.createBlock)(require__internal_icon_src_Icon, { clsPrefix: mergedClsPrefix }, { default: () => ((0, vue.openBlock)(), (0, vue.createBlock)(require__internal_icons_Search)) }, 1032, ["clsPrefix"])) }, 1032, [
			"value",
			"onUpdateValue",
			"disabled",
			"placeholder",
			"theme",
			"themeOverrides"
		]))], 2);
	}
});
//#endregion
module.exports = TransferFilter_default;
