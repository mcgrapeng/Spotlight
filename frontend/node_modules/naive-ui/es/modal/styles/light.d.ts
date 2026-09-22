import { ThemeCommonVars } from "../../_styles/common/light.js";
import { CardTheme } from "../../card/styles/light.js";
import "../../card/styles/index.js";
import { DialogTheme } from "../../dialog/styles/light.js";
import "../../dialog/styles/index.js";
import { ExtractThemeOverrides, Theme } from "../../_mixins/use-theme.js";
import "../../_mixins/index.js";
import { ScrollbarTheme } from "../../_internal/scrollbar/styles/light.js";
import "../../_internal/scrollbar/styles/index.js";
//#region src/modal/styles/light.d.ts
declare function self(vars: ThemeCommonVars): {
  color: string;
  textColor: string;
  boxShadow: string;
};
interface ModalThemeVars extends ReturnType<typeof self> {}
declare const modalLight: ModalTheme;
interface ModalTheme extends Theme<'Modal', ModalThemeVars, {
  Scrollbar: ScrollbarTheme;
  Dialog: DialogTheme;
  Card: CardTheme;
}> {}
interface ModalThemeOverrides extends ExtractThemeOverrides<ModalTheme> {}
//#endregion
export { ModalTheme, ModalThemeOverrides, ModalThemeVars, modalLight as default, self };