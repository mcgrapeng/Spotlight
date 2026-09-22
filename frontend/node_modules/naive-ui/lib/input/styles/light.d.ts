import { ThemeCommonVars } from "../../_styles/common/light.js";
import { ExtractThemeOverrides, Theme } from "../../_mixins/use-theme.js";
import "../../_mixins/index.js";
import { ScrollbarTheme } from "../../_internal/scrollbar/styles/light.js";
import "../../_internal/scrollbar/styles/index.js";
//#region src/input/styles/light.d.ts
declare function self(vars: ThemeCommonVars): {
  fontWeight: string;
  countTextColorDisabled: string;
  countTextColor: string;
  heightTiny: string;
  heightSmall: string;
  heightMedium: string;
  heightLarge: string;
  fontSizeTiny: string;
  fontSizeSmall: string;
  fontSizeMedium: string;
  fontSizeLarge: string;
  lineHeight: string;
  lineHeightTextarea: string;
  borderRadius: string;
  iconSize: string;
  groupLabelColor: string;
  groupLabelTextColor: string;
  textColor: string;
  textColorDisabled: string;
  textDecorationColor: string;
  caretColor: string;
  placeholderColor: string;
  placeholderColorDisabled: string;
  color: string;
  colorHover: string;
  colorDisabled: string;
  colorFocus: string;
  groupLabelBorder: string;
  border: string;
  borderHover: string;
  borderDisabled: string;
  borderFocus: string;
  boxShadowFocus: string;
  loadingColor: string;
  loadingColorWarning: string;
  borderWarning: string;
  borderHoverWarning: string;
  colorFocusWarning: string;
  borderFocusWarning: string;
  boxShadowFocusWarning: string;
  caretColorWarning: string;
  loadingColorError: string;
  borderError: string;
  borderHoverError: string;
  colorFocusError: string;
  borderFocusError: string;
  boxShadowFocusError: string;
  caretColorError: string;
  clearColor: string;
  clearColorHover: string;
  clearColorPressed: string;
  iconColor: string;
  iconColorDisabled: string;
  iconColorHover: string;
  iconColorPressed: string;
  suffixTextColor: string;
  paddingTiny: string;
  paddingSmall: string;
  paddingMedium: string;
  paddingLarge: string;
  clearSize: string;
};
declare const inputLight: InputTheme;
interface InputThemeVars extends ReturnType<typeof self> {}
interface InputTheme extends Theme<'Input', InputThemeVars, {
  Scrollbar: ScrollbarTheme;
}> {}
interface InputThemeOverrides extends ExtractThemeOverrides<InputTheme> {}
//#endregion
export { InputTheme, InputThemeOverrides, InputThemeVars, inputLight as default };