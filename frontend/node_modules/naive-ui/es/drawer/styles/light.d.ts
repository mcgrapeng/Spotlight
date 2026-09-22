import { ThemeCommonVars } from "../../_styles/common/light.js";
import { ExtractThemeOverrides, Theme } from "../../_mixins/use-theme.js";
import "../../_mixins/index.js";
import { ScrollbarTheme } from "../../_internal/scrollbar/styles/light.js";
import "../../_internal/scrollbar/styles/index.js";
//#region src/drawer/styles/light.d.ts
declare function self(vars: ThemeCommonVars): {
  bodyPadding: string;
  borderRadius: string;
  headerPadding: string;
  footerPadding: string;
  color: string;
  textColor: string;
  titleTextColor: string;
  titleFontSize: string;
  titleFontWeight: string;
  boxShadow: string;
  lineHeight: string;
  headerBorderBottom: string;
  footerBorderTop: string;
  closeIconColor: string;
  closeIconColorHover: string;
  closeIconColorPressed: string;
  closeSize: string;
  closeIconSize: string;
  closeColorHover: string;
  closeColorPressed: string;
  closeBorderRadius: string;
  resizableTriggerColorHover: string;
};
interface DrawerThemeVars extends ReturnType<typeof self> {}
declare const drawerLight: DrawerTheme;
interface DrawerTheme extends Theme<'Drawer', DrawerThemeVars, {
  Scrollbar: ScrollbarTheme;
}> {}
interface DrawerThemeOverrides extends ExtractThemeOverrides<DrawerTheme> {}
//#endregion
export { DrawerTheme, DrawerThemeOverrides, DrawerThemeVars, drawerLight as default, self };