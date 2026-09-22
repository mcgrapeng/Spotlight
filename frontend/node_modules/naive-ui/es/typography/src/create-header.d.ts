import { ExtractPublicPropTypes } from "../../_utils/naive/extract-public-props.js";
import "../../_utils/index.js";
import { TypographyTheme, TypographyThemeOverrides } from "../styles/light.js";
import "../styles/index.js";
import { CSSProperties, PropType, Ref } from "vue";
//#region src/typography/src/create-header.d.ts
declare const headerProps: {
  readonly type: {
    readonly type: PropType<"info" | "success" | "warning" | "error" | "default">;
    readonly default: "default";
  };
  readonly prefix: StringConstructor;
  readonly alignText: BooleanConstructor;
  readonly theme: PropType<TypographyTheme>;
  readonly themeOverrides: PropType<TypographyThemeOverrides>;
  readonly builtinThemeOverrides: PropType<TypographyThemeOverrides>;
};
type HeaderProps = ExtractPublicPropTypes<typeof headerProps>;
declare const _default: (level: "1" | "2" | "3" | "4" | "5" | "6") => import("vue").DefineComponent<import("vue").ExtractPropTypes<{
  readonly type: {
    readonly type: PropType<"info" | "success" | "warning" | "error" | "default">;
    readonly default: "default";
  };
  readonly prefix: StringConstructor;
  readonly alignText: BooleanConstructor;
  readonly theme: PropType<TypographyTheme>;
  readonly themeOverrides: PropType<TypographyThemeOverrides>;
  readonly builtinThemeOverrides: PropType<TypographyThemeOverrides>;
}>, {
  mergedClsPrefix: Ref<string, string>;
  cssVars: Ref<CSSProperties, CSSProperties> | undefined;
  themeClass: Ref<string, string> | undefined;
  onRender: (() => void) | undefined;
}, {}, {}, {}, import("vue").ComponentOptionsMixin, import("vue").ComponentOptionsMixin, {}, string, import("vue").PublicProps, Readonly<import("vue").ExtractPropTypes<{
  readonly type: {
    readonly type: PropType<"info" | "success" | "warning" | "error" | "default">;
    readonly default: "default";
  };
  readonly prefix: StringConstructor;
  readonly alignText: BooleanConstructor;
  readonly theme: PropType<TypographyTheme>;
  readonly themeOverrides: PropType<TypographyThemeOverrides>;
  readonly builtinThemeOverrides: PropType<TypographyThemeOverrides>;
}>> & Readonly<{}>, {
  readonly type: "error" | "info" | "success" | "warning" | "default";
  readonly alignText: boolean;
}, {}, {}, {}, string, import("vue").ComponentProvideOptions, true, {}, any>;
//#endregion
export { HeaderProps, _default as default, headerProps };