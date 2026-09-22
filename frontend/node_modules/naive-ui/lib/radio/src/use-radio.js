Object.defineProperty(exports, Symbol.toStringTag, { value: "Module" });
const require__utils_vue_create_injection_key = require("../../_utils/vue/create-injection-key.js");
const require__utils_naive_warn = require("../../_utils/naive/warn.js");
const require__utils_vue_call = require("../../_utils/vue/call.js");
const require__mixins_use_config = require("../../_mixins/use-config.js");
const require__mixins_use_form_item = require("../../_mixins/use-form-item.js");
let vue = require("vue");
let vooks = require("vooks");
//#region src/radio/src/use-radio.ts
const radioBaseProps = {
	name: String,
	value: {
		type: [
			String,
			Number,
			Boolean
		],
		default: "on"
	},
	checked: {
		type: Boolean,
		default: void 0
	},
	defaultChecked: Boolean,
	disabled: {
		type: Boolean,
		default: void 0
	},
	label: String,
	size: String,
	onUpdateChecked: [Function, Array],
	"onUpdate:checked": [Function, Array],
	checkedValue: {
		type: Boolean,
		default: void 0
	}
};
const radioGroupInjectionKey = require__utils_vue_create_injection_key.createInjectionKey("n-radio-group");
function setup(props) {
	if (process.env.NODE_ENV !== "production") (0, vue.watchEffect)(() => {
		if (props.checkedValue !== void 0) require__utils_naive_warn.warnOnce("radio", "`checked-value` is deprecated, please use `checked` instead.");
	});
	const NRadioGroup = (0, vue.inject)(radioGroupInjectionKey, null);
	const { mergedClsPrefixRef, mergedComponentPropsRef } = require__mixins_use_config.default(props);
	const formItem = require__mixins_use_form_item.default(props, {
		mergedSize(NFormItem) {
			const { size } = props;
			if (size !== void 0) return size;
			if (NRadioGroup) {
				const { mergedSizeRef: { value: mergedSize } } = NRadioGroup;
				if (mergedSize !== void 0) return mergedSize;
			}
			if (NFormItem) return NFormItem.mergedSize.value;
			const configSize = mergedComponentPropsRef?.value?.Radio?.size;
			if (configSize) return configSize;
			return "medium";
		},
		mergedDisabled(NFormItem) {
			if (props.disabled) return true;
			if (NRadioGroup?.disabledRef.value) return true;
			if (NFormItem?.disabled.value) return true;
			return false;
		}
	});
	const { mergedSizeRef, mergedDisabledRef } = formItem;
	const inputRef = (0, vue.ref)(null);
	const labelRef = (0, vue.ref)(null);
	const uncontrolledCheckedRef = (0, vue.ref)(props.defaultChecked);
	const controlledCheckedRef = (0, vue.toRef)(props, "checked");
	const mergedCheckedRef = (0, vooks.useMergedState)(controlledCheckedRef, uncontrolledCheckedRef);
	const renderSafeCheckedRef = (0, vooks.useMemo)(() => {
		if (NRadioGroup) return NRadioGroup.valueRef.value === props.value;
		return mergedCheckedRef.value;
	});
	const mergedNameRef = (0, vooks.useMemo)(() => {
		const { name } = props;
		if (name !== void 0) return name;
		if (NRadioGroup) return NRadioGroup.nameRef.value;
	});
	const focusRef = (0, vue.ref)(false);
	function doUpdateChecked() {
		if (NRadioGroup) {
			const { doUpdateValue } = NRadioGroup;
			const { value } = props;
			require__utils_vue_call.call(doUpdateValue, value);
		} else {
			const { onUpdateChecked, "onUpdate:checked": _onUpdateChecked } = props;
			const { nTriggerFormInput, nTriggerFormChange } = formItem;
			if (onUpdateChecked) require__utils_vue_call.call(onUpdateChecked, true);
			if (_onUpdateChecked) require__utils_vue_call.call(_onUpdateChecked, true);
			nTriggerFormInput();
			nTriggerFormChange();
			uncontrolledCheckedRef.value = true;
		}
	}
	function toggle() {
		if (mergedDisabledRef.value) return;
		if (!renderSafeCheckedRef.value) doUpdateChecked();
	}
	function handleRadioInputChange() {
		toggle();
		if (inputRef.value) inputRef.value.checked = renderSafeCheckedRef.value;
	}
	function handleRadioInputBlur() {
		focusRef.value = false;
	}
	function handleRadioInputFocus() {
		focusRef.value = true;
	}
	return {
		mergedClsPrefix: NRadioGroup ? NRadioGroup.mergedClsPrefixRef : mergedClsPrefixRef,
		inputRef,
		labelRef,
		mergedName: mergedNameRef,
		mergedDisabled: mergedDisabledRef,
		renderSafeChecked: renderSafeCheckedRef,
		focus: focusRef,
		mergedSize: mergedSizeRef,
		handleRadioInputChange,
		handleRadioInputBlur,
		handleRadioInputFocus
	};
}
//#endregion
exports.radioBaseProps = radioBaseProps;
exports.radioGroupInjectionKey = radioGroupInjectionKey;
exports.setup = setup;
