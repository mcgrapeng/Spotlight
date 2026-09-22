const require_vdom = require("../../vue-jsx-vapor/vdom.js");
const require_checkbox_src_Checkbox = require("../../checkbox/src/Checkbox.js");
const require_legacy_transfer_src_interface = require("./interface.js");
let vue = require("vue");
//#region src/legacy-transfer/src/TransferHeader.tsx
var TransferHeader_default = (0, vue.defineComponent)({
	name: "TransferHeader",
	props: {
		source: Boolean,
		onChange: {
			type: Function,
			required: true
		},
		title: String
	},
	setup(props) {
		const { srcOptsRef, tgtOptsRef, srcCheckedStatusRef, tgtCheckedStatusRef, srcCheckedValuesRef, tgtCheckedValuesRef, mergedThemeRef, disabledRef, mergedClsPrefixRef } = (0, vue.inject)(require_legacy_transfer_src_interface.transferInjectionKey);
		const checkboxPropsRef = (0, vue.computed)(() => {
			const { source } = props;
			if (source) return srcCheckedStatusRef.value;
			else return tgtCheckedStatusRef.value;
		});
		return () => {
			const { source } = props;
			const { value: checkboxProps } = checkboxPropsRef;
			const { value: mergedTheme } = mergedThemeRef;
			const { value: mergedClsPrefix } = mergedClsPrefixRef;
			return (() => {
				const _cache = require_vdom.createVNodeCache("76321fa8f0e5ceb7");
				return (0, vue.openBlock)(), (0, vue.createElementBlock)("div", { class: require_vdom.normalizeClass(`${mergedClsPrefix}-legacy-transfer-list-header`) }, [
					(0, vue.createElementVNode)("div", { class: require_vdom.normalizeClass(`${mergedClsPrefix}-legacy-transfer-list-header__checkbox`) }, [((0, vue.openBlock)(), (0, vue.createBlock)(require_checkbox_src_Checkbox.default, {
						theme: mergedTheme.peers.Checkbox,
						themeOverrides: mergedTheme.peerOverrides.Checkbox,
						checked: checkboxProps.checked,
						indeterminate: checkboxProps.indeterminate,
						disabled: checkboxProps.disabled || disabledRef.value,
						onUpdateChecked: props.onChange
					}, null, 8, [
						"theme",
						"themeOverrides",
						"checked",
						"indeterminate",
						"disabled",
						"onUpdateChecked"
					]))], 2),
					(0, vue.createElementVNode)("div", { class: require_vdom.normalizeClass(`${mergedClsPrefix}-legacy-transfer-list-header__header`) }, [require_vdom.normalizeVNode(() => props.title)], 2),
					(0, vue.createElementVNode)("div", { class: require_vdom.normalizeClass(`${mergedClsPrefix}-legacy-transfer-list-header__extra`) }, [
						source ? ((0, vue.openBlock)(), (0, vue.createElementBlock)(vue.Fragment, { key: 0 }, [require_vdom.normalizeVNode(() => srcCheckedValuesRef.value.length)], 64)) : ((0, vue.openBlock)(), (0, vue.createElementBlock)(vue.Fragment, { key: 1 }, [require_vdom.normalizeVNode(() => tgtCheckedValuesRef.value.length)], 64)),
						_cache[0] || (_cache[0] = require_vdom.normalizeVNode("/", -1)),
						source ? ((0, vue.openBlock)(), (0, vue.createElementBlock)(vue.Fragment, { key: 2 }, [require_vdom.normalizeVNode(() => srcOptsRef.value.length)], 64)) : ((0, vue.openBlock)(), (0, vue.createElementBlock)(vue.Fragment, { key: 3 }, [require_vdom.normalizeVNode(() => tgtOptsRef.value.length)], 64))
					], 2)
				], 2);
			})();
		};
	}
});
//#endregion
module.exports = TransferHeader_default;
