import { ThemeCommonVars } from "../../_styles/common/light.js";
import { EmptyTheme } from "../../empty/styles/light.js";
import "../../empty/styles/index.js";
import { InputTheme } from "../../input/styles/light.js";
import "../../input/styles/index.js";
import { ButtonTheme } from "../../button/styles/light.js";
import "../../button/styles/index.js";
import { CheckboxTheme } from "../../checkbox/styles/light.js";
import "../../checkbox/styles/index.js";
import { ExtractThemeOverrides, Theme } from "../../_mixins/use-theme.js";
import "../../_mixins/index.js";
import { ScrollbarTheme } from "../../_internal/scrollbar/styles/light.js";
import "../../_internal/scrollbar/styles/index.js";
//#region src/transfer/styles/light.d.ts
declare function self(vars: ThemeCommonVars): {
  itemHeightSmall: string;
  itemHeightMedium: string;
  itemHeightLarge: string;
  fontSizeSmall: string;
  fontSizeMedium: string;
  fontSizeLarge: string;
  borderRadius: string;
  dividerColor: string;
  borderColor: string;
  listColor: string;
  headerColor: string;
  titleTextColor: string;
  titleTextColorDisabled: string;
  extraTextColor: string;
  extraTextColorDisabled: string;
  itemTextColor: string;
  itemTextColorDisabled: string;
  itemColorPending: string;
  titleFontWeight: string;
  closeColorHover: string;
  closeColorPressed: string;
  closeIconColor: string;
  closeIconColorHover: string;
  closeIconColorPressed: string;
  extraFontSizeSmall: string;
  extraFontSizeMedium: string;
  extraFontSizeLarge: string;
  titleFontSizeSmall: string;
  titleFontSizeMedium: string;
  titleFontSizeLarge: string;
  closeSize: string;
  closeIconSize: string;
  headerHeightSmall: string;
  headerHeightMedium: string;
  headerHeightLarge: string;
};
interface TransferThemeVars extends ReturnType<typeof self> {}
declare const transferLight: TransferTheme;
interface TransferTheme extends Theme<'Transfer', TransferThemeVars, {
  Checkbox: CheckboxTheme;
  Scrollbar: ScrollbarTheme;
  Input: InputTheme;
  Empty: EmptyTheme;
  Button: ButtonTheme;
}> {}
interface TransferThemeOverrides extends ExtractThemeOverrides<TransferTheme> {}
//#endregion
export { TransferTheme, TransferThemeOverrides, TransferThemeVars, transferLight as default };