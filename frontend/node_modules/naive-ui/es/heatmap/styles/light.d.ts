import { ThemeCommonVars } from "../../_styles/common/light.js";
import { ExtractThemeOverrides, Theme } from "../../_mixins/use-theme.js";
import "../../_mixins/index.js";
//#region src/heatmap/styles/light.d.ts
declare function self(vars: ThemeCommonVars): {
  activeColors: string[];
  borderRadius: string;
  borderColor: string;
  textColor: string;
  mininumColor: string;
  fontWeight: string;
  loadingColorStart: string;
  loadingColorEnd: string;
  rectSizeSmall: string;
  rectSizeMedium: string;
  rectSizeLarge: string;
  borderRadiusSmall: string;
  borderRadiusMedium: string;
  borderRadiusLarge: string;
  xGapSmall: string;
  xGapMedium: string;
  xGapLarge: string;
  yGapSmall: string;
  yGapMedium: string;
  yGapLarge: string;
  fontSizeSmall: string;
  fontSizeMedium: string;
  fontSizeLarge: string;
};
interface HeatmapThemeVars extends ReturnType<typeof self> {}
declare const heatmapLight: HeatmapTheme;
interface HeatmapTheme extends Theme<'Heatmap', HeatmapThemeVars> {}
interface HeatmapThemeOverrides extends ExtractThemeOverrides<HeatmapTheme> {}
//#endregion
export { HeatmapTheme, HeatmapThemeOverrides, HeatmapThemeVars, heatmapLight as default, self };