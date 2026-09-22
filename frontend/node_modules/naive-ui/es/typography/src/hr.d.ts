import { TypographyTheme, TypographyThemeOverrides } from "../styles/light.js";
import "../styles/index.js";
import { CSSProperties, Ref } from "vue";
//#region src/typography/src/hr.d.ts
declare const _default: import("vue").DefineComponent<import("vue").ExtractPropTypes<{
  theme: import("vue").PropType<TypographyTheme>;
  themeOverrides: import("vue").PropType<TypographyThemeOverrides>;
  builtinThemeOverrides: import("vue").PropType<TypographyThemeOverrides>;
}>, {
  mergedClsPrefix: Ref<string, string>;
  cssVars: Ref<CSSProperties, CSSProperties> | undefined;
  themeClass: Ref<string, string> | undefined;
  onRender: (() => void) | undefined;
}, {}, {}, {}, import("vue").ComponentOptionsMixin, import("vue").ComponentOptionsMixin, {}, string, import("vue").PublicProps, Readonly<import("vue").ExtractPropTypes<{
  theme: import("vue").PropType<TypographyTheme>;
  themeOverrides: import("vue").PropType<TypographyThemeOverrides>;
  builtinThemeOverrides: import("vue").PropType<TypographyThemeOverrides>;
}>> & Readonly<{}>, {}, {}, {}, {}, string, import("vue").ComponentProvideOptions, true, {}, any>;
//#endregion
export { _default as default };