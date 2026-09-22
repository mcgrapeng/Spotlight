import { ExtractPublicPropTypes } from "../../_utils/naive/extract-public-props.js";
import { MaybeArray } from "../../_utils/vue/call.js";
import "../../_utils/index.js";
import { RadioTheme, RadioThemeOverrides } from "../styles/light.js";
import "../styles/index.js";
import { OnUpdateValue } from "./interface.js";
import { RtlItem } from "../../config-provider/src/internal-interface.js";
import { CSSProperties, PropType, Ref } from "vue";
//#region src/radio/src/RadioGroup.d.ts
interface RadioGroupOption {
  label?: string;
  value?: string | number | boolean;
  disabled?: boolean;
  [key: string]: unknown;
}
declare const radioGroupProps: {
  readonly name: StringConstructor;
  readonly options: PropType<RadioGroupOption[]>;
  readonly labelField: {
    readonly type: StringConstructor;
    readonly default: "label";
  };
  readonly valueField: {
    readonly type: StringConstructor;
    readonly default: "value";
  };
  readonly value: PropType<string | number | boolean | null>;
  readonly defaultValue: {
    readonly type: PropType<string | number | boolean | null>;
    readonly default: null;
  };
  readonly size: PropType<"small" | "medium" | "large">;
  readonly disabled: {
    readonly type: PropType<boolean | undefined>;
    readonly default: undefined;
  };
  readonly 'onUpdate:value': PropType<MaybeArray<OnUpdateValue>>;
  readonly onUpdateValue: PropType<MaybeArray<OnUpdateValue>>;
  readonly theme: PropType<RadioTheme>;
  readonly themeOverrides: PropType<RadioThemeOverrides>;
  readonly builtinThemeOverrides: PropType<RadioThemeOverrides>;
};
type RadioGroupProps = ExtractPublicPropTypes<typeof radioGroupProps>;
declare const _default: import("vue").DefineComponent<import("vue").ExtractPropTypes<{
  readonly name: StringConstructor;
  readonly options: PropType<RadioGroupOption[]>;
  readonly labelField: {
    readonly type: StringConstructor;
    readonly default: "label";
  };
  readonly valueField: {
    readonly type: StringConstructor;
    readonly default: "value";
  };
  readonly value: PropType<string | number | boolean | null>;
  readonly defaultValue: {
    readonly type: PropType<string | number | boolean | null>;
    readonly default: null;
  };
  readonly size: PropType<"small" | "medium" | "large">;
  readonly disabled: {
    readonly type: PropType<boolean | undefined>;
    readonly default: undefined;
  };
  readonly 'onUpdate:value': PropType<MaybeArray<OnUpdateValue>>;
  readonly onUpdateValue: PropType<MaybeArray<OnUpdateValue>>;
  readonly theme: PropType<RadioTheme>;
  readonly themeOverrides: PropType<RadioThemeOverrides>;
  readonly builtinThemeOverrides: PropType<RadioThemeOverrides>;
}>, {
  selfElRef: Ref<HTMLDivElement | null, HTMLDivElement | null>;
  rtlEnabled: Ref<RtlItem | undefined, RtlItem | undefined> | undefined;
  mergedClsPrefix: Ref<string, string>;
  mergedValue: import("vue").ComputedRef<string | number | boolean | null>;
  handleFocusout: (e: FocusEvent) => void;
  handleFocusin: (e: FocusEvent) => void;
  cssVars: Ref<CSSProperties, CSSProperties> | undefined;
  themeClass: Ref<string, string> | undefined;
  onRender: (() => void) | undefined;
}, {}, {}, {}, import("vue").ComponentOptionsMixin, import("vue").ComponentOptionsMixin, {}, string, import("vue").PublicProps, Readonly<import("vue").ExtractPropTypes<{
  readonly name: StringConstructor;
  readonly options: PropType<RadioGroupOption[]>;
  readonly labelField: {
    readonly type: StringConstructor;
    readonly default: "label";
  };
  readonly valueField: {
    readonly type: StringConstructor;
    readonly default: "value";
  };
  readonly value: PropType<string | number | boolean | null>;
  readonly defaultValue: {
    readonly type: PropType<string | number | boolean | null>;
    readonly default: null;
  };
  readonly size: PropType<"small" | "medium" | "large">;
  readonly disabled: {
    readonly type: PropType<boolean | undefined>;
    readonly default: undefined;
  };
  readonly 'onUpdate:value': PropType<MaybeArray<OnUpdateValue>>;
  readonly onUpdateValue: PropType<MaybeArray<OnUpdateValue>>;
  readonly theme: PropType<RadioTheme>;
  readonly themeOverrides: PropType<RadioThemeOverrides>;
  readonly builtinThemeOverrides: PropType<RadioThemeOverrides>;
}>> & Readonly<{}>, {
  readonly defaultValue: string | number | boolean | null;
  readonly disabled: boolean | undefined;
  readonly valueField: string;
  readonly labelField: string;
}, {}, {}, {}, string, import("vue").ComponentProvideOptions, true, {}, any>;
//#endregion
export { RadioGroupOption, RadioGroupProps, _default as default, radioGroupProps };