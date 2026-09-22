import { ThemeCommonVars } from "../../_styles/common/light.js";
import { ExtractThemeOverrides, Theme } from "../../_mixins/use-theme.js";
import "../../_mixins/index.js";
//#region src/skeleton/styles/light.d.ts
declare function self(vars: ThemeCommonVars): {
  color: string;
  colorEnd: string;
  borderRadius: string;
  heightSmall: string;
  heightMedium: string;
  heightLarge: string;
};
interface SkeletonThemeVars extends ReturnType<typeof self> {}
declare const skeletonLight: SkeletonTheme;
interface SkeletonTheme extends Theme<'Skeleton', SkeletonThemeVars> {}
interface SkeletonThemeOverrides extends ExtractThemeOverrides<SkeletonTheme> {}
//#endregion
export { SkeletonTheme, SkeletonThemeOverrides, SkeletonThemeVars, skeletonLight };