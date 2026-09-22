import { ExtractThemeOverrides, Theme } from "../../_mixins/use-theme.js";
import "../../_mixins/index.js";
//#region src/watermark/styles/light.d.ts
interface WatermarkThemeVars {
  fontFamily: string;
}
declare const watermarkLight: WatermarkTheme;
interface WatermarkTheme extends Theme<'Watermark', WatermarkThemeVars> {}
interface WatermarkThemeOverrides extends ExtractThemeOverrides<WatermarkTheme> {}
//#endregion
export { WatermarkTheme, WatermarkThemeOverrides, WatermarkThemeVars, watermarkLight as default };