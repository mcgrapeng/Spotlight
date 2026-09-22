import { ThemeCommonVars } from "../../_styles/common/light.js";
import { ExtractThemeOverrides, Theme } from "../../_mixins/use-theme.js";
import "../../_mixins/index.js";
//#region src/slider/styles/light.d.ts
declare function self(vars: ThemeCommonVars): {
  fontSize: string;
  markFontSize: string;
  railColor: string;
  railColorHover: string;
  fillColor: string;
  fillColorHover: string;
  opacityDisabled: string;
  handleColor: string;
  dotColor: string;
  dotColorModal: string;
  dotColorPopover: string;
  handleBoxShadow: string;
  handleBoxShadowHover: string;
  handleBoxShadowActive: string;
  handleBoxShadowFocus: string;
  indicatorColor: string;
  indicatorBoxShadow: string;
  indicatorTextColor: string;
  indicatorBorderRadius: string;
  dotBorder: string;
  dotBorderActive: string;
  dotBoxShadow: string;
  railHeight: string;
  railWidthVertical: string;
  handleSize: string;
  dotHeight: string;
  dotWidth: string;
  dotBorderRadius: string;
};
interface SliderThemeVars extends ReturnType<typeof self> {}
declare const sliderLight: SliderTheme;
interface SliderTheme extends Theme<'Slider', SliderThemeVars> {}
interface SliderThemeOverrides extends ExtractThemeOverrides<SliderTheme> {}
//#endregion
export { SliderTheme, SliderThemeOverrides, SliderThemeVars, sliderLight as default };