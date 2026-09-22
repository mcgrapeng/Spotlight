import { ExtractPublicPropTypes } from "../../_utils/naive/extract-public-props.js";
import "../../_utils/index.js";
import { FormTheme, FormThemeOverrides } from "../styles/light.js";
import "../styles/index.js";
import { FormItemRule, FormItemSlots, FormItemValidate, LabelAlign, LabelPlacement } from "./interface.js";
import { SlotsType } from "vue";
//#region src/form/src/FormItemGridItem.d.ts
declare const formItemGiProps: {
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
    readonly type: import("vue").PropType<string | number>;
    readonly default: 1;
  };
  readonly offset: {
    readonly type: import("vue").PropType<string | number>;
    readonly default: 0;
  };
  readonly suffix: BooleanConstructor;
  readonly privateOffset: NumberConstructor;
  readonly privateSpan: NumberConstructor;
  readonly privateColStart: NumberConstructor;
  readonly privateShow: {
    readonly type: BooleanConstructor;
    readonly default: true;
  };
};
declare const formItemGiPropKeys: ("label" | "span" | "theme" | "themeOverrides" | "builtinThemeOverrides" | "required" | "offset" | "size" | "contentClass" | "contentStyle" | "suffix" | "first" | "path" | "labelPlacement" | "labelAlign" | "labelStyle" | "labelWidth" | "showRequireMark" | "requireMarkPlacement" | "showFeedback" | "showLabel" | "rulePath" | "rule" | "ignorePathChange" | "validationStatus" | "feedback" | "feedbackClass" | "feedbackStyle" | "labelProps" | "privateOffset" | "privateSpan" | "privateColStart" | "privateShow")[];
type FormItemGiProps = ExtractPublicPropTypes<typeof formItemGiProps>;
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
    readonly type: import("vue").PropType<string | number>;
    readonly default: 1;
  };
  readonly offset: {
    readonly type: import("vue").PropType<string | number>;
    readonly default: 0;
  };
  readonly suffix: BooleanConstructor;
  readonly privateOffset: NumberConstructor;
  readonly privateSpan: NumberConstructor;
  readonly privateColStart: NumberConstructor;
  readonly privateShow: {
    readonly type: BooleanConstructor;
    readonly default: true;
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
    readonly type: import("vue").PropType<string | number>;
    readonly default: 1;
  };
  readonly offset: {
    readonly type: import("vue").PropType<string | number>;
    readonly default: 0;
  };
  readonly suffix: BooleanConstructor;
  readonly privateOffset: NumberConstructor;
  readonly privateSpan: NumberConstructor;
  readonly privateColStart: NumberConstructor;
  readonly privateShow: {
    readonly type: BooleanConstructor;
    readonly default: true;
  };
}>> & Readonly<{}>, {
  readonly span: string | number;
  readonly required: boolean;
  readonly offset: string | number;
  readonly suffix: boolean;
  readonly first: boolean;
  readonly showRequireMark: boolean | undefined;
  readonly showFeedback: boolean | undefined;
  readonly showLabel: boolean | undefined;
  readonly ignorePathChange: boolean;
  readonly privateShow: boolean;
}, SlotsType<FormItemSlots>, {}, {}, string, import("vue").ComponentProvideOptions, true, {}, any>;
//#endregion
export { FormItemGiProps, _default as default, formItemGiPropKeys, formItemGiProps };