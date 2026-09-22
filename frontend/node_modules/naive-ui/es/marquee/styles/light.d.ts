import { ExtractThemeOverrides, Theme } from "../../_mixins/use-theme.js";
import "../../_mixins/index.js";
//#region src/marquee/styles/light.d.ts
declare function self(): {};
interface MarqueeThemeVars extends ReturnType<typeof self> {}
declare const marqueeLight: MarqueeTheme;
interface MarqueeTheme extends Theme<'Marquee', MarqueeThemeVars> {}
interface MarqueeThemeOverrides extends ExtractThemeOverrides<MarqueeTheme> {}
//#endregion
export { MarqueeTheme, MarqueeThemeOverrides, MarqueeThemeVars, marqueeLight as default, self };