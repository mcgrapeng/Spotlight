import { ThemeCommonVars } from "../../_styles/common/light.js";
import { ExtractThemeOverrides, Theme } from "../../_mixins/use-theme.js";
import "../../_mixins/index.js";
//#region src/loading-bar/styles/light.d.ts
declare function self(vars: ThemeCommonVars): {
  colorError: string;
  colorLoading: string;
  height: string;
};
interface LoadingBarThemeVars extends ReturnType<typeof self> {}
declare const loadingBarLight: LoadingBarTheme;
interface LoadingBarTheme extends Theme<'LoadingBar', LoadingBarThemeVars> {}
interface LoadingBarThemeOverrides extends ExtractThemeOverrides<LoadingBarTheme> {}
//#endregion
export { LoadingBarTheme, LoadingBarThemeOverrides, LoadingBarThemeVars, loadingBarLight as default };