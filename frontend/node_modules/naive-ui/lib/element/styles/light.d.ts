import { ExtractThemeOverrides, Theme } from "../../_mixins/use-theme.js";
import "../../_mixins/index.js";
//#region src/element/styles/light.d.ts
interface ElementThemeVars {}
declare const elementLight: ElementTheme;
interface ElementTheme extends Theme<'Element', ElementThemeVars> {}
interface ElementThemeOverrides extends ExtractThemeOverrides<ElementTheme> {}
//#endregion
export { ElementTheme, ElementThemeOverrides, ElementThemeVars, elementLight as default };