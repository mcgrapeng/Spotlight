import { ThemeCommonVars } from "../../../_styles/common/light.js";
import { ExtractThemeOverrides, Theme } from "../../../_mixins/use-theme.js";
import "../../../_mixins/index.js";
//#region src/_internal/scrollbar/styles/light.d.ts
declare function self(vars: ThemeCommonVars): {
  height: string;
  width: string;
  borderRadius: string;
  color: string;
  colorHover: string;
  railInsetHorizontalBottom: string;
  railInsetHorizontalTop: string;
  railInsetVerticalRight: string;
  railInsetVerticalLeft: string;
  railColor: string;
};
interface ScrollbarThemeVars extends ReturnType<typeof self> {}
declare const scrollbarLight: ScrollbarTheme;
interface ScrollbarTheme extends Theme<'Scrollbar', ScrollbarThemeVars> {}
interface ScrollbarThemeOverrides extends ExtractThemeOverrides<ScrollbarTheme> {}
//#endregion
export { ScrollbarTheme, ScrollbarThemeOverrides, ScrollbarThemeVars, scrollbarLight as default, self };