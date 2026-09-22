import { PopoverProps } from "../../popover/src/Popover.js";
import { HeatmapDataItem } from "./public-types.js";
import { CSSProperties, PropType, Ref, SlotsType, VNode } from "vue";
//#region src/heatmap/src/Rect.d.ts
interface RectSlots {
  tooltip?: (props: HeatmapDataItem) => VNode[];
}
declare const _default: import("vue").DefineComponent<import("vue").ExtractPropTypes<{
  mergedClsPrefix: {
    type: StringConstructor;
    required: true;
  };
  data: {
    type: PropType<HeatmapDataItem>;
    required: true;
  };
  color: {
    type: StringConstructor;
    required: true;
  };
  style: ObjectConstructor;
  loading: BooleanConstructor;
  loadingClass: StringConstructor;
  tooltip: {
    type: PropType<PopoverProps | boolean>;
    default: boolean;
  };
}>, {
  cssVars: Ref<CSSProperties>;
  tooltipProps: import("vue").ComputedRef<PopoverProps>;
  defaultTooltipContent: import("vue").ComputedRef<string>;
}, {}, {}, {}, import("vue").ComponentOptionsMixin, import("vue").ComponentOptionsMixin, {}, string, import("vue").PublicProps, Readonly<import("vue").ExtractPropTypes<{
  mergedClsPrefix: {
    type: StringConstructor;
    required: true;
  };
  data: {
    type: PropType<HeatmapDataItem>;
    required: true;
  };
  color: {
    type: StringConstructor;
    required: true;
  };
  style: ObjectConstructor;
  loading: BooleanConstructor;
  loadingClass: StringConstructor;
  tooltip: {
    type: PropType<PopoverProps | boolean>;
    default: boolean;
  };
}>> & Readonly<{}>, {
  loading: boolean;
  tooltip: boolean | PopoverProps;
}, SlotsType<RectSlots>, {}, {}, string, import("vue").ComponentProvideOptions, true, {}, any>;
//#endregion
export { RectSlots, _default as default };