const require_vdom = require("../../vue-jsx-vapor/vdom.js");
const require__internal_icon_src_Icon = require("../../_internal/icon/src/Icon.js");
const require__internal_icons_Search = require("../../_internal/icons/Search.js");
const require_input_src_Input = require("../../input/src/Input.js");
const require_legacy_transfer_src_interface = require("./interface.js");
let vue = require("vue");
//#region src/legacy-transfer/src/TransferFilter.tsx
var TransferFilter_default = (0, vue.defineComponent)({
	name: "TransferFilter",
	props: {
		value: String,
		placeholder: String,
		disabled: Boolean,
		onFocus: {
			type: Function,
			required: true
		},
		onBlur: {
			type: Function,
			required: true
		},
		onUpdateValue: {
			type: Function,
			required: true
		}
	},
	setup() {
		const { mergedThemeRef, mergedClsPrefixRef } = (0, vue.inject)(require_legacy_transfer_src_interface.transferInjectionKey);
		return {
			mergedClsPrefix: mergedClsPrefixRef,
			mergedTheme: mergedThemeRef
		};
	},
	render() {
		const { mergedTheme, mergedClsPrefix } = this;
		return (0, vue.openBlock)(), (0, vue.createElementBlock)("div", { class: require_vdom.normalizeClass(`${mergedClsPrefix}-legacy-transfer-filter`) }, [((0, vue.openBlock)(), (0, vue.createBlock)(require_input_src_Input.default, {
			value: this.value,
			onUpdateValue: this.onUpdateValue,
			disabled: this.disabled,
			theme: mergedTheme.peers.Input,
			themeOverrides: mergedTheme.peerOverrides.Input,
			clearable: true,
			size: "small",
			placeholder: this.placeholder,
			onFocus: this.onFocus,
			onBlur: this.onBlur
		}, { "clear-icon-placeholder": () => ((0, vue.openBlock)(), (0, vue.createBlock)(require__internal_icon_src_Icon, {
			clsPrefix: mergedClsPrefix,
			class: require_vdom.normalizeClass(`${mergedClsPrefix}-legacy-transfer-icon`)
		}, { default: () => ((0, vue.openBlock)(), (0, vue.createBlock)(require__internal_icons_Search)) }, 1032, ["clsPrefix", "class"])) }, 1032, [
			"value",
			"onUpdateValue",
			"disabled",
			"theme",
			"themeOverrides",
			"placeholder",
			"onFocus",
			"onBlur"
		]))], 2);
	}
});
//#endregion
module.exports = TransferFilter_default;
