import { ThemeCommonVars } from "../../_styles/common/light.js";
import { ExtractThemeOverrides, Theme } from "../../_mixins/use-theme.js";
//#region src/progress/styles/light.d.ts
declare function self(vars: ThemeCommonVars): {
  fontSize: string;
  fontSizeCircle: string;
  fontWeightCircle: string;
  railColor: string;
  railHeight: string;
  iconSizeCircle: string;
  iconSizeLine: string;
  iconColor: string;
  iconColorInfo: string;
  iconColorSuccess: string;
  iconColorWarning: string;
  iconColorError: string;
  textColorCircle: string;
  textColorLineInner: string;
  textColorLineOuter: string;
  fillColor: string;
  fillColorInfo: string;
  fillColorSuccess: string;
  fillColorWarning: string;
  fillColorError: string;
  lineBgProcessing: string;
};
interface ProgressThemeVars extends ReturnType<typeof self> {}
declare const progressLight: ProgressTheme;
interface ProgressTheme extends Theme<'Progress', ProgressThemeVars> {}
interface ProgressThemeOverrides extends ExtractThemeOverrides<ProgressTheme> {}
//#endregion
export { ProgressTheme, ProgressThemeOverrides, ProgressThemeVars, progressLight as default, self };