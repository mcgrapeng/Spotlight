import { ThemeCommonVars } from "../../_styles/common/light.js";
import { ExtractThemeOverrides, Theme } from "../../_mixins/use-theme.js";
import "../../_mixins/index.js";
//#region src/icon/styles/light.d.ts
declare function self(vars: ThemeCommonVars): {
  color: string;
  opacity1Depth: string;
  opacity2Depth: string;
  opacity3Depth: string;
  opacity4Depth: string;
  opacity5Depth: string;
};
interface IconThemeVars extends ReturnType<typeof self> {}
declare const iconLight: IconTheme;
interface IconTheme extends Theme<'Icon', IconThemeVars> {}
interface IconThemeOverrides extends ExtractThemeOverrides<IconTheme> {}
//#endregion
export { IconTheme, IconThemeOverrides, IconThemeVars, iconLight as default, self };