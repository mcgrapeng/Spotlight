import { FormItemSize } from "./public-types.js";
import { ExtractPublicPropTypes } from "../../_utils/naive/extract-public-props.js";
import "../../_utils/index.js";
import { FormTheme, FormThemeOverrides } from "../styles/light.js";
import "../styles/index.js";
import { FormItemInternalValidate, FormItemRule, FormItemSlots, FormItemValidate, LabelAlign, LabelPlacement } from "./interface.js";
import { CSSProperties, ExtractPropTypes, LabelHTMLAttributes, PropType, Ref, SlotsType, VNodeChild } from "vue";
//#region src/form/src/FormItem.d.ts
declare const formItemProps: {
  readonly label: StringConstructor;
  readonly labelWidth: PropType<string | number>;
  readonly labelStyle: PropType<CSSProperties | string>;
  readonly labelAlign: PropType<LabelAlign>;
  readonly labelPlacement: PropType<LabelPlacement>;
  readonly path: StringConstructor;
  readonly first: BooleanConstructor;
  readonly rulePath: StringConstructor;
  readonly required: BooleanConstructor;
  readonly showRequireMark: {
    readonly type: PropType<boolean | undefined>;
    readonly default: undefined;
  };
  readonly requireMarkPlacement: PropType<"left" | "right" | "right-hanging">;
  readonly showFeedback: {
    readonly type: PropType<boolean | undefined>;
    readonly default: undefined;
  };
  readonly rule: PropType<FormItemRule | FormItemRule[]>;
  readonly size: PropType<"small" | "medium" | "large">;
  readonly ignorePathChange: BooleanConstructor;
  readonly validationStatus: PropType<"error" | "warning" | "success">;
  readonly feedback: StringConstructor;
  readonly feedbackClass: StringConstructor;
  readonly feedbackStyle: PropType<string | CSSProperties>;
  readonly showLabel: {
    readonly type: PropType<boolean | undefined>;
    readonly default: undefined;
  };
  readonly labelProps: PropType<LabelHTMLAttributes>;
  readonly contentClass: StringConstructor;
  readonly contentStyle: PropType<string | CSSProperties>;
  readonly theme: PropType<FormTheme>;
  readonly themeOverrides: PropType<FormThemeOverrides>;
  readonly builtinThemeOverrides: PropType<FormThemeOverrides>;
};
type FormItemSetupProps = ExtractPropTypes<typeof formItemProps>;
type FormItemProps = ExtractPublicPropTypes<typeof formItemProps>;
declare const formItemPropKeys: ("theme" | "themeOverrides" | "builtinThemeOverrides" | "required" | "label" | "contentClass" | "contentStyle" | "size" | "labelPlacement" | "labelAlign" | "labelStyle" | "first" | "path" | "labelWidth" | "rulePath" | "showRequireMark" | "requireMarkPlacement" | "showFeedback" | "rule" | "ignorePathChange" | "validationStatus" | "feedback" | "feedbackClass" | "feedbackStyle" | "showLabel" | "labelProps")[];
declare const _default: import("vue").DefineComponent<ExtractPropTypes<{
  readonly label: StringConstructor;
  readonly labelWidth: PropType<string | number>;
  readonly labelStyle: PropType<CSSProperties | string>;
  readonly labelAlign: PropType<LabelAlign>;
  readonly labelPlacement: PropType<LabelPlacement>;
  readonly path: StringConstructor;
  readonly first: BooleanConstructor;
  readonly rulePath: StringConstructor;
  readonly required: BooleanConstructor;
  readonly showRequireMark: {
    readonly type: PropType<boolean | undefined>;
    readonly default: undefined;
  };
  readonly requireMarkPlacement: PropType<"left" | "right" | "right-hanging">;
  readonly showFeedback: {
    readonly type: PropType<boolean | undefined>;
    readonly default: undefined;
  };
  readonly rule: PropType<FormItemRule | FormItemRule[]>;
  readonly size: PropType<"small" | "medium" | "large">;
  readonly ignorePathChange: BooleanConstructor;
  readonly validationStatus: PropType<"error" | "warning" | "success">;
  readonly feedback: StringConstructor;
  readonly feedbackClass: StringConstructor;
  readonly feedbackStyle: PropType<string | CSSProperties>;
  readonly showLabel: {
    readonly type: PropType<boolean | undefined>;
    readonly default: undefined;
  };
  readonly labelProps: PropType<LabelHTMLAttributes>;
  readonly contentClass: StringConstructor;
  readonly contentStyle: PropType<string | CSSProperties>;
  readonly theme: PropType<FormTheme>;
  readonly themeOverrides: PropType<FormThemeOverrides>;
  readonly builtinThemeOverrides: PropType<FormThemeOverrides>;
}>, {
  cssVars: Ref<CSSProperties, CSSProperties> | undefined;
  themeClass: Ref<string, string> | undefined;
  onRender: (() => void) | undefined;
  validate: FormItemValidate;
  restoreValidation: () => void;
  invalidateLabelWidth: () => void;
  path?: string;
  internalValidate: FormItemInternalValidate;
  mergedSize: import("vue").ComputedRef<FormItemSize>;
  validationErrored: Ref<boolean, boolean>;
  validationWarned: Ref<boolean, boolean>;
  mergedLabelStyle: import("vue").ComputedRef<import("vue").StyleValue[]>;
  mergedLabelPlacement: import("vue").ComputedRef<LabelPlacement>;
  mergedLabelAlign: import("vue").ComputedRef<LabelAlign | undefined>;
  mergedShowRequireMark: import("vue").ComputedRef<boolean | undefined>;
  mergedRequireMarkPlacement: import("vue").ComputedRef<"left" | "right" | "right-hanging">;
  mergedValidationStatus: import("vue").ComputedRef<"error" | "success" | "warning" | undefined>;
  mergedShowFeedback: import("vue").ComputedRef<boolean>;
  mergedShowLabel: import("vue").ComputedRef<boolean>;
  isAutoLabelWidth: import("vue").ComputedRef<boolean>;
  labelElementRef: Ref<HTMLLabelElement | null, HTMLLabelElement | null>;
  mergedClsPrefix: Ref<string, string>;
  mergedRequired: import("vue").ComputedRef<boolean>;
  feedbackId: Ref<string, string>;
  renderExplains: Ref<{
    key: string;
    render: () => VNodeChild;
  }[], {
    key: string;
    render: () => VNodeChild;
  }[] | {
    key: string;
    render: () => VNodeChild;
  }[]>;
  reverseColSpace: import("vue").ComputedRef<boolean>;
}, {}, {}, {}, import("vue").ComponentOptionsMixin, import("vue").ComponentOptionsMixin, {}, string, import("vue").PublicProps, Readonly<ExtractPropTypes<{
  readonly label: StringConstructor;
  readonly labelWidth: PropType<string | number>;
  readonly labelStyle: PropType<CSSProperties | string>;
  readonly labelAlign: PropType<LabelAlign>;
  readonly labelPlacement: PropType<LabelPlacement>;
  readonly path: StringConstructor;
  readonly first: BooleanConstructor;
  readonly rulePath: StringConstructor;
  readonly required: BooleanConstructor;
  readonly showRequireMark: {
    readonly type: PropType<boolean | undefined>;
    readonly default: undefined;
  };
  readonly requireMarkPlacement: PropType<"left" | "right" | "right-hanging">;
  readonly showFeedback: {
    readonly type: PropType<boolean | undefined>;
    readonly default: undefined;
  };
  readonly rule: PropType<FormItemRule | FormItemRule[]>;
  readonly size: PropType<"small" | "medium" | "large">;
  readonly ignorePathChange: BooleanConstructor;
  readonly validationStatus: PropType<"error" | "warning" | "success">;
  readonly feedback: StringConstructor;
  readonly feedbackClass: StringConstructor;
  readonly feedbackStyle: PropType<string | CSSProperties>;
  readonly showLabel: {
    readonly type: PropType<boolean | undefined>;
    readonly default: undefined;
  };
  readonly labelProps: PropType<LabelHTMLAttributes>;
  readonly contentClass: StringConstructor;
  readonly contentStyle: PropType<string | CSSProperties>;
  readonly theme: PropType<FormTheme>;
  readonly themeOverrides: PropType<FormThemeOverrides>;
  readonly builtinThemeOverrides: PropType<FormThemeOverrides>;
}>> & Readonly<{}>, {
  readonly required: boolean;
  readonly first: boolean;
  readonly showRequireMark: boolean | undefined;
  readonly showFeedback: boolean | undefined;
  readonly ignorePathChange: boolean;
  readonly showLabel: boolean | undefined;
}, SlotsType<FormItemSlots>, {}, {}, string, import("vue").ComponentProvideOptions, true, {}, any>;
//#endregion
export { FormItemProps, FormItemSetupProps, _default as default, formItemPropKeys, formItemProps };