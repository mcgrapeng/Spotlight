import { ThemeCommonVars } from "../../_styles/common/light.js";
import { ExtractThemeOverrides, Theme } from "../../_mixins/use-theme.js";
import "../../_mixins/index.js";
//#region src/badge/styles/light.d.ts
declare function self(vars: ThemeCommonVars): {
  color: string;
  colorInfo: string;
  colorSuccess: string;
  colorError: string;
  colorWarning: string;
  fontSize: string;
  fontFamily: string;
};
interface BadgeThemeVars extends ReturnType<typeof self> {}
declare const badgeLight: BadgeTheme;
interface BadgeTheme extends Theme<'Badge', BadgeThemeVars> {}
interface BadgeThemeOverrides extends ExtractThemeOverrides<BadgeTheme> {}
//#endregion
export { BadgeTheme, BadgeThemeOverrides, BadgeThemeVars, badgeLight as default };