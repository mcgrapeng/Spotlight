import { HeatmapDataItem } from "./public-types.js";
//#region src/heatmap/src/interface.d.ts
interface DayRect extends HeatmapDataItem {
  color: string;
  dayOfWeek: number;
  rowIndex: number;
  colIndex: number;
}
//#endregion
export { DayRect };