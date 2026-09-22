import { ExtractPublicPropTypes } from "../../_utils/naive/extract-public-props.js";
import "../../_utils/index.js";
import { TooltipProps } from "../../tooltip/src/Tooltip.js";
import "../../tooltip/index.js";
import { HeatmapTheme, HeatmapThemeOverrides } from "../styles/light.js";
import { HeatmapColorTheme } from "./theme.js";
import { HeatmapData, HeatmapFirstDayOfWeek, HeatmapSlots } from "./public-types.js";
import { DayRect } from "./interface.js";
import { RtlItem } from "../../config-provider/src/internal-interface.js";
import { CSSProperties, PropType, Ref, SlotsType } from "vue";
//#region src/heatmap/src/Heatmap.d.ts
declare const heatmapProps: {
  readonly activeColors: PropType<string[]>;
  readonly colorTheme: PropType<HeatmapColorTheme>;
  readonly data: PropType<HeatmapData>;
  readonly loadingData: PropType<HeatmapData>;
  readonly fillCalendarLeading: BooleanConstructor;
  readonly firstDayOfWeek: {
    readonly type: PropType<HeatmapFirstDayOfWeek>;
    readonly default: 0;
  };
  readonly loading: BooleanConstructor;
  readonly minimumColor: StringConstructor;
  readonly showColorIndicator: {
    readonly type: BooleanConstructor;
    readonly default: true;
  };
  readonly showWeekLabels: {
    readonly type: BooleanConstructor;
    readonly default: true;
  };
  readonly showMonthLabels: {
    readonly type: BooleanConstructor;
    readonly default: true;
  };
  readonly size: {
    readonly type: PropType<"small" | "medium" | "large">;
    readonly default: "medium";
  };
  readonly tooltip: {
    readonly type: PropType<TooltipProps | boolean>;
    readonly default: false;
  };
  readonly xGap: PropType<number | string>;
  readonly yGap: PropType<number | string>;
  readonly theme: PropType<HeatmapTheme>;
  readonly themeOverrides: PropType<HeatmapThemeOverrides>;
  readonly builtinThemeOverrides: PropType<HeatmapThemeOverrides>;
};
type HeatmapProps = ExtractPublicPropTypes<typeof heatmapProps>;
declare const _default: import("vue").DefineComponent<import("vue").ExtractPropTypes<{
  readonly activeColors: PropType<string[]>;
  readonly colorTheme: PropType<HeatmapColorTheme>;
  readonly data: PropType<HeatmapData>;
  readonly loadingData: PropType<HeatmapData>;
  readonly fillCalendarLeading: BooleanConstructor;
  readonly firstDayOfWeek: {
    readonly type: PropType<HeatmapFirstDayOfWeek>;
    readonly default: 0;
  };
  readonly loading: BooleanConstructor;
  readonly minimumColor: StringConstructor;
  readonly showColorIndicator: {
    readonly type: BooleanConstructor;
    readonly default: true;
  };
  readonly showWeekLabels: {
    readonly type: BooleanConstructor;
    readonly default: true;
  };
  readonly showMonthLabels: {
    readonly type: BooleanConstructor;
    readonly default: true;
  };
  readonly size: {
    readonly type: PropType<"small" | "medium" | "large">;
    readonly default: "medium";
  };
  readonly tooltip: {
    readonly type: PropType<TooltipProps | boolean>;
    readonly default: false;
  };
  readonly xGap: PropType<number | string>;
  readonly yGap: PropType<number | string>;
  readonly theme: PropType<HeatmapTheme>;
  readonly themeOverrides: PropType<HeatmapThemeOverrides>;
  readonly builtinThemeOverrides: PropType<HeatmapThemeOverrides>;
}>, {
  weekLabels: import("vue").ComputedRef<{
    label: string;
    visible: boolean;
  }[]>;
  monthLabels: import("vue").ComputedRef<{
    name: string;
    colSpan: number;
  }[]>;
  mergedColors: import("vue").ComputedRef<string[]>;
  mergedClsPrefix: Ref<string, string>;
  rtlEnabled: Ref<RtlItem | undefined, RtlItem | undefined> | undefined;
  locale: Ref<{
    less: string;
    more: string;
    monthFormat: string;
    weekdayFormat: string;
  }, {
    less: string;
    more: string;
    monthFormat: string;
    weekdayFormat: string;
  }>;
  cssVars: Ref<CSSProperties, CSSProperties> | undefined;
  themeClass: Ref<string, string> | undefined;
  onRender: (() => void) | undefined;
  heatmapMatrix: import("vue").ComputedRef<DayRect[][]>;
  loadingClass: Ref<string, string>;
}, {}, {}, {}, import("vue").ComponentOptionsMixin, import("vue").ComponentOptionsMixin, {}, string, import("vue").PublicProps, Readonly<import("vue").ExtractPropTypes<{
  readonly activeColors: PropType<string[]>;
  readonly colorTheme: PropType<HeatmapColorTheme>;
  readonly data: PropType<HeatmapData>;
  readonly loadingData: PropType<HeatmapData>;
  readonly fillCalendarLeading: BooleanConstructor;
  readonly firstDayOfWeek: {
    readonly type: PropType<HeatmapFirstDayOfWeek>;
    readonly default: 0;
  };
  readonly loading: BooleanConstructor;
  readonly minimumColor: StringConstructor;
  readonly showColorIndicator: {
    readonly type: BooleanConstructor;
    readonly default: true;
  };
  readonly showWeekLabels: {
    readonly type: BooleanConstructor;
    readonly default: true;
  };
  readonly showMonthLabels: {
    readonly type: BooleanConstructor;
    readonly default: true;
  };
  readonly size: {
    readonly type: PropType<"small" | "medium" | "large">;
    readonly default: "medium";
  };
  readonly tooltip: {
    readonly type: PropType<TooltipProps | boolean>;
    readonly default: false;
  };
  readonly xGap: PropType<number | string>;
  readonly yGap: PropType<number | string>;
  readonly theme: PropType<HeatmapTheme>;
  readonly themeOverrides: PropType<HeatmapThemeOverrides>;
  readonly builtinThemeOverrides: PropType<HeatmapThemeOverrides>;
}>> & Readonly<{}>, {
  readonly loading: boolean;
  readonly size: "small" | "medium" | "large";
  readonly firstDayOfWeek: HeatmapFirstDayOfWeek;
  readonly tooltip: boolean | TooltipProps;
  readonly fillCalendarLeading: boolean;
  readonly showColorIndicator: boolean;
  readonly showWeekLabels: boolean;
  readonly showMonthLabels: boolean;
}, SlotsType<HeatmapSlots>, {}, {}, string, import("vue").ComponentProvideOptions, true, {}, any>;
//#endregion
export { HeatmapProps, _default as default, heatmapProps };