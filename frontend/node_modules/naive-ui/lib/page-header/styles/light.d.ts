import { ThemeCommonVars } from "../../_styles/common/light.js";
import { ExtractThemeOverrides, Theme } from "../../_mixins/use-theme.js";
import "../../_mixins/index.js";
//#region src/page-header/styles/light.d.ts
declare function self(vars: ThemeCommonVars): {
  titleFontWeight: string;
  fontSize: string;
  titleTextColor: string;
  backColor: string;
  backColorHover: string;
  backColorPressed: string;
  subtitleTextColor: string;
  titleFontSize: string;
  backSize: string;
};
declare const pageHeaderLight: PageHeaderTheme;
interface PageHeaderThemeVars extends ReturnType<typeof self> {}
interface PageHeaderTheme extends Theme<'PageHeader', PageHeaderThemeVars> {}
interface PageHeaderThemeOverrides extends ExtractThemeOverrides<PageHeaderTheme> {}
//#endregion
export { PageHeaderTheme, PageHeaderThemeOverrides, PageHeaderThemeVars, pageHeaderLight, self };