import { ExtractThemeOverrides, Theme } from "../../_mixins/use-theme.js";
import "../../_mixins/index.js";
//#region src/space/styles/light.d.ts
declare function self(): {
  gapSmall: string;
  gapMedium: string;
  gapLarge: string;
};
interface SpaceThemeVars extends ReturnType<typeof self> {}
declare const spaceLight: SpaceTheme;
interface SpaceTheme extends Theme<'Space', SpaceThemeVars> {}
interface SpaceThemeOverrides extends ExtractThemeOverrides<SpaceTheme> {}
//#endregion
export { SpaceTheme, SpaceThemeOverrides, SpaceThemeVars, spaceLight as default };