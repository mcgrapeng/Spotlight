import { ExtractPublicPropTypes } from "../../_utils/naive/extract-public-props.js";
import "../../_utils/index.js";
import { FlexTheme, FlexThemeOverrides } from "../styles/light.js";
import "../styles/index.js";
import { FlexAlign, FlexJustify } from "./type.js";
import { RtlItem } from "../../config-provider/src/internal-interface.js";
import { PropType } from "vue";
//#region src/flex/src/Flex.d.ts
declare const flexProps: {
  readonly align: PropType<FlexAlign>;
  readonly justify: {
    readonly type: PropType<FlexJustify>;
    readonly default: "start";
  };
  readonly inline: BooleanConstructor;
  readonly vertical: BooleanConstructor;
  readonly reverse: BooleanConstructor;
  readonly size: {
    readonly type: PropType<"small" | "medium" | "large" | number | [number, number]>;
    readonly default: "medium";
  };
  readonly wrap: {
    readonly type: BooleanConstructor;
    readonly default: true;
  };
  readonly theme: PropType<FlexTheme>;
  readonly themeOverrides: PropType<FlexThemeOverrides>;
  readonly builtinThemeOverrides: PropType<FlexThemeOverrides>;
};
type FlexProps = ExtractPublicPropTypes<typeof flexProps>;
declare const _default: import("vue").DefineComponent<import("vue").ExtractPropTypes<{
  readonly align: PropType<FlexAlign>;
  readonly justify: {
    readonly type: PropType<FlexJustify>;
    readonly default: "start";
  };
  readonly inline: BooleanConstructor;
  readonly vertical: BooleanConstructor;
  readonly reverse: BooleanConstructor;
  readonly size: {
    readonly type: PropType<"small" | "medium" | "large" | number | [number, number]>;
    readonly default: "medium";
  };
  readonly wrap: {
    readonly type: BooleanConstructor;
    readonly default: true;
  };
  readonly theme: PropType<FlexTheme>;
  readonly themeOverrides: PropType<FlexThemeOverrides>;
  readonly builtinThemeOverrides: PropType<FlexThemeOverrides>;
}>, {
  rtlEnabled: import("vue").Ref<RtlItem | undefined, RtlItem | undefined> | undefined;
  mergedClsPrefix: import("vue").Ref<string, string>;
  margin: import("vue").ComputedRef<{
    horizontal: number;
    vertical: number;
  }>;
}, {}, {}, {}, import("vue").ComponentOptionsMixin, import("vue").ComponentOptionsMixin, {}, string, import("vue").PublicProps, Readonly<import("vue").ExtractPropTypes<{
  readonly align: PropType<FlexAlign>;
  readonly justify: {
    readonly type: PropType<FlexJustify>;
    readonly default: "start";
  };
  readonly inline: BooleanConstructor;
  readonly vertical: BooleanConstructor;
  readonly reverse: BooleanConstructor;
  readonly size: {
    readonly type: PropType<"small" | "medium" | "large" | number | [number, number]>;
    readonly default: "medium";
  };
  readonly wrap: {
    readonly type: BooleanConstructor;
    readonly default: true;
  };
  readonly theme: PropType<FlexTheme>;
  readonly themeOverrides: PropType<FlexThemeOverrides>;
  readonly builtinThemeOverrides: PropType<FlexThemeOverrides>;
}>> & Readonly<{}>, {
  readonly reverse: boolean;
  readonly size: number | "small" | "medium" | "large" | [number, number];
  readonly vertical: boolean;
  readonly inline: boolean;
  readonly wrap: boolean;
  readonly justify: import("csstype").Property.JustifyContent;
}, {}, {}, {}, string, import("vue").ComponentProvideOptions, true, {}, any>;
//#endregion
export { FlexProps, _default as default, flexProps };