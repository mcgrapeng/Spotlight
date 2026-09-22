import { HeatmapColorTheme } from "./theme.js";
import { VNode } from "vue";
//#region src/heatmap/src/public-types.d.ts
type HeatmapData = HeatmapDataItem[];
interface HeatmapDataItem {
  timestamp: number;
  value?: number | null;
}
type HeatmapTooltipSlotProps = HeatmapDataItem;
interface HeatmapSlots {
  footer?: () => VNode[];
  indicator?: () => VNode[];
  'indicator-leading-text'?: () => VNode[];
  'indicator-trailing-text'?: () => VNode[];
  tooltip?: (props: HeatmapTooltipSlotProps) => VNode[];
}
type HeatmapFirstDayOfWeek = 0 | 1 | 2 | 3 | 4 | 5 | 6;
//#endregion
export { type HeatmapColorTheme, HeatmapData, HeatmapDataItem, HeatmapFirstDayOfWeek, HeatmapSlots, HeatmapTooltipSlotProps };