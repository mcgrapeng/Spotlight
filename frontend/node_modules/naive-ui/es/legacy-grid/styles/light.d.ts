import { ExtractThemeOverrides, Theme } from "../../_mixins/use-theme.js";
import "../../_mixins/index.js";
//#region src/legacy-grid/styles/light.d.ts
interface RowThemeVars {}
declare const rowLight: RowTheme;
interface RowTheme extends Theme<'Row', RowThemeVars> {}
interface RowThemeOverrides extends ExtractThemeOverrides<RowTheme> {}
//#endregion
export { RowTheme, RowThemeOverrides, RowThemeVars, rowLight as default };