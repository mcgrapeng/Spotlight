import { ExtractPublicPropTypes } from "../../_utils/naive/extract-public-props.js";
import "../../_utils/index.js";
import { FormTheme, FormThemeOverrides } from "../styles/light.js";
import "../styles/index.js";
import { FormItemRule, FormItemValidate, LabelAlign, LabelPlacement } from "./interface.js";
import { Span } from "../../legacy-grid/src/interface.js";
//#region src/form/src/FormItemCol.d.ts
declare const formItemColProps: {
  readonly label: StringConstructor;
  readonly labelWidth: import("vue").PropType<string | number>;
  readonly labelStyle: import("vue").PropType<import("vue").CSSProperties | string>;
  readonly labelAlign: import("vue").PropType<LabelAlign>;
  readonly labelPlacement: import("vue").PropType<LabelPlacement>;
  readonly path: StringConstructor;
  readonly first: BooleanConstructor;
  readonly rulePath: StringConstructor;
  readonly required: BooleanConstructor;
  readonly showRequireMark: {
    readonly type: import("vue").PropType<boolean | undefined>;
    readonly default: undefined;
  };
  readonly requireMarkPlacement: import("vue").PropType<"left" | "right" | "right-hanging">;
  readonly showFeedback: {
    readonly type: import("vue").PropType<boolean | undefined>;
    readonly default: undefined;
  };
  readonly rule: import("vue").PropType<FormItemRule | FormItemRule[]>;
  readonly size: import("vue").PropType<"small" | "medium" | "large">;
  readonly ignorePathChange: BooleanConstructor;
  readonly validationStatus: import("vue").PropType<"error" | "warning" | "success">;
  readonly feedback: StringConstructor;
  readonly feedbackClass: StringConstructor;
  readonly feedbackStyle: import("vue").PropType<string | import("vue").CSSProperties>;
  readonly showLabel: {
    readonly type: import("vue").PropType<boolean | undefined>;
    readonly default: undefined;
  };
  readonly labelProps: import("vue").PropType<import("vue").LabelHTMLAttributes>;
  readonly contentClass: StringConstructor;
  readonly contentStyle: import("vue").PropType<string | import("vue").CSSProperties>;
  readonly theme: import("vue").PropType<FormTheme>;
  readonly themeOverrides: import("vue").PropType<FormThemeOverrides>;
  readonly builtinThemeOverrides: import("vue").PropType<FormThemeOverrides>;
  readonly span: {
    readonly type: import("vue").PropType<Span>;
    readonly default: 1;
  };
  readonly push: {
    readonly type: import("vue").PropType<Span>;
    readonly default: 0;
  };
  readonly pull: {
    readonly type: import("vue").PropType<Span>;
    readonly default: 0;
  };
  readonly offset: {
    readonly type: import("vue").PropType<Span>;
    readonly default: 0;
  };
};
declare const formItemColPropKeys: ("push" | "theme" | "themeOverrides" | "builtinThemeOverrides" | "required" | "label" | "span" | "contentClass" | "contentStyle" | "size" | "offset" | "labelPlacement" | "labelAlign" | "labelStyle" | "first" | "path" | "labelWidth" | "rulePath" | "showRequireMark" | "requireMarkPlacement" | "showFeedback" | "rule" | "ignorePathChange" | "validationStatus" | "feedback" | "feedbackClass" | "feedbackStyle" | "showLabel" | "labelProps" | "pull")[];
type FormItemColProps = ExtractPublicPropTypes<typeof formItemColProps>;
declare const _default: import("vue").DefineComponent<import("vue").ExtractPropTypes<{
  readonly label: StringConstructor;
  readonly labelWidth: import("vue").PropType<string | number>;
  readonly labelStyle: import("vue").PropType<import("vue").CSSProperties | string>;
  readonly labelAlign: import("vue").PropType<LabelAlign>;
  readonly labelPlacement: import("vue").PropType<LabelPlacement>;
  readonly path: StringConstructor;
  readonly first: BooleanConstructor;
  readonly rulePath: StringConstructor;
  readonly required: BooleanConstructor;
  readonly showRequireMark: {
    readonly type: import("vue").PropType<boolean | undefined>;
    readonly default: undefined;
  };
  readonly requireMarkPlacement: import("vue").PropType<"left" | "right" | "right-hanging">;
  readonly showFeedback: {
    readonly type: import("vue").PropType<boolean | undefined>;
    readonly default: undefined;
  };
  readonly rule: import("vue").PropType<FormItemRule | FormItemRule[]>;
  readonly size: import("vue").PropType<"small" | "medium" | "large">;
  readonly ignorePathChange: BooleanConstructor;
  readonly validationStatus: import("vue").PropType<"error" | "warning" | "success">;
  readonly feedback: StringConstructor;
  readonly feedbackClass: StringConstructor;
  readonly feedbackStyle: import("vue").PropType<string | import("vue").CSSProperties>;
  readonly showLabel: {
    readonly type: import("vue").PropType<boolean | undefined>;
    readonly default: undefined;
  };
  readonly labelProps: import("vue").PropType<import("vue").LabelHTMLAttributes>;
  readonly contentClass: StringConstructor;
  readonly contentStyle: import("vue").PropType<string | import("vue").CSSProperties>;
  readonly theme: import("vue").PropType<FormTheme>;
  readonly themeOverrides: import("vue").PropType<FormThemeOverrides>;
  readonly builtinThemeOverrides: import("vue").PropType<FormThemeOverrides>;
  readonly span: {
    readonly type: import("vue").PropType<Span>;
    readonly default: 1;
  };
  readonly push: {
    readonly type: import("vue").PropType<Span>;
    readonly default: 0;
  };
  readonly pull: {
    readonly type: import("vue").PropType<Span>;
    readonly default: 0;
  };
  readonly offset: {
    readonly type: import("vue").PropType<Span>;
    readonly default: 0;
  };
}>, {
  formItemInstRef: unknown;
  validate: FormItemValidate;
  restoreValidation: () => void;
}, {}, {}, {}, import("vue").ComponentOptionsMixin, import("vue").ComponentOptionsMixin, {}, string, import("vue").PublicProps, Readonly<import("vue").ExtractPropTypes<{
  readonly label: StringConstructor;
  readonly labelWidth: import("vue").PropType<string | number>;
  readonly labelStyle: import("vue").PropType<import("vue").CSSProperties | string>;
  readonly labelAlign: import("vue").PropType<LabelAlign>;
  readonly labelPlacement: import("vue").PropType<LabelPlacement>;
  readonly path: StringConstructor;
  readonly first: BooleanConstructor;
  readonly rulePath: StringConstructor;
  readonly required: BooleanConstructor;
  readonly showRequireMark: {
    readonly type: import("vue").PropType<boolean | undefined>;
    readonly default: undefined;
  };
  readonly requireMarkPlacement: import("vue").PropType<"left" | "right" | "right-hanging">;
  readonly showFeedback: {
    readonly type: import("vue").PropType<boolean | undefined>;
    readonly default: undefined;
  };
  readonly rule: import("vue").PropType<FormItemRule | FormItemRule[]>;
  readonly size: import("vue").PropType<"small" | "medium" | "large">;
  readonly ignorePathChange: BooleanConstructor;
  readonly validationStatus: import("vue").PropType<"error" | "warning" | "success">;
  readonly feedback: StringConstructor;
  readonly feedbackClass: StringConstructor;
  readonly feedbackStyle: import("vue").PropType<string | import("vue").CSSProperties>;
  readonly showLabel: {
    readonly type: import("vue").PropType<boolean | undefined>;
    readonly default: undefined;
  };
  readonly labelProps: import("vue").PropType<import("vue").LabelHTMLAttributes>;
  readonly contentClass: StringConstructor;
  readonly contentStyle: import("vue").PropType<string | import("vue").CSSProperties>;
  readonly theme: import("vue").PropType<FormTheme>;
  readonly themeOverrides: import("vue").PropType<FormThemeOverrides>;
  readonly builtinThemeOverrides: import("vue").PropType<FormThemeOverrides>;
  readonly span: {
    readonly type: import("vue").PropType<Span>;
    readonly default: 1;
  };
  readonly push: {
    readonly type: import("vue").PropType<Span>;
    readonly default: 0;
  };
  readonly pull: {
    readonly type: import("vue").PropType<Span>;
    readonly default: 0;
  };
  readonly offset: {
    readonly type: import("vue").PropType<Span>;
    readonly default: 0;
  };
}>> & Readonly<{}>, {
  readonly push: Span;
  readonly required: boolean;
  readonly span: Span;
  readonly offset: Span;
  readonly first: boolean;
  readonly showRequireMark: boolean | undefined;
  readonly showFeedback: boolean | undefined;
  readonly ignorePathChange: boolean;
  readonly showLabel: boolean | undefined;
  readonly pull: Span;
}, {}, {}, {}, string, import("vue").ComponentProvideOptions, true, {}, any>;
//#endregion
export { FormItemColProps, _default as default, formItemColPropKeys, formItemColProps };