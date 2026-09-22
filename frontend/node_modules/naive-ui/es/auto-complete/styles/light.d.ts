import { ThemeCommonVars } from "../../_styles/common/light.js";
import { InternalSelectMenuTheme } from "../../_internal/select-menu/styles/light.js";
import "../../_internal/select-menu/styles/index.js";
import { InputTheme } from "../../input/styles/light.js";
import "../../input/styles/index.js";
import { ExtractThemeOverrides, Theme } from "../../_mixins/use-theme.js";
import "../../_mixins/index.js";
//#region src/auto-complete/styles/light.d.ts
declare function self(vars: ThemeCommonVars): {
  menuBoxShadow: string;
};
declare const autoCompleteLight: AutoCompleteTheme;
interface AutoCompleteTheme extends Theme<'AutoComplete', AutoCompleteThemeVars, {
  InternalSelectMenu: InternalSelectMenuTheme;
  Input: InputTheme;
}> {}
interface AutoCompleteThemeOverrides extends ExtractThemeOverrides<AutoCompleteTheme> {}
interface AutoCompleteThemeVars extends ReturnType<typeof self> {}
//#endregion
export { AutoCompleteTheme, AutoCompleteThemeOverrides, AutoCompleteThemeVars, autoCompleteLight as default, self };