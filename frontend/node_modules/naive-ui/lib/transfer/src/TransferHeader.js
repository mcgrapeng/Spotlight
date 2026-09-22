const require__mixins_use_locale = require("../../_mixins/use-locale.js");
const require_vdom = require("../../vue-jsx-vapor/vdom.js");
const require_button_src_Button = require("../../button/src/Button.js");
const require_transfer_src_interface = require("./interface.js");
let vue = require("vue");
//#region src/transfer/src/TransferHeader.tsx
var TransferHeader_default = (0, vue.defineComponent)({
	name: "TransferHeader",
	props: {
		size: {
			type: String,
			required: true
		},
		selectAllText: String,
		clearText: String,
		source: Boolean,
		onCheckedAll: Function,
		onClearAll: Function,
		title: [String, Function]
	},
	setup(props) {
		const { targetOptionsRef, canNotSelectAnythingRef, canBeClearedRef, allCheckedRef, mergedThemeRef, disabledRef, mergedClsPrefixRef, srcOptionsLengthRef } = (0, vue.inject)(require_transfer_src_interface.transferInjectionKey);
		const { localeRef } = require__mixins_use_locale("Transfer");
		return () => {
			const { source, onClearAll, onCheckedAll, selectAllText, clearText } = props;
			const { value: mergedTheme } = mergedThemeRef;
			const { value: mergedClsPrefix } = mergedClsPrefixRef;
			const { value: locale } = localeRef;
			const buttonSize = props.size === "large" ? "small" : "tiny";
			const { title } = props;
			return (0, vue.openBlock)(), (0, vue.createElementBlock)("div", { class: require_vdom.normalizeClass(`${mergedClsPrefix}-transfer-list-header`) }, [
				require_vdom.normalizeVNode(() => title && ((0, vue.openBlock)(), (0, vue.createElementBlock)("div", { class: require_vdom.normalizeClass(`${mergedClsPrefix}-transfer-list-header__title`) }, [typeof title === "function" ? ((0, vue.openBlock)(), (0, vue.createElementBlock)(vue.Fragment, { key: 0 }, [require_vdom.normalizeVNode(() => title())], 64)) : ((0, vue.openBlock)(), (0, vue.createElementBlock)(vue.Fragment, { key: 1 }, [require_vdom.normalizeVNode(() => title)], 64))], 2))),
				require_vdom.normalizeVNode(() => source && ((0, vue.openBlock)(), (0, vue.createBlock)(require_button_src_Button.default, {
					class: require_vdom.normalizeClass(`${mergedClsPrefix}-transfer-list-header__button`),
					theme: mergedTheme.peers.Button,
					themeOverrides: mergedTheme.peerOverrides.Button,
					size: buttonSize,
					tertiary: true,
					onClick: allCheckedRef.value ? onClearAll : onCheckedAll,
					disabled: canNotSelectAnythingRef.value || disabledRef.value
				}, { default: () => allCheckedRef.value ? clearText || locale.unselectAll : selectAllText || locale.selectAll }, 1032, [
					"class",
					"theme",
					"themeOverrides",
					"size",
					"onClick",
					"disabled"
				]))),
				require_vdom.normalizeVNode(() => !source && canBeClearedRef.value && ((0, vue.openBlock)(), (0, vue.createBlock)(require_button_src_Button.default, {
					class: require_vdom.normalizeClass(`${mergedClsPrefix}-transfer-list-header__button`),
					theme: mergedTheme.peers.Button,
					themeOverrides: mergedTheme.peerOverrides.Button,
					size: buttonSize,
					tertiary: true,
					onClick: onClearAll,
					disabled: disabledRef.value
				}, { default: () => locale.clearAll }, 1032, [
					"class",
					"theme",
					"themeOverrides",
					"size",
					"onClick",
					"disabled"
				]))),
				(0, vue.createElementVNode)("div", { class: require_vdom.normalizeClass(`${mergedClsPrefix}-transfer-list-header__extra`) }, [source ? ((0, vue.openBlock)(), (0, vue.createElementBlock)(vue.Fragment, { key: 0 }, [require_vdom.normalizeVNode(() => locale.total(srcOptionsLengthRef.value))], 64)) : ((0, vue.openBlock)(), (0, vue.createElementBlock)(vue.Fragment, { key: 1 }, [require_vdom.normalizeVNode(() => locale.selected(targetOptionsRef.value.length))], 64))], 2)
			], 2);
		};
	}
});
//#endregion
module.exports = TransferHeader_default;
