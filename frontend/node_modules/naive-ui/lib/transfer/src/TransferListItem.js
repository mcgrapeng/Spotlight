const require__utils_naive_attribute = require("../../_utils/naive/attribute.js");
const require_vdom = require("../../vue-jsx-vapor/vdom.js");
const require__internal_close_src_Close = require("../../_internal/close/src/Close.js");
const require_checkbox_src_Checkbox = require("../../checkbox/src/Checkbox.js");
const require_transfer_src_interface = require("./interface.js");
let vue = require("vue");
let vooks = require("vooks");
//#region src/transfer/src/TransferListItem.tsx
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
		disabled: Boolean,
		option: {
			type: Object,
			required: true
		}
	},
	setup(props) {
		const { targetValueSetRef, mergedClsPrefixRef, mergedThemeRef, handleItemCheck, renderSourceLabelRef, renderTargetLabelRef, showSelectedRef } = (0, vue.inject)(require_transfer_src_interface.transferInjectionKey);
		const checkedRef = (0, vooks.useMemo)(() => targetValueSetRef.value.has(props.value));
		function handleClick() {
			if (!props.disabled) handleItemCheck(!checkedRef.value, props.value);
		}
		return {
			mergedClsPrefix: mergedClsPrefixRef,
			mergedTheme: mergedThemeRef,
			checked: checkedRef,
			showSelected: showSelectedRef,
			renderSourceLabel: renderSourceLabelRef,
			renderTargetLabel: renderTargetLabelRef,
			handleClick
		};
	},
	render() {
		const { disabled, mergedTheme, mergedClsPrefix, label, checked, source, renderSourceLabel, renderTargetLabel } = this;
		return (0, vue.openBlock)(), (0, vue.createElementBlock)("div", {
			class: require_vdom.normalizeClass([
				`${mergedClsPrefix}-transfer-list-item`,
				disabled && `${mergedClsPrefix}-transfer-list-item--disabled`,
				source ? `${mergedClsPrefix}-transfer-list-item--source` : `${mergedClsPrefix}-transfer-list-item--target`
			]),
			onClick: source ? this.handleClick : void 0
		}, [
			(0, vue.createElementVNode)("div", { class: require_vdom.normalizeClass(`${mergedClsPrefix}-transfer-list-item__background`) }, null, 2),
			require_vdom.normalizeVNode(() => source && this.showSelected && ((0, vue.openBlock)(), (0, vue.createElementBlock)("div", { class: require_vdom.normalizeClass(`${mergedClsPrefix}-transfer-list-item__checkbox`) }, [((0, vue.openBlock)(), (0, vue.createBlock)(require_checkbox_src_Checkbox.default, {
				theme: mergedTheme.peers.Checkbox,
				themeOverrides: mergedTheme.peerOverrides.Checkbox,
				disabled,
				checked
			}, null, 8, [
				"theme",
				"themeOverrides",
				"disabled",
				"checked"
			]))], 2))),
			(0, vue.createElementVNode)("div", {
				class: require_vdom.normalizeClass(`${mergedClsPrefix}-transfer-list-item__label`),
				title: require__utils_naive_attribute.getTitleAttribute(label)
			}, [source ? ((0, vue.openBlock)(), (0, vue.createElementBlock)(vue.Fragment, { key: 0 }, [renderSourceLabel ? ((0, vue.openBlock)(), (0, vue.createElementBlock)(vue.Fragment, { key: 0 }, [require_vdom.normalizeVNode(() => renderSourceLabel({ option: this.option }))], 64)) : ((0, vue.openBlock)(), (0, vue.createElementBlock)(vue.Fragment, { key: 1 }, [require_vdom.normalizeVNode(() => label)], 64))], 64)) : ((0, vue.openBlock)(), (0, vue.createElementBlock)(vue.Fragment, { key: 1 }, [renderTargetLabel ? ((0, vue.openBlock)(), (0, vue.createElementBlock)(vue.Fragment, { key: 0 }, [require_vdom.normalizeVNode(() => renderTargetLabel({ option: this.option }))], 64)) : ((0, vue.openBlock)(), (0, vue.createElementBlock)(vue.Fragment, { key: 1 }, [require_vdom.normalizeVNode(() => label)], 64))], 64))], 10, _hoisted_2),
			require_vdom.normalizeVNode(() => !source && !disabled && ((0, vue.openBlock)(), (0, vue.createBlock)(require__internal_close_src_Close, {
				focusable: false,
				class: require_vdom.normalizeClass(`${mergedClsPrefix}-transfer-list-item__close`),
				clsPrefix: mergedClsPrefix,
				onClick: this.handleClick
			}, null, 8, [
				"class",
				"clsPrefix",
				"onClick"
			])))
		], 10, _hoisted_1);
	}
});
//#endregion
module.exports = TransferListItem_default;
