import { ExtractPublicPropTypes } from "../../_utils/naive/extract-public-props.js";
import "../../_utils/index.js";
import { TypographyTheme, TypographyThemeOverrides } from "../styles/light.js";
import "../styles/index.js";
import { CSSProperties, Ref } from "vue";
//#region src/typography/src/ol.d.ts
declare const olProps: {
  alignText: BooleanConstructor;
  theme: import("vue").PropType<TypographyTheme>;
  themeOverrides: import("vue").PropType<TypographyThemeOverrides>;
  builtinThemeOverrides: import("vue").PropType<TypographyThemeOverrides>;
};
type OlProps = ExtractPublicPropTypes<typeof olProps>;
declare const _default: import("vue").DefineComponent<import("vue").ExtractPropTypes<{
  alignText: BooleanConstructor;
  theme: import("vue").PropType<TypographyTheme>;
  themeOverrides: import("vue").PropType<TypographyThemeOverrides>;
  builtinThemeOverrides: import("vue").PropType<TypographyThemeOverrides>;
}>, {
  mergedClsPrefix: Ref<string, string>;
  cssVars: Ref<CSSProperties, CSSProperties> | undefined;
  themeClass: Ref<string, string> | undefined;
  onRender: (() => void) | undefined;
}, {}, {}, {}, import("vue").ComponentOptionsMixin, import("vue").ComponentOptionsMixin, {}, string, import("vue").PublicProps, Readonly<import("vue").ExtractPropTypes<{
  alignText: BooleanConstructor;
  theme: import("vue").PropType<TypographyTheme>;
  themeOverrides: import("vue").PropType<TypographyThemeOverrides>;
  builtinThemeOverrides: import("vue").PropType<TypographyThemeOverrides>;
}>> & Readonly<{}>, {
  alignText: boolean;
}, {}, {}, {}, string, import("vue").ComponentProvideOptions, true, {}, any>;
//#endregion
export { OlProps, _default as default, olProps };