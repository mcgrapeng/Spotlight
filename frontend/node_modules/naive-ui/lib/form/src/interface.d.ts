import { FormSetupProps } from "./Form.js";
import { Ref, VNode, VNodeChild } from "vue";
import { RuleItem, ValidateError, ValidateMessages, ValidateOption } from "async-validator";
//#region src/form/src/interface.d.ts
interface FormRules {
  [path: string]: FormRules | FormItemRule | FormItemRule[];
}
type SetRule<T, R> = T extends ((rule: any, ...args: infer K) => infer P) ? (rule: R, ...args: K) => P : never;
type FormItemRuleValidatorParams = Parameters<SetRule<NonNullable<RuleItem['validator']>, FormItemRule>>;
type FormItemRuleValidator = (...args: FormItemRuleValidatorParams) => boolean | Error | Error[] | Promise<void> | undefined;
type FormItemRuleAsyncValidator = (...args: FormItemRuleValidatorParams) => Promise<void> | undefined;
type FormItemRule = Omit<RuleItem, 'validator' | 'asyncValidator'> & {
  key?: string;
  trigger?: ValidationTrigger | string | Array<ValidationTrigger | string>;
  validator?: FormItemRuleValidator;
  asyncValidator?: FormItemRuleAsyncValidator;
  renderMessage?: () => VNodeChild;
  level?: 'warning' | 'error';
};
interface FormItemValidateOptions {
  trigger?: ValidationTrigger | string;
  callback?: ValidateCallback;
  shouldRuleBeApplied?: ShouldRuleBeApplied;
  options?: ValidateOption;
}
interface FormItemInternalValidateResult {
  valid: boolean;
  errors: ValidateError[] | undefined;
  warnings: ValidateError[] | undefined;
}
type FormItemInternalValidate = (trigger: ValidationTrigger | string | null | undefined, shouldRuleBeApplied?: ShouldRuleBeApplied, options?: ValidateOption) => Promise<FormItemInternalValidateResult>;
type FormItemValidate = ((options: FormItemValidateOptions) => Promise<{
  warnings: ValidateError[] | undefined;
}>) & ((trigger?: string, callback?: ValidateCallback) => Promise<{
  warnings: ValidateError[] | undefined;
}>);
interface FormItemInst {
  validate: FormItemValidate;
  restoreValidation: () => void;
  invalidateLabelWidth: () => void;
  path?: string;
  internalValidate: FormItemInternalValidate;
}
type FormItemColRef = FormItemInst;
type FormItemRowRef = FormItemInst;
interface FormInjection {
  props: FormSetupProps;
  maxChildLabelWidthRef: Ref<number | undefined>;
  deriveMaxChildLabelWidth: (currentWidth: number) => void;
}
type LabelAlign = 'left' | 'center' | 'right';
type LabelPlacement = 'left' | 'top';
type ValidationTrigger = 'input' | 'change' | 'blur' | 'focus';
type ShouldRuleBeApplied = (rule: FormItemRule) => boolean;
type ValidateCallback = (errors: ValidateError[] | undefined, extra: {
  warnings: ValidateError[] | undefined;
}) => void;
type FormValidateCallback = (errors: ValidateError[][] | undefined, extra: {
  warnings: ValidateError[][] | undefined;
}) => void;
interface FormValidateOptions {
  paths: string[];
  shouldRuleBeApplied: ShouldRuleBeApplied;
}
type FormValidateFilter = ShouldRuleBeApplied | string[] | FormValidateOptions;
type FormValidate = (callback?: FormValidateCallback, filter?: FormValidateFilter) => Promise<{
  warnings: ValidateError[][] | undefined;
}>;
type FormValidationError = ValidateError[];
interface FormInst {
  validate: FormValidate;
  restoreValidation: () => void;
  invalidateLabelWidth: () => void;
}
interface FormValidateMessages extends ValidateMessages {}
interface FormItemSlots {
  default?: () => VNode[];
  feedback?: () => VNode[];
  label?: () => VNode[];
}
//#endregion
export { FormInjection, FormInst, FormItemColRef, FormItemInst, FormItemInternalValidate, FormItemInternalValidateResult, FormItemRowRef, FormItemRule, FormItemRuleAsyncValidator, FormItemRuleValidator, FormItemRuleValidatorParams, FormItemSlots, FormItemValidate, FormItemValidateOptions, FormRules, FormValidate, FormValidateCallback, FormValidateFilter, FormValidateMessages, FormValidateOptions, FormValidationError, LabelAlign, LabelPlacement, ShouldRuleBeApplied, ValidateCallback, ValidationTrigger };