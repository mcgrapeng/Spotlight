import { ThemeCommonVars } from "../../_styles/common/light.js";
import { ExtractThemeOverrides, Theme } from "../../_mixins/use-theme.js";
import "../../_mixins/index.js";
//#region src/form/styles/light.d.ts
declare function self(vars: ThemeCommonVars): {
  blankHeightSmall: string;
  blankHeightMedium: string;
  blankHeightLarge: string;
  lineHeight: string;
  labelTextColor: string;
  asteriskColor: string;
  feedbackTextColorError: string;
  feedbackTextColorWarning: string;
  feedbackTextColor: string;
  feedbackPadding: string;
  feedbackHeightSmall: string;
  feedbackHeightMedium: string;
  feedbackHeightLarge: string;
  feedbackFontSizeSmall: string;
  feedbackFontSizeMedium: string;
  feedbackFontSizeLarge: string;
  labelFontSizeLeftSmall: string;
  labelFontSizeLeftMedium: string;
  labelFontSizeLeftLarge: string;
  labelFontSizeTopSmall: string;
  labelFontSizeTopMedium: string;
  labelFontSizeTopLarge: string;
  labelHeightSmall: string;
  labelHeightMedium: string;
  labelHeightLarge: string;
  labelPaddingVertical: string;
  labelPaddingHorizontal: string;
  labelTextAlignVertical: string;
  labelTextAlignHorizontal: string;
  labelFontWeight: string;
};
interface FormThemeVars extends ReturnType<typeof self> {}
declare const formLight: FormTheme;
interface FormTheme extends Theme<'Form', FormThemeVars> {}
interface FormThemeOverrides extends ExtractThemeOverrides<FormTheme> {}
//#endregion
export { FormTheme, FormThemeOverrides, FormThemeVars, formLight as default, self };