import { ThemeCommonVars } from "../../_styles/common/light.js";
import { InputTheme } from "../../input/styles/light.js";
import "../../input/styles/index.js";
import { ButtonTheme } from "../../button/styles/light.js";
import "../../button/styles/index.js";
import { ExtractThemeOverrides, Theme } from "../../_mixins/use-theme.js";
import "../../_mixins/index.js";
import { ScrollbarTheme } from "../../_internal/scrollbar/styles/light.js";
import "../../_internal/scrollbar/styles/index.js";
//#region src/time-picker/styles/light.d.ts
declare function self(vars: ThemeCommonVars): {
  panelColor: string;
  panelBoxShadow: string;
  panelDividerColor: string;
  itemTextColor: string;
  itemTextColorActive: string;
  itemColorHover: string;
  itemOpacityDisabled: string;
  itemBorderRadius: string;
  borderRadius: string;
  iconColor: string;
  iconColorDisabled: string;
  itemFontSize: string;
  itemHeight: string;
  itemWidth: string;
  panelActionPadding: string;
};
interface TimePickerThemeVars extends ReturnType<typeof self> {}
declare const timePickerLight: TimePickerTheme;
interface TimePickerTheme extends Theme<'TimePicker', TimePickerThemeVars, {
  Scrollbar: ScrollbarTheme;
  Button: ButtonTheme;
  Input: InputTheme;
}> {}
interface TimePickerThemeOverrides extends ExtractThemeOverrides<TimePickerTheme> {}
//#endregion
export { TimePickerTheme, TimePickerThemeOverrides, TimePickerThemeVars, timePickerLight as default, self };