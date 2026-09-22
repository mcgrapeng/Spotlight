Object.defineProperties(exports, {
	__esModule: { value: true },
	[Symbol.toStringTag]: { value: "Module" }
});
const require__utils_cssr_index = require("../../_utils/cssr/index.js");
const require__utils_naive_warn = require("../../_utils/naive/warn.js");
const require__utils_vue_call = require("../../_utils/vue/call.js");
const require__mixins_use_config = require("../../_mixins/use-config.js");
const require__mixins_use_form_item = require("../../_mixins/use-form-item.js");
const require__mixins_use_theme = require("../../_mixins/use-theme.js");
const require_vdom = require("../../vue-jsx-vapor/vdom.js");
const require__internal_scrollbar_src_Scrollbar = require("../../_internal/scrollbar/src/Scrollbar.js");
const require_transfer_styles_light = require("../styles/light.js");
const require_transfer_src_interface = require("./interface.js");
const require_transfer_src_styles_index_cssr = require("./styles/index.cssr.js");
const require_transfer_src_TransferFilter = require("./TransferFilter.js");
const require_transfer_src_TransferHeader = require("./TransferHeader.js");
const require_transfer_src_TransferList = require("./TransferList.js");
const require_transfer_src_use_transfer_data = require("./use-transfer-data.js");
let seemly = require("seemly");
let vue = require("vue");
let vooks = require("vooks");
//#region src/transfer/src/Transfer.tsx
const transferProps = {
	...require__mixins_use_theme.default.props,
	value: Array,
	defaultValue: {
		type: Array,
		default: null
	},
	options: {
		type: Array,
		default: () => []
	},
	disabled: {
		type: Boolean,
		default: void 0
	},
	virtualScroll: Boolean,
	sourceTitle: [String, Function],
	selectAllText: String,
	clearText: String,
	targetTitle: [String, Function],
	filterable: {
		type: Boolean,
		default: void 0
	},
	sourceFilterable: Boolean,
	targetFilterable: Boolean,
	showSelected: {
		type: Boolean,
		default: true
	},
	sourceFilterPlaceholder: String,
	targetFilterPlaceholder: String,
	filter: {
		type: Function,
		default: (pattern, option) => {
			if (!pattern) return true;
			return ~`${option.label}`.toLowerCase().indexOf(`${pattern}`.toLowerCase());
		}
	},
	size: String,
	renderSourceLabel: Function,
	renderTargetLabel: Function,
	renderSourceList: Function,
	renderTargetList: Function,
	"onUpdate:value": [Function, Array],
	onUpdateValue: [Function, Array],
	onChange: [Function, Array]
};
var Transfer_default = (0, vue.defineComponent)({
	name: "Transfer",
	props: transferProps,
	setup(props) {
		if (process.env.NODE_ENV !== "production") (0, vue.watchEffect)(() => {
			if (props.onChange !== void 0) require__utils_naive_warn.warnOnce("transfer", "`on-change` is deprecated, please use `on-update:value` instead.");
			if (props.filterable !== void 0) require__utils_naive_warn.warnOnce("transfer", "`filterable` is deprecated, please use `source-filterable` or `target-filterable` instead.");
		});
		const { mergedClsPrefixRef, mergedComponentPropsRef } = require__mixins_use_config.default(props);
		const themeRef = require__mixins_use_theme.default("Transfer", "-transfer", require_transfer_src_styles_index_cssr, require_transfer_styles_light, props, mergedClsPrefixRef);
		const formItem = require__mixins_use_form_item.default(props, { mergedSize: (NFormItem) => {
			const { size } = props;
			if (size) return size;
			const { mergedSize: formItemSize } = NFormItem || {};
			if (formItemSize?.value) return formItemSize.value;
			const configSize = mergedComponentPropsRef?.value?.Transfer?.size;
			if (configSize) return configSize;
			return "medium";
		} });
		const { mergedSizeRef, mergedDisabledRef } = formItem;
		const itemSizeRef = (0, vue.computed)(() => {
			const { value: size } = mergedSizeRef;
			const { self: { [require__utils_cssr_index.createKey("itemHeight", size)]: itemSize } } = themeRef.value;
			return (0, seemly.depx)(itemSize);
		});
		const { uncontrolledValueRef, mergedValueRef, targetValueSetRef, valueSetForCheckAllRef, valueSetForUncheckAllRef, valueSetForClearRef, filteredTgtOptionsRef, filteredSrcOptionsRef, targetOptionsRef, canNotSelectAnythingRef, canBeClearedRef, allCheckedRef, srcPatternRef, tgtPatternRef, mergedSrcFilterableRef, handleSrcFilterUpdateValue, handleTgtFilterUpdateValue } = require_transfer_src_use_transfer_data.useTransferData(props);
		function doUpdateValue(value) {
			const { onUpdateValue, "onUpdate:value": _onUpdateValue, onChange } = props;
			const { nTriggerFormInput, nTriggerFormChange } = formItem;
			if (onUpdateValue) require__utils_vue_call.call(onUpdateValue, value);
			if (_onUpdateValue) require__utils_vue_call.call(_onUpdateValue, value);
			if (onChange) require__utils_vue_call.call(onChange, value);
			uncontrolledValueRef.value = value;
			nTriggerFormInput();
			nTriggerFormChange();
		}
		function handleSourceCheckAll() {
			doUpdateValue([...valueSetForCheckAllRef.value]);
		}
		function handleSourceUncheckAll() {
			doUpdateValue([...valueSetForUncheckAllRef.value]);
		}
		function handleTargetClearAll() {
			doUpdateValue([...valueSetForClearRef.value]);
		}
		function handleItemCheck(checked, optionValue) {
			if (checked) doUpdateValue((mergedValueRef.value || []).concat(optionValue));
			else doUpdateValue((mergedValueRef.value || []).filter((v) => v !== optionValue));
		}
		function handleChecked(optionValueList) {
			doUpdateValue(optionValueList);
		}
		(0, vue.provide)(require_transfer_src_interface.transferInjectionKey, {
			targetValueSetRef,
			mergedClsPrefixRef,
			disabledRef: mergedDisabledRef,
			mergedThemeRef: themeRef,
			targetOptionsRef,
			canNotSelectAnythingRef,
			canBeClearedRef,
			allCheckedRef,
			srcOptionsLengthRef: (0, vue.computed)(() => props.options.length),
			handleItemCheck,
			renderSourceLabelRef: (0, vue.toRef)(props, "renderSourceLabel"),
			renderTargetLabelRef: (0, vue.toRef)(props, "renderTargetLabel"),
			showSelectedRef: (0, vue.toRef)(props, "showSelected")
		});
		return {
			mergedClsPrefix: mergedClsPrefixRef,
			mergedDisabled: mergedDisabledRef,
			itemSize: itemSizeRef,
			isMounted: (0, vooks.useIsMounted)(),
			mergedTheme: themeRef,
			filteredSrcOpts: filteredSrcOptionsRef,
			filteredTgtOpts: filteredTgtOptionsRef,
			srcPattern: srcPatternRef,
			tgtPattern: tgtPatternRef,
			mergedSize: mergedSizeRef,
			mergedSrcFilterable: mergedSrcFilterableRef,
			handleSrcFilterUpdateValue,
			handleTgtFilterUpdateValue,
			handleSourceCheckAll,
			handleSourceUncheckAll,
			handleTargetClearAll,
			handleItemCheck,
			handleChecked,
			cssVars: (0, vue.computed)(() => {
				const { value: size } = mergedSizeRef;
				const { common: { cubicBezierEaseInOut }, self: { borderRadius, borderColor, listColor, titleTextColor, titleTextColorDisabled, extraTextColor, itemTextColor, itemColorPending, itemTextColorDisabled, titleFontWeight, closeColorHover, closeColorPressed, closeIconColor, closeIconColorHover, closeIconColorPressed, closeIconSize, closeSize, dividerColor, extraTextColorDisabled, [require__utils_cssr_index.createKey("extraFontSize", size)]: extraFontSize, [require__utils_cssr_index.createKey("fontSize", size)]: fontSize, [require__utils_cssr_index.createKey("titleFontSize", size)]: titleFontSize, [require__utils_cssr_index.createKey("itemHeight", size)]: itemHeight, [require__utils_cssr_index.createKey("headerHeight", size)]: headerHeight } } = themeRef.value;
				return {
					"--n-bezier": cubicBezierEaseInOut,
					"--n-border-color": borderColor,
					"--n-border-radius": borderRadius,
					"--n-extra-font-size": extraFontSize,
					"--n-font-size": fontSize,
					"--n-header-font-size": titleFontSize,
					"--n-header-extra-text-color": extraTextColor,
					"--n-header-extra-text-color-disabled": extraTextColorDisabled,
					"--n-header-font-weight": titleFontWeight,
					"--n-header-text-color": titleTextColor,
					"--n-header-text-color-disabled": titleTextColorDisabled,
					"--n-item-color-pending": itemColorPending,
					"--n-item-height": itemHeight,
					"--n-item-text-color": itemTextColor,
					"--n-item-text-color-disabled": itemTextColorDisabled,
					"--n-list-color": listColor,
					"--n-header-height": headerHeight,
					"--n-close-size": closeSize,
					"--n-close-icon-size": closeIconSize,
					"--n-close-color-hover": closeColorHover,
					"--n-close-color-pressed": closeColorPressed,
					"--n-close-icon-color": closeIconColor,
					"--n-close-icon-color-hover": closeIconColorHover,
					"--n-close-icon-color-pressed": closeIconColorPressed,
					"--n-divider-color": dividerColor
				};
			})
		};
	},
	render() {
		const { mergedClsPrefix, renderSourceList, renderTargetList, mergedTheme, mergedSrcFilterable, targetFilterable } = this;
		return (0, vue.openBlock)(), (0, vue.createElementBlock)("div", {
			class: require_vdom.normalizeClass([`${mergedClsPrefix}-transfer`, this.mergedDisabled && `${mergedClsPrefix}-transfer--disabled`]),
			style: (0, vue.normalizeStyle)(this.cssVars)
		}, [(0, vue.createElementVNode)("div", { class: require_vdom.normalizeClass(`${mergedClsPrefix}-transfer-list ${mergedClsPrefix}-transfer-list--source`) }, [
			((0, vue.openBlock)(), (0, vue.createBlock)(require_transfer_src_TransferHeader, {
				source: true,
				selectAllText: this.selectAllText,
				clearText: this.clearText,
				title: this.sourceTitle,
				onCheckedAll: this.handleSourceCheckAll,
				onClearAll: this.handleSourceUncheckAll,
				size: this.mergedSize
			}, null, 8, [
				"selectAllText",
				"clearText",
				"title",
				"onCheckedAll",
				"onClearAll",
				"size"
			])),
			(0, vue.createElementVNode)("div", { class: require_vdom.normalizeClass(`${mergedClsPrefix}-transfer-list-body`) }, [mergedSrcFilterable ? ((0, vue.openBlock)(), (0, vue.createBlock)(require_transfer_src_TransferFilter, {
				key: 0,
				onUpdateValue: this.handleSrcFilterUpdateValue,
				value: this.srcPattern,
				disabled: this.mergedDisabled,
				placeholder: this.sourceFilterPlaceholder
			}, null, 8, [
				"onUpdateValue",
				"value",
				"disabled",
				"placeholder"
			])) : require_vdom.normalizeVNode(() => null), (0, vue.createElementVNode)("div", { class: require_vdom.normalizeClass(`${mergedClsPrefix}-transfer-list-flex-container`) }, [renderSourceList ? ((0, vue.openBlock)(), (0, vue.createBlock)(require__internal_scrollbar_src_Scrollbar.default, {
				key: 0,
				theme: mergedTheme.peers.Scrollbar,
				themeOverrides: mergedTheme.peerOverrides.Scrollbar
			}, { default: () => renderSourceList({
				onCheck: this.handleChecked,
				checkedOptions: this.filteredTgtOpts,
				pattern: this.srcPattern
			}) }, 1032, ["theme", "themeOverrides"])) : ((0, vue.openBlock)(), (0, vue.createBlock)(require_transfer_src_TransferList, {
				key: 1,
				source: true,
				options: this.filteredSrcOpts,
				disabled: this.mergedDisabled,
				virtualScroll: this.virtualScroll,
				itemSize: this.itemSize
			}, null, 8, [
				"options",
				"disabled",
				"virtualScroll",
				"itemSize"
			]))], 2)], 2),
			(0, vue.createElementVNode)("div", { class: require_vdom.normalizeClass(`${mergedClsPrefix}-transfer-list__border`) }, null, 2)
		], 2), (0, vue.createElementVNode)("div", { class: require_vdom.normalizeClass(`${mergedClsPrefix}-transfer-list ${mergedClsPrefix}-transfer-list--target`) }, [
			((0, vue.openBlock)(), (0, vue.createBlock)(require_transfer_src_TransferHeader, {
				onClearAll: this.handleTargetClearAll,
				size: this.mergedSize,
				title: this.targetTitle
			}, null, 8, [
				"onClearAll",
				"size",
				"title"
			])),
			(0, vue.createElementVNode)("div", { class: require_vdom.normalizeClass(`${mergedClsPrefix}-transfer-list-body`) }, [targetFilterable ? ((0, vue.openBlock)(), (0, vue.createBlock)(require_transfer_src_TransferFilter, {
				key: 0,
				onUpdateValue: this.handleTgtFilterUpdateValue,
				value: this.tgtPattern,
				disabled: this.mergedDisabled,
				placeholder: this.sourceFilterPlaceholder
			}, null, 8, [
				"onUpdateValue",
				"value",
				"disabled",
				"placeholder"
			])) : require_vdom.normalizeVNode(() => null), (0, vue.createElementVNode)("div", { class: require_vdom.normalizeClass(`${mergedClsPrefix}-transfer-list-flex-container`) }, [renderTargetList ? ((0, vue.openBlock)(), (0, vue.createBlock)(require__internal_scrollbar_src_Scrollbar.default, {
				key: 0,
				theme: mergedTheme.peers.Scrollbar,
				themeOverrides: mergedTheme.peerOverrides.Scrollbar
			}, { default: () => renderTargetList({
				onCheck: this.handleChecked,
				checkedOptions: this.filteredTgtOpts,
				pattern: this.tgtPattern
			}) }, 1032, ["theme", "themeOverrides"])) : ((0, vue.openBlock)(), (0, vue.createBlock)(require_transfer_src_TransferList, {
				key: 1,
				options: this.filteredTgtOpts,
				disabled: this.mergedDisabled,
				virtualScroll: this.virtualScroll,
				itemSize: this.itemSize
			}, null, 8, [
				"options",
				"disabled",
				"virtualScroll",
				"itemSize"
			]))], 2)], 2),
			(0, vue.createElementVNode)("div", { class: require_vdom.normalizeClass(`${mergedClsPrefix}-transfer-list__border`) }, null, 2)
		], 2)], 6);
	}
});
//#endregion
exports.default = Transfer_default;
exports.transferProps = transferProps;
