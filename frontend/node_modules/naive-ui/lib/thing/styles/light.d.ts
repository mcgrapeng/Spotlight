import { ThemeCommonVars } from "../../_styles/common/light.js";
import { ExtractThemeOverrides, Theme } from "../../_mixins/use-theme.js";
import "../../_mixins/index.js";
//#region src/thing/styles/light.d.ts
declare function self(vars: ThemeCommonVars): {
  fontSize: string;
  titleTextColor: string;
  textColor: string;
  titleFontWeight: string;
};
interface ThingThemeVars extends ReturnType<typeof self> {}
declare const thingLight: ThingTheme;
interface ThingTheme extends Theme<'Thing', ThingThemeVars> {}
interface ThingThemeOverrides extends ExtractThemeOverrides<ThingTheme> {}
//#endregion
export { ThingTheme, ThingThemeOverrides, ThingThemeVars, thingLight as default, self };