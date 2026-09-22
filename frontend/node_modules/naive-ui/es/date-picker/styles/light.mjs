import { createTheme } from "../../_mixins/use-theme.mjs";
import derived from "../../_styles/common/light.mjs";
import scrollbarLight from "../../_internal/scrollbar/styles/light.mjs";
import inputLight from "../../input/styles/light.mjs";
import buttonLight from "../../button/styles/light.mjs";
import timePickerLight from "../../time-picker/styles/light.mjs";
import _common_default from "./_common.mjs";
import { changeColor } from "seemly";
//#region src/date-picker/styles/light.ts
function self(vars) {
  const {
    hoverColor,
    fontSize,
    textColor2,
    textColorDisabled,
    popoverColor,
    primaryColor,
    borderRadiusSmall,
    iconColor,
    iconColorDisabled,
    textColor1,
    dividerColor,
    boxShadow2,
    borderRadius,
    fontWeightStrong
  } = vars;
  return {
    ..._common_default,
    itemFontSize: fontSize,
    calendarDaysFontSize: fontSize,
    calendarTitleFontSize: fontSize,
    itemTextColor: textColor2,
    itemTextColorDisabled: textColorDisabled,
    itemTextColorActive: popoverColor,
    itemTextColorCurrent: primaryColor,
    itemColorIncluded: changeColor(primaryColor, {
      alpha: .1
    }),
    itemColorHover: hoverColor,
    itemColorDisabled: hoverColor,
    itemColorActive: primaryColor,
    itemBorderRadius: borderRadiusSmall,
    panelColor: popoverColor,
    panelTextColor: textColor2,
    arrowColor: iconColor,
    calendarTitleTextColor: textColor1,
    calendarTitleColorHover: hoverColor,
    calendarDaysTextColor: textColor2,
    panelHeaderDividerColor: dividerColor,
    calendarDaysDividerColor: dividerColor,
    calendarDividerColor: dividerColor,
    panelActionDividerColor: dividerColor,
    panelBoxShadow: boxShadow2,
    panelBorderRadius: borderRadius,
    calendarTitleFontWeight: fontWeightStrong,
    scrollItemBorderRadius: borderRadius,
    iconColor,
    iconColorDisabled
  };
}
const datePickerLight = createTheme({
  name: "DatePicker",
  common: derived,
  peers: {
    Input: inputLight,
    Button: buttonLight,
    TimePicker: timePickerLight,
    Scrollbar: scrollbarLight
  },
  self
});
//#endregion
export { datePickerLight as default, self };