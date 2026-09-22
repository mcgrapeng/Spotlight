import { useInjectionInstanceCollection } from "../../_utils/composable/use-collection.mjs";
import { createKey } from "../../_utils/cssr/index.mjs";
import { warn } from "../../_utils/naive/warn.mjs";
import { keysOf } from "../../_utils/vue/keysOf.mjs";
import { resolveWrappedSlot } from "../../_utils/vue/resolve-slot.mjs";
import useConfig from "../../_mixins/use-config.mjs";
import { useThemeClass } from "../../_mixins/use-css-vars-class.mjs";
import { formItemInjectionKey } from "../../_mixins/use-form-item.mjs";
import useTheme from "../../_mixins/use-theme.mjs";
import { normalizeClass as normalizeClass$1, normalizeVNode } from "../../vue-jsx-vapor/vdom.mjs";
import formLight from "../styles/light.mjs";
import { formInjectionKey, formItemInstsInjectionKey } from "./context.mjs";
import form_item_cssr_default from "./styles/form-item.cssr.mjs";
import { formItemMisc, formItemRule, formItemSize } from "./utils.mjs";
import { createId } from "seemly";
import { Fragment, Transition, computed, createElementBlock, createElementVNode, createVNode, defineComponent, inject, mergeProps, normalizeStyle, onMounted, openBlock, provide, ref, toRef, watch } from "vue";
import { get } from "lodash-es";
import Schema from "async-validator";
//#region src/form/src/FormItem.tsx
const formItemProps = {
  ...useTheme.props,
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
const formItemPropKeys = keysOf(formItemProps);
function wrapValidator(validator, async) {
  return (...args) => {
    try {
      const validateResult = validator(...args);
      if (!async && (typeof validateResult === "boolean" || validateResult instanceof Error || Array.isArray(validateResult)) || validateResult?.then) return validateResult;else if (validateResult === void 0) return true;else {
        warn("form-item/validate", `You return a ${typeof validateResult} typed value in the validator method, which is not recommended. Please use ${async ? "`Promise`" : "`boolean`, `Error` or `Promise`"} typed value instead.`);
        return true;
      }
    } catch (err) {
      warn("form-item/validate", "An error is catched in the validation, so the validation won't be done. Your callback in `validate` method of `n-form` or `n-form-item` won't be called in this validation.");
      console.error(err);
      return;
    }
  };
}
var FormItem_default = defineComponent({
  name: "FormItem",
  props: formItemProps,
  slots: Object,
  setup(props) {
    useInjectionInstanceCollection(formItemInstsInjectionKey, "formItems", toRef(props, "path"));
    const {
      mergedClsPrefixRef,
      inlineThemeDisabled
    } = useConfig(props);
    const NForm = inject(formInjectionKey, null);
    const formItemSizeRefs = formItemSize(props);
    const formItemMiscRefs = formItemMisc(props);
    const {
      validationErrored: validationErroredRef,
      validationWarned: validationWarnedRef
    } = formItemMiscRefs;
    const {
      mergedRequired: mergedRequiredRef,
      mergedRules: mergedRulesRef
    } = formItemRule(props);
    const {
      mergedSize: mergedSizeRef
    } = formItemSizeRefs;
    const {
      mergedLabelPlacement: labelPlacementRef,
      mergedLabelAlign: labelTextAlignRef,
      mergedRequireMarkPlacement: mergedRequireMarkPlacementRef
    } = formItemMiscRefs;
    const renderExplainsRef = ref([]);
    const feedbackIdRef = ref(createId());
    const labelElementRef = ref(null);
    const mergedDisabledRef = NForm ? toRef(NForm.props, "disabled") : ref(false);
    const themeRef = useTheme("Form", "-form-item", form_item_cssr_default, formLight, props, mergedClsPrefixRef);
    watch(toRef(props, "path"), () => {
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
      if (props.feedback) feedbackIdRef.value = createId();
    }
    const internalValidate = async (trigger = null, shouldRuleBeApplied = () => true, options = {
      suppressWarning: true
    }) => {
      const {
        path
      } = props;
      if (!options) options = {};else if (!options.first) options.first = props.first;
      const {
        value: rules
      } = mergedRulesRef;
      const value = NForm ? get(NForm.props.model, path || "") : void 0;
      const messageRenderers = {};
      const originalMessageRendersMessage = {};
      const activeRules = (!trigger ? rules : rules.filter(rule => {
        if (Array.isArray(rule.trigger)) return rule.trigger.includes(trigger);else return rule.trigger === trigger;
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
      const activeErrorRules = activeRules.filter(r => r.level !== "warning");
      const activeWarningRules = activeRules.filter(r => r.level === "warning");
      const validationResult = {
        valid: true,
        errors: void 0,
        warnings: void 0
      };
      if (!activeRules.length) return validationResult;
      const mergedPath = path ?? "__n_no_path__";
      const validator = new Schema({
        [mergedPath]: activeErrorRules
      });
      const warningValidator = new Schema({
        [mergedPath]: activeWarningRules
      });
      const {
        validateMessages
      } = NForm?.props || {};
      if (validateMessages) {
        validator.messages(validateMessages);
        warningValidator.messages(validateMessages);
      }
      const renderMessages = errors => {
        renderExplainsRef.value = errors.map(error => {
          const transformedMessage = error?.message || "";
          return {
            key: transformedMessage,
            render: () => {
              if (transformedMessage.startsWith("__renderMessage__")) return messageRenderers[transformedMessage]();
              return transformedMessage;
            }
          };
        });
        errors.forEach(error => {
          if (error.message?.startsWith("__renderMessage__")) error.message = originalMessageRendersMessage[error.message];
        });
      };
      if (activeErrorRules.length) {
        const errors = await new Promise(resolve => {
          validator.validate({
            [mergedPath]: value
          }, options, resolve);
        });
        if (errors?.length) {
          validationResult.valid = false;
          validationResult.errors = errors;
          renderMessages(errors);
        }
      }
      if (activeWarningRules.length && !validationResult.errors) {
        const warnings = await new Promise(resolve => {
          warningValidator.validate({
            [mergedPath]: value
          }, options, resolve);
        });
        if (warnings?.length) {
          renderMessages(warnings);
          validationResult.warnings = warnings;
        }
      }
      if (!validationResult.errors && !validationResult.warnings) restoreValidation();else {
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
        internalValidate(trigger, shouldRuleBeApplied, asyncValidatorOptions).then(({
          valid,
          errors,
          warnings
        }) => {
          if (valid) {
            if (validateCallback) validateCallback(void 0, {
              warnings
            });
            resolve({
              warnings
            });
          } else {
            if (validateCallback) validateCallback(errors, {
              warnings
            });
            reject(errors);
          }
        });
      });
    }
    provide(formItemInjectionKey, {
      path: toRef(props, "path"),
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
    onMounted(invalidateLabelWidth);
    const cssVarsRef = computed(() => {
      const {
        value: size
      } = mergedSizeRef;
      const {
        value: labelPlacement
      } = labelPlacementRef;
      const direction = labelPlacement === "top" ? "vertical" : "horizontal";
      const {
        common: {
          cubicBezierEaseInOut
        },
        self: {
          labelTextColor,
          asteriskColor,
          lineHeight,
          feedbackTextColor,
          feedbackTextColorWarning,
          feedbackTextColorError,
          feedbackPadding,
          labelFontWeight,
          [createKey("labelHeight", size)]: labelHeight,
          [createKey("blankHeight", size)]: blankHeight,
          [createKey("feedbackFontSize", size)]: feedbackFontSize,
          [createKey("feedbackHeight", size)]: feedbackHeight,
          [createKey("labelPadding", direction)]: labelPadding,
          [createKey("labelTextAlign", direction)]: labelTextAlign,
          [createKey(createKey("labelFontSize", labelPlacement), size)]: labelFontSize
        }
      } = themeRef.value;
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
    const themeClassHandle = inlineThemeDisabled ? useThemeClass("form-item", computed(() => {
      return `${mergedSizeRef.value[0]}${labelPlacementRef.value[0]}${labelTextAlignRef.value?.[0] || ""}`;
    }), cssVarsRef, props) : void 0;
    return {
      labelElementRef,
      mergedClsPrefix: mergedClsPrefixRef,
      mergedRequired: mergedRequiredRef,
      feedbackId: feedbackIdRef,
      renderExplains: renderExplainsRef,
      reverseColSpace: computed(() => {
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
    const {
      $slots,
      mergedClsPrefix,
      mergedShowLabel,
      mergedShowRequireMark,
      mergedRequireMarkPlacement,
      onRender
    } = this;
    const renderedShowRequireMark = mergedShowRequireMark !== void 0 ? mergedShowRequireMark : this.mergedRequired;
    onRender?.();
    const renderLabel = () => {
      const labelText = this.$slots.label ? this.$slots.label() : this.label;
      if (!labelText) return null;
      const textNode = (openBlock(), createElementBlock("span", {
        class: normalizeClass$1(`${mergedClsPrefix}-form-item-label__text`)
      }, [normalizeVNode(() => labelText)], 2));
      const markNode = renderedShowRequireMark ? (openBlock(), createElementBlock("span", {
        key: 1,
        class: normalizeClass$1(`${mergedClsPrefix}-form-item-label__asterisk`)
      }, [mergedRequireMarkPlacement !== "left" ? normalizeVNode(() => "\xA0*") : normalizeVNode(() => "*\xA0")], 2)) : mergedRequireMarkPlacement === "right-hanging" && (openBlock(), createElementBlock("span", {
        key: 2,
        class: normalizeClass$1(`${mergedClsPrefix}-form-item-label__asterisk-placeholder`)
      }, "\xA0*", 2));
      const {
        labelProps
      } = this;
      return openBlock(), createElementBlock("label", mergeProps(labelProps, {
        class: [labelProps?.class, `${mergedClsPrefix}-form-item-label`, `${mergedClsPrefix}-form-item-label--${mergedRequireMarkPlacement}-mark`, this.reverseColSpace && `${mergedClsPrefix}-form-item-label--reverse-columns-space`],
        style: this.mergedLabelStyle,
        ref: "labelElementRef"
      }), [mergedRequireMarkPlacement === "left" ? (openBlock(), createElementBlock(Fragment, {
        key: 0
      }, [normalizeVNode(() => [markNode, textNode])], 64)) : (openBlock(), createElementBlock(Fragment, {
        key: 1
      }, [normalizeVNode(() => [textNode, markNode])], 64))], 16);
    };
    return openBlock(), createElementBlock("div", {
      class: normalizeClass$1([`${mergedClsPrefix}-form-item`, this.themeClass, `${mergedClsPrefix}-form-item--${this.mergedSize}-size`, `${mergedClsPrefix}-form-item--${this.mergedLabelPlacement}-labelled`, this.isAutoLabelWidth && `${mergedClsPrefix}-form-item--auto-label-width`, !mergedShowLabel && `${mergedClsPrefix}-form-item--no-label`]),
      style: normalizeStyle(this.cssVars)
    }, [normalizeVNode(() => mergedShowLabel && renderLabel()), createElementVNode("div", {
      class: normalizeClass$1([`${mergedClsPrefix}-form-item-blank`, this.contentClass, this.mergedValidationStatus && `${mergedClsPrefix}-form-item-blank--${this.mergedValidationStatus}`]),
      style: normalizeStyle(this.contentStyle)
    }, [normalizeVNode(() => $slots.default?.())], 6), this.mergedShowFeedback ? (openBlock(), createElementBlock("div", {
      key: this.feedbackId,
      style: normalizeStyle(this.feedbackStyle),
      class: normalizeClass$1([`${mergedClsPrefix}-form-item-feedback-wrapper`, this.feedbackClass])
    }, [createVNode(Transition, {
      name: "fade-down-transition",
      mode: "out-in"
    }, {
      default: () => {
        const {
          mergedValidationStatus
        } = this;
        return resolveWrappedSlot($slots.feedback, children => {
          const {
            feedback
          } = this;
          const feedbackNodes = children || feedback ? (openBlock(), createElementBlock("div", {
            key: "__feedback__",
            class: normalizeClass$1(`${mergedClsPrefix}-form-item-feedback__line`)
          }, [normalizeVNode(() => children || feedback)], 2)) : this.renderExplains.length ? this.renderExplains?.map(({
            key,
            render
          }) => (openBlock(), createElementBlock("div", {
            key,
            class: normalizeClass$1(`${mergedClsPrefix}-form-item-feedback__line`)
          }, [normalizeVNode(() => render())], 2))) : null;
          return feedbackNodes ? mergedValidationStatus === "warning" ? (openBlock(), createElementBlock("div", {
            key: "controlled-warning",
            class: normalizeClass$1(`${mergedClsPrefix}-form-item-feedback ${mergedClsPrefix}-form-item-feedback--warning`)
          }, [normalizeVNode(() => feedbackNodes)], 2)) : mergedValidationStatus === "error" ? (openBlock(), createElementBlock("div", {
            key: "controlled-error",
            class: normalizeClass$1(`${mergedClsPrefix}-form-item-feedback ${mergedClsPrefix}-form-item-feedback--error`)
          }, [normalizeVNode(() => feedbackNodes)], 2)) : mergedValidationStatus === "success" ? (openBlock(), createElementBlock("div", {
            key: "controlled-success",
            class: normalizeClass$1(`${mergedClsPrefix}-form-item-feedback ${mergedClsPrefix}-form-item-feedback--success`)
          }, [normalizeVNode(() => feedbackNodes)], 2)) : (openBlock(), createElementBlock("div", {
            key: "controlled-default",
            class: normalizeClass$1(`${mergedClsPrefix}-form-item-feedback`)
          }, [normalizeVNode(() => feedbackNodes)], 2)) : null;
        });
      }
    }, 1024)], 6)) : normalizeVNode(() => null)], 6);
  }
});
//#endregion
export { FormItem_default as default, formItemPropKeys, formItemProps };