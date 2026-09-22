import { ExtractPublicPropTypes } from "../../_utils/naive/extract-public-props.js";
import "../../_utils/index.js";
import { GradientTextTheme, GradientTextThemeOverrides } from "../styles/light.js";
import "../styles/index.js";
import { CSSProperties, PropType, Ref } from "vue";
//#region src/gradient-text/src/GradientText.d.ts
type Gradient = string | {
  deg?: string | number;
  from: string;
  to: string;
};
declare const gradientTextProps: {
  readonly size: PropType<string | number>;
  readonly fontSize: PropType<string | number>;
  readonly type: {
    readonly type: PropType<"info" | "success" | "warning" | "error" | "primary" | "danger">;
    readonly default: "primary";
  };
  readonly color: PropType<Gradient>;
  readonly gradient: PropType<Gradient>;
  readonly theme: PropType<GradientTextTheme>;
  readonly themeOverrides: PropType<GradientTextThemeOverrides>;
  readonly builtinThemeOverrides: PropType<GradientTextThemeOverrides>;
};
type GradientTextProps = ExtractPublicPropTypes<typeof gradientTextProps>;
declare const _default: import("vue").DefineComponent<import("vue").ExtractPropTypes<{
  readonly size: PropType<string | number>;
  readonly fontSize: PropType<string | number>;
  readonly type: {
    readonly type: PropType<"info" | "success" | "warning" | "error" | "primary" | "danger">;
    readonly default: "primary";
  };
  readonly color: PropType<Gradient>;
  readonly gradient: PropType<Gradient>;
  readonly theme: PropType<GradientTextTheme>;
  readonly themeOverrides: PropType<GradientTextThemeOverrides>;
  readonly builtinThemeOverrides: PropType<GradientTextThemeOverrides>;
}>, {
  mergedClsPrefix: Ref<string, string>;
  compatibleType: import("vue").ComputedRef<"error" | "info" | "success" | "warning" | "primary">;
  styleFontSize: import("vue").ComputedRef<string | number | undefined>;
  styleBgImage: import("vue").ComputedRef<string | undefined>;
  cssVars: Ref<CSSProperties, CSSProperties> | undefined;
  themeClass: Ref<string, string> | undefined;
  onRender: (() => void) | undefined;
}, {}, {}, {}, import("vue").ComponentOptionsMixin, import("vue").ComponentOptionsMixin, {}, string, import("vue").PublicProps, Readonly<import("vue").ExtractPropTypes<{
  readonly size: PropType<string | number>;
  readonly fontSize: PropType<string | number>;
  readonly type: {
    readonly type: PropType<"info" | "success" | "warning" | "error" | "primary" | "danger">;
    readonly default: "primary";
  };
  readonly color: PropType<Gradient>;
  readonly gradient: PropType<Gradient>;
  readonly theme: PropType<GradientTextTheme>;
  readonly themeOverrides: PropType<GradientTextThemeOverrides>;
  readonly builtinThemeOverrides: PropType<GradientTextThemeOverrides>;
}>> & Readonly<{}>, {
  readonly type: "error" | "info" | "success" | "warning" | "primary" | "danger";
}, {}, {}, {}, string, import("vue").ComponentProvideOptions, true, {}, any>;
//#endregion
export { GradientTextProps, _default as default, gradientTextProps };