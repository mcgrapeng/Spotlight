import { ThemeCommonVars } from "../../_styles/common/light.js";
import { ExtractThemeOverrides, Theme } from "../../_mixins/use-theme.js";
import "../../_mixins/index.js";
//#region src/float-button/styles/light.d.ts
declare function self(vars: ThemeCommonVars): {
  color: string;
  colorHover: string;
  colorPressed: string;
  colorPrimary: string;
  colorPrimaryHover: string;
  colorPrimaryPressed: string;
  textColor: string;
  boxShadow: string;
  boxShadowHover: string;
  boxShadowPressed: string;
  textColorPrimary: string;
  borderRadiusSquare: string;
};
interface FloatButtonThemeVars extends ReturnType<typeof self> {}
declare const themeLight: FloatButtonTheme;
interface FloatButtonTheme extends Theme<'FloatButton', FloatButtonThemeVars> {}
interface FloatButtonThemeOverrides extends ExtractThemeOverrides<FloatButtonTheme> {}
//#endregion
export { FloatButtonTheme, FloatButtonThemeOverrides, FloatButtonThemeVars, themeLight as default };