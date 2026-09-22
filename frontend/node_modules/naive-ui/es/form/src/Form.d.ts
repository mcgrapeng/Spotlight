import { FormSize } from "./public-types.js";
import { ExtractPublicPropTypes } from "../../_utils/naive/extract-public-props.js";
import "../../_utils/index.js";
import { FormTheme, FormThemeOverrides } from "../styles/light.js";
import "../styles/index.js";
import { FormInst, FormRules, FormValidateMessages, LabelAlign, LabelPlacement } from "./interface.js";
import { ExtractPropTypes, PropType } from "vue";
//#region src/form/src/Form.d.ts
declare const formProps: {
  readonly inline: BooleanConstructor;
  readonly labelWidth: PropType<number | string>;
  readonly labelAlign: PropType<LabelAlign>;
  readonly labelPlacement: {
    readonly type: PropType<LabelPlacement>;
    readonly default: "top";
  };
  readonly model: {
    readonly type: PropType<Record<string, any>>;
    readonly default: () => void;
  };
  readonly rules: PropType<FormRules>;
  readonly disabled: BooleanConstructor;
  readonly size: PropType<FormSize>;
  readonly showRequireMark: {
    readonly type: PropType<boolean | undefined>;
    readonly default: undefined;
  };
  readonly requireMarkPlacement: PropType<"left" | "right" | "right-hanging">;
  readonly showFeedback: {
    readonly type: BooleanConstructor;
    readonly default: true;
  };
  readonly onSubmit: {
    readonly type: PropType<(e: Event) => void>;
    readonly default: (e: Event) => void;
  };
  readonly showLabel: {
    readonly type: PropType<boolean | undefined>;
    readonly default: undefined;
  };
  readonly validateMessages: PropType<Partial<FormValidateMessages>>;
  readonly theme: PropType<FormTheme>;
  readonly themeOverrides: PropType<FormThemeOverrides>;
  readonly builtinThemeOverrides: PropType<FormThemeOverrides>;
};
type FormSetupProps = ExtractPropTypes<typeof formProps>;
type FormProps = ExtractPublicPropTypes<typeof formProps>;
declare const _default: import("vue").DefineComponent<ExtractPropTypes<{
  readonly inline: BooleanConstructor;
  readonly labelWidth: PropType<number | string>;
  readonly labelAlign: PropType<LabelAlign>;
  readonly labelPlacement: {
    readonly type: PropType<LabelPlacement>;
    readonly default: "top";
  };
  readonly model: {
    readonly type: PropType<Record<string, any>>;
    readonly default: () => void;
  };
  readonly rules: PropType<FormRules>;
  readonly disabled: BooleanConstructor;
  readonly size: PropType<FormSize>;
  readonly showRequireMark: {
    readonly type: PropType<boolean | undefined>;
    readonly default: undefined;
  };
  readonly requireMarkPlacement: PropType<"left" | "right" | "right-hanging">;
  readonly showFeedback: {
    readonly type: BooleanConstructor;
    readonly default: true;
  };
  readonly onSubmit: {
    readonly type: PropType<(e: Event) => void>;
    readonly default: (e: Event) => void;
  };
  readonly showLabel: {
    readonly type: PropType<boolean | undefined>;
    readonly default: undefined;
  };
  readonly validateMessages: PropType<Partial<FormValidateMessages>>;
  readonly theme: PropType<FormTheme>;
  readonly themeOverrides: PropType<FormThemeOverrides>;
  readonly builtinThemeOverrides: PropType<FormThemeOverrides>;
}>, FormInst & {
  mergedClsPrefix: import("vue").Ref<string, string>;
}, {}, {}, {}, import("vue").ComponentOptionsMixin, import("vue").ComponentOptionsMixin, {}, string, import("vue").PublicProps, Readonly<ExtractPropTypes<{
  readonly inline: BooleanConstructor;
  readonly labelWidth: PropType<number | string>;
  readonly labelAlign: PropType<LabelAlign>;
  readonly labelPlacement: {
    readonly type: PropType<LabelPlacement>;
    readonly default: "top";
  };
  readonly model: {
    readonly type: PropType<Record<string, any>>;
    readonly default: () => void;
  };
  readonly rules: PropType<FormRules>;
  readonly disabled: BooleanConstructor;
  readonly size: PropType<FormSize>;
  readonly showRequireMark: {
    readonly type: PropType<boolean | undefined>;
    readonly default: undefined;
  };
  readonly requireMarkPlacement: PropType<"left" | "right" | "right-hanging">;
  readonly showFeedback: {
    readonly type: BooleanConstructor;
    readonly default: true;
  };
  readonly onSubmit: {
    readonly type: PropType<(e: Event) => void>;
    readonly default: (e: Event) => void;
  };
  readonly showLabel: {
    readonly type: PropType<boolean | undefined>;
    readonly default: undefined;
  };
  readonly validateMessages: PropType<Partial<FormValidateMessages>>;
  readonly theme: PropType<FormTheme>;
  readonly themeOverrides: PropType<FormThemeOverrides>;
  readonly builtinThemeOverrides: PropType<FormThemeOverrides>;
}>> & Readonly<{}>, {
  readonly onSubmit: (e: Event) => void;
  readonly disabled: boolean;
  readonly inline: boolean;
  readonly labelPlacement: LabelPlacement;
  readonly showRequireMark: boolean | undefined;
  readonly showFeedback: boolean;
  readonly showLabel: boolean | undefined;
  readonly model: Record<string, any>;
}, {}, {}, {}, string, import("vue").ComponentProvideOptions, true, {}, any>;
//#endregion
export { FormProps, FormSetupProps, _default as default, formProps };