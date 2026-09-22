import { ThemeCommonVars } from "../../_styles/common/light.js";
import { ExtractThemeOverrides, Theme } from "../../_mixins/use-theme.js";
import "../../_mixins/index.js";
//#region src/split/styles/light.d.ts
declare function self(vars: ThemeCommonVars): {
  resizableTriggerColorHover: string;
  resizableTriggerColor: string;
};
interface SplitThemeVars extends ReturnType<typeof self> {}
declare const themeLight: SplitTheme;
interface SplitTheme extends Theme<'Split', SplitThemeVars> {}
interface SplitThemeOverrides extends ExtractThemeOverrides<SplitTheme> {}
//#endregion
export { SplitTheme, SplitThemeOverrides, SplitThemeVars, themeLight as default, self };