import { ThemeCommonVars } from "../../_styles/common/light.js";
import { ExtractThemeOverrides, Theme } from "../../_mixins/use-theme.js";
//#region src/collapse/styles/light.d.ts
declare function self(vars: ThemeCommonVars): {
  titleFontSize: string;
  titleFontWeight: string;
  dividerColor: string;
  titleTextColor: string;
  titleTextColorDisabled: string;
  fontSize: string;
  textColor: string;
  arrowColor: string;
  arrowColorDisabled: string;
  itemMargin: string;
  titlePadding: string;
};
interface CollapseThemeVars extends ReturnType<typeof self> {}
declare const collapseLight: CollapseTheme;
interface CollapseTheme extends Theme<'Collapse', CollapseThemeVars> {}
interface CollapseThemeOverrides extends ExtractThemeOverrides<CollapseTheme> {}
//#endregion
export { CollapseTheme, CollapseThemeOverrides, CollapseThemeVars, collapseLight as default, self };