import { ExtractThemeOverrides, Theme } from "../../_mixins/use-theme.js";
import "../../_mixins/index.js";
//#region src/equation/styles/light.d.ts
declare const self: () => {};
interface EquationThemeVars extends ReturnType<typeof self> {}
declare const equationLight: EquationTheme;
interface EquationTheme extends Theme<'Equation', EquationThemeVars> {}
interface EquationThemeOverrides extends ExtractThemeOverrides<EquationTheme> {}
//#endregion
export { EquationTheme, EquationThemeOverrides, EquationThemeVars, equationLight as default, self };