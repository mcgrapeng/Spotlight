import { ThemeCommonVars } from "../../../_styles/common/light.js";
import { EmptyTheme } from "../../../empty/styles/light.js";
import "../../../empty/styles/index.js";
import { ExtractThemeOverrides, Theme } from "../../../_mixins/use-theme.js";
import "../../../_mixins/index.js";
import { ScrollbarTheme } from "../../scrollbar/styles/light.js";
import "../../scrollbar/styles/index.js";
//#region src/_internal/select-menu/styles/light.d.ts
declare function self(vars: ThemeCommonVars): {
  optionFontSizeTiny: string;
  optionFontSizeSmall: string;
  optionFontSizeMedium: string;
  optionFontSizeLarge: string;
  optionFontSizeHuge: string;
  optionHeightTiny: string;
  optionHeightSmall: string;
  optionHeightMedium: string;
  optionHeightLarge: string;
  optionHeightHuge: string;
  borderRadius: string;
  color: string;
  groupHeaderTextColor: string;
  actionDividerColor: string;
  optionTextColor: string;
  optionTextColorPressed: string;
  optionTextColorDisabled: string;
  optionTextColorActive: string;
  optionOpacityDisabled: string;
  optionCheckColor: string;
  optionColorPending: string;
  optionColorActive: string;
  optionColorActivePending: string;
  actionTextColor: string;
  loadingColor: string;
  height: string;
  paddingTiny: string;
  paddingSmall: string;
  paddingMedium: string;
  paddingLarge: string;
  paddingHuge: string;
  optionPaddingTiny: string;
  optionPaddingSmall: string;
  optionPaddingMedium: string;
  optionPaddingLarge: string;
  optionPaddingHuge: string;
  loadingSize: string;
};
interface InternalSelectMenuThemeVars extends ReturnType<typeof self> {}
declare const internalSelectMenuLight: InternalSelectMenuTheme;
interface InternalSelectMenuTheme extends Theme<'InternalSelectMenu', InternalSelectMenuThemeVars, {
  Scrollbar: ScrollbarTheme;
  Empty: EmptyTheme;
}> {}
interface InternalSelectMenuThemeOverrides extends ExtractThemeOverrides<InternalSelectMenuTheme> {}
//#endregion
export { InternalSelectMenuTheme, InternalSelectMenuThemeOverrides, InternalSelectMenuThemeVars, internalSelectMenuLight as default, self };