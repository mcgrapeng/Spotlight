import { ThemeCommonVars } from "../../_styles/common/light.js";
import { ExtractThemeOverrides, Theme } from "../../_mixins/use-theme.js";
import "../../_mixins/index.js";
import { ScrollbarTheme } from "../../_internal/scrollbar/styles/light.js";
import "../../_internal/scrollbar/styles/index.js";
//#region src/layout/styles/light.d.ts
declare function self(vars: ThemeCommonVars): {
  textColor: string;
  textColorInverted: string;
  color: string;
  colorEmbedded: string;
  headerColor: string;
  headerColorInverted: string;
  footerColor: string;
  footerColorInverted: string;
  headerBorderColor: string;
  headerBorderColorInverted: string;
  footerBorderColor: string;
  footerBorderColorInverted: string;
  siderBorderColor: string;
  siderBorderColorInverted: string;
  siderColor: string;
  siderColorInverted: string;
  siderToggleButtonBorder: string;
  siderToggleButtonColor: string;
  siderToggleButtonIconColor: string;
  siderToggleButtonIconColorInverted: string;
  siderToggleBarColor: string;
  siderToggleBarColorHover: string;
  __invertScrollbar: string;
};
interface LayoutThemeVars extends ReturnType<typeof self> {}
declare const layoutLight: LayoutTheme;
interface LayoutTheme extends Theme<'Layout', LayoutThemeVars, {
  Scrollbar: ScrollbarTheme;
}> {}
interface LayoutThemeOverrides extends ExtractThemeOverrides<LayoutTheme> {}
//#endregion
export { LayoutTheme, LayoutThemeOverrides, LayoutThemeVars, layoutLight as default, self };