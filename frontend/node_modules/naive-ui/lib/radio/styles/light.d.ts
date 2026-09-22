import { ThemeCommonVars } from "../../_styles/common/light.js";
import { ExtractThemeOverrides, Theme } from "../../_mixins/use-theme.js";
//#region src/radio/styles/light.d.ts
declare function self(vars: ThemeCommonVars): {
  labelLineHeight: string;
  buttonHeightSmall: string;
  buttonHeightMedium: string;
  buttonHeightLarge: string;
  fontSizeSmall: string;
  fontSizeMedium: string;
  fontSizeLarge: string;
  boxShadow: string;
  boxShadowActive: string;
  boxShadowFocus: string;
  boxShadowHover: string;
  boxShadowDisabled: string;
  color: string;
  colorDisabled: string;
  colorActive: string;
  textColor: string;
  textColorDisabled: string;
  dotColorActive: string;
  dotColorDisabled: string;
  buttonBorderColor: string;
  buttonBorderColorActive: string;
  buttonBorderColorHover: string;
  buttonColor: string;
  buttonColorActive: string;
  buttonTextColor: string;
  buttonTextColorActive: string;
  buttonTextColorHover: string;
  opacityDisabled: string;
  buttonBoxShadowFocus: string;
  buttonBoxShadowHover: string;
  buttonBoxShadow: string;
  buttonBorderRadius: string;
  radioSizeSmall: string;
  radioSizeMedium: string;
  radioSizeLarge: string;
  labelPadding: string;
  labelFontWeight: string;
};
interface RadioThemeVars extends ReturnType<typeof self> {}
declare const radioLight: RadioTheme;
interface RadioTheme extends Theme<'Radio', RadioThemeVars> {}
interface RadioThemeOverrides extends ExtractThemeOverrides<RadioTheme> {}
//#endregion
export { RadioTheme, RadioThemeOverrides, RadioThemeVars, radioLight as default };