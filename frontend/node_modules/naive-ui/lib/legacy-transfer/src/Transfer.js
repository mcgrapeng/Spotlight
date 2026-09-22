Object.defineProperties(exports, {
	__esModule: { value: true },
	[Symbol.toStringTag]: { value: "Module" }
});
const require__utils_cssr_index = require("../../_utils/cssr/index.js");
const require__utils_naive_warn = require("../../_utils/naive/warn.js");
const require__utils_vue_call = require("../../_utils/vue/call.js");
const require__mixins_use_config = require("../../_mixins/use-config.js");
const require__mixins_use_form_item = require("../../_mixins/use-form-item.js");
const require__mixins_use_locale = require("../../_mixins/use-locale.js");
const require__mixins_use_theme = require("../../_mixins/use-theme.js");
const require_vdom = require("../../vue-jsx-vapor/vdom.js");
const require__internal_icon_src_Icon = require("../../_internal/icon/src/Icon.js");
const require__internal_icons_ChevronLeft = require("../../_internal/icons/ChevronLeft.js");
const require__internal_icons_ChevronRight = require("../../_internal/icons/ChevronRight.js");
const require_button_src_Button = require("../../button/src/Button.js");
const require_legacy_transfer_styles_light = require("../styles/light.js");
const require_legacy_transfer_src_interface = require("./interface.js");
const require_legacy_transfer_src_styles_index_cssr = require("./styles/index.cssr.js");
const require_legacy_transfer_src_TransferFilter = require("./TransferFilter.js");
const require_legacy_transfer_src_TransferHeader = require("./TransferHeader.js");
const require_legacy_transfer_src_TransferList = require("./TransferList.js");
const require_legacy_transfer_src_use_transfer_data = require("./use-transfer-data.js");
let seemly = require("seemly");
let vue = require("vue");
let vooks = require("vooks");
//#region src/legacy-transfer/src/Transfer.tsx
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
	sourceTitle: String,
	targetTitle: String,
	filterable: Boolean,
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
	"onUpdate:value": [Function, Array],
	onUpdateValue: [Function, Array],
	onChange: [Function, Array]
};
var Transfer_default = (0, vue.defineComponent)({
	name: "LegacyTransfer",
	props: transferProps,
	setup(props) {
		if (process.env.NODE_ENV !== "production") (0, vue.watchEffect)(() => {
			if (props.onChange !== void 0) require__utils_naive_warn.warnOnce("legacy-transfer", "`on-change` is deprecated, please use `on-update:value` instead.");
		});
		const { mergedClsPrefixRef } = require__mixins_use_config.default(props);
		const themeRef = require__mixins_use_theme.default("LegacyTransfer", "-legacy-transfer", require_legacy_transfer_src_styles_index_cssr, require_legacy_transfer_styles_light, props, mergedClsPrefixRef);
		const formItem = require__mixins_use_form_item.default(props);
		const { mergedSizeRef, mergedDisabledRef } = formItem;
		const itemSizeRef = (0, vue.computed)(() => {
			const { value: size } = mergedSizeRef;
			const { self: { [require__utils_cssr_index.createKey("itemHeight", size)]: itemSize } } = themeRef.value;
			return (0, seemly.depx)(itemSize);
		});
		const { uncontrolledValue: uncontrolledValueRef, mergedValue: mergedValueRef, avlSrcValueSet: avlSrcValueSetRef, avlTgtValueSet: avlTgtValueSetRef, tgtOpts: tgtOptsRef, srcOpts: srcOptsRef, filteredSrcOpts: filteredSrcOptsRef, filteredTgtOpts: filteredTgtOptsRef, srcCheckedValues: srcCheckedValuesRef, tgtCheckedValues: tgtCheckedValuesRef, srcCheckedStatus: srcCheckedStatusRef, tgtCheckedStatus: tgtCheckedStatusRef, srcPattern: srcPatternRef, tgtPattern: tgtPatternRef, isInputing: isInputingRef, fromButtonDisabled: fromButtonDisabledRef, toButtonDisabled: toButtonDisabledRef, handleInputFocus, handleInputBlur, handleTgtFilterUpdateValue, handleSrcFilterUpdateValue } = require_legacy_transfer_src_use_transfer_data.useTransferData(props, mergedDisabledRef);
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
		function handleSrcHeaderCheck() {
			const { value: { checked, indeterminate } } = srcCheckedStatusRef;
			if (indeterminate || checked) srcCheckedValuesRef.value = [];
			else srcCheckedValuesRef.value = Array.from(avlSrcValueSetRef.value);
		}
		function handleTgtHeaderCheck() {
			const { value: { checked, indeterminate } } = tgtCheckedStatusRef;
			if (indeterminate || checked) tgtCheckedValuesRef.value = [];
			else tgtCheckedValuesRef.value = Array.from(avlTgtValueSetRef.value);
		}
		function handleTgtCheckboxClick(checked, optionValue) {
			if (checked) tgtCheckedValuesRef.value.push(optionValue);
			else {
				const index = tgtCheckedValuesRef.value.findIndex((v) => v === optionValue);
				if (~index) tgtCheckedValuesRef.value.splice(index, 1);
			}
		}
		function handleSrcCheckboxClick(checked, optionValue) {
			if (checked) srcCheckedValuesRef.value.push(optionValue);
			else {
				const index = srcCheckedValuesRef.value.findIndex((v) => v === optionValue);
				if (~index) srcCheckedValuesRef.value.splice(index, 1);
			}
		}
		function handleToTgtClick() {
			doUpdateValue(srcCheckedValuesRef.value.concat(mergedValueRef.value || []));
			srcCheckedValuesRef.value = [];
		}
		function handleToSrcClick() {
			const tgtCheckedValueSet = new Set(tgtCheckedValuesRef.value);
			doUpdateValue((mergedValueRef.value || []).filter((v) => !tgtCheckedValueSet.has(v)));
			tgtCheckedValuesRef.value = [];
		}
		(0, vue.provide)(require_legacy_transfer_src_interface.transferInjectionKey, {
			mergedClsPrefixRef,
			mergedSizeRef,
			disabledRef: mergedDisabledRef,
			mergedThemeRef: themeRef,
			srcCheckedValuesRef,
			tgtCheckedValuesRef,
			srcOptsRef,
			tgtOptsRef,
			srcCheckedStatusRef,
			tgtCheckedStatusRef,
			handleSrcCheckboxClick,
			handleTgtCheckboxClick
		});
		const { localeRef } = require__mixins_use_locale("LegacyTransfer");
		return {
			locale: localeRef,
			mergedClsPrefix: mergedClsPrefixRef,
			mergedDisabled: mergedDisabledRef,
			itemSize: itemSizeRef,
			isMounted: (0, vooks.useIsMounted)(),
			isInputing: isInputingRef,
			mergedTheme: themeRef,
			filteredSrcOpts: filteredSrcOptsRef,
			filteredTgtOpts: filteredTgtOptsRef,
			srcPattern: srcPatternRef,
			tgtPattern: tgtPatternRef,
			toButtonDisabled: toButtonDisabledRef,
			fromButtonDisabled: fromButtonDisabledRef,
			handleSrcHeaderCheck,
			handleTgtHeaderCheck,
			handleToSrcClick,
			handleToTgtClick,
			handleInputFocus,
			handleInputBlur,
			handleTgtFilterUpdateValue,
			handleSrcFilterUpdateValue,
			cssVars: (0, vue.computed)(() => {
				const { value: size } = mergedSizeRef;
				const { common: { cubicBezierEaseInOut, cubicBezierEaseIn, cubicBezierEaseOut }, self: { width, borderRadius, borderColor, listColor, headerColor, titleTextColor, titleTextColorDisabled, extraTextColor, filterDividerColor, itemTextColor, itemColorPending, itemTextColorDisabled, extraFontSize, titleFontWeight, iconColor, iconColorDisabled, [require__utils_cssr_index.createKey("fontSize", size)]: fontSize, [require__utils_cssr_index.createKey("itemHeight", size)]: itemHeight } } = themeRef.value;
				return {
					"--n-bezier": cubicBezierEaseInOut,
					"--n-bezier-ease-in": cubicBezierEaseIn,
					"--n-bezier-ease-out": cubicBezierEaseOut,
					"--n-border-color": borderColor,
					"--n-border-radius": borderRadius,
					"--n-extra-font-size": extraFontSize,
					"--n-filter-divider-color": filterDividerColor,
					"--n-font-size": fontSize,
					"--n-header-color": headerColor,
					"--n-header-extra-text-color": extraTextColor,
					"--n-header-font-weight": titleFontWeight,
					"--n-header-text-color": titleTextColor,
					"--n-header-text-color-disabled": titleTextColorDisabled,
					"--n-item-color-pending": itemColorPending,
					"--n-item-height": itemHeight,
					"--n-item-text-color": itemTextColor,
					"--n-item-text-color-disabled": itemTextColorDisabled,
					"--n-list-color": listColor,
					"--n-width": width,
					"--n-icon-color": iconColor,
					"--n-icon-color-disabled": iconColorDisabled
				};
			})
		};
	},
	render() {
		const { mergedClsPrefix } = this;
		return (0, vue.openBlock)(), (0, vue.createElementBlock)("div", {
			class: require_vdom.normalizeClass([
				`${mergedClsPrefix}-legacy-transfer`,
				this.mergedDisabled && `${mergedClsPrefix}-legacy-transfer--disabled`,
				this.filterable && `${mergedClsPrefix}-legacy-transfer--filterable`
			]),
			style: (0, vue.normalizeStyle)(this.cssVars)
		}, [
			(0, vue.createElementVNode)("div", { class: require_vdom.normalizeClass(`${mergedClsPrefix}-legacy-transfer-list`) }, [
				((0, vue.openBlock)(), (0, vue.createBlock)(require_legacy_transfer_src_TransferHeader, {
					source: true,
					onChange: this.handleSrcHeaderCheck,
					title: this.sourceTitle || this.locale.sourceTitle
				}, null, 8, ["onChange", "title"])),
				(0, vue.createElementVNode)("div", { class: require_vdom.normalizeClass(`${mergedClsPrefix}-legacy-transfer-list-body`) }, [this.filterable ? ((0, vue.openBlock)(), (0, vue.createBlock)(require_legacy_transfer_src_TransferFilter, {
					key: 0,
					onUpdateValue: this.handleSrcFilterUpdateValue,
					value: this.srcPattern,
					disabled: this.mergedDisabled,
					placeholder: this.sourceFilterPlaceholder,
					onFocus: this.handleInputFocus,
					onBlur: this.handleInputBlur
				}, null, 8, [
					"onUpdateValue",
					"value",
					"disabled",
					"placeholder",
					"onFocus",
					"onBlur"
				])) : require_vdom.normalizeVNode(() => null), (0, vue.createElementVNode)("div", { class: require_vdom.normalizeClass(`${mergedClsPrefix}-legacy-transfer-list-flex-container`) }, [((0, vue.openBlock)(), (0, vue.createBlock)(require_legacy_transfer_src_TransferList, {
					source: true,
					options: this.filteredSrcOpts,
					disabled: this.mergedDisabled,
					virtualScroll: this.virtualScroll,
					isMounted: this.isMounted,
					isInputing: this.isInputing,
					itemSize: this.itemSize
				}, null, 8, [
					"options",
					"disabled",
					"virtualScroll",
					"isMounted",
					"isInputing",
					"itemSize"
				]))], 2)], 2),
				(0, vue.createElementVNode)("div", { class: require_vdom.normalizeClass(`${mergedClsPrefix}-legacy-transfer-list__border`) }, null, 2)
			], 2),
			(0, vue.createElementVNode)("div", { class: require_vdom.normalizeClass(`${mergedClsPrefix}-legacy-transfer-gap`) }, [((0, vue.openBlock)(), (0, vue.createBlock)(require_button_src_Button.default, {
				disabled: this.toButtonDisabled || this.mergedDisabled,
				theme: this.mergedTheme.peers.Button,
				themeOverrides: this.mergedTheme.peerOverrides.Button,
				onClick: this.handleToTgtClick
			}, { icon: () => ((0, vue.openBlock)(), (0, vue.createBlock)(require__internal_icon_src_Icon, { clsPrefix: mergedClsPrefix }, { default: () => ((0, vue.openBlock)(), (0, vue.createBlock)(require__internal_icons_ChevronRight)) }, 1032, ["clsPrefix"])) }, 1032, [
				"disabled",
				"theme",
				"themeOverrides",
				"onClick"
			])), ((0, vue.openBlock)(), (0, vue.createBlock)(require_button_src_Button.default, {
				disabled: this.fromButtonDisabled || this.mergedDisabled,
				theme: this.mergedTheme.peers.Button,
				themeOverrides: this.mergedTheme.peerOverrides.Button,
				onClick: this.handleToSrcClick
			}, { icon: () => ((0, vue.openBlock)(), (0, vue.createBlock)(require__internal_icon_src_Icon, { clsPrefix: mergedClsPrefix }, { default: () => ((0, vue.openBlock)(), (0, vue.createBlock)(require__internal_icons_ChevronLeft)) }, 1032, ["clsPrefix"])) }, 1032, [
				"disabled",
				"theme",
				"themeOverrides",
				"onClick"
			]))], 2),
			(0, vue.createElementVNode)("div", { class: require_vdom.normalizeClass(`${mergedClsPrefix}-legacy-transfer-list`) }, [
				((0, vue.openBlock)(), (0, vue.createBlock)(require_legacy_transfer_src_TransferHeader, {
					onChange: this.handleTgtHeaderCheck,
					title: this.targetTitle || this.locale.targetTitle
				}, null, 8, ["onChange", "title"])),
				(0, vue.createElementVNode)("div", { class: require_vdom.normalizeClass(`${mergedClsPrefix}-legacy-transfer-list-body`) }, [this.filterable ? ((0, vue.openBlock)(), (0, vue.createBlock)(require_legacy_transfer_src_TransferFilter, {
					key: 0,
					onUpdateValue: this.handleTgtFilterUpdateValue,
					value: this.tgtPattern,
					disabled: this.mergedDisabled,
					placeholder: this.targetFilterPlaceholder,
					onFocus: this.handleInputFocus,
					onBlur: this.handleInputBlur
				}, null, 8, [
					"onUpdateValue",
					"value",
					"disabled",
					"placeholder",
					"onFocus",
					"onBlur"
				])) : require_vdom.normalizeVNode(() => null), (0, vue.createElementVNode)("div", { class: require_vdom.normalizeClass(`${mergedClsPrefix}-legacy-transfer-list-flex-container`) }, [((0, vue.openBlock)(), (0, vue.createBlock)(require_legacy_transfer_src_TransferList, {
					options: this.filteredTgtOpts,
					disabled: this.mergedDisabled,
					virtualScroll: this.virtualScroll,
					isMounted: this.isMounted,
					isInputing: this.isInputing,
					itemSize: this.itemSize
				}, null, 8, [
					"options",
					"disabled",
					"virtualScroll",
					"isMounted",
					"isInputing",
					"itemSize"
				]))], 2)], 2),
				(0, vue.createElementVNode)("div", { class: require_vdom.normalizeClass(`${mergedClsPrefix}-legacy-transfer-list__border`) }, null, 2)
			], 2)
		], 6);
	}
});
//#endregion
exports.default = Transfer_default;
exports.transferProps = transferProps;
