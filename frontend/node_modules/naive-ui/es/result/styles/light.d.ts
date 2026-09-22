import { ThemeCommonVars } from "../../_styles/common/light.js";
import { ExtractThemeOverrides, Theme } from "../../_mixins/use-theme.js";
import "../../_mixins/index.js";
//#region src/result/styles/light.d.ts
declare function self(vars: ThemeCommonVars): {
  lineHeight: string;
  titleFontWeight: string;
  titleTextColor: string;
  textColor: string;
  iconColorError: string;
  iconColorSuccess: string;
  iconColorInfo: string;
  iconColorWarning: string;
  titleFontSizeSmall: string;
  titleFontSizeMedium: string;
  titleFontSizeLarge: string;
  titleFontSizeHuge: string;
  fontSizeSmall: string;
  fontSizeMedium: string;
  fontSizeLarge: string;
  fontSizeHuge: string;
  iconSizeSmall: string;
  iconSizeMedium: string;
  iconSizeLarge: string;
  iconSizeHuge: string;
  iconColor418: undefined;
  iconColor404: undefined;
  iconColor403: undefined;
  iconColor500: undefined;
};
interface ResultThemeVars extends ReturnType<typeof self> {}
declare const resultLight: ResultTheme;
interface ResultTheme extends Theme<'Result', ResultThemeVars> {}
interface ResultThemeOverrides extends ExtractThemeOverrides<ResultTheme> {}
//#endregion
export { ResultTheme, ResultThemeOverrides, ResultThemeVars, resultLight as default, self };