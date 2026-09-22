import { ThemeCommonVars } from "../../_styles/common/light.js";
import { ExtractThemeOverrides, Theme } from "../../_mixins/use-theme.js";
import "../../_mixins/index.js";
//#region src/checkbox/styles/light.d.ts
declare function self(vars: ThemeCommonVars): {
  labelLineHeight: string;
  fontSizeSmall: string;
  fontSizeMedium: string;
  fontSizeLarge: string;
  borderRadius: string;
  color: string;
  colorChecked: string;
  colorDisabled: string;
  colorDisabledChecked: string;
  colorTableHeader: string;
  colorTableHeaderModal: string;
  colorTableHeaderPopover: string;
  checkMarkColor: string;
  checkMarkColorDisabled: string;
  checkMarkColorDisabledChecked: string;
  border: string;
  borderDisabled: string;
  borderDisabledChecked: string;
  borderChecked: string;
  borderFocus: string;
  boxShadowFocus: string;
  textColor: string;
  textColorDisabled: string;
  sizeSmall: string;
  sizeMedium: string;
  sizeLarge: string;
  labelPadding: string;
  labelFontWeight: string;
};
interface CheckboxThemeVars extends ReturnType<typeof self> {}
declare const checkboxLight: CheckboxTheme;
interface CheckboxTheme extends Theme<'Checkbox', CheckboxThemeVars> {}
interface CheckboxThemeOverrides extends ExtractThemeOverrides<CheckboxTheme> {}
//#endregion
export { CheckboxTheme, CheckboxThemeOverrides, CheckboxThemeVars, checkboxLight as default, self };