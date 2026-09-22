import { ThemeCommonVars } from "../../_styles/common/light.js";
import { ExtractThemeOverrides, Theme } from "../../_mixins/use-theme.js";
//#region src/collapse-transition/styles/light.d.ts
declare function self(vars: ThemeCommonVars): {
  bezier: string;
};
interface CollapseTransitionThemeVars extends ReturnType<typeof self> {}
declare const collapseTransitionLight: CollapseTransitionTheme;
interface CollapseTransitionTheme extends Theme<'CollapseTransition', CollapseTransitionThemeVars> {}
interface CollapseTransitionThemeOverrides extends ExtractThemeOverrides<CollapseTransitionTheme> {}
//#endregion
export { CollapseTransitionTheme, CollapseTransitionThemeOverrides, CollapseTransitionThemeVars, collapseTransitionLight as default, self };