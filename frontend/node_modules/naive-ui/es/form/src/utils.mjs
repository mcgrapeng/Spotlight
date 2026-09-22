import { formatLength } from "../../_utils/css/format-length.mjs";
import useConfig from "../../_mixins/use-config.mjs";
import { formInjectionKey } from "./context.mjs";
import { computed, inject, ref } from "vue";
import { get } from "lodash-es";
//#region src/form/src/utils.ts
function formItemSize(props) {
  const NForm = inject(formInjectionKey, null);
  const {
    mergedComponentPropsRef
  } = useConfig(props);
  return {
    mergedSize: computed(() => {
      if (props.size !== void 0) return props.size;
      if (NForm?.props.size !== void 0) return NForm.props.size;
      const configSize = mergedComponentPropsRef?.value?.Form?.size;
      if (configSize) return configSize;
      return "medium";
    })
  };
}
function formItemMisc(props) {
  const NForm = inject(formInjectionKey, null);
  const mergedLabelPlacementRef = computed(() => {
    const {
      labelPlacement
    } = props;
    if (labelPlacement !== void 0) return labelPlacement;
    if (NForm?.props.labelPlacement) return NForm.props.labelPlacement;
    return "top";
  });
  const isAutoLabelWidthRef = computed(() => {
    return mergedLabelPlacementRef.value === "left" && (props.labelWidth === "auto" || NForm?.props.labelWidth === "auto");
  });
  const mergedLabelWidthRef = computed(() => {
    if (mergedLabelPlacementRef.value === "top") return;
    const {
      labelWidth
    } = props;
    if (labelWidth !== void 0 && labelWidth !== "auto") return formatLength(labelWidth);
    if (isAutoLabelWidthRef.value) {
      const autoComputedWidth = NForm?.maxChildLabelWidthRef.value;
      if (autoComputedWidth !== void 0) return formatLength(autoComputedWidth);else return;
    }
    if (NForm?.props.labelWidth !== void 0) return formatLength(NForm.props.labelWidth);
  });
  const mergedLabelAlignRef = computed(() => {
    const {
      labelAlign
    } = props;
    if (labelAlign) return labelAlign;
    if (NForm?.props.labelAlign) return NForm.props.labelAlign;
  });
  const mergedLabelStyleRef = computed(() => {
    return [props.labelProps?.style, props.labelStyle, {
      width: mergedLabelWidthRef.value
    }];
  });
  const mergedShowRequireMarkRef = computed(() => {
    const {
      showRequireMark
    } = props;
    if (showRequireMark !== void 0) return showRequireMark;
    return NForm?.props.showRequireMark;
  });
  const mergedRequireMarkPlacementRef = computed(() => {
    const {
      requireMarkPlacement
    } = props;
    if (requireMarkPlacement !== void 0) return requireMarkPlacement;
    return NForm?.props.requireMarkPlacement || "right";
  });
  const validationErroredRef = ref(false);
  const validationWarnedRef = ref(false);
  return {
    validationErrored: validationErroredRef,
    validationWarned: validationWarnedRef,
    mergedLabelStyle: mergedLabelStyleRef,
    mergedLabelPlacement: mergedLabelPlacementRef,
    mergedLabelAlign: mergedLabelAlignRef,
    mergedShowRequireMark: mergedShowRequireMarkRef,
    mergedRequireMarkPlacement: mergedRequireMarkPlacementRef,
    mergedValidationStatus: computed(() => {
      const {
        validationStatus
      } = props;
      if (validationStatus !== void 0) return validationStatus;
      if (validationErroredRef.value) return "error";
      if (validationWarnedRef.value) return "warning";
    }),
    mergedShowFeedback: computed(() => {
      const {
        showFeedback
      } = props;
      if (showFeedback !== void 0) return showFeedback;
      if (NForm?.props.showFeedback !== void 0) return NForm.props.showFeedback;
      return true;
    }),
    mergedShowLabel: computed(() => {
      const {
        showLabel
      } = props;
      if (showLabel !== void 0) return showLabel;
      if (NForm?.props.showLabel !== void 0) return NForm.props.showLabel;
      return true;
    }),
    isAutoLabelWidth: isAutoLabelWidthRef
  };
}
function formItemRule(props) {
  const NForm = inject(formInjectionKey, null);
  const compatibleRulePathRef = computed(() => {
    const {
      rulePath
    } = props;
    if (rulePath !== void 0) return rulePath;
    const {
      path
    } = props;
    if (path !== void 0) return path;
  });
  const mergedRulesRef = computed(() => {
    const rules = [];
    const {
      rule
    } = props;
    if (rule !== void 0) {
      if (Array.isArray(rule)) rules.push(...rule);else rules.push(rule);
    }
    if (NForm) {
      const {
        rules: formRules
      } = NForm.props;
      const {
        value: rulePath
      } = compatibleRulePathRef;
      if (formRules !== void 0 && rulePath !== void 0) {
        const formRule = get(formRules, rulePath);
        if (formRule !== void 0) {
          if (Array.isArray(formRule)) rules.push(...formRule);else rules.push(formRule);
        }
      }
    }
    return rules;
  });
  const hasRequiredRuleRef = computed(() => {
    return mergedRulesRef.value.some(rule => rule.required);
  });
  return {
    mergedRules: mergedRulesRef,
    mergedRequired: computed(() => {
      return hasRequiredRuleRef.value || props.required;
    })
  };
}
//#endregion
export { formItemMisc, formItemRule, formItemSize };