Object.defineProperty(exports, Symbol.toStringTag, { value: "Module" });
const require__utils_css_format_length = require("../../_utils/css/format-length.js");
const require__mixins_use_config = require("../../_mixins/use-config.js");
const require_form_src_context = require("./context.js");
let vue = require("vue");
let lodash_es = require("lodash");
//#region src/form/src/utils.ts
function formItemSize(props) {
	const NForm = (0, vue.inject)(require_form_src_context.formInjectionKey, null);
	const { mergedComponentPropsRef } = require__mixins_use_config.default(props);
	return { mergedSize: (0, vue.computed)(() => {
		if (props.size !== void 0) return props.size;
		if (NForm?.props.size !== void 0) return NForm.props.size;
		const configSize = mergedComponentPropsRef?.value?.Form?.size;
		if (configSize) return configSize;
		return "medium";
	}) };
}
function formItemMisc(props) {
	const NForm = (0, vue.inject)(require_form_src_context.formInjectionKey, null);
	const mergedLabelPlacementRef = (0, vue.computed)(() => {
		const { labelPlacement } = props;
		if (labelPlacement !== void 0) return labelPlacement;
		if (NForm?.props.labelPlacement) return NForm.props.labelPlacement;
		return "top";
	});
	const isAutoLabelWidthRef = (0, vue.computed)(() => {
		return mergedLabelPlacementRef.value === "left" && (props.labelWidth === "auto" || NForm?.props.labelWidth === "auto");
	});
	const mergedLabelWidthRef = (0, vue.computed)(() => {
		if (mergedLabelPlacementRef.value === "top") return;
		const { labelWidth } = props;
		if (labelWidth !== void 0 && labelWidth !== "auto") return require__utils_css_format_length.formatLength(labelWidth);
		if (isAutoLabelWidthRef.value) {
			const autoComputedWidth = NForm?.maxChildLabelWidthRef.value;
			if (autoComputedWidth !== void 0) return require__utils_css_format_length.formatLength(autoComputedWidth);
			else return;
		}
		if (NForm?.props.labelWidth !== void 0) return require__utils_css_format_length.formatLength(NForm.props.labelWidth);
	});
	const mergedLabelAlignRef = (0, vue.computed)(() => {
		const { labelAlign } = props;
		if (labelAlign) return labelAlign;
		if (NForm?.props.labelAlign) return NForm.props.labelAlign;
	});
	const mergedLabelStyleRef = (0, vue.computed)(() => {
		return [
			props.labelProps?.style,
			props.labelStyle,
			{ width: mergedLabelWidthRef.value }
		];
	});
	const mergedShowRequireMarkRef = (0, vue.computed)(() => {
		const { showRequireMark } = props;
		if (showRequireMark !== void 0) return showRequireMark;
		return NForm?.props.showRequireMark;
	});
	const mergedRequireMarkPlacementRef = (0, vue.computed)(() => {
		const { requireMarkPlacement } = props;
		if (requireMarkPlacement !== void 0) return requireMarkPlacement;
		return NForm?.props.requireMarkPlacement || "right";
	});
	const validationErroredRef = (0, vue.ref)(false);
	const validationWarnedRef = (0, vue.ref)(false);
	return {
		validationErrored: validationErroredRef,
		validationWarned: validationWarnedRef,
		mergedLabelStyle: mergedLabelStyleRef,
		mergedLabelPlacement: mergedLabelPlacementRef,
		mergedLabelAlign: mergedLabelAlignRef,
		mergedShowRequireMark: mergedShowRequireMarkRef,
		mergedRequireMarkPlacement: mergedRequireMarkPlacementRef,
		mergedValidationStatus: (0, vue.computed)(() => {
			const { validationStatus } = props;
			if (validationStatus !== void 0) return validationStatus;
			if (validationErroredRef.value) return "error";
			if (validationWarnedRef.value) return "warning";
		}),
		mergedShowFeedback: (0, vue.computed)(() => {
			const { showFeedback } = props;
			if (showFeedback !== void 0) return showFeedback;
			if (NForm?.props.showFeedback !== void 0) return NForm.props.showFeedback;
			return true;
		}),
		mergedShowLabel: (0, vue.computed)(() => {
			const { showLabel } = props;
			if (showLabel !== void 0) return showLabel;
			if (NForm?.props.showLabel !== void 0) return NForm.props.showLabel;
			return true;
		}),
		isAutoLabelWidth: isAutoLabelWidthRef
	};
}
function formItemRule(props) {
	const NForm = (0, vue.inject)(require_form_src_context.formInjectionKey, null);
	const compatibleRulePathRef = (0, vue.computed)(() => {
		const { rulePath } = props;
		if (rulePath !== void 0) return rulePath;
		const { path } = props;
		if (path !== void 0) return path;
	});
	const mergedRulesRef = (0, vue.computed)(() => {
		const rules = [];
		const { rule } = props;
		if (rule !== void 0) {
			if (Array.isArray(rule)) rules.push(...rule);
			else rules.push(rule);
		}
		if (NForm) {
			const { rules: formRules } = NForm.props;
			const { value: rulePath } = compatibleRulePathRef;
			if (formRules !== void 0 && rulePath !== void 0) {
				const formRule = (0, lodash_es.get)(formRules, rulePath);
				if (formRule !== void 0) {
					if (Array.isArray(formRule)) rules.push(...formRule);
					else rules.push(formRule);
				}
			}
		}
		return rules;
	});
	const hasRequiredRuleRef = (0, vue.computed)(() => {
		return mergedRulesRef.value.some((rule) => rule.required);
	});
	return {
		mergedRules: mergedRulesRef,
		mergedRequired: (0, vue.computed)(() => {
			return hasRequiredRuleRef.value || props.required;
		})
	};
}
//#endregion
exports.formItemMisc = formItemMisc;
exports.formItemRule = formItemRule;
exports.formItemSize = formItemSize;
