import { ThemeCommonVars } from "../../_styles/common/light.js";
import { ExtractThemeOverrides, Theme } from "../../_mixins/use-theme.js";
import "../../_mixins/index.js";
//#region src/empty/styles/light.d.ts
declare function self(vars: ThemeCommonVars): {
  fontSizeTiny: string;
  fontSizeSmall: string;
  fontSizeMedium: string;
  fontSizeLarge: string;
  fontSizeHuge: string;
  textColor: string;
  iconColor: string;
  extraTextColor: string;
  iconSizeTiny: string;
  iconSizeSmall: string;
  iconSizeMedium: string;
  iconSizeLarge: string;
  iconSizeHuge: string;
};
interface EmptyThemeVars extends ReturnType<typeof self> {}
declare const emptyLight: EmptyTheme;
interface EmptyTheme extends Theme<'Empty', EmptyThemeVars> {}
interface EmptyThemeOverrides extends ExtractThemeOverrides<EmptyTheme> {}
//#endregion
export { EmptyTheme, EmptyThemeOverrides, EmptyThemeVars, emptyLight as default, self };