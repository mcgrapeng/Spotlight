import { ThemeCommonVars } from "../../_styles/common/light.js";
import { ButtonTheme } from "../../button/styles/light.js";
import "../../button/styles/index.js";
import { ExtractThemeOverrides, Theme } from "../../_mixins/use-theme.js";
import "../../_mixins/index.js";
//#region src/dialog/styles/light.d.ts
declare function self(vars: ThemeCommonVars): {
  fontSize: string;
  lineHeight: string;
  border: string;
  titleTextColor: string;
  textColor: string;
  color: string;
  closeColorHover: string;
  closeColorPressed: string;
  closeIconColor: string;
  closeIconColorHover: string;
  closeIconColorPressed: string;
  closeBorderRadius: string;
  iconColor: string;
  iconColorInfo: string;
  iconColorSuccess: string;
  iconColorWarning: string;
  iconColorError: string;
  borderRadius: string;
  titleFontWeight: string;
  titleFontSize: string;
  padding: string;
  iconSize: string;
  actionSpace: string;
  contentMargin: string;
  iconMargin: string;
  iconMarginIconTop: string;
  closeSize: string;
  closeIconSize: string;
  closeMargin: string;
  closeMarginIconTop: string;
};
interface DialogThemeVars extends ReturnType<typeof self> {}
declare const dialogLight: DialogTheme;
interface DialogTheme extends Theme<'Dialog', DialogThemeVars, {
  Button: ButtonTheme;
}> {}
interface DialogThemeOverrides extends ExtractThemeOverrides<DialogTheme> {}
//#endregion
export { DialogTheme, DialogThemeOverrides, DialogThemeVars, dialogLight as default, self };