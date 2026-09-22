import { ThemeCommonVars } from "../../_styles/common/light.js";
import { EmptyTheme } from "../../empty/styles/light.js";
import "../../empty/styles/index.js";
import { InternalSelectMenuTheme } from "../../_internal/select-menu/styles/light.js";
import "../../_internal/select-menu/styles/index.js";
import { InternalSelectionTheme } from "../../_internal/selection/styles/light.js";
import "../../_internal/selection/styles/index.js";
import { CheckboxTheme } from "../../checkbox/styles/light.js";
import "../../checkbox/styles/index.js";
import { ExtractThemeOverrides, Theme } from "../../_mixins/use-theme.js";
import "../../_mixins/index.js";
import { ScrollbarTheme } from "../../_internal/scrollbar/styles/light.js";
import "../../_internal/scrollbar/styles/index.js";
//#region src/cascader/styles/light.d.ts
declare function self(vars: ThemeCommonVars): {
  menuBorderRadius: string;
  menuColor: string;
  menuBoxShadow: string;
  menuDividerColor: string;
  menuHeight: string;
  optionArrowColor: string;
  optionHeight: string;
  optionFontSize: string;
  optionColorHover: string;
  optionTextColor: string;
  optionTextColorActive: string;
  optionTextColorDisabled: string;
  optionCheckMarkColor: string;
  loadingColor: string;
  columnWidth: string;
};
interface CascaderThemeVars extends ReturnType<typeof self> {}
declare const cascaderLight: CascaderTheme;
interface CascaderTheme extends Theme<'Cascader', CascaderThemeVars, {
  InternalSelectMenu: InternalSelectMenuTheme;
  InternalSelection: InternalSelectionTheme;
  Scrollbar: ScrollbarTheme;
  Checkbox: CheckboxTheme;
  Empty: EmptyTheme;
}> {}
interface CascaderThemeOverrides extends ExtractThemeOverrides<CascaderTheme> {}
//#endregion
export { CascaderTheme, CascaderThemeOverrides, CascaderThemeVars, cascaderLight as default, self };