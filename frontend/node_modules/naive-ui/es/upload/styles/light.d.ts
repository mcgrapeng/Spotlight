import { ThemeCommonVars } from "../../_styles/common/light.js";
import { ButtonTheme } from "../../button/styles/light.js";
import "../../button/styles/index.js";
import { ProgressTheme } from "../../progress/styles/light.js";
import "../../progress/styles/index.js";
import { ExtractThemeOverrides, Theme } from "../../_mixins/use-theme.js";
import "../../_mixins/index.js";
//#region src/upload/styles/light.d.ts
declare function self(vars: ThemeCommonVars): {
  fontSize: string;
  lineHeight: string;
  borderRadius: string;
  draggerColor: string;
  draggerBorder: string;
  draggerBorderHover: string;
  itemColorHover: string;
  itemColorHoverError: string;
  itemTextColor: string;
  itemTextColorError: string;
  itemTextColorSuccess: string;
  itemIconColor: string;
  itemDisabledOpacity: string;
  itemBorderImageCardError: string;
  itemBorderImageCard: string;
};
interface UploadThemeVars extends ReturnType<typeof self> {}
declare const uploadLight: UploadTheme;
interface UploadTheme extends Theme<'Upload', UploadThemeVars, {
  Button: ButtonTheme;
  Progress: ProgressTheme;
}> {}
interface UploadThemeOverrides extends ExtractThemeOverrides<UploadTheme> {}
//#endregion
export { UploadTheme, UploadThemeOverrides, UploadThemeVars, uploadLight as default, self };