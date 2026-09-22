import { ExtractPublicPropTypes } from "../../_utils/naive/extract-public-props.js";
import "../../_utils/index.js";
import { StatisticTheme, StatisticThemeOverrides } from "../styles/light.js";
import "../styles/index.js";
import { RtlItem } from "../../config-provider/src/internal-interface.js";
import { CSSProperties, Ref, SlotsType, VNode } from "vue";
//#region src/statistic/src/Statistic.d.ts
declare const statisticProps: {
  tabularNums: BooleanConstructor;
  label: StringConstructor;
  value: (StringConstructor | NumberConstructor)[];
  theme: import("vue").PropType<StatisticTheme>;
  themeOverrides: import("vue").PropType<StatisticThemeOverrides>;
  builtinThemeOverrides: import("vue").PropType<StatisticThemeOverrides>;
};
type StatisticProps = ExtractPublicPropTypes<typeof statisticProps>;
interface StatisticSlots {
  default?: () => VNode[];
  label?: () => VNode[];
  prefix?: () => VNode[];
  suffix?: () => VNode[];
}
declare const _default: import("vue").DefineComponent<import("vue").ExtractPropTypes<{
  tabularNums: BooleanConstructor;
  label: StringConstructor;
  value: (StringConstructor | NumberConstructor)[];
  theme: import("vue").PropType<StatisticTheme>;
  themeOverrides: import("vue").PropType<StatisticThemeOverrides>;
  builtinThemeOverrides: import("vue").PropType<StatisticThemeOverrides>;
}>, {
  rtlEnabled: Ref<RtlItem | undefined, RtlItem | undefined> | undefined;
  mergedClsPrefix: Ref<string, string>;
  cssVars: Ref<CSSProperties, CSSProperties> | undefined;
  themeClass: Ref<string, string> | undefined;
  onRender: (() => void) | undefined;
}, {}, {}, {}, import("vue").ComponentOptionsMixin, import("vue").ComponentOptionsMixin, {}, string, import("vue").PublicProps, Readonly<import("vue").ExtractPropTypes<{
  tabularNums: BooleanConstructor;
  label: StringConstructor;
  value: (StringConstructor | NumberConstructor)[];
  theme: import("vue").PropType<StatisticTheme>;
  themeOverrides: import("vue").PropType<StatisticThemeOverrides>;
  builtinThemeOverrides: import("vue").PropType<StatisticThemeOverrides>;
}>> & Readonly<{}>, {
  tabularNums: boolean;
}, SlotsType<StatisticSlots>, {}, {}, string, import("vue").ComponentProvideOptions, true, {}, any>;
//#endregion
export { StatisticProps, StatisticSlots, _default as default, statisticProps };