import { ThemeCommonVars } from "../../_styles/common/light.js";
import { InputTheme } from "../../input/styles/light.js";
import "../../input/styles/index.js";
import { ButtonTheme } from "../../button/styles/light.js";
import "../../button/styles/index.js";
import { ExtractThemeOverrides, Theme } from "../../_mixins/use-theme.js";
//#region src/color-picker/styles/light.d.ts
declare function self(vars: ThemeCommonVars): {
  panelFontSize: string;
  boxShadow: string;
  color: string;
  textColor: string;
  borderRadius: string;
  border: string;
  heightSmall: string;
  heightMedium: string;
  heightLarge: string;
  fontSizeSmall: string;
  fontSizeMedium: string;
  fontSizeLarge: string;
  dividerColor: string;
};
interface ColorPickerThemeVars extends ReturnType<typeof self> {}
declare const colorPickerLight: ColorPickerTheme;
interface ColorPickerTheme extends Theme<'ColorPicker', ColorPickerThemeVars, {
  Input: InputTheme;
  Button: ButtonTheme;
}> {}
interface ColorPickerThemeOverrides extends ExtractThemeOverrides<ColorPickerTheme> {}
//#endregion
export { ColorPickerTheme, ColorPickerThemeOverrides, ColorPickerThemeVars, colorPickerLight as default, self };