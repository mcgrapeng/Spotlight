Object.defineProperty(exports, Symbol.toStringTag, { value: "Module" });
let vue = require("vue");
let vooks = require("vooks");
//#region src/legacy-transfer/src/use-transfer-data.ts
function useTransferData(props, mergedDisabledRef) {
	const uncontrolledValueRef = (0, vue.ref)(props.defaultValue);
	const controlledValueRef = (0, vue.toRef)(props, "value");
	const mergedValueRef = (0, vooks.useMergedState)(controlledValueRef, uncontrolledValueRef);
	const optMapRef = (0, vue.computed)(() => {
		const map = /* @__PURE__ */ new Map();
		(props.options || []).forEach((opt) => map.set(opt.value, opt));
		return map;
	});
	const tgtValueSetRef = (0, vue.computed)(() => new Set(mergedValueRef.value || []));
	const srcOptsRef = (0, vue.computed)(() => props.options.filter((option) => !tgtValueSetRef.value.has(option.value)));
	const tgtOptsRef = (0, vue.computed)(() => {
		const optMap = optMapRef.value;
		return (mergedValueRef.value || []).map((v) => optMap.get(v));
	});
	const srcPatternRef = (0, vue.ref)("");
	const tgtPatternRef = (0, vue.ref)("");
	const filteredSrcOptsRef = (0, vue.computed)(() => {
		if (!props.filterable) return srcOptsRef.value;
		const { filter } = props;
		return srcOptsRef.value.filter((opt) => filter(srcPatternRef.value, opt, "source"));
	});
	const filteredTgtOptsRef = (0, vue.computed)(() => {
		if (!props.filterable) return tgtOptsRef.value;
		const { filter } = props;
		return tgtOptsRef.value.filter((opt) => filter(tgtPatternRef.value, opt, "target"));
	});
	const avlSrcValueSetRef = (0, vue.computed)(() => new Set(filteredSrcOptsRef.value.filter((opt) => !opt.disabled).map((opt) => opt.value)));
	const avlTgtValueSetRef = (0, vue.computed)(() => new Set(filteredTgtOptsRef.value.filter((opt) => !opt.disabled).map((opt) => opt.value)));
	const srcCheckedValuesRef = (0, vue.ref)([]);
	const tgtCheckedValuesRef = (0, vue.ref)([]);
	const srcCheckedStatusRef = (0, vue.computed)(() => {
		const srcCheckedLength = srcCheckedValuesRef.value.filter((v) => avlSrcValueSetRef.value.has(v)).length;
		const avlValueCount = avlSrcValueSetRef.value.size;
		if (avlValueCount === 0) return {
			checked: false,
			indeterminate: false,
			disabled: true
		};
		else if (srcCheckedLength === 0) return {
			checked: false,
			indeterminate: false
		};
		else if (srcCheckedLength === avlValueCount) return {
			checked: true,
			indeterminate: false
		};
		else return {
			checked: false,
			indeterminate: true
		};
	});
	const tgtCheckedStatusRef = (0, vue.computed)(() => {
		const tgtCheckedLength = tgtCheckedValuesRef.value.filter((v) => avlTgtValueSetRef.value.has(v)).length;
		const avlValueCount = avlTgtValueSetRef.value.size;
		if (avlValueCount === 0) return {
			checked: false,
			indeterminate: false,
			disabled: true
		};
		else if (tgtCheckedLength === 0) return {
			checked: false,
			indeterminate: false
		};
		else if (tgtCheckedLength === avlValueCount) return {
			checked: true,
			indeterminate: false
		};
		else return {
			checked: false,
			indeterminate: true
		};
	});
	const fromButtonDisabledRef = (0, vooks.useMemo)(() => {
		if (mergedDisabledRef.value) return true;
		return tgtCheckedValuesRef.value.length === 0;
	});
	const toButtonDisabledRef = (0, vooks.useMemo)(() => {
		if (mergedDisabledRef.value) return true;
		return srcCheckedValuesRef.value.length === 0;
	});
	const isInputingRef = (0, vue.ref)(false);
	function handleInputFocus() {
		isInputingRef.value = true;
	}
	function handleInputBlur() {
		isInputingRef.value = false;
	}
	function handleSrcFilterUpdateValue(value) {
		srcPatternRef.value = value ?? "";
	}
	function handleTgtFilterUpdateValue(value) {
		tgtPatternRef.value = value ?? "";
	}
	return {
		uncontrolledValue: uncontrolledValueRef,
		mergedValue: mergedValueRef,
		avlSrcValueSet: avlSrcValueSetRef,
		avlTgtValueSet: avlTgtValueSetRef,
		tgtOpts: tgtOptsRef,
		srcOpts: srcOptsRef,
		filteredSrcOpts: filteredSrcOptsRef,
		filteredTgtOpts: filteredTgtOptsRef,
		srcCheckedValues: srcCheckedValuesRef,
		tgtCheckedValues: tgtCheckedValuesRef,
		srcCheckedStatus: srcCheckedStatusRef,
		tgtCheckedStatus: tgtCheckedStatusRef,
		srcPattern: srcPatternRef,
		tgtPattern: tgtPatternRef,
		isInputing: isInputingRef,
		fromButtonDisabled: fromButtonDisabledRef,
		toButtonDisabled: toButtonDisabledRef,
		handleInputFocus,
		handleInputBlur,
		handleTgtFilterUpdateValue,
		handleSrcFilterUpdateValue
	};
}
//#endregion
exports.useTransferData = useTransferData;
