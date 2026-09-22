import { FormItemSize } from "./public-types.js";
import { FormItemRule, LabelAlign, LabelPlacement } from "./interface.js";
import { FormItemSetupProps } from "./FormItem.js";
import { ComputedRef } from "vue";
//#region src/form/src/utils.d.ts
declare function formItemSize(props: FormItemSetupProps): {
  mergedSize: ComputedRef<FormItemSize>;
};
declare function formItemMisc(props: FormItemSetupProps): {
  validationErrored: import("vue").Ref<boolean, boolean>;
  validationWarned: import("vue").Ref<boolean, boolean>;
  mergedLabelStyle: ComputedRef<import("vue").StyleValue[]>;
  mergedLabelPlacement: ComputedRef<LabelPlacement>;
  mergedLabelAlign: ComputedRef<LabelAlign | undefined>;
  mergedShowRequireMark: ComputedRef<boolean | undefined>;
  mergedRequireMarkPlacement: ComputedRef<"left" | "right" | "right-hanging">;
  mergedValidationStatus: ComputedRef<"error" | "success" | "warning" | undefined>;
  mergedShowFeedback: ComputedRef<boolean>;
  mergedShowLabel: ComputedRef<boolean>;
  isAutoLabelWidth: ComputedRef<boolean>;
};
declare function formItemRule(props: FormItemSetupProps): {
  mergedRules: ComputedRef<FormItemRule[]>;
  mergedRequired: ComputedRef<boolean>;
};
//#endregion
export { formItemMisc, formItemRule, formItemSize };