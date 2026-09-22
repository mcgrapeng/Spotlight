import { ThemeCommonVars } from "../../_styles/common/light.js";
import { ExtractThemeOverrides, Theme } from "../../_mixins/use-theme.js";
import "../../_mixins/index.js";
//#region src/statistic/styles/light.d.ts
declare function self(vars: ThemeCommonVars): {
  labelFontSize: string;
  labelFontWeight: string;
  valueFontWeight: string;
  valueFontSize: string;
  labelTextColor: string;
  valuePrefixTextColor: string;
  valueSuffixTextColor: string;
  valueTextColor: string;
};
interface StatisticThemeVars extends ReturnType<typeof self> {}
declare const statisticLight: StatisticTheme;
interface StatisticTheme extends Theme<'Statistic', StatisticThemeVars> {}
interface StatisticThemeOverrides extends ExtractThemeOverrides<StatisticTheme> {}
//#endregion
export { StatisticTheme, StatisticThemeOverrides, StatisticThemeVars, statisticLight as default, self };