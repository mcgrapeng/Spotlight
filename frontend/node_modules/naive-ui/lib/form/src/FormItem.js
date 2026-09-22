Object.defineProperties(exports, {
	__esModule: { value: true },
	[Symbol.toStringTag]: { value: "Module" }
});
const require_runtime = require("../../_virtual/_rolldown/runtime.js");
const require__utils_composable_use_collection = require("../../_utils/composable/use-collection.js");
const require__utils_cssr_index = require("../../_utils/cssr/index.js");
const require__utils_naive_warn = require("../../_utils/naive/warn.js");
const require__utils_vue_keysOf = require("../../_utils/vue/keysOf.js");
const require__utils_vue_resolve_slot = require("../../_utils/vue/resolve-slot.js");
const require__mixins_use_config = require("../../_mixins/use-config.js");
const require__mixins_use_css_vars_class = require("../../_mixins/use-css-vars-class.js");
const require__mixins_use_form_item = require("../../_mixins/use-form-item.js");
const require__mixins_use_theme = require("../../_mixins/use-theme.js");
const require_vdom = require("../../vue-jsx-vapor/vdom.js");
const require_form_styles_light = require("../styles/light.js");
const require_form_src_context = require("./context.js");
const require_form_src_styles_form_item_cssr = require("./styles/form-item.cssr.js");
const require_form_src_utils = require("./utils.js");
let seemly = require("seemly");
let vue = require("vue");
let lodash_es = require("lodash");
let async_validator = require("async-validator");
async_validator = require_runtime.__toESM(async_validator);
//#region src/form/src/FormItem.tsx
const formItemProps = {
	...require__mixins_use_theme.default.props,
	label: String,
	labelWidth: [Number, String],
	labelStyle: [String, Object],
	labelAlign: String,
	labelPlacement: String,
	path: String,
	first: Boolean,
	rulePath: String,
	required: Boolean,
	showRequireMark: {
		type: Boolean,
		default: void 0
	},
	requireMarkPlacement: String,
	showFeedback: {
		type: Boolean,
		default: void 0
	},
	rule: [Object, Array],
	size: String,
	ignorePathChange: Boolean,
	validationStatus: String,
	feedback: String,
	feedbackClass: String,
	feedbackStyle: [String, Object],
	showLabel: {
		type: Boolean,
		default: void 0
	},
	labelProps: Object,
	contentClass: String,
	contentStyle: [String, Object]
};
const formItemPropKeys = require__utils_vue_keysOf.keysOf(formItemProps);
function wrapValidator(validator, async) {
	return (...args) => {
		try {
			const validateResult = validator(...args);
			if (!async && (typeof validateResult === "boolean" || validateResult instanceof Error || Array.isArray(validateResult)) || validateResult?.then) return validateResult;
			else if (validateResult === void 0) return true;
			else {
				require__utils_naive_warn.warn("form-item/validate", `You return a ${typeof validateResult} typed value in the validator method, which is not recommended. Please use ${async ? "`Promise`" : "`boolean`, `Error` or `Promise`"} typed value instead.`);
				return true;
			}
		} catch (err) {
			require__utils_naive_warn.warn("form-item/validate", "An error is catched in the validation, so the validation won't be done. Your callback in `validate` method of `n-form` or `n-form-item` won't be called in this validation.");
			console.error(err);
			return;
		}
	};
}
var FormItem_default = (0, vue.defineComponent)({
	name: "FormItem",
	props: formItemProps,
	slots: Object,
	setup(props) {
		require__utils_composable_use_collection.useInjectionInstanceCollection(require_form_src_context.formItemInstsInjectionKey, "formItems", (0, vue.toRef)(props, "path"));
		const { mergedClsPrefixRef, inlineThemeDisabled } = require__mixins_use_config.default(props);
		const NForm = (0, vue.inject)(require_form_src_context.formInjectionKey, null);
		const formItemSizeRefs = require_form_src_utils.formItemSize(props);
		const formItemMiscRefs = require_form_src_utils.formItemMisc(props);
		const { validationErrored: validationErroredRef, validationWarned: validationWarnedRef } = formItemMiscRefs;
		const { mergedRequired: mergedRequiredRef, mergedRules: mergedRulesRef } = require_form_src_utils.formItemRule(props);
		const { mergedSize: mergedSizeRef } = formItemSizeRefs;
		const { mergedLabelPlacement: labelPlacementRef, mergedLabelAlign: labelTextAlignRef, mergedRequireMarkPlacement: mergedRequireMarkPlacementRef } = formItemMiscRefs;
		const renderExplainsRef = (0, vue.ref)([]);
		const feedbackIdRef = (0, vue.ref)((0, seemly.createId)());
		const labelElementRef = (0, vue.ref)(null);
		const mergedDisabledRef = NForm ? (0, vue.toRef)(NForm.props, "disabled") : (0, vue.ref)(false);
		const themeRef = require__mixins_use_theme.default("Form", "-form-item", require_form_src_styles_form_item_cssr, require_form_styles_light.default, props, mergedClsPrefixRef);
		(0, vue.watch)((0, vue.toRef)(props, "path"), () => {
			if (props.ignorePathChange) return;
			restoreValidation();
		});
		function invalidateLabelWidth() {
			if (!formItemMiscRefs.isAutoLabelWidth.value) return;
			const labelElement = labelElementRef.value;
			if (labelElement !== null) {
				const memoizedWhitespace = labelElement.style.whiteSpace;
				labelElement.style.whiteSpace = "nowrap";
				labelElement.style.width = "";
				NForm?.deriveMaxChildLabelWidth(Number(getComputedStyle(labelElement).width.slice(0, -2)));
				labelElement.style.whiteSpace = memoizedWhitespace;
			}
		}
		function restoreValidation() {
			renderExplainsRef.value = [];
			validationErroredRef.value = false;
			validationWarnedRef.value = false;
			if (props.feedback) feedbackIdRef.value = (0, seemly.createId)();
		}
		const internalValidate = async (trigger = null, shouldRuleBeApplied = () => true, options = { suppressWarning: true }) => {
			const { path } = props;
			if (!options) options = {};
			else if (!options.first) options.first = props.first;
			const { value: rules } = mergedRulesRef;
			const value = NForm ? (0, lodash_es.get)(NForm.props.model, path || "") : void 0;
			const messageRenderers = {};
			const originalMessageRendersMessage = {};
			const activeRules = (!trigger ? rules : rules.filter((rule) => {
				if (Array.isArray(rule.trigger)) return rule.trigger.includes(trigger);
				else return rule.trigger === trigger;
			})).filter(shouldRuleBeApplied).map((rule, i) => {
				const shallowClonedRule = Object.assign({}, rule);
				if (shallowClonedRule.validator) shallowClonedRule.validator = wrapValidator(shallowClonedRule.validator, false);
				if (shallowClonedRule.asyncValidator) shallowClonedRule.asyncValidator = wrapValidator(shallowClonedRule.asyncValidator, true);
				if (shallowClonedRule.renderMessage) {
					const rendererKey = `__renderMessage__${i}`;
					originalMessageRendersMessage[rendererKey] = shallowClonedRule.message;
					shallowClonedRule.message = rendererKey;
					messageRenderers[rendererKey] = shallowClonedRule.renderMessage;
				}
				return shallowClonedRule;
			});
			const activeErrorRules = activeRules.filter((r) => r.level !== "warning");
			const activeWarningRules = activeRules.filter((r) => r.level === "warning");
			const validationResult = {
				valid: true,
				errors: void 0,
				warnings: void 0
			};
			if (!activeRules.length) return validationResult;
			const mergedPath = path ?? "__n_no_path__";
			const validator = new async_validator.default({ [mergedPath]: activeErrorRules });
			const warningValidator = new async_validator.default({ [mergedPath]: activeWarningRules });
			const { validateMessages } = NForm?.props || {};
			if (validateMessages) {
				validator.messages(validateMessages);
				warningValidator.messages(validateMessages);
			}
			const renderMessages = (errors) => {
				renderExplainsRef.value = errors.map((error) => {
					const transformedMessage = error?.message || "";
					return {
						key: transformedMessage,
						render: () => {
							if (transformedMessage.startsWith("__renderMessage__")) return messageRenderers[transformedMessage]();
							return transformedMessage;
						}
					};
				});
				errors.forEach((error) => {
					if (error.message?.startsWith("__renderMessage__")) error.message = originalMessageRendersMessage[error.message];
				});
			};
			if (activeErrorRules.length) {
				const errors = await new Promise((resolve) => {
					validator.validate({ [mergedPath]: value }, options, resolve);
				});
				if (errors?.length) {
					validationResult.valid = false;
					validationResult.errors = errors;
					renderMessages(errors);
				}
			}
			if (activeWarningRules.length && !validationResult.errors) {
				const warnings = await new Promise((resolve) => {
					warningValidator.validate({ [mergedPath]: value }, options, resolve);
				});
				if (warnings?.length) {
					renderMessages(warnings);
					validationResult.warnings = warnings;
				}
			}
			if (!validationResult.errors && !validationResult.warnings) restoreValidation();
			else {
				validationErroredRef.value = !!validationResult.errors;
				validationWarnedRef.value = !!validationResult.warnings;
			}
			return validationResult;
		};
		function handleContentBlur() {
			internalValidate("blur");
		}
		function handleContentChange() {
			internalValidate("change");
		}
		function handleContentFocus() {
			internalValidate("focus");
		}
		function handleContentInput() {
			internalValidate("input");
		}
		async function validate(options, callback) {
			/** the following code is for compatibility */
			let trigger;
			let validateCallback;
			let shouldRuleBeApplied;
			let asyncValidatorOptions;
			if (typeof options === "string") {
				trigger = options;
				validateCallback = callback;
			} else if (options !== null && typeof options === "object") {
				trigger = options.trigger;
				validateCallback = options.callback;
				shouldRuleBeApplied = options.shouldRuleBeApplied;
				asyncValidatorOptions = options.options;
			}
			return await new Promise((resolve, reject) => {
				internalValidate(trigger, shouldRuleBeApplied, asyncValidatorOptions).then(({ valid, errors, warnings }) => {
					if (valid) {
						if (validateCallback) validateCallback(void 0, { warnings });
						resolve({ warnings });
					} else {
						if (validateCallback) validateCallback(errors, { warnings });
						reject(errors);
					}
				});
			});
		}
		(0, vue.provide)(require__mixins_use_form_item.formItemInjectionKey, {
			path: (0, vue.toRef)(props, "path"),
			disabled: mergedDisabledRef,
			mergedSize: formItemSizeRefs.mergedSize,
			mergedValidationStatus: formItemMiscRefs.mergedValidationStatus,
			restoreValidation,
			handleContentBlur,
			handleContentChange,
			handleContentFocus,
			handleContentInput
		});
		const exposedRef = {
			validate,
			restoreValidation,
			internalValidate,
			invalidateLabelWidth
		};
		(0, vue.onMounted)(invalidateLabelWidth);
		const cssVarsRef = (0, vue.computed)(() => {
			const { value: size } = mergedSizeRef;
			const { value: labelPlacement } = labelPlacementRef;
			const direction = labelPlacement === "top" ? "vertical" : "horizontal";
			const { common: { cubicBezierEaseInOut }, self: { labelTextColor, asteriskColor, lineHeight, feedbackTextColor, feedbackTextColorWarning, feedbackTextColorError, feedbackPadding, labelFontWeight, [require__utils_cssr_index.createKey("labelHeight", size)]: labelHeight, [require__utils_cssr_index.createKey("blankHeight", size)]: blankHeight, [require__utils_cssr_index.createKey("feedbackFontSize", size)]: feedbackFontSize, [require__utils_cssr_index.createKey("feedbackHeight", size)]: feedbackHeight, [require__utils_cssr_index.createKey("labelPadding", direction)]: labelPadding, [require__utils_cssr_index.createKey("labelTextAlign", direction)]: labelTextAlign, [require__utils_cssr_index.createKey(require__utils_cssr_index.createKey("labelFontSize", labelPlacement), size)]: labelFontSize } } = themeRef.value;
			let mergedLabelTextAlign = labelTextAlignRef.value ?? labelTextAlign;
			if (labelPlacement === "top") mergedLabelTextAlign = mergedLabelTextAlign === "right" ? "flex-end" : "flex-start";
			return {
				"--n-bezier": cubicBezierEaseInOut,
				"--n-line-height": lineHeight,
				"--n-blank-height": blankHeight,
				"--n-label-font-size": labelFontSize,
				"--n-label-text-align": mergedLabelTextAlign,
				"--n-label-height": labelHeight,
				"--n-label-padding": labelPadding,
				"--n-label-font-weight": labelFontWeight,
				"--n-asterisk-color": asteriskColor,
				"--n-label-text-color": labelTextColor,
				"--n-feedback-padding": feedbackPadding,
				"--n-feedback-font-size": feedbackFontSize,
				"--n-feedback-height": feedbackHeight,
				"--n-feedback-text-color": feedbackTextColor,
				"--n-feedback-text-color-warning": feedbackTextColorWarning,
				"--n-feedback-text-color-error": feedbackTextColorError
			};
		});
		const themeClassHandle = inlineThemeDisabled ? require__mixins_use_css_vars_class.useThemeClass("form-item", (0, vue.computed)(() => {
			return `${mergedSizeRef.value[0]}${labelPlacementRef.value[0]}${labelTextAlignRef.value?.[0] || ""}`;
		}), cssVarsRef, props) : void 0;
		return {
			labelElementRef,
			mergedClsPrefix: mergedClsPrefixRef,
			mergedRequired: mergedRequiredRef,
			feedbackId: feedbackIdRef,
			renderExplains: renderExplainsRef,
			reverseColSpace: (0, vue.computed)(() => {
				return labelPlacementRef.value === "left" && mergedRequireMarkPlacementRef.value === "left" && labelTextAlignRef.value === "left";
			}),
			...formItemMiscRefs,
			...formItemSizeRefs,
			...exposedRef,
			cssVars: inlineThemeDisabled ? void 0 : cssVarsRef,
			themeClass: themeClassHandle?.themeClass,
			onRender: themeClassHandle?.onRender
		};
	},
	render() {
		const { $slots, mergedClsPrefix, mergedShowLabel, mergedShowRequireMark, mergedRequireMarkPlacement, onRender } = this;
		const renderedShowRequireMark = mergedShowRequireMark !== void 0 ? mergedShowRequireMark : this.mergedRequired;
		onRender?.();
		const renderLabel = () => {
			const labelText = this.$slots.label ? this.$slots.label() : this.label;
			if (!labelText) return null;
			const textNode = ((0, vue.openBlock)(), (0, vue.createElementBlock)("span", { class: require_vdom.normalizeClass(`${mergedClsPrefix}-form-item-label__text`) }, [require_vdom.normalizeVNode(() => labelText)], 2));
			const markNode = renderedShowRequireMark ? ((0, vue.openBlock)(), (0, vue.createElementBlock)("span", {
				key: 1,
				class: require_vdom.normalizeClass(`${mergedClsPrefix}-form-item-label__asterisk`)
			}, [mergedRequireMarkPlacement !== "left" ? require_vdom.normalizeVNode(() => "\xA0*") : require_vdom.normalizeVNode(() => "*\xA0")], 2)) : mergedRequireMarkPlacement === "right-hanging" && ((0, vue.openBlock)(), (0, vue.createElementBlock)("span", {
				key: 2,
				class: require_vdom.normalizeClass(`${mergedClsPrefix}-form-item-label__asterisk-placeholder`)
			}, "\xA0*", 2));
			const { labelProps } = this;
			return (0, vue.openBlock)(), (0, vue.createElementBlock)("label", (0, vue.mergeProps)(labelProps, {
				class: [
					labelProps?.class,
					`${mergedClsPrefix}-form-item-label`,
					`${mergedClsPrefix}-form-item-label--${mergedRequireMarkPlacement}-mark`,
					this.reverseColSpace && `${mergedClsPrefix}-form-item-label--reverse-columns-space`
				],
				style: this.mergedLabelStyle,
				ref: "labelElementRef"
			}), [mergedRequireMarkPlacement === "left" ? ((0, vue.openBlock)(), (0, vue.createElementBlock)(vue.Fragment, { key: 0 }, [require_vdom.normalizeVNode(() => [markNode, textNode])], 64)) : ((0, vue.openBlock)(), (0, vue.createElementBlock)(vue.Fragment, { key: 1 }, [require_vdom.normalizeVNode(() => [textNode, markNode])], 64))], 16);
		};
		return (0, vue.openBlock)(), (0, vue.createElementBlock)("div", {
			class: require_vdom.normalizeClass([
				`${mergedClsPrefix}-form-item`,
				this.themeClass,
				`${mergedClsPrefix}-form-item--${this.mergedSize}-size`,
				`${mergedClsPrefix}-form-item--${this.mergedLabelPlacement}-labelled`,
				this.isAutoLabelWidth && `${mergedClsPrefix}-form-item--auto-label-width`,
				!mergedShowLabel && `${mergedClsPrefix}-form-item--no-label`
			]),
			style: (0, vue.normalizeStyle)(this.cssVars)
		}, [
			require_vdom.normalizeVNode(() => mergedShowLabel && renderLabel()),
			(0, vue.createElementVNode)("div", {
				class: require_vdom.normalizeClass([
					`${mergedClsPrefix}-form-item-blank`,
					this.contentClass,
					this.mergedValidationStatus && `${mergedClsPrefix}-form-item-blank--${this.mergedValidationStatus}`
				]),
				style: (0, vue.normalizeStyle)(this.contentStyle)
			}, [require_vdom.normalizeVNode(() => $slots.default?.())], 6),
			this.mergedShowFeedback ? ((0, vue.openBlock)(), (0, vue.createElementBlock)("div", {
				key: this.feedbackId,
				style: (0, vue.normalizeStyle)(this.feedbackStyle),
				class: require_vdom.normalizeClass([`${mergedClsPrefix}-form-item-feedback-wrapper`, this.feedbackClass])
			}, [(0, vue.createVNode)(vue.Transition, {
				name: "fade-down-transition",
				mode: "out-in"
			}, { default: () => {
				const { mergedValidationStatus } = this;
				return require__utils_vue_resolve_slot.resolveWrappedSlot($slots.feedback, (children) => {
					const { feedback } = this;
					const feedbackNodes = children || feedback ? ((0, vue.openBlock)(), (0, vue.createElementBlock)("div", {
						key: "__feedback__",
						class: require_vdom.normalizeClass(`${mergedClsPrefix}-form-item-feedback__line`)
					}, [require_vdom.normalizeVNode(() => children || feedback)], 2)) : this.renderExplains.length ? this.renderExplains?.map(({ key, render }) => ((0, vue.openBlock)(), (0, vue.createElementBlock)("div", {
						key,
						class: require_vdom.normalizeClass(`${mergedClsPrefix}-form-item-feedback__line`)
					}, [require_vdom.normalizeVNode(() => render())], 2))) : null;
					return feedbackNodes ? mergedValidationStatus === "warning" ? ((0, vue.openBlock)(), (0, vue.createElementBlock)("div", {
						key: "controlled-warning",
						class: require_vdom.normalizeClass(`${mergedClsPrefix}-form-item-feedback ${mergedClsPrefix}-form-item-feedback--warning`)
					}, [require_vdom.normalizeVNode(() => feedbackNodes)], 2)) : mergedValidationStatus === "error" ? ((0, vue.openBlock)(), (0, vue.createElementBlock)("div", {
						key: "controlled-error",
						class: require_vdom.normalizeClass(`${mergedClsPrefix}-form-item-feedback ${mergedClsPrefix}-form-item-feedback--error`)
					}, [require_vdom.normalizeVNode(() => feedbackNodes)], 2)) : mergedValidationStatus === "success" ? ((0, vue.openBlock)(), (0, vue.createElementBlock)("div", {
						key: "controlled-success",
						class: require_vdom.normalizeClass(`${mergedClsPrefix}-form-item-feedback ${mergedClsPrefix}-form-item-feedback--success`)
					}, [require_vdom.normalizeVNode(() => feedbackNodes)], 2)) : ((0, vue.openBlock)(), (0, vue.createElementBlock)("div", {
						key: "controlled-default",
						class: require_vdom.normalizeClass(`${mergedClsPrefix}-form-item-feedback`)
					}, [require_vdom.normalizeVNode(() => feedbackNodes)], 2)) : null;
				});
			} }, 1024)], 6)) : require_vdom.normalizeVNode(() => null)
		], 6);
	}
});
//#endregion
exports.default = FormItem_default;
exports.formItemPropKeys = formItemPropKeys;
exports.formItemProps = formItemProps;
