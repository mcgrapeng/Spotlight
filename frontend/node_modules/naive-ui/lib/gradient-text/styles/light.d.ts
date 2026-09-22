import { ThemeCommonVars } from "../../_styles/common/light.js";
import { ExtractThemeOverrides, Theme } from "../../_mixins/use-theme.js";
import "../../_mixins/index.js";
//#region src/gradient-text/styles/light.d.ts
declare function self(vars: ThemeCommonVars): {
  fontWeight: string;
  rotate: string;
  colorStartPrimary: string;
  colorEndPrimary: string;
  colorStartInfo: string;
  colorEndInfo: string;
  colorStartWarning: string;
  colorEndWarning: string;
  colorStartError: string;
  colorEndError: string;
  colorStartSuccess: string;
  colorEndSuccess: string;
};
interface GradientTextThemeVars extends ReturnType<typeof self> {}
declare const gradientTextLight: GradientTextTheme;
interface GradientTextTheme extends Theme<'GradientText', GradientTextThemeVars> {}
interface GradientTextThemeOverrides extends ExtractThemeOverrides<GradientTextTheme> {}
//#endregion
export { GradientTextTheme, GradientTextThemeOverrides, GradientTextThemeVars, gradientTextLight as default };