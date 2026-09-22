import { ThemeCommonVars } from "../../_styles/common/light.js";
import { InternalSelectMenuTheme } from "../../_internal/select-menu/styles/light.js";
import "../../_internal/select-menu/styles/index.js";
import { PopoverTheme } from "../../popover/styles/light.js";
import "../../popover/styles/index.js";
import "../../config-provider/index.js";
import { ExtractThemeOverrides, Theme } from "../../_mixins/use-theme.js";
import "../../_mixins/index.js";
//#region src/popselect/styles/light.d.ts
declare function self(vars: ThemeCommonVars): {
  menuBoxShadow: string;
};
interface PopselectThemeVars extends ReturnType<typeof self> {}
declare const popselectLight: PopselectTheme;
interface PopselectTheme extends Theme<'Popselect', PopselectThemeVars, {
  Popover: PopoverTheme;
  InternalSelectMenu: InternalSelectMenuTheme;
}> {}
interface PopselectThemeOverrides extends ExtractThemeOverrides<PopselectTheme> {}
//#endregion
export { PopselectTheme, PopselectThemeOverrides, PopselectThemeVars, popselectLight as default, self };