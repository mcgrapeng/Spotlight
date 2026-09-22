import { ThemeCommonVars } from "../../_styles/common/light.js";
import { ButtonTheme } from "../../button/styles/light.js";
import "../../button/styles/index.js";
import { ExtractThemeOverrides, Theme } from "../../_mixins/use-theme.js";
import "../../_mixins/index.js";
//#region src/calendar/styles/light.d.ts
declare function self(vars: ThemeCommonVars): {
  borderRadius: string;
  borderColor: string;
  borderColorModal: string;
  borderColorPopover: string;
  textColor: string;
  titleFontWeight: string;
  titleTextColor: string;
  dayTextColor: string;
  fontSize: string;
  lineHeight: string;
  dateColorCurrent: string;
  dateTextColorCurrent: string;
  cellColorHover: string;
  cellColorHoverModal: string;
  cellColorHoverPopover: string;
  cellColor: string;
  cellColorModal: string;
  cellColorPopover: string;
  barColor: string;
  titleFontSize: string;
};
interface CalendarThemeVars extends ReturnType<typeof self> {}
declare const calendarLight: CalendarTheme;
interface CalendarTheme extends Theme<'Calendar', CalendarThemeVars, {
  Button: ButtonTheme;
}> {}
interface CalendarThemeOverrides extends ExtractThemeOverrides<CalendarTheme> {}
//#endregion
export { CalendarTheme, CalendarThemeOverrides, CalendarThemeVars, calendarLight as default, self };