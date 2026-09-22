import { ThemeCommonVars } from "../../_styles/common/light.js";
import { ExtractThemeOverrides, Theme } from "../../_mixins/use-theme.js";
import "../../_mixins/index.js";
import { ScrollbarTheme } from "../../_internal/scrollbar/styles/light.js";
import "../../_internal/scrollbar/styles/index.js";
//#region src/popover/styles/light.d.ts
declare function self(vars: ThemeCommonVars): {
  fontSize: string;
  borderRadius: string;
  color: string;
  dividerColor: string;
  textColor: string;
  boxShadow: string;
  space: string;
  spaceArrow: string;
  arrowOffset: string;
  arrowOffsetVertical: string;
  arrowHeight: string;
  padding: string;
};
interface PopoverThemeVars extends ReturnType<typeof self> {}
declare const popoverLight: PopoverTheme;
interface PopoverTheme extends Theme<'Popover', PopoverThemeVars, {
  Scrollbar: ScrollbarTheme;
}> {}
interface PopoverThemeOverrides extends ExtractThemeOverrides<PopoverTheme> {}
//#endregion
export { PopoverTheme, PopoverThemeOverrides, PopoverThemeVars, popoverLight as default, self };