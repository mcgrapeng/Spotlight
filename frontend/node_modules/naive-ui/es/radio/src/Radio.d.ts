import { ExtractPublicPropTypes } from "../../_utils/naive/extract-public-props.js";
import { MaybeArray } from "../../_utils/vue/call.js";
import "../../_utils/index.js";
import { RadioTheme, RadioThemeOverrides } from "../styles/light.js";
import "../styles/index.js";
import { RadioSize } from "./public-types.js";
import { UseRadio } from "./use-radio.js";
import { RtlItem } from "../../config-provider/src/internal-interface.js";
import { CSSProperties, Ref } from "vue";
//#region src/radio/src/Radio.d.ts
declare const radioProps: {
  readonly name: StringConstructor;
  readonly value: {
    readonly type: import("vue").PropType<string | number | boolean>;
    readonly default: "on";
  };
  readonly checked: {
    readonly type: import("vue").PropType<boolean | undefined>;
    readonly default: undefined;
  };
  readonly defaultChecked: BooleanConstructor;
  readonly disabled: {
    readonly type: import("vue").PropType<boolean | undefined>;
    readonly default: undefined;
  };
  readonly label: StringConstructor;
  readonly size: import("vue").PropType<RadioSize>;
  readonly onUpdateChecked: import("vue").PropType<undefined | MaybeArray<(value: boolean) => void>>;
  readonly 'onUpdate:checked': import("vue").PropType<undefined | MaybeArray<(value: boolean) => void>>;
  readonly checkedValue: {
    readonly type: import("vue").PropType<boolean | undefined>;
    readonly default: undefined;
  };
  readonly theme: import("vue").PropType<RadioTheme>;
  readonly themeOverrides: import("vue").PropType<RadioThemeOverrides>;
  readonly builtinThemeOverrides: import("vue").PropType<RadioThemeOverrides>;
};
type RadioProps = ExtractPublicPropTypes<typeof radioProps>;
declare const _default: import("vue").DefineComponent<import("vue").ExtractPropTypes<{
  readonly name: StringConstructor;
  readonly value: {
    readonly type: import("vue").PropType<string | number | boolean>;
    readonly default: "on";
  };
  readonly checked: {
    readonly type: import("vue").PropType<boolean | undefined>;
    readonly default: undefined;
  };
  readonly defaultChecked: BooleanConstructor;
  readonly disabled: {
    readonly type: import("vue").PropType<boolean | undefined>;
    readonly default: undefined;
  };
  readonly label: StringConstructor;
  readonly size: import("vue").PropType<RadioSize>;
  readonly onUpdateChecked: import("vue").PropType<undefined | MaybeArray<(value: boolean) => void>>;
  readonly 'onUpdate:checked': import("vue").PropType<undefined | MaybeArray<(value: boolean) => void>>;
  readonly checkedValue: {
    readonly type: import("vue").PropType<boolean | undefined>;
    readonly default: undefined;
  };
  readonly theme: import("vue").PropType<RadioTheme>;
  readonly themeOverrides: import("vue").PropType<RadioThemeOverrides>;
  readonly builtinThemeOverrides: import("vue").PropType<RadioThemeOverrides>;
}>, UseRadio & {
  rtlEnabled: Ref<RtlItem | undefined, RtlItem | undefined> | undefined;
  cssVars: Ref<CSSProperties, CSSProperties> | undefined;
  themeClass: Ref<string, string> | undefined;
  onRender: (() => void) | undefined;
}, {}, {}, {}, import("vue").ComponentOptionsMixin, import("vue").ComponentOptionsMixin, {}, string, import("vue").PublicProps, Readonly<import("vue").ExtractPropTypes<{
  readonly name: StringConstructor;
  readonly value: {
    readonly type: import("vue").PropType<string | number | boolean>;
    readonly default: "on";
  };
  readonly checked: {
    readonly type: import("vue").PropType<boolean | undefined>;
    readonly default: undefined;
  };
  readonly defaultChecked: BooleanConstructor;
  readonly disabled: {
    readonly type: import("vue").PropType<boolean | undefined>;
    readonly default: undefined;
  };
  readonly label: StringConstructor;
  readonly size: import("vue").PropType<RadioSize>;
  readonly onUpdateChecked: import("vue").PropType<undefined | MaybeArray<(value: boolean) => void>>;
  readonly 'onUpdate:checked': import("vue").PropType<undefined | MaybeArray<(value: boolean) => void>>;
  readonly checkedValue: {
    readonly type: import("vue").PropType<boolean | undefined>;
    readonly default: undefined;
  };
  readonly theme: import("vue").PropType<RadioTheme>;
  readonly themeOverrides: import("vue").PropType<RadioThemeOverrides>;
  readonly builtinThemeOverrides: import("vue").PropType<RadioThemeOverrides>;
}>> & Readonly<{}>, {
  readonly disabled: boolean | undefined;
  readonly value: string | number | boolean;
  readonly checked: boolean | undefined;
  readonly defaultChecked: boolean;
  readonly checkedValue: boolean | undefined;
}, {}, {}, {}, string, import("vue").ComponentProvideOptions, true, {}, any>;
//#endregion
export { RadioProps, _default as default, radioProps };