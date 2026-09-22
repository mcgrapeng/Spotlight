import { createTheme } from "../../_mixins/use-theme.mjs";
import derived from "../../_styles/common/light.mjs";
import scrollbarLight from "../../_internal/scrollbar/styles/light.mjs";
import _common_default from "./_common.mjs";
//#region src/notification/styles/light.ts
function self(vars) {
  const {
    textColor2,
    successColor,
    infoColor,
    warningColor,
    errorColor,
    popoverColor,
    closeIconColor,
    closeIconColorHover,
    closeIconColorPressed,
    closeColorHover,
    closeColorPressed,
    textColor1,
    textColor3,
    borderRadius,
    fontWeightStrong,
    boxShadow2,
    lineHeight,
    fontSize
  } = vars;
  return {
    ..._common_default,
    borderRadius,
    lineHeight,
    fontSize,
    headerFontWeight: fontWeightStrong,
    iconColor: textColor2,
    iconColorSuccess: successColor,
    iconColorInfo: infoColor,
    iconColorWarning: warningColor,
    iconColorError: errorColor,
    color: popoverColor,
    textColor: textColor2,
    closeIconColor,
    closeIconColorHover,
    closeIconColorPressed,
    closeBorderRadius: borderRadius,
    closeColorHover,
    closeColorPressed,
    headerTextColor: textColor1,
    descriptionTextColor: textColor3,
    actionTextColor: textColor2,
    boxShadow: boxShadow2
  };
}
const notificationLight = createTheme({
  name: "Notification",
  common: derived,
  peers: {
    Scrollbar: scrollbarLight
  },
  self
});
//#endregion
export { notificationLight as default, self };