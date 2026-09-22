import { ExtractPublicPropTypes } from "../../_utils/naive/extract-public-props.js";
import "../../_utils/index.js";
import { FormTheme, FormThemeOverrides } from "../styles/light.js";
import "../styles/index.js";
import { FormItemRule, FormItemValidate, LabelAlign, LabelPlacement } from "./interface.js";
import { Span } from "../../legacy-grid/src/interface.js";
//#region src/form/src/FormItemRow.d.ts
declare const formItemRowProps: {
  label: StringConstructor;
  labelWidth: import("vue").PropType<string | number>;
  labelStyle: import("vue").PropType<import("vue").CSSProperties | string>;
  labelAlign: import("vue").PropType<LabelAlign>;
  labelPlacement: import("vue").PropType<LabelPlacement>;
  path: StringConstructor;
  first: BooleanConstructor;
  rulePath: StringConstructor;
  required: BooleanConstructor;
  showRequireMark: {
    readonly type: import("vue").PropType<boolean | undefined>;
    readonly default: undefined;
  };
  requireMarkPlacement: import("vue").PropType<"left" | "right" | "right-hanging">;
  showFeedback: {
    readonly type: import("vue").PropType<boolean | undefined>;
    readonly default: undefined;
  };
  rule: import("vue").PropType<FormItemRule | FormItemRule[]>;
  size: import("vue").PropType<"small" | "medium" | "large">;
  ignorePathChange: BooleanConstructor;
  validationStatus: import("vue").PropType<"error" | "warning" | "success">;
  feedback: StringConstructor;
  feedbackClass: StringConstructor;
  feedbackStyle: import("vue").PropType<string | import("vue").CSSProperties>;
  showLabel: {
    readonly type: import("vue").PropType<boolean | undefined>;
    readonly default: undefined;
  };
  labelProps: import("vue").PropType<import("vue").LabelHTMLAttributes>;
  contentClass: StringConstructor;
  contentStyle: import("vue").PropType<string | import("vue").CSSProperties>;
  theme: import("vue").PropType<FormTheme>;
  themeOverrides: import("vue").PropType<FormThemeOverrides>;
  builtinThemeOverrides: import("vue").PropType<FormThemeOverrides>;
  span: {
    readonly type: import("vue").PropType<Span>;
    readonly default: 1;
  };
  push: {
    readonly type: import("vue").PropType<Span>;
    readonly default: 0;
  };
  pull: {
    readonly type: import("vue").PropType<Span>;
    readonly default: 0;
  };
  offset: {
    readonly type: import("vue").PropType<Span>;
    readonly default: 0;
  };
  gutter: {
    readonly type: import("vue").PropType<string | number | [number, number]>;
    readonly default: 0;
  };
  alignItems: StringConstructor;
  justifyContent: StringConstructor;
};
type FormItemRowProps = ExtractPublicPropTypes<typeof formItemRowProps>;
declare const _default: import("vue").DefineComponent<import("vue").ExtractPropTypes<{
  label: StringConstructor;
  labelWidth: import("vue").PropType<string | number>;
  labelStyle: import("vue").PropType<import("vue").CSSProperties | string>;
  labelAlign: import("vue").PropType<LabelAlign>;
  labelPlacement: import("vue").PropType<LabelPlacement>;
  path: StringConstructor;
  first: BooleanConstructor;
  rulePath: StringConstructor;
  required: BooleanConstructor;
  showRequireMark: {
    readonly type: import("vue").PropType<boolean | undefined>;
    readonly default: undefined;
  };
  requireMarkPlacement: import("vue").PropType<"left" | "right" | "right-hanging">;
  showFeedback: {
    readonly type: import("vue").PropType<boolean | undefined>;
    readonly default: undefined;
  };
  rule: import("vue").PropType<FormItemRule | FormItemRule[]>;
  size: import("vue").PropType<"small" | "medium" | "large">;
  ignorePathChange: BooleanConstructor;
  validationStatus: import("vue").PropType<"error" | "warning" | "success">;
  feedback: StringConstructor;
  feedbackClass: StringConstructor;
  feedbackStyle: import("vue").PropType<string | import("vue").CSSProperties>;
  showLabel: {
    readonly type: import("vue").PropType<boolean | undefined>;
    readonly default: undefined;
  };
  labelProps: import("vue").PropType<import("vue").LabelHTMLAttributes>;
  contentClass: StringConstructor;
  contentStyle: import("vue").PropType<string | import("vue").CSSProperties>;
  theme: import("vue").PropType<FormTheme>;
  themeOverrides: import("vue").PropType<FormThemeOverrides>;
  builtinThemeOverrides: import("vue").PropType<FormThemeOverrides>;
  span: {
    readonly type: import("vue").PropType<Span>;
    readonly default: 1;
  };
  push: {
    readonly type: import("vue").PropType<Span>;
    readonly default: 0;
  };
  pull: {
    readonly type: import("vue").PropType<Span>;
    readonly default: 0;
  };
  offset: {
    readonly type: import("vue").PropType<Span>;
    readonly default: 0;
  };
  gutter: {
    readonly type: import("vue").PropType<string | number | [number, number]>;
    readonly default: 0;
  };
  alignItems: StringConstructor;
  justifyContent: StringConstructor;
}>, {
  formItemColInstRef: unknown;
  validate: FormItemValidate;
  restoreValidation: () => void;
}, {}, {}, {}, import("vue").ComponentOptionsMixin, import("vue").ComponentOptionsMixin, {}, string, import("vue").PublicProps, Readonly<import("vue").ExtractPropTypes<{
  label: StringConstructor;
  labelWidth: import("vue").PropType<string | number>;
  labelStyle: import("vue").PropType<import("vue").CSSProperties | string>;
  labelAlign: import("vue").PropType<LabelAlign>;
  labelPlacement: import("vue").PropType<LabelPlacement>;
  path: StringConstructor;
  first: BooleanConstructor;
  rulePath: StringConstructor;
  required: BooleanConstructor;
  showRequireMark: {
    readonly type: import("vue").PropType<boolean | undefined>;
    readonly default: undefined;
  };
  requireMarkPlacement: import("vue").PropType<"left" | "right" | "right-hanging">;
  showFeedback: {
    readonly type: import("vue").PropType<boolean | undefined>;
    readonly default: undefined;
  };
  rule: import("vue").PropType<FormItemRule | FormItemRule[]>;
  size: import("vue").PropType<"small" | "medium" | "large">;
  ignorePathChange: BooleanConstructor;
  validationStatus: import("vue").PropType<"error" | "warning" | "success">;
  feedback: StringConstructor;
  feedbackClass: StringConstructor;
  feedbackStyle: import("vue").PropType<string | import("vue").CSSProperties>;
  showLabel: {
    readonly type: import("vue").PropType<boolean | undefined>;
    readonly default: undefined;
  };
  labelProps: import("vue").PropType<import("vue").LabelHTMLAttributes>;
  contentClass: StringConstructor;
  contentStyle: import("vue").PropType<string | import("vue").CSSProperties>;
  theme: import("vue").PropType<FormTheme>;
  themeOverrides: import("vue").PropType<FormThemeOverrides>;
  builtinThemeOverrides: import("vue").PropType<FormThemeOverrides>;
  span: {
    readonly type: import("vue").PropType<Span>;
    readonly default: 1;
  };
  push: {
    readonly type: import("vue").PropType<Span>;
    readonly default: 0;
  };
  pull: {
    readonly type: import("vue").PropType<Span>;
    readonly default: 0;
  };
  offset: {
    readonly type: import("vue").PropType<Span>;
    readonly default: 0;
  };
  gutter: {
    readonly type: import("vue").PropType<string | number | [number, number]>;
    readonly default: 0;
  };
  alignItems: StringConstructor;
  justifyContent: StringConstructor;
}>> & Readonly<{}>, {
  push: Span;
  span: Span;
  required: boolean;
  offset: Span;
  first: boolean;
  showRequireMark: boolean | undefined;
  showFeedback: boolean | undefined;
  showLabel: boolean | undefined;
  ignorePathChange: boolean;
  pull: Span;
  gutter: string | number | [number, number];
}, {}, {}, {}, string, import("vue").ComponentProvideOptions, true, {}, any>;
//#endregion
export { FormItemRowProps, _default as default, formItemRowProps };