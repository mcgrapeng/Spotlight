import { createTheme } from "../../_mixins/use-theme.mjs";
import derived from "../../_styles/common/light.mjs";
import buttonLight from "../../button/styles/light.mjs";
import _common_default from "./_common.mjs";
import { composite } from "seemly";
//#region src/calendar/styles/light.ts
function self(vars) {
  const {
    borderRadius,
    fontSize,
    lineHeight,
    textColor2,
    textColor1,
    textColorDisabled,
    dividerColor,
    fontWeightStrong,
    primaryColor,
    baseColor,
    hoverColor,
    cardColor,
    modalColor,
    popoverColor
  } = vars;
  return {
    ..._common_default,
    borderRadius,
    borderColor: composite(cardColor, dividerColor),
    borderColorModal: composite(modalColor, dividerColor),
    borderColorPopover: composite(popoverColor, dividerColor),
    textColor: textColor2,
    titleFontWeight: fontWeightStrong,
    titleTextColor: textColor1,
    dayTextColor: textColorDisabled,
    fontSize,
    lineHeight,
    dateColorCurrent: primaryColor,
    dateTextColorCurrent: baseColor,
    cellColorHover: composite(cardColor, hoverColor),
    cellColorHoverModal: composite(modalColor, hoverColor),
    cellColorHoverPopover: composite(popoverColor, hoverColor),
    cellColor: cardColor,
    cellColorModal: modalColor,
    cellColorPopover: popoverColor,
    barColor: primaryColor
  };
}
const calendarLight = createTheme({
  name: "Calendar",
  common: derived,
  peers: {
    Button: buttonLight
  },
  self
});
//#endregion
export { calendarLight as default, self };