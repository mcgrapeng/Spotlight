import { ExtractThemeOverrides, Theme } from "../../_mixins/use-theme.js";
import "../../_mixins/index.js";
//#region src/carousel/styles/light.d.ts
declare function self(): {
  dotSize: string;
  dotColor: string;
  dotColorActive: string;
  dotColorFocus: string;
  dotLineWidth: string;
  dotLineWidthActive: string;
  arrowColor: string;
};
interface CarouselThemeVars extends ReturnType<typeof self> {}
declare const carouselLight: CarouselTheme;
interface CarouselTheme extends Theme<'Carousel', CarouselThemeVars> {}
interface CarouselThemeOverrides extends ExtractThemeOverrides<CarouselTheme> {}
//#endregion
export { CarouselTheme, CarouselThemeOverrides, CarouselThemeVars, carouselLight as default, self };