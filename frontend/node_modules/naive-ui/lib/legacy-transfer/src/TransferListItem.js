const require__utils_naive_attribute = require("../../_utils/naive/attribute.js");
const require_vdom = require("../../vue-jsx-vapor/vdom.js");
const require_checkbox_src_Checkbox = require("../../checkbox/src/Checkbox.js");
const require_legacy_transfer_src_interface = require("./interface.js");
let vue = require("vue");
let vooks = require("vooks");
//#region src/legacy-transfer/src/TransferListItem.tsx
const _hoisted_1 = ["onClick"];
const _hoisted_2 = ["title"];
var TransferListItem_default = (0, vue.defineComponent)({
	name: "NTransferListItem",
	props: {
		source: Boolean,
		label: {
			type: String,
			required: true
		},
		value: {
			type: [String, Number],
			required: true
		},
		disabled: Boolean
	},
	setup(props) {
		const { source } = props;
		const { mergedClsPrefixRef, mergedThemeRef, srcCheckedValuesRef, tgtCheckedValuesRef, handleSrcCheckboxClick, handleTgtCheckboxClick } = (0, vue.inject)(require_legacy_transfer_src_interface.transferInjectionKey);
		const checkedRef = source ? (0, vooks.useMemo)(() => srcCheckedValuesRef.value.includes(props.value)) : (0, vooks.useMemo)(() => tgtCheckedValuesRef.value.includes(props.value));
		return {
			mergedClsPrefix: mergedClsPrefixRef,
			mergedTheme: mergedThemeRef,
			checked: checkedRef,
			handleClick: source ? () => {
				if (!props.disabled) handleSrcCheckboxClick(!checkedRef.value, props.value);
			} : () => {
				if (!props.disabled) handleTgtCheckboxClick(!checkedRef.value, props.value);
			}
		};
	},
	render() {
		const { disabled, mergedTheme, mergedClsPrefix, label, checked, source } = this;
		return (0, vue.openBlock)(), (0, vue.createElementBlock)("div", {
			class: require_vdom.normalizeClass([
				`${mergedClsPrefix}-legacy-transfer-list-item`,
				disabled && `${mergedClsPrefix}-legacy-transfer-list-item--disabled`,
				source ? `${mergedClsPrefix}-legacy-transfer-list-item--source` : `${mergedClsPrefix}-legacy-transfer-list-item--target`
			]),
			onClick: this.handleClick
		}, [(0, vue.createElementVNode)("div", { class: require_vdom.normalizeClass(`${mergedClsPrefix}-legacy-transfer-list-item__checkbox`) }, [((0, vue.openBlock)(), (0, vue.createBlock)(require_checkbox_src_Checkbox.default, {
			theme: mergedTheme.peers.Checkbox,
			themeOverrides: mergedTheme.peerOverrides.Checkbox,
			disabled,
			checked
		}, null, 8, [
			"theme",
			"themeOverrides",
			"disabled",
			"checked"
		]))], 2), (0, vue.createElementVNode)("div", {
			class: require_vdom.normalizeClass(`${mergedClsPrefix}-legacy-transfer-list-item__label`),
			title: require__utils_naive_attribute.getTitleAttribute(label)
		}, [require_vdom.normalizeVNode(() => label)], 10, _hoisted_2)], 10, _hoisted_1);
	}
});
//#endregion
module.exports = TransferListItem_default;
