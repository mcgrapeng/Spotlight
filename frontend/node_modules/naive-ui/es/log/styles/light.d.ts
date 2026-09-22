import { ThemeCommonVars } from "../../_styles/common/light.js";
import { CodeTheme } from "../../code/styles/light.js";
import "../../code/styles/index.js";
import { ExtractThemeOverrides, Theme } from "../../_mixins/use-theme.js";
import "../../_mixins/index.js";
import { ScrollbarTheme } from "../../_internal/scrollbar/styles/light.js";
import "../../_internal/scrollbar/styles/index.js";
//#region src/log/styles/light.d.ts
declare function self(vars: ThemeCommonVars): {
  loaderFontSize: string;
  loaderTextColor: string;
  loaderColor: string;
  loaderBorder: string;
  loadingColor: string;
};
interface LogThemeVars extends ReturnType<typeof self> {}
declare const logLight: LogTheme;
interface LogTheme extends Theme<'Log', LogThemeVars, {
  Scrollbar: ScrollbarTheme;
  Code: CodeTheme;
}> {}
interface LogThemeOverrides extends ExtractThemeOverrides<LogTheme> {}
//#endregion
export { LogTheme, LogThemeOverrides, LogThemeVars, logLight as default };