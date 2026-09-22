//#region src/heatmap/src/theme.d.ts
declare const heatmapColorThemes: {
  green: string[];
  blue: string[];
  orange: string[];
  purple: string[];
  red: string[];
};
type HeatmapColorTheme = keyof typeof heatmapColorThemes;
//#endregion
export { HeatmapColorTheme, heatmapColorThemes };