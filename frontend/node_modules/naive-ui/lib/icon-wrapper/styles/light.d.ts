import { ThemeCommonVars } from "../../_styles/common/light.js";
import { ExtractThemeOverrides, Theme } from "../../_mixins/use-theme.js";
import "../../_mixins/index.js";
//#region src/icon-wrapper/styles/light.d.ts
declare function self(vars: ThemeCommonVars): {
  color: string;
  iconColor: string;
};
interface IconWrapperThemeVars extends ReturnType<typeof self> {}
declare const iconWrapperLight: IconWrapperTheme;
interface IconWrapperTheme extends Theme<'IconWrapper', IconWrapperThemeVars> {}
interface IconWrapperThemeOverrides extends ExtractThemeOverrides<IconWrapperTheme> {}
//#endregion
export { IconWrapperTheme, IconWrapperThemeOverrides, IconWrapperThemeVars, iconWrapperLight as default, self };