import { ExtractThemeOverrides, Theme } from "../../_mixins/use-theme.js";
import "../../_mixins/index.js";
//#region src/flex/styles/light.d.ts
declare function self(): {
  gapSmall: string;
  gapMedium: string;
  gapLarge: string;
};
interface FlexThemeVars extends ReturnType<typeof self> {}
declare const flexLight: FlexTheme;
interface FlexTheme extends Theme<'Flex', FlexThemeVars> {}
interface FlexThemeOverrides extends ExtractThemeOverrides<FlexTheme> {}
//#endregion
export { FlexTheme, FlexThemeOverrides, FlexThemeVars, flexLight as default };