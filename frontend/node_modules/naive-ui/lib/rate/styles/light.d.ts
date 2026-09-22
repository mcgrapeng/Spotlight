import { ThemeCommonVars } from "../../_styles/common/light.js";
import { ExtractThemeOverrides, Theme } from "../../_mixins/use-theme.js";
import "../../_mixins/index.js";
//#region src/rate/styles/light.d.ts
declare function self(vars: ThemeCommonVars): {
  itemColor: string;
  itemColorActive: string;
  sizeSmall: string;
  sizeMedium: string;
  sizeLarge: string;
};
interface RateThemeVars extends ReturnType<typeof self> {}
declare const themeLight: RateTheme;
interface RateTheme extends Theme<'Rate', RateThemeVars> {}
interface RateThemeOverrides extends ExtractThemeOverrides<RateTheme> {}
//#endregion
export { RateTheme, RateThemeOverrides, RateThemeVars, themeLight as default };