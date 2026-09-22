import { ThemeCommonVars } from "../../_styles/common/light.js";
import { PopoverTheme } from "../../popover/styles/light.js";
import "../../popover/styles/index.js";
import { ExtractThemeOverrides, Theme } from "../../_mixins/use-theme.js";
//#region src/tooltip/styles/light.d.ts
declare function self(vars: ThemeCommonVars): {
  borderRadius: string;
  boxShadow: string;
  color: string;
  textColor: string;
  padding: string;
};
interface TooltipThemeVars extends ReturnType<typeof self> {}
declare const tooltipLight: TooltipTheme;
interface TooltipTheme extends Theme<'Tooltip', TooltipThemeVars, {
  Popover: PopoverTheme;
}> {}
interface TooltipThemeOverrides extends ExtractThemeOverrides<TooltipTheme> {}
//#endregion
export { TooltipTheme, TooltipThemeOverrides, TooltipThemeVars, tooltipLight as default };