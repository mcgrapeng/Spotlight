import { ThemeCommonVars } from "../../_styles/common/light.js";
import { ExtractThemeOverrides, Theme } from "../../_mixins/use-theme.js";
import "../../_mixins/index.js";
//#region src/switch/styles/light.d.ts
declare function self(vars: ThemeCommonVars): {
  iconColor: string;
  textColor: string;
  loadingColor: string;
  opacityDisabled: string;
  railColor: string;
  railColorActive: string;
  buttonBoxShadow: string;
  buttonColor: string;
  railBorderRadiusSmall: string;
  railBorderRadiusMedium: string;
  railBorderRadiusLarge: string;
  buttonBorderRadiusSmall: string;
  buttonBorderRadiusMedium: string;
  buttonBorderRadiusLarge: string;
  boxShadowFocus: string;
  buttonHeightSmall: string;
  buttonHeightMedium: string;
  buttonHeightLarge: string;
  buttonWidthSmall: string;
  buttonWidthMedium: string;
  buttonWidthLarge: string;
  buttonWidthPressedSmall: string;
  buttonWidthPressedMedium: string;
  buttonWidthPressedLarge: string;
  railHeightSmall: string;
  railHeightMedium: string;
  railHeightLarge: string;
  railWidthSmall: string;
  railWidthMedium: string;
  railWidthLarge: string;
};
interface SwitchThemeVars extends ReturnType<typeof self> {}
declare const switchLight: SwitchTheme;
interface SwitchTheme extends Theme<'Switch', SwitchThemeVars> {}
interface SwitchThemeOverrides extends ExtractThemeOverrides<SwitchTheme> {}
//#endregion
export { SwitchTheme, SwitchThemeOverrides, SwitchThemeVars, switchLight as default };