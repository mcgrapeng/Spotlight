import { ThemeCommonVars } from "../../_styles/common/light.js";
import { ExtractThemeOverrides, Theme } from "../../_mixins/use-theme.js";
import "../../_mixins/index.js";
//#region src/breadcrumb/styles/light.d.ts
declare function self(vars: ThemeCommonVars): {
  fontSize: string;
  itemLineHeight: string;
  itemTextColor: string;
  itemTextColorHover: string;
  itemTextColorPressed: string;
  itemTextColorActive: string;
  itemBorderRadius: string;
  itemColorHover: string;
  itemColorPressed: string;
  separatorColor: string;
  fontWeightActive: string;
};
interface BreadcrumbThemeVars extends ReturnType<typeof self> {}
declare const breadcrumbLight: BreadcrumbTheme;
interface BreadcrumbTheme extends Theme<'Breadcrumb', BreadcrumbThemeVars> {}
interface BreadcrumbThemeOverrides extends ExtractThemeOverrides<BreadcrumbTheme> {}
//#endregion
export { BreadcrumbTheme, BreadcrumbThemeOverrides, BreadcrumbThemeVars, breadcrumbLight as default, self };