import { ThemeCommonVars } from "../../_styles/common/light.js";
import { PopoverTheme } from "../../popover/styles/light.js";
import "../../popover/styles/index.js";
import { ExtractThemeOverrides, Theme } from "../../_mixins/use-theme.js";
//#region src/dropdown/styles/light.d.ts
declare function self(vars: ThemeCommonVars): {
  optionHeightSmall: string;
  optionHeightMedium: string;
  optionHeightLarge: string;
  optionHeightHuge: string;
  borderRadius: string;
  fontSizeSmall: string;
  fontSizeMedium: string;
  fontSizeLarge: string;
  fontSizeHuge: string;
  optionTextColor: string;
  optionTextColorHover: string;
  optionTextColorActive: string;
  optionTextColorChildActive: string;
  color: string;
  dividerColor: string;
  suffixColor: string;
  prefixColor: string;
  optionColorHover: string;
  optionColorActive: string;
  groupHeaderTextColor: string;
  optionTextColorInverted: string;
  optionTextColorHoverInverted: string;
  optionTextColorActiveInverted: string;
  optionTextColorChildActiveInverted: string;
  colorInverted: string;
  dividerColorInverted: string;
  suffixColorInverted: string;
  prefixColorInverted: string;
  optionColorHoverInverted: string;
  optionColorActiveInverted: string;
  groupHeaderTextColorInverted: string;
  optionOpacityDisabled: string;
  padding: string;
  optionIconSizeSmall: string;
  optionIconSizeMedium: string;
  optionIconSizeLarge: string;
  optionIconSizeHuge: string;
  optionSuffixWidthSmall: string;
  optionSuffixWidthMedium: string;
  optionSuffixWidthLarge: string;
  optionSuffixWidthHuge: string;
  optionIconSuffixWidthSmall: string;
  optionIconSuffixWidthMedium: string;
  optionIconSuffixWidthLarge: string;
  optionIconSuffixWidthHuge: string;
  optionPrefixWidthSmall: string;
  optionPrefixWidthMedium: string;
  optionPrefixWidthLarge: string;
  optionPrefixWidthHuge: string;
  optionIconPrefixWidthSmall: string;
  optionIconPrefixWidthMedium: string;
  optionIconPrefixWidthLarge: string;
  optionIconPrefixWidthHuge: string;
};
interface DropdownThemeVars extends ReturnType<typeof self> {}
declare const dropdownLight: DropdownTheme;
interface DropdownTheme extends Theme<'Dropdown', DropdownThemeVars, {
  Popover: PopoverTheme;
}> {}
interface DropdownThemeOverrides extends ExtractThemeOverrides<DropdownTheme> {}
//#endregion
export { DropdownTheme, DropdownThemeOverrides, DropdownThemeVars, dropdownLight as default, self };