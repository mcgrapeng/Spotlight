Object.defineProperties(exports, {
	__esModule: { value: true },
	[Symbol.toStringTag]: { value: "Module" }
});
const require__utils_cssr_index = require("../../_utils/cssr/index.js");
const require__utils_naive_value = require("../../_utils/naive/value.js");
const require__utils_vue_call = require("../../_utils/vue/call.js");
const require__utils_vue_resolve_slot = require("../../_utils/vue/resolve-slot.js");
const require__mixins_use_config = require("../../_mixins/use-config.js");
const require__mixins_use_css_vars_class = require("../../_mixins/use-css-vars-class.js");
const require__mixins_use_form_item = require("../../_mixins/use-form-item.js");
const require__mixins_use_rtl = require("../../_mixins/use-rtl.js");
const require__mixins_use_theme = require("../../_mixins/use-theme.js");
const require_vdom = require("../../vue-jsx-vapor/vdom.js");
const require_input_src_Input = require("../../input/src/Input.js");
const require_input_otp_styles_light = require("../styles/light.js");
const require_input_otp_src_styles_index_cssr = require("./styles/index.cssr.js");
let seemly = require("seemly");
let vue = require("vue");
let vooks = require("vooks");
//#region src/input-otp/src/InputOtp.tsx
const inputOtpProps = {
	...require__mixins_use_theme.default.props,
	defaultValue: {
		type: Array,
		default: []
	},
	value: Array,
	length: {
		type: Number,
		default: 6
	},
	block: Boolean,
	size: String,
	disabled: Boolean,
	mask: Boolean,
	readonly: Boolean,
	status: String,
	gap: [String, Number],
	placeholder: {
		type: String,
		default: ""
	},
	allowInput: Function,
	onBlur: [Function, Array],
	onFocus: [Function, Array],
	"onUpdate:value": [Function, Array],
	onUpdateValue: [Function, Array],
	onFinish: [Function, Array]
};
var InputOtp_default = (0, vue.defineComponent)({
	name: "InputOtp",
	props: inputOtpProps,
	slots: Object,
	setup(props) {
		const { mergedClsPrefixRef, mergedRtlRef, inlineThemeDisabled, mergedComponentPropsRef } = require__mixins_use_config.default(props);
		const themeRef = require__mixins_use_theme.default("InputOtp", "-input-otp", require_input_otp_src_styles_index_cssr, require_input_otp_styles_light.default, props, mergedClsPrefixRef);
		const rtlEnabledRef = require__mixins_use_rtl.useRtl("InputOtp", mergedRtlRef, mergedClsPrefixRef);
		const formItem = require__mixins_use_form_item.default(props, { mergedSize: (NFormItem) => {
			const { size } = props;
			if (size) return size;
			const { mergedSize: formItemSize } = NFormItem || {};
			if (formItemSize?.value) return formItemSize.value;
			const configSize = mergedComponentPropsRef?.value?.InputOtp?.size;
			if (configSize) return configSize;
			return "medium";
		} });
		const { mergedSizeRef, mergedDisabledRef, mergedStatusRef } = formItem;
		const cssVarsRef = (0, vue.computed)(() => {
			const { value: size } = mergedSizeRef;
			const { gap: propGap } = props;
			const { self: { [require__utils_cssr_index.createKey("inputWidth", size)]: inputWidth, [require__utils_cssr_index.createKey("gap", size)]: gap } } = themeRef.value;
			return {
				"--n-gap": propGap === void 0 ? gap : typeof propGap === "number" ? (0, seemly.pxfy)(propGap) : propGap,
				"--n-input-width": inputWidth
			};
		});
		const themeClassHandle = inlineThemeDisabled ? require__mixins_use_css_vars_class.useThemeClass("input-otp", (0, vue.computed)(() => {
			const { value: size } = mergedSizeRef;
			return size[0];
		}), cssVarsRef, props) : void 0;
		const uncontrolledValueRef = (0, vue.ref)(props.defaultValue);
		const controlledValueRef = (0, vue.toRef)(props, "value");
		const mergedValueRef = (0, vooks.useMergedState)(controlledValueRef, uncontrolledValueRef);
		const inputRefList = (0, vue.ref)([]);
		const inputTypeRef = (0, vue.computed)(() => props.mask ? "password" : "text");
		const handleFocus = (e, index) => {
			if (inputRefList?.value.some((inputInst) => inputInst.inputElRef === e.relatedTarget)) return;
			const { onFocus } = props;
			if (onFocus) require__utils_vue_call.call(onFocus, e, index);
			const { nTriggerFormFocus } = formItem;
			nTriggerFormFocus();
		};
		const handleBlur = (e, index) => {
			if (inputRefList?.value.some((inputInst) => inputInst.inputElRef === e.relatedTarget)) return;
			const { onBlur } = props;
			const { nTriggerFormBlur } = formItem;
			if (onBlur) require__utils_vue_call.call(onBlur, e, index);
			nTriggerFormBlur();
		};
		const focusOnChar = (charIndex) => {
			if (charIndex >= props.length) return;
			if (charIndex < 0) return;
			inputRefList?.value[charIndex].focus();
			inputRefList?.value[charIndex].select();
		};
		const focusOnNextChar = (currentIndex) => {
			if (currentIndex >= props.length - 1) return;
			focusOnChar(currentIndex + 1);
		};
		const focusOnPrevChar = (currentIndex) => {
			if (currentIndex <= 0) return;
			focusOnChar(currentIndex - 1);
		};
		const justifyValue = (value) => {
			const justifiedValue = value ? Array.from(value) : [];
			const length = props.length;
			while (justifiedValue.length > length) justifiedValue.pop();
			while (justifiedValue.length < length) justifiedValue.push("");
			return justifiedValue;
		};
		function doUpdateValue(value, meta) {
			const { nTriggerFormInput, nTriggerFormChange } = formItem;
			if (require__utils_naive_value.isArrayShallowEqual(value, mergedValueRef.value)) {
				nTriggerFormInput();
				return;
			}
			const { "onUpdate:value": _onUpdateValue, onUpdateValue, length, onFinish } = props;
			if (_onUpdateValue) require__utils_vue_call.call(_onUpdateValue, value, meta);
			if (onUpdateValue) require__utils_vue_call.call(onUpdateValue, value, meta);
			if (value.filter((v) => v).length === length && onFinish) require__utils_vue_call.call(onFinish, value);
			uncontrolledValueRef.value = value;
			nTriggerFormInput();
			nTriggerFormChange();
		}
		const handlePaste = (e, index) => {
			if (props.readonly || mergedDisabledRef.value) return;
			e.preventDefault();
			const { clipboardData } = e;
			const text = clipboardData?.getData("text");
			if (!text) return;
			const currentValue = justifyValue(mergedValueRef.value);
			let startIndex = index;
			const allowInput = props.allowInput;
			let pasteApplied = false;
			let appendedText = "";
			for (let i = 0; i < text.length; ++i) {
				if (allowInput && !allowInput(text[i], startIndex, currentValue)) continue;
				pasteApplied = true;
				currentValue[startIndex] = text[i];
				appendedText += text[i];
				startIndex++;
				if (startIndex >= currentValue.length) break;
			}
			if (pasteApplied) {
				focusOnChar(startIndex);
				doUpdateValue(currentValue, {
					diff: appendedText,
					index: startIndex,
					source: "paste"
				});
			}
		};
		const handleKeydown = (e, index) => {
			if (mergedDisabledRef.value) return;
			const keyCode = e.code || e.key;
			const currentValue = justifyValue(mergedValueRef.value);
			if (keyCode === "Backspace" && !props.readonly) {
				e.preventDefault();
				currentValue[Math.max(index, 0)] = "";
				doUpdateValue(currentValue, {
					diff: "",
					index,
					source: "delete"
				});
				focusOnPrevChar(index);
			} else if (keyCode === "ArrowLeft") {
				e.preventDefault();
				focusOnPrevChar(index);
			} else if (keyCode === "ArrowRight") {
				e.preventDefault();
				focusOnNextChar(index);
			}
		};
		const handleInput = (value, index) => {
			const currentValue = justifyValue(mergedValueRef.value);
			const currentValueAtIndex = currentValue[index];
			const text = value.replace(currentValueAtIndex, "") || value;
			if (text.length > 1) {
				let startIndex = index;
				const allowInput = props.allowInput;
				let pasteApplied = false;
				let appendedText = "";
				for (let i = 0; i < text.length; ++i) {
					if (allowInput && !allowInput(text[i], startIndex, currentValue)) continue;
					pasteApplied = true;
					currentValue[startIndex] = text[i];
					appendedText += text[i];
					startIndex++;
					if (startIndex >= currentValue.length) break;
				}
				if (pasteApplied) {
					focusOnChar(Math.min(startIndex, props.length - 1));
					doUpdateValue(currentValue, {
						diff: appendedText,
						index: startIndex,
						source: "input"
					});
				}
				return;
			}
			const char = text[text.length - 1] || "";
			const allowInput = props.allowInput;
			if (allowInput && !allowInput(char, index, currentValue)) return;
			currentValue[index] = char;
			doUpdateValue(currentValue, {
				diff: char,
				index,
				source: "input"
			});
			focusOnNextChar(index);
		};
		const getTemplateEvents = (index) => {
			return {
				onInput: (value) => handleInput(value, index),
				onPaste: (event) => handlePaste(event, index),
				onKeydown: (event) => handleKeydown(event, index),
				onFocus: (event) => handleFocus(event, index),
				onBlur: (event) => handleBlur(event, index)
			};
		};
		const exposedMethods = { focusOnChar };
		return {
			mergedTheme: themeRef,
			perItemValueArray: (0, vue.computed)(() => justifyValue(mergedValueRef.value)),
			mergedClsPrefix: mergedClsPrefixRef,
			inputRefList,
			inputType: inputTypeRef,
			rtlEnabled: rtlEnabledRef,
			mergedStatus: mergedStatusRef,
			mergedDisabled: mergedDisabledRef,
			cssVars: inlineThemeDisabled ? void 0 : cssVarsRef,
			themeClass: themeClassHandle?.themeClass,
			getTemplateEvents,
			onRender: themeClassHandle?.onRender,
			...exposedMethods
		};
	},
	render() {
		const { mergedTheme, mergedClsPrefix, perItemValueArray, size, placeholder, mergedDisabled, mergedStatus, readonly, inputType, $slots, getTemplateEvents, themeClass, onRender } = this;
		onRender?.();
		return (0, vue.openBlock)(), (0, vue.createElementBlock)("div", {
			style: (0, vue.normalizeStyle)(this.cssVars),
			class: require_vdom.normalizeClass([
				`${mergedClsPrefix}-input-otp`,
				themeClass,
				this.rtlEnabled && `${mergedClsPrefix}-input-otp--rtl`,
				this.block && `${mergedClsPrefix}-input-otp--block`
			])
		}, [require_vdom.normalizeVNode(() => (0, seemly.repeat)(this.length, void 0).map((_, index) => require__utils_vue_resolve_slot.resolveSlotWithTypedProps($slots.default, {
			index,
			value: perItemValueArray[index],
			type: inputType,
			size,
			placeholder,
			disabled: mergedDisabled,
			readonly,
			status: mergedStatus,
			builtinThemeOverrides: {
				paddingTiny: "0",
				paddingSmall: "0",
				paddingMedium: "0",
				paddingLarge: "0"
			},
			theme: mergedTheme.peers.Input,
			themeOverrides: mergedTheme.peerOverrides.Input,
			ref: (el) => this.inputRefList[index] = el,
			...getTemplateEvents(index)
		}, ({ index, ...restProps }) => [((0, vue.openBlock)(), (0, vue.createBlock)(require_input_src_Input.default, (0, vue.mergeProps)(restProps, { key: index }), null, 16))])))], 6);
	}
});
//#endregion
exports.default = InputOtp_default;
exports.inputOtpProps = inputOtpProps;
