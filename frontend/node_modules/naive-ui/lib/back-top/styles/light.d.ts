import { ThemeCommonVars } from "../../_styles/common/light.js";
import { ExtractThemeOverrides, Theme } from "../../_mixins/use-theme.js";
import "../../_mixins/index.js";
//#region src/back-top/styles/light.d.ts
declare function self(vars: ThemeCommonVars): {
  color: string;
  textColor: string;
  iconColor: string;
  iconColorHover: string;
  iconColorPressed: string;
  boxShadow: string;
  boxShadowHover: string;
  boxShadowPressed: string;
  width: string;
  height: string;
  borderRadius: string;
  iconSize: string;
};
interface BackTopThemeVars extends ReturnType<typeof self> {}
declare const backTopLight: BackTopTheme;
interface BackTopTheme extends Theme<'BackTop', BackTopThemeVars> {}
interface BackTopThemeOverrides extends ExtractThemeOverrides<BackTopTheme> {}
//#endregion
export { BackTopTheme, BackTopThemeOverrides, BackTopThemeVars, backTopLight as default };