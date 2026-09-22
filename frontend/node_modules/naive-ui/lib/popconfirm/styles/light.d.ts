import { ThemeCommonVars } from "../../_styles/common/light.js";
import { PopoverTheme } from "../../popover/styles/light.js";
import "../../popover/styles/index.js";
import { ButtonTheme } from "../../button/styles/light.js";
import "../../button/styles/index.js";
import { ExtractThemeOverrides, Theme } from "../../_mixins/use-theme.js";
import "../../_mixins/index.js";
//#region src/popconfirm/styles/light.d.ts
declare function self(vars: ThemeCommonVars): {
  fontSize: string;
  iconColor: string;
  iconSize: string;
};
interface PopconfirmThemeVars extends ReturnType<typeof self> {}
declare const popconfirmLight: PopconfirmTheme;
interface PopconfirmTheme extends Theme<'Popconfirm', PopconfirmThemeVars, {
  Button: ButtonTheme;
  Popover: PopoverTheme;
}> {}
interface PopconfirmThemeOverrides extends ExtractThemeOverrides<PopconfirmTheme> {}
//#endregion
export { PopconfirmTheme, PopconfirmThemeOverrides, PopconfirmThemeVars, popconfirmLight as default, self };