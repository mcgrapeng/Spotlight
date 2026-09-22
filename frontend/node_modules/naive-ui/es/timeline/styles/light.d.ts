import { ThemeCommonVars } from "../../_styles/common/light.js";
import { ExtractThemeOverrides, Theme } from "../../_mixins/use-theme.js";
import "../../_mixins/index.js";
//#region src/timeline/styles/light.d.ts
declare function self(vars: ThemeCommonVars): {
  contentFontSize: string;
  titleFontWeight: string;
  circleBorder: string;
  circleBorderInfo: string;
  circleBorderError: string;
  circleBorderSuccess: string;
  circleBorderWarning: string;
  iconColor: string;
  iconColorInfo: string;
  iconColorError: string;
  iconColorSuccess: string;
  iconColorWarning: string;
  titleTextColor: string;
  contentTextColor: string;
  metaTextColor: string;
  lineColor: string;
  titleMarginMedium: string;
  titleMarginLarge: string;
  titleFontSizeMedium: string;
  titleFontSizeLarge: string;
  iconSizeMedium: string;
  iconSizeLarge: string;
};
interface TimelineThemeVars extends ReturnType<typeof self> {}
declare const timelineLight: TimelineTheme;
interface TimelineTheme extends Theme<'Timeline', TimelineThemeVars> {}
interface TimelineThemeOverrides extends ExtractThemeOverrides<TimelineTheme> {}
//#endregion
export { TimelineTheme, TimelineThemeOverrides, TimelineThemeVars, timelineLight as default };