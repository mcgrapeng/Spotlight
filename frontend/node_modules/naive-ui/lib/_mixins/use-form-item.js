Object.defineProperties(exports, {
	__esModule: { value: true },
	[Symbol.toStringTag]: { value: "Module" }
});
const require__utils_vue_create_injection_key = require("../_utils/vue/create-injection-key.js");
let vue = require("vue");
//#region src/_mixins/use-form-item.ts
const formItemInjectionKey = require__utils_vue_create_injection_key.createInjectionKey("n-form-item");
function useFormItem(props, { defaultSize = "medium", mergedSize, mergedDisabled } = {}) {
	const NFormItem = (0, vue.inject)(formItemInjectionKey, null);
	(0, vue.provide)(formItemInjectionKey, null);
	const mergedSizeRef = (0, vue.computed)(mergedSize ? () => mergedSize(NFormItem) : () => {
		const { size } = props;
		if (size) return size;
		if (NFormItem) {
			const { mergedSize } = NFormItem;
			if (mergedSize.value !== void 0) return mergedSize.value;
		}
		return defaultSize;
	});
	const mergedDisabledRef = (0, vue.computed)(mergedDisabled ? () => mergedDisabled(NFormItem) : () => {
		const { disabled } = props;
		if (disabled !== void 0) return disabled;
		if (NFormItem) return NFormItem.disabled.value;
		return false;
	});
	const mergedStatusRef = (0, vue.computed)(() => {
		const { status } = props;
		if (status) return status;
		return NFormItem?.mergedValidationStatus.value;
	});
	(0, vue.onBeforeUnmount)(() => {
		if (NFormItem) NFormItem.restoreValidation();
	});
	return {
		mergedSizeRef,
		mergedDisabledRef,
		mergedStatusRef,
		nTriggerFormBlur() {
			if (NFormItem) NFormItem.handleContentBlur();
		},
		nTriggerFormChange() {
			if (NFormItem) NFormItem.handleContentChange();
		},
		nTriggerFormFocus() {
			if (NFormItem) NFormItem.handleContentFocus();
		},
		nTriggerFormInput() {
			if (NFormItem) NFormItem.handleContentInput();
		}
	};
}
//#endregion
exports.default = useFormItem;
exports.formItemInjectionKey = formItemInjectionKey;
