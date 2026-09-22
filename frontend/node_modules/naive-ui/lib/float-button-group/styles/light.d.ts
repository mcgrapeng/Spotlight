import { ThemeCommonVars } from "../../_styles/common/light.js";
import "../../config-provider/index.js";
import { ExtractThemeOverrides, Theme } from "../../_mixins/use-theme.js";
import "../../_mixins/index.js";
//#region src/float-button-group/styles/light.d.ts
declare function self(vars: ThemeCommonVars): {
  color: string;
  buttonBorderColor: string;
  borderRadiusSquare: string;
  boxShadow: string;
};
interface FloatButtonGroupThemeVars extends ReturnType<typeof self> {}
declare const themeLight: FloatButtonGroupTheme;
interface FloatButtonGroupTheme extends Theme<'FloatButtonGroup', FloatButtonGroupThemeVars> {}
interface FloatButtonGroupThemeOverrides extends ExtractThemeOverrides<FloatButtonGroupTheme> {}
//#endregion
export { FloatButtonGroupTheme, FloatButtonGroupThemeOverrides, FloatButtonGroupThemeVars, themeLight as default };