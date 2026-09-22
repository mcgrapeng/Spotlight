import { ExtractThemeOverrides, Theme } from "../../_mixins/use-theme.js";
import "../../_mixins/index.js";
//#region src/button-group/styles/light.d.ts
interface ButtonGroupThemeVars {}
declare const buttonGroupLight: ButtonGroupTheme;
interface ButtonGroupTheme extends Theme<'ButtonGroup', ButtonGroupThemeVars> {}
interface ButtonGroupThemeOverrides extends ExtractThemeOverrides<ButtonGroupTheme> {}
//#endregion
export { ButtonGroupTheme, ButtonGroupThemeOverrides, ButtonGroupThemeVars, buttonGroupLight as default };