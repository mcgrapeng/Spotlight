import { ThemeCommonVars } from "../../_styles/common/light.js";
import { InternalSelectMenuTheme } from "../../_internal/select-menu/styles/light.js";
import "../../_internal/select-menu/styles/index.js";
import { InternalSelectionTheme } from "../../_internal/selection/styles/light.js";
import "../../_internal/selection/styles/index.js";
import { ExtractThemeOverrides, Theme } from "../../_mixins/use-theme.js";
import "../../_mixins/index.js";
//#region src/select/styles/light.d.ts
declare function self(vars: ThemeCommonVars): {
  menuBoxShadow: string;
};
declare const selectLight: SelectTheme;
interface SelectTheme extends Theme<'Select', SelectThemeVars, {
  InternalSelection: InternalSelectionTheme;
  InternalSelectMenu: InternalSelectMenuTheme;
}> {}
interface SelectThemeOverrides extends ExtractThemeOverrides<SelectTheme> {}
interface SelectThemeVars extends ReturnType<typeof self> {}
//#endregion
export { SelectTheme, SelectThemeOverrides, SelectThemeVars, selectLight as default, self };