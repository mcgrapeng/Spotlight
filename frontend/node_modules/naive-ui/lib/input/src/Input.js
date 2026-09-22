Object.defineProperties(exports, {
	__esModule: { value: true },
	[Symbol.toStringTag]: { value: "Module" }
});
const require__utils_cssr_index = require("../../_utils/cssr/index.js");
const require__utils_vue_call = require("../../_utils/vue/call.js");
const require__utils_vue_resolve_slot = require("../../_utils/vue/resolve-slot.js");
const require__mixins_use_config = require("../../_mixins/use-config.js");
const require__mixins_use_css_vars_class = require("../../_mixins/use-css-vars-class.js");
const require__mixins_use_form_item = require("../../_mixins/use-form-item.js");
const require__mixins_use_locale = require("../../_mixins/use-locale.js");
const require__mixins_use_rtl = require("../../_mixins/use-rtl.js");
const require__mixins_use_style = require("../../_mixins/use-style.js");
const require__mixins_use_theme = require("../../_mixins/use-theme.js");
const require_vdom = require("../../vue-jsx-vapor/vdom.js");
const require__internal_icon_src_Icon = require("../../_internal/icon/src/Icon.js");
const require__internal_icons_Eye = require("../../_internal/icons/Eye.js");
const require__internal_icons_EyeOff = require("../../_internal/icons/EyeOff.js");
const require__internal_clear_src_Clear = require("../../_internal/clear/src/Clear.js");
const require__internal_scrollbar_src_Scrollbar = require("../../_internal/scrollbar/src/Scrollbar.js");
const require__internal_suffix_src_Suffix = require("../../_internal/suffix/src/Suffix.js");
const require__utils_env_browser = require("../../_utils/env/browser.js");
const require_input_styles_light = require("../styles/light.js");
const require_input_src_interface = require("./interface.js");
const require_input_src_styles_input_cssr = require("./styles/input.cssr.js");
const require_input_src_utils = require("./utils.js");
const require_input_src_WordCount = require("./WordCount.js");
let seemly = require("seemly");
let vue = require("vue");
let evtd = require("evtd");
let vooks = require("vooks");
let vueuc = require("vueuc");
//#region src/input/src/Input.tsx
const _hoisted_1 = [
	"autofocus",
	"rows",
	"placeholder",
	"value",
	"disabled",
	"maxlength",
	"minlength",
	"readonly",
	"tabindex",
	"onBlur",
	"onFocus",
	"onInput",
	"onChange",
	"onScroll"
];
const _hoisted_2 = [
	"type",
	"tabindex",
	"placeholder",
	"disabled",
	"maxlength",
	"minlength",
	"value",
	"readonly",
	"autofocus",
	"size",
	"onBlur",
	"onFocus",
	"onInput",
	"onChange"
];
const _hoisted_3 = ["onMousedown", "onClick"];
const _hoisted_4 = [
	"type",
	"tabindex",
	"placeholder",
	"disabled",
	"maxlength",
	"minlength",
	"value",
	"readonly",
	"onBlur",
	"onFocus",
	"onInput",
	"onChange"
];
const _hoisted_5 = [
	"tabindex",
	"onFocus",
	"onBlur",
	"onClick",
	"onMousedown",
	"onMouseenter",
	"onMouseleave",
	"onCompositionstart",
	"onCompositionend",
	"onKeyup",
	"onKeydown"
];
const inputProps = {
	...require__mixins_use_theme.default.props,
	bordered: {
		type: Boolean,
		default: void 0
	},
	type: {
		type: String,
		default: "text"
	},
	placeholder: [Array, String],
	defaultValue: {
		type: [String, Array],
		default: null
	},
	value: [String, Array],
	disabled: {
		type: Boolean,
		default: void 0
	},
	size: String,
	rows: {
		type: [Number, String],
		default: 3
	},
	round: Boolean,
	minlength: [String, Number],
	maxlength: [String, Number],
	clearable: Boolean,
	autosize: {
		type: [Boolean, Object],
		default: false
	},
	pair: Boolean,
	separator: String,
	readonly: {
		type: [String, Boolean],
		default: false
	},
	passivelyActivated: Boolean,
	showPasswordOn: String,
	stateful: {
		type: Boolean,
		default: true
	},
	autofocus: Boolean,
	inputProps: Object,
	resizable: {
		type: Boolean,
		default: true
	},
	showCount: Boolean,
	loading: {
		type: Boolean,
		default: void 0
	},
	allowInput: Function,
	renderCount: Function,
	onMousedown: Function,
	onKeydown: Function,
	onKeyup: [Function, Array],
	onInput: [Function, Array],
	onFocus: [Function, Array],
	onBlur: [Function, Array],
	onClick: [Function, Array],
	onChange: [Function, Array],
	onClear: [Function, Array],
	countGraphemes: Function,
	status: String,
	"onUpdate:value": [Function, Array],
	onUpdateValue: [Function, Array],
	/** private */
	textDecoration: [String, Array],
	attrSize: {
		type: Number,
		default: 20
	},
	onInputBlur: [Function, Array],
	onInputFocus: [Function, Array],
	onDeactivate: [Function, Array],
	onActivate: [Function, Array],
	onWrapperFocus: [Function, Array],
	onWrapperBlur: [Function, Array],
	internalDeactivateOnEnter: Boolean,
	internalForceFocus: Boolean,
	internalLoadingBeforeSuffix: {
		type: Boolean,
		default: true
	},
	/** deprecated */
	showPasswordToggle: Boolean
};
var Input_default = (0, vue.defineComponent)({
	name: "Input",
	props: inputProps,
	slots: Object,
	setup(props) {
		const { mergedClsPrefixRef, mergedBorderedRef, inlineThemeDisabled, mergedRtlRef, mergedComponentPropsRef } = require__mixins_use_config.default(props);
		const themeRef = require__mixins_use_theme.default("Input", "-input", require_input_src_styles_input_cssr.default, require_input_styles_light, props, mergedClsPrefixRef);
		if (require__utils_env_browser.isSafari) require__mixins_use_style("-input-safari", require_input_src_styles_input_cssr.safariStyle, mergedClsPrefixRef);
		const wrapperElRef = (0, vue.ref)(null);
		const textareaElRef = (0, vue.ref)(null);
		const textareaMirrorElRef = (0, vue.ref)(null);
		const inputMirrorElRef = (0, vue.ref)(null);
		const inputElRef = (0, vue.ref)(null);
		const inputEl2Ref = (0, vue.ref)(null);
		const currentFocusedInputRef = (0, vue.ref)(null);
		const focusedInputCursorControl = require_input_src_utils.useCursor(currentFocusedInputRef);
		const textareaScrollbarInstRef = (0, vue.ref)(null);
		const { localeRef } = require__mixins_use_locale("Input");
		const uncontrolledValueRef = (0, vue.ref)(props.defaultValue);
		const controlledValueRef = (0, vue.toRef)(props, "value");
		const mergedValueRef = (0, vooks.useMergedState)(controlledValueRef, uncontrolledValueRef);
		const formItem = require__mixins_use_form_item.default(props, { mergedSize: (NFormItem) => {
			const { size } = props;
			if (size) return size;
			const { mergedSize: formItemSize } = NFormItem || {};
			if (formItemSize?.value) return formItemSize.value;
			const configSize = mergedComponentPropsRef?.value?.Input?.size;
			if (configSize) return configSize;
			return "medium";
		} });
		const { mergedSizeRef, mergedDisabledRef, mergedStatusRef } = formItem;
		const focusedRef = (0, vue.ref)(false);
		const hoverRef = (0, vue.ref)(false);
		const isComposingRef = (0, vue.ref)(false);
		const activatedRef = (0, vue.ref)(false);
		let syncSource = null;
		const mergedPlaceholderRef = (0, vue.computed)(() => {
			const { placeholder, pair } = props;
			if (pair) {
				if (Array.isArray(placeholder)) return placeholder;
				else if (placeholder === void 0) return ["", ""];
				return [placeholder, placeholder];
			} else if (placeholder === void 0) return [localeRef.value.placeholder];
			else return [placeholder];
		});
		const showPlaceholder1Ref = (0, vue.computed)(() => {
			const { value: isComposing } = isComposingRef;
			const { value: mergedValue } = mergedValueRef;
			const { value: mergedPlaceholder } = mergedPlaceholderRef;
			return !isComposing && (require_input_src_utils.isEmptyInputValue(mergedValue) || Array.isArray(mergedValue) && require_input_src_utils.isEmptyInputValue(mergedValue[0])) && mergedPlaceholder[0];
		});
		const showPlaceholder2Ref = (0, vue.computed)(() => {
			const { value: isComposing } = isComposingRef;
			const { value: mergedValue } = mergedValueRef;
			const { value: mergedPlaceholder } = mergedPlaceholderRef;
			return !isComposing && mergedPlaceholder[1] && (require_input_src_utils.isEmptyInputValue(mergedValue) || Array.isArray(mergedValue) && require_input_src_utils.isEmptyInputValue(mergedValue[1]));
		});
		const mergedFocusRef = (0, vooks.useMemo)(() => {
			return props.internalForceFocus || focusedRef.value;
		});
		const showClearButton = (0, vooks.useMemo)(() => {
			if (mergedDisabledRef.value || props.readonly || !props.clearable || !mergedFocusRef.value && !hoverRef.value) return false;
			const { value: mergedValue } = mergedValueRef;
			const { value: mergedFocus } = mergedFocusRef;
			if (props.pair) return !!(Array.isArray(mergedValue) && (mergedValue[0] || mergedValue[1])) && (hoverRef.value || mergedFocus);
			else return !!mergedValue && (hoverRef.value || mergedFocus);
		});
		const mergedShowPasswordOnRef = (0, vue.computed)(() => {
			const { showPasswordOn } = props;
			if (showPasswordOn) return showPasswordOn;
			if (props.showPasswordToggle) return "click";
		});
		const passwordVisibleRef = (0, vue.ref)(false);
		const textDecorationStyleRef = (0, vue.computed)(() => {
			const { textDecoration } = props;
			if (!textDecoration) return ["", ""];
			if (Array.isArray(textDecoration)) return textDecoration.map((v) => ({ textDecoration: v }));
			return [{ textDecoration }];
		});
		const textAreaScrollContainerWidthRef = (0, vue.ref)(void 0);
		const updateTextAreaStyle = () => {
			if (props.type === "textarea") {
				const { autosize } = props;
				if (autosize) textAreaScrollContainerWidthRef.value = textareaScrollbarInstRef.value?.$el?.offsetWidth;
				if (!textareaElRef.value) return;
				if (typeof autosize === "boolean") return;
				const { paddingTop: stylePaddingTop, paddingBottom: stylePaddingBottom, lineHeight: styleLineHeight } = window.getComputedStyle(textareaElRef.value);
				const paddingTop = Number(stylePaddingTop.slice(0, -2));
				const paddingBottom = Number(stylePaddingBottom.slice(0, -2));
				const lineHeight = Number(styleLineHeight.slice(0, -2));
				const { value: textareaMirrorEl } = textareaMirrorElRef;
				if (!textareaMirrorEl) return;
				if (autosize.minRows) {
					const minRows = Math.max(autosize.minRows, 1);
					const styleMinHeight = `${paddingTop + paddingBottom + lineHeight * minRows}px`;
					textareaMirrorEl.style.minHeight = styleMinHeight;
				}
				if (autosize.maxRows) {
					const styleMaxHeight = `${paddingTop + paddingBottom + lineHeight * autosize.maxRows}px`;
					textareaMirrorEl.style.maxHeight = styleMaxHeight;
				}
			}
		};
		const maxlengthRef = (0, vue.computed)(() => {
			const { maxlength } = props;
			return maxlength === void 0 ? void 0 : Number(maxlength);
		});
		(0, vue.onMounted)(() => {
			const { value } = mergedValueRef;
			if (!Array.isArray(value)) syncMirror(value);
		});
		const vm = (0, vue.getCurrentInstance)().proxy;
		function doUpdateValue(value, meta) {
			const { onUpdateValue, "onUpdate:value": _onUpdateValue, onInput } = props;
			const { nTriggerFormInput } = formItem;
			if (onUpdateValue) require__utils_vue_call.call(onUpdateValue, value, meta);
			if (_onUpdateValue) require__utils_vue_call.call(_onUpdateValue, value, meta);
			if (onInput) require__utils_vue_call.call(onInput, value, meta);
			uncontrolledValueRef.value = value;
			nTriggerFormInput();
		}
		function doChange(value, meta) {
			const { onChange } = props;
			const { nTriggerFormChange } = formItem;
			if (onChange) require__utils_vue_call.call(onChange, value, meta);
			uncontrolledValueRef.value = value;
			nTriggerFormChange();
		}
		function doBlur(e) {
			const { onBlur } = props;
			const { nTriggerFormBlur } = formItem;
			if (onBlur) require__utils_vue_call.call(onBlur, e);
			nTriggerFormBlur();
		}
		function doFocus(e) {
			const { onFocus } = props;
			const { nTriggerFormFocus } = formItem;
			if (onFocus) require__utils_vue_call.call(onFocus, e);
			nTriggerFormFocus();
		}
		function doClear(e) {
			const { onClear } = props;
			if (onClear) require__utils_vue_call.call(onClear, e);
		}
		function doUpdateValueBlur(e) {
			const { onInputBlur } = props;
			if (onInputBlur) require__utils_vue_call.call(onInputBlur, e);
		}
		function doUpdateValueFocus(e) {
			const { onInputFocus } = props;
			if (onInputFocus) require__utils_vue_call.call(onInputFocus, e);
		}
		function doDeactivate() {
			const { onDeactivate } = props;
			if (onDeactivate) require__utils_vue_call.call(onDeactivate);
		}
		function doActivate() {
			const { onActivate } = props;
			if (onActivate) require__utils_vue_call.call(onActivate);
		}
		function doClick(e) {
			const { onClick } = props;
			if (onClick) require__utils_vue_call.call(onClick, e);
		}
		function doWrapperFocus(e) {
			const { onWrapperFocus } = props;
			if (onWrapperFocus) require__utils_vue_call.call(onWrapperFocus, e);
		}
		function doWrapperBlur(e) {
			const { onWrapperBlur } = props;
			if (onWrapperBlur) require__utils_vue_call.call(onWrapperBlur, e);
		}
		function handleCompositionStart() {
			isComposingRef.value = true;
		}
		function handleCompositionEnd(e) {
			isComposingRef.value = false;
			if (e.target === inputEl2Ref.value) handleInput(e, 1);
			else handleInput(e, 0);
		}
		function handleInput(e, index = 0, event = "input") {
			const targetValue = e.target.value;
			syncMirror(targetValue);
			if (e instanceof InputEvent && !e.isComposing) isComposingRef.value = false;
			if (props.type === "textarea") {
				const { value: textareaScrollbarInst } = textareaScrollbarInstRef;
				if (textareaScrollbarInst) textareaScrollbarInst.syncUnifiedContainer();
			}
			syncSource = targetValue;
			if (isComposingRef.value) return;
			focusedInputCursorControl.recordCursor();
			const isIncomingValueValid = allowInput(targetValue);
			if (isIncomingValueValid) {
				if (!props.pair) {
					if (event === "input") doUpdateValue(targetValue, { source: index });
					else doChange(targetValue, { source: index });
				} else {
					let { value } = mergedValueRef;
					if (!Array.isArray(value)) value = ["", ""];
					else value = [value[0], value[1]];
					value[index] = targetValue;
					if (event === "input") doUpdateValue(value, { source: index });
					else doChange(value, { source: index });
				}
			}
			vm.$forceUpdate();
			if (!isIncomingValueValid) (0, vue.nextTick)(focusedInputCursorControl.restoreCursor);
		}
		function allowInput(value) {
			const { countGraphemes, maxlength, minlength } = props;
			if (countGraphemes) {
				let graphemesCount;
				if (maxlength !== void 0) {
					if (graphemesCount === void 0) graphemesCount = countGraphemes(value);
					if (graphemesCount > Number(maxlength)) return false;
				}
				if (minlength !== void 0) {
					if (graphemesCount === void 0) graphemesCount = countGraphemes(value);
					if (graphemesCount < Number(maxlength)) return false;
				}
			}
			const { allowInput } = props;
			if (typeof allowInput === "function") return allowInput(value);
			return true;
		}
		function handleInputBlur(e) {
			doUpdateValueBlur(e);
			if (e.relatedTarget === wrapperElRef.value) doDeactivate();
			if (!(e.relatedTarget !== null && (e.relatedTarget === inputElRef.value || e.relatedTarget === inputEl2Ref.value || e.relatedTarget === textareaElRef.value))) activatedRef.value = false;
			dealWithEvent(e, "blur");
			currentFocusedInputRef.value = null;
		}
		function handleInputFocus(e, index) {
			doUpdateValueFocus(e);
			focusedRef.value = true;
			activatedRef.value = true;
			doActivate();
			dealWithEvent(e, "focus");
			if (index === 0) currentFocusedInputRef.value = inputElRef.value;
			else if (index === 1) currentFocusedInputRef.value = inputEl2Ref.value;
			else if (index === 2) currentFocusedInputRef.value = textareaElRef.value;
		}
		function handleWrapperBlur(e) {
			if (props.passivelyActivated) {
				doWrapperBlur(e);
				dealWithEvent(e, "blur");
			}
		}
		function handleWrapperFocus(e) {
			if (props.passivelyActivated) {
				focusedRef.value = true;
				doWrapperFocus(e);
				dealWithEvent(e, "focus");
			}
		}
		function dealWithEvent(e, type) {
			if (e.relatedTarget !== null && (e.relatedTarget === inputElRef.value || e.relatedTarget === inputEl2Ref.value || e.relatedTarget === textareaElRef.value || e.relatedTarget === wrapperElRef.value)) {} else if (type === "focus") {
				doFocus(e);
				focusedRef.value = true;
			} else if (type === "blur") {
				doBlur(e);
				focusedRef.value = false;
			}
		}
		function handleChange(e, index) {
			handleInput(e, index, "change");
		}
		function handleClick(e) {
			doClick(e);
		}
		function handleClear(e) {
			doClear(e);
			clearValue();
		}
		function clearValue() {
			if (props.pair) {
				doUpdateValue(["", ""], { source: "clear" });
				doChange(["", ""], { source: "clear" });
			} else {
				doUpdateValue("", { source: "clear" });
				doChange("", { source: "clear" });
			}
		}
		function handleMouseDown(e) {
			const { onMousedown } = props;
			if (onMousedown) onMousedown(e);
			const { tagName } = e.target;
			if (tagName !== "INPUT" && tagName !== "TEXTAREA") {
				if (props.resizable) {
					const { value: wrapperEl } = wrapperElRef;
					if (wrapperEl) {
						const { left, top, width, height } = wrapperEl.getBoundingClientRect();
						const resizeHandleSize = 14;
						if (left + width - resizeHandleSize < e.clientX && e.clientX < left + width && top + height - resizeHandleSize < e.clientY && e.clientY < top + height) return;
					}
				}
				e.preventDefault();
				if (!focusedRef.value) focus();
			}
		}
		function handleMouseEnter() {
			hoverRef.value = true;
			if (props.type === "textarea") textareaScrollbarInstRef.value?.handleMouseEnterWrapper();
		}
		function handleMouseLeave() {
			hoverRef.value = false;
			if (props.type === "textarea") textareaScrollbarInstRef.value?.handleMouseLeaveWrapper();
		}
		function handlePasswordToggleClick() {
			if (mergedDisabledRef.value) return;
			if (mergedShowPasswordOnRef.value !== "click") return;
			passwordVisibleRef.value = !passwordVisibleRef.value;
		}
		function handlePasswordToggleMousedown(e) {
			if (mergedDisabledRef.value) return;
			e.preventDefault();
			const preventDefaultOnce = (e) => {
				e.preventDefault();
				(0, evtd.off)("mouseup", document, preventDefaultOnce);
			};
			(0, evtd.on)("mouseup", document, preventDefaultOnce);
			if (mergedShowPasswordOnRef.value !== "mousedown") return;
			passwordVisibleRef.value = true;
			const hidePassword = () => {
				passwordVisibleRef.value = false;
				(0, evtd.off)("mouseup", document, hidePassword);
			};
			(0, evtd.on)("mouseup", document, hidePassword);
		}
		function handleWrapperKeyup(e) {
			if (props.onKeyup) require__utils_vue_call.call(props.onKeyup, e);
		}
		function handleWrapperKeydown(e) {
			if (props.onKeydown) require__utils_vue_call.call(props.onKeydown, e);
			switch (e.key) {
				case "Escape":
					handleWrapperKeydownEsc();
					break;
				case "Enter": handleWrapperKeydownEnter(e);
			}
		}
		function handleWrapperKeydownEnter(e) {
			if (props.passivelyActivated) {
				const { value: focused } = activatedRef;
				if (focused) {
					if (props.internalDeactivateOnEnter) handleWrapperKeydownEsc();
					return;
				}
				e.preventDefault();
				if (props.type === "textarea") textareaElRef.value?.focus();
				else inputElRef.value?.focus();
			}
		}
		function handleWrapperKeydownEsc() {
			if (props.passivelyActivated) {
				activatedRef.value = false;
				(0, vue.nextTick)(() => {
					wrapperElRef.value?.focus();
				});
			}
		}
		function focus() {
			if (mergedDisabledRef.value) return;
			if (props.passivelyActivated) wrapperElRef.value?.focus();
			else {
				textareaElRef.value?.focus();
				inputElRef.value?.focus();
			}
		}
		function blur() {
			if (wrapperElRef.value?.contains(document.activeElement)) document.activeElement.blur();
		}
		function select() {
			textareaElRef.value?.select();
			inputElRef.value?.select();
		}
		function activate() {
			if (mergedDisabledRef.value) return;
			if (textareaElRef.value) textareaElRef.value.focus();
			else if (inputElRef.value) inputElRef.value.focus();
		}
		function deactivate() {
			const { value: wrapperEl } = wrapperElRef;
			if (wrapperEl?.contains(document.activeElement) && wrapperEl !== document.activeElement) handleWrapperKeydownEsc();
		}
		function scrollTo(options) {
			if (props.type === "textarea") {
				const { value: textareaEl } = textareaElRef;
				textareaEl?.scrollTo(options);
			} else {
				const { value: inputEl } = inputElRef;
				inputEl?.scrollTo(options);
			}
		}
		function syncMirror(value) {
			const { type, pair, autosize } = props;
			if (!pair && autosize) {
				if (type === "textarea") {
					const { value: textareaMirrorEl } = textareaMirrorElRef;
					if (textareaMirrorEl) textareaMirrorEl.textContent = `${value ?? ""}\r\n`;
				} else {
					const { value: inputMirrorEl } = inputMirrorElRef;
					if (inputMirrorEl) {
						if (value) inputMirrorEl.textContent = value;
						else inputMirrorEl.innerHTML = "&nbsp;";
					}
				}
			}
		}
		function handleTextAreaMirrorResize() {
			updateTextAreaStyle();
		}
		const placeholderStyleRef = (0, vue.ref)({ top: "0" });
		function handleTextAreaScroll(e) {
			const { scrollTop } = e.target;
			placeholderStyleRef.value.top = `${-scrollTop}px`;
			textareaScrollbarInstRef.value?.syncUnifiedContainer();
		}
		let stopWatchMergedValue1 = null;
		(0, vue.watchEffect)(() => {
			const { autosize, type } = props;
			if (autosize && type === "textarea") stopWatchMergedValue1 = (0, vue.watch)(mergedValueRef, (value) => {
				if (!Array.isArray(value) && value !== syncSource) syncMirror(value);
			});
			else stopWatchMergedValue1?.();
		});
		let stopWatchMergedValue2 = null;
		(0, vue.watchEffect)(() => {
			if (props.type === "textarea") stopWatchMergedValue2 = (0, vue.watch)(mergedValueRef, (value) => {
				if (!Array.isArray(value) && value !== syncSource) textareaScrollbarInstRef.value?.syncUnifiedContainer();
			});
			else stopWatchMergedValue2?.();
		});
		(0, vue.provide)(require_input_src_interface.inputInjectionKey, {
			mergedValueRef,
			maxlengthRef,
			mergedClsPrefixRef,
			countGraphemesRef: (0, vue.toRef)(props, "countGraphemes")
		});
		const exposedProps = {
			wrapperElRef,
			inputElRef,
			textareaElRef,
			isCompositing: isComposingRef,
			clear: clearValue,
			focus,
			blur,
			select,
			deactivate,
			activate,
			scrollTo
		};
		const rtlEnabledRef = require__mixins_use_rtl.useRtl("Input", mergedRtlRef, mergedClsPrefixRef);
		const cssVarsRef = (0, vue.computed)(() => {
			const { value: size } = mergedSizeRef;
			const { common: { cubicBezierEaseInOut }, self: { color, colorHover, borderRadius, textColor, caretColor, caretColorError, caretColorWarning, textDecorationColor, border, borderDisabled, borderHover, borderFocus, placeholderColor, placeholderColorDisabled, lineHeightTextarea, colorDisabled, colorFocus, textColorDisabled, boxShadowFocus, iconSize, colorFocusWarning, boxShadowFocusWarning, borderWarning, borderFocusWarning, borderHoverWarning, colorFocusError, boxShadowFocusError, borderError, borderFocusError, borderHoverError, clearSize, clearColor, clearColorHover, clearColorPressed, iconColor, iconColorDisabled, suffixTextColor, countTextColor, countTextColorDisabled, iconColorHover, iconColorPressed, loadingColor, loadingColorError, loadingColorWarning, fontWeight, [require__utils_cssr_index.createKey("padding", size)]: padding, [require__utils_cssr_index.createKey("fontSize", size)]: fontSize, [require__utils_cssr_index.createKey("height", size)]: height } } = themeRef.value;
			const { left: paddingLeft, right: paddingRight } = (0, seemly.getPadding)(padding);
			return {
				"--n-bezier": cubicBezierEaseInOut,
				"--n-count-text-color": countTextColor,
				"--n-count-text-color-disabled": countTextColorDisabled,
				"--n-color": color,
				"--n-color-hover": colorHover,
				"--n-font-size": fontSize,
				"--n-font-weight": fontWeight,
				"--n-border-radius": borderRadius,
				"--n-height": height,
				"--n-padding-left": paddingLeft,
				"--n-padding-right": paddingRight,
				"--n-text-color": textColor,
				"--n-caret-color": caretColor,
				"--n-text-decoration-color": textDecorationColor,
				"--n-border": border,
				"--n-border-disabled": borderDisabled,
				"--n-border-hover": borderHover,
				"--n-border-focus": borderFocus,
				"--n-placeholder-color": placeholderColor,
				"--n-placeholder-color-disabled": placeholderColorDisabled,
				"--n-icon-size": iconSize,
				"--n-line-height-textarea": lineHeightTextarea,
				"--n-color-disabled": colorDisabled,
				"--n-color-focus": colorFocus,
				"--n-text-color-disabled": textColorDisabled,
				"--n-box-shadow-focus": boxShadowFocus,
				"--n-loading-color": loadingColor,
				"--n-caret-color-warning": caretColorWarning,
				"--n-color-focus-warning": colorFocusWarning,
				"--n-box-shadow-focus-warning": boxShadowFocusWarning,
				"--n-border-warning": borderWarning,
				"--n-border-focus-warning": borderFocusWarning,
				"--n-border-hover-warning": borderHoverWarning,
				"--n-loading-color-warning": loadingColorWarning,
				"--n-caret-color-error": caretColorError,
				"--n-color-focus-error": colorFocusError,
				"--n-box-shadow-focus-error": boxShadowFocusError,
				"--n-border-error": borderError,
				"--n-border-focus-error": borderFocusError,
				"--n-border-hover-error": borderHoverError,
				"--n-loading-color-error": loadingColorError,
				"--n-clear-color": clearColor,
				"--n-clear-size": clearSize,
				"--n-clear-color-hover": clearColorHover,
				"--n-clear-color-pressed": clearColorPressed,
				"--n-icon-color": iconColor,
				"--n-icon-color-hover": iconColorHover,
				"--n-icon-color-pressed": iconColorPressed,
				"--n-icon-color-disabled": iconColorDisabled,
				"--n-suffix-text-color": suffixTextColor
			};
		});
		const themeClassHandle = inlineThemeDisabled ? require__mixins_use_css_vars_class.useThemeClass("input", (0, vue.computed)(() => {
			const { value: size } = mergedSizeRef;
			return size[0];
		}), cssVarsRef, props) : void 0;
		return {
			...exposedProps,
			wrapperElRef,
			inputElRef,
			inputMirrorElRef,
			inputEl2Ref,
			textareaElRef,
			textareaMirrorElRef,
			textareaScrollbarInstRef,
			rtlEnabled: rtlEnabledRef,
			uncontrolledValue: uncontrolledValueRef,
			mergedValue: mergedValueRef,
			passwordVisible: passwordVisibleRef,
			mergedPlaceholder: mergedPlaceholderRef,
			showPlaceholder1: showPlaceholder1Ref,
			showPlaceholder2: showPlaceholder2Ref,
			mergedFocus: mergedFocusRef,
			isComposing: isComposingRef,
			activated: activatedRef,
			showClearButton,
			mergedSize: mergedSizeRef,
			mergedDisabled: mergedDisabledRef,
			textDecorationStyle: textDecorationStyleRef,
			mergedClsPrefix: mergedClsPrefixRef,
			mergedBordered: mergedBorderedRef,
			mergedShowPasswordOn: mergedShowPasswordOnRef,
			placeholderStyle: placeholderStyleRef,
			mergedStatus: mergedStatusRef,
			textAreaScrollContainerWidth: textAreaScrollContainerWidthRef,
			handleTextAreaScroll,
			handleCompositionStart,
			handleCompositionEnd,
			handleInput,
			handleInputBlur,
			handleInputFocus,
			handleWrapperBlur,
			handleWrapperFocus,
			handleMouseEnter,
			handleMouseLeave,
			handleMouseDown,
			handleChange,
			handleClick,
			handleClear,
			handlePasswordToggleClick,
			handlePasswordToggleMousedown,
			handleWrapperKeydown,
			handleWrapperKeyup,
			handleTextAreaMirrorResize,
			getTextareaScrollContainer: () => {
				return textareaElRef.value;
			},
			mergedTheme: themeRef,
			cssVars: inlineThemeDisabled ? void 0 : cssVarsRef,
			themeClass: themeClassHandle?.themeClass,
			onRender: themeClassHandle?.onRender
		};
	},
	render() {
		const { mergedClsPrefix, mergedStatus, themeClass, type, countGraphemes, onRender } = this;
		const $slots = this.$slots;
		onRender?.();
		return (0, vue.openBlock)(), (0, vue.createElementBlock)("div", {
			ref: "wrapperElRef",
			class: require_vdom.normalizeClass([
				`${mergedClsPrefix}-input`,
				`${mergedClsPrefix}-input--${this.mergedSize}-size`,
				themeClass,
				mergedStatus && `${mergedClsPrefix}-input--${mergedStatus}-status`,
				{
					[`${mergedClsPrefix}-input--rtl`]: this.rtlEnabled,
					[`${mergedClsPrefix}-input--disabled`]: this.mergedDisabled,
					[`${mergedClsPrefix}-input--textarea`]: type === "textarea",
					[`${mergedClsPrefix}-input--resizable`]: this.resizable && !this.autosize,
					[`${mergedClsPrefix}-input--autosize`]: this.autosize,
					[`${mergedClsPrefix}-input--round`]: this.round && !(type === "textarea"),
					[`${mergedClsPrefix}-input--pair`]: this.pair,
					[`${mergedClsPrefix}-input--focus`]: this.mergedFocus,
					[`${mergedClsPrefix}-input--stateful`]: this.stateful
				}
			]),
			style: (0, vue.normalizeStyle)(this.cssVars),
			tabindex: !this.mergedDisabled && this.passivelyActivated && !this.activated ? 0 : void 0,
			onFocus: this.handleWrapperFocus,
			onBlur: this.handleWrapperBlur,
			onClick: this.handleClick,
			onMousedown: this.handleMouseDown,
			onMouseenter: this.handleMouseEnter,
			onMouseleave: this.handleMouseLeave,
			onCompositionstart: this.handleCompositionStart,
			onCompositionend: this.handleCompositionEnd,
			onKeyup: this.handleWrapperKeyup,
			onKeydown: this.handleWrapperKeydown
		}, [
			(0, vue.createElementVNode)("div", { class: require_vdom.normalizeClass(`${mergedClsPrefix}-input-wrapper`) }, [
				require_vdom.normalizeVNode(() => require__utils_vue_resolve_slot.resolveWrappedSlot($slots.prefix, (children) => children && ((0, vue.openBlock)(), (0, vue.createElementBlock)("div", { class: require_vdom.normalizeClass(`${mergedClsPrefix}-input__prefix`) }, [require_vdom.normalizeVNode(() => children)], 2)))),
				type === "textarea" ? ((0, vue.openBlock)(), (0, vue.createBlock)(require__internal_scrollbar_src_Scrollbar.default, {
					key: 0,
					ref: "textareaScrollbarInstRef",
					class: require_vdom.normalizeClass(`${mergedClsPrefix}-input__textarea`),
					container: this.getTextareaScrollContainer,
					theme: this.theme?.peers?.Scrollbar,
					themeOverrides: this.themeOverrides?.peers?.Scrollbar,
					triggerDisplayManually: true,
					useUnifiedContainer: true,
					internalHoistYRail: true
				}, { default: () => {
					const { textAreaScrollContainerWidth } = this;
					const scrollContainerWidthStyle = { width: this.autosize && textAreaScrollContainerWidth && `${textAreaScrollContainerWidth}px` };
					return (0, vue.openBlock)(), (0, vue.createElementBlock)(vue.Fragment, null, [
						(0, vue.createElementVNode)("textarea", (0, vue.mergeProps)(this.inputProps, {
							ref: "textareaElRef",
							class: [`${mergedClsPrefix}-input__textarea-el`, this.inputProps?.class],
							autofocus: this.autofocus,
							rows: Number(this.rows),
							placeholder: this.placeholder,
							value: this.mergedValue,
							disabled: this.mergedDisabled,
							maxlength: countGraphemes ? void 0 : this.maxlength,
							minlength: countGraphemes ? void 0 : this.minlength,
							readonly: this.readonly,
							tabindex: this.passivelyActivated && !this.activated ? -1 : void 0,
							style: [
								this.textDecorationStyle[0],
								this.inputProps?.style,
								scrollContainerWidthStyle
							],
							onBlur: this.handleInputBlur,
							onFocus: (e) => {
								this.handleInputFocus(e, 2);
							},
							onInput: this.handleInput,
							onChange: this.handleChange,
							onScroll: this.handleTextAreaScroll
						}), null, 16, _hoisted_1),
						this.showPlaceholder1 ? ((0, vue.openBlock)(), (0, vue.createElementBlock)("div", {
							class: require_vdom.normalizeClass(`${mergedClsPrefix}-input__placeholder`),
							style: (0, vue.normalizeStyle)([this.placeholderStyle, scrollContainerWidthStyle]),
							key: "placeholder"
						}, [require_vdom.normalizeVNode(() => this.mergedPlaceholder[0])], 6)) : require_vdom.normalizeVNode(() => null),
						this.autosize ? ((0, vue.openBlock)(), (0, vue.createBlock)(vueuc.VResizeObserver, {
							key: 2,
							onResize: this.handleTextAreaMirrorResize
						}, { default: () => ((0, vue.openBlock)(), (0, vue.createElementBlock)("div", {
							ref: "textareaMirrorElRef",
							class: require_vdom.normalizeClass(`${mergedClsPrefix}-input__textarea-mirror`),
							key: "mirror"
						}, null, 2)) }, 1032, ["onResize"])) : require_vdom.normalizeVNode(() => null)
					], 64);
				} }, 1032, [
					"class",
					"container",
					"theme",
					"themeOverrides"
				])) : ((0, vue.openBlock)(), (0, vue.createElementBlock)("div", {
					key: 1,
					class: require_vdom.normalizeClass(`${mergedClsPrefix}-input__input`)
				}, [
					(0, vue.createElementVNode)("input", (0, vue.mergeProps)({ type: type === "password" && this.mergedShowPasswordOn && this.passwordVisible ? "text" : type }, this.inputProps, {
						ref: "inputElRef",
						class: [`${mergedClsPrefix}-input__input-el`, this.inputProps?.class],
						style: [this.textDecorationStyle[0], this.inputProps?.style],
						tabindex: this.passivelyActivated && !this.activated ? -1 : this.inputProps?.tabindex,
						placeholder: this.mergedPlaceholder[0],
						disabled: this.mergedDisabled,
						maxlength: countGraphemes ? void 0 : this.maxlength,
						minlength: countGraphemes ? void 0 : this.minlength,
						value: Array.isArray(this.mergedValue) ? this.mergedValue[0] : this.mergedValue,
						readonly: this.readonly,
						autofocus: this.autofocus,
						size: this.attrSize,
						onBlur: this.handleInputBlur,
						onFocus: (e) => {
							this.handleInputFocus(e, 0);
						},
						onInput: (e) => {
							this.handleInput(e, 0);
						},
						onChange: (e) => {
							this.handleChange(e, 0);
						}
					}), null, 16, _hoisted_2),
					this.showPlaceholder1 ? ((0, vue.openBlock)(), (0, vue.createElementBlock)("div", {
						key: 0,
						class: require_vdom.normalizeClass(`${mergedClsPrefix}-input__placeholder`)
					}, [(0, vue.createElementVNode)("span", null, [require_vdom.normalizeVNode(() => this.mergedPlaceholder[0])])], 2)) : require_vdom.normalizeVNode(() => null),
					this.autosize ? ((0, vue.openBlock)(), (0, vue.createElementBlock)("div", {
						class: require_vdom.normalizeClass(`${mergedClsPrefix}-input__input-mirror`),
						key: "mirror",
						ref: "inputMirrorElRef"
					}, "\xA0", 2)) : require_vdom.normalizeVNode(() => null)
				], 2)),
				require_vdom.normalizeVNode(() => !this.pair && require__utils_vue_resolve_slot.resolveWrappedSlot($slots.suffix, (children) => {
					return children || this.clearable || this.showCount || this.mergedShowPasswordOn || this.loading !== void 0 ? ((0, vue.openBlock)(), (0, vue.createElementBlock)("div", {
						key: 1,
						class: require_vdom.normalizeClass(`${mergedClsPrefix}-input__suffix`)
					}, [require_vdom.normalizeVNode(() => [
						require__utils_vue_resolve_slot.resolveWrappedSlot($slots["clear-icon-placeholder"], (children) => {
							return (this.clearable || children) && ((0, vue.openBlock)(), (0, vue.createBlock)(require__internal_clear_src_Clear, {
								clsPrefix: mergedClsPrefix,
								show: this.showClearButton,
								onClear: this.handleClear
							}, {
								placeholder: () => children,
								icon: () => this.$slots["clear-icon"]?.()
							}, 1032, [
								"clsPrefix",
								"show",
								"onClear"
							]));
						}),
						!this.internalLoadingBeforeSuffix ? children : null,
						this.loading !== void 0 ? ((0, vue.openBlock)(), (0, vue.createBlock)(require__internal_suffix_src_Suffix, {
							key: 2,
							clsPrefix: mergedClsPrefix,
							loading: this.loading,
							showArrow: false,
							showClear: false,
							style: (0, vue.normalizeStyle)(this.cssVars)
						}, null, 8, [
							"clsPrefix",
							"loading",
							"style"
						])) : null,
						this.internalLoadingBeforeSuffix ? children : null,
						this.showCount && this.type !== "textarea" ? ((0, vue.openBlock)(), (0, vue.createBlock)(require_input_src_WordCount, { key: 3 }, { default: (props) => {
							const { renderCount } = this;
							if (renderCount) return renderCount(props);
							return $slots.count?.(props);
						} }, 1024)) : null,
						this.mergedShowPasswordOn && this.type === "password" ? ((0, vue.openBlock)(), (0, vue.createElementBlock)("div", {
							key: 4,
							class: require_vdom.normalizeClass(`${mergedClsPrefix}-input__eye`),
							onMousedown: this.handlePasswordToggleMousedown,
							onClick: this.handlePasswordToggleClick
						}, [this.passwordVisible ? ((0, vue.openBlock)(), (0, vue.createElementBlock)(vue.Fragment, { key: 0 }, [require_vdom.normalizeVNode(() => require__utils_vue_resolve_slot.resolveSlot($slots["password-visible-icon"], () => [((0, vue.openBlock)(), (0, vue.createBlock)(require__internal_icon_src_Icon, { clsPrefix: mergedClsPrefix }, { default: () => ((0, vue.openBlock)(), (0, vue.createBlock)(require__internal_icons_Eye)) }, 1032, ["clsPrefix"]))]))], 64)) : ((0, vue.openBlock)(), (0, vue.createElementBlock)(vue.Fragment, { key: 1 }, [require_vdom.normalizeVNode(() => require__utils_vue_resolve_slot.resolveSlot($slots["password-invisible-icon"], () => [((0, vue.openBlock)(), (0, vue.createBlock)(require__internal_icon_src_Icon, { clsPrefix: mergedClsPrefix }, { default: () => ((0, vue.openBlock)(), (0, vue.createBlock)(require__internal_icons_EyeOff)) }, 1032, ["clsPrefix"]))]))], 64))], 42, _hoisted_3)) : null
					])], 2)) : null;
				}))
			], 2),
			this.pair ? ((0, vue.openBlock)(), (0, vue.createElementBlock)("span", {
				key: 0,
				class: require_vdom.normalizeClass(`${mergedClsPrefix}-input__separator`)
			}, [require_vdom.normalizeVNode(() => require__utils_vue_resolve_slot.resolveSlot($slots.separator, () => [this.separator]))], 2)) : require_vdom.normalizeVNode(() => null),
			this.pair ? ((0, vue.openBlock)(), (0, vue.createElementBlock)("div", {
				key: 2,
				class: require_vdom.normalizeClass(`${mergedClsPrefix}-input-wrapper`)
			}, [(0, vue.createElementVNode)("div", { class: require_vdom.normalizeClass(`${mergedClsPrefix}-input__input`) }, [(0, vue.createElementVNode)("input", {
				ref: "inputEl2Ref",
				type: this.type,
				class: require_vdom.normalizeClass(`${mergedClsPrefix}-input__input-el`),
				tabindex: this.passivelyActivated && !this.activated ? -1 : void 0,
				placeholder: this.mergedPlaceholder[1],
				disabled: this.mergedDisabled,
				maxlength: countGraphemes ? void 0 : this.maxlength,
				minlength: countGraphemes ? void 0 : this.minlength,
				value: Array.isArray(this.mergedValue) ? this.mergedValue[1] : void 0,
				readonly: this.readonly,
				style: (0, vue.normalizeStyle)(this.textDecorationStyle[1]),
				onBlur: this.handleInputBlur,
				onFocus: (e) => {
					this.handleInputFocus(e, 1);
				},
				onInput: (e) => {
					this.handleInput(e, 1);
				},
				onChange: (e) => {
					this.handleChange(e, 1);
				}
			}, null, 46, _hoisted_4), this.showPlaceholder2 ? ((0, vue.openBlock)(), (0, vue.createElementBlock)("div", {
				key: 0,
				class: require_vdom.normalizeClass(`${mergedClsPrefix}-input__placeholder`)
			}, [(0, vue.createElementVNode)("span", null, [require_vdom.normalizeVNode(() => this.mergedPlaceholder[1])])], 2)) : require_vdom.normalizeVNode(() => null)], 2), require_vdom.normalizeVNode(() => require__utils_vue_resolve_slot.resolveWrappedSlot($slots.suffix, (children) => {
				return (this.clearable || children) && ((0, vue.openBlock)(), (0, vue.createElementBlock)("div", { class: require_vdom.normalizeClass(`${mergedClsPrefix}-input__suffix`) }, [require_vdom.normalizeVNode(() => [this.clearable && ((0, vue.openBlock)(), (0, vue.createBlock)(require__internal_clear_src_Clear, {
					clsPrefix: mergedClsPrefix,
					show: this.showClearButton,
					onClear: this.handleClear
				}, {
					icon: () => $slots["clear-icon"]?.(),
					placeholder: () => $slots["clear-icon-placeholder"]?.()
				}, 1032, [
					"clsPrefix",
					"show",
					"onClear"
				])), children])], 2));
			}))], 2)) : require_vdom.normalizeVNode(() => null),
			this.mergedBordered ? ((0, vue.openBlock)(), (0, vue.createElementBlock)("div", {
				key: 4,
				class: require_vdom.normalizeClass(`${mergedClsPrefix}-input__border`)
			}, null, 2)) : require_vdom.normalizeVNode(() => null),
			this.mergedBordered ? ((0, vue.openBlock)(), (0, vue.createElementBlock)("div", {
				key: 6,
				class: require_vdom.normalizeClass(`${mergedClsPrefix}-input__state-border`)
			}, null, 2)) : require_vdom.normalizeVNode(() => null),
			this.showCount && type === "textarea" ? ((0, vue.openBlock)(), (0, vue.createBlock)(require_input_src_WordCount, { key: 8 }, { default: (props) => {
				const { renderCount } = this;
				if (renderCount) return renderCount(props);
				return $slots.count?.(props);
			} }, 1024)) : require_vdom.normalizeVNode(() => null)
		], 46, _hoisted_5);
	}
});
//#endregion
exports.default = Input_default;
exports.inputProps = inputProps;
