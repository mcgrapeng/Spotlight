import { TooltipTheme } from "../../tooltip/styles/light.js";
import "../../tooltip/styles/index.js";
import { ExtractThemeOverrides, Theme } from "../../_mixins/use-theme.js";
import "../../_mixins/index.js";
//#region src/ellipsis/styles/light.d.ts
interface EllipsisThemeVars {}
declare const ellipsisLight: EllipsisTheme;
interface EllipsisTheme extends Theme<'Ellipsis', EllipsisThemeVars, {
  Tooltip: TooltipTheme;
}> {}
interface EllipsisThemeOverrides extends ExtractThemeOverrides<EllipsisTheme> {}
//#endregion
export { EllipsisTheme, EllipsisThemeOverrides, EllipsisThemeVars, ellipsisLight as default };