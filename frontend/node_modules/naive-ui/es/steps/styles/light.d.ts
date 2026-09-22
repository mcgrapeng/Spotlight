import { ThemeCommonVars } from "../../_styles/common/light.js";
import { ExtractThemeOverrides, Theme } from "../../_mixins/use-theme.js";
import "../../_mixins/index.js";
//#region src/steps/styles/light.d.ts
declare function self(vars: ThemeCommonVars): {
  stepHeaderFontWeight: string;
  indicatorTextColorProcess: string;
  indicatorTextColorWait: string;
  indicatorTextColorFinish: string;
  indicatorTextColorError: string;
  indicatorBorderColorProcess: string;
  indicatorBorderColorWait: string;
  indicatorBorderColorFinish: string;
  indicatorBorderColorError: string;
  indicatorColorProcess: string;
  indicatorColorWait: string;
  indicatorColorFinish: string;
  indicatorColorError: string;
  splitorColorProcess: string;
  splitorColorWait: string;
  splitorColorFinish: string;
  splitorColorError: string;
  headerTextColorProcess: string;
  headerTextColorWait: string;
  headerTextColorFinish: string;
  headerTextColorError: string;
  descriptionTextColorProcess: string;
  descriptionTextColorWait: string;
  descriptionTextColorFinish: string;
  descriptionTextColorError: string;
  stepHeaderFontSizeSmall: string;
  stepHeaderFontSizeMedium: string;
  indicatorIndexFontSizeSmall: string;
  indicatorIndexFontSizeMedium: string;
  indicatorSizeSmall: string;
  indicatorSizeMedium: string;
  indicatorIconSizeSmall: string;
  indicatorIconSizeMedium: string;
};
interface StepsThemeVars extends ReturnType<typeof self> {}
declare const stepsLight: StepsTheme;
interface StepsTheme extends Theme<'Steps', StepsThemeVars> {}
interface StepsThemeOverrides extends ExtractThemeOverrides<StepsTheme> {}
//#endregion
export { StepsTheme, StepsThemeOverrides, StepsThemeVars, stepsLight as default, self };