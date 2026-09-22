import { createTheme } from "../../_mixins/use-theme.mjs";
import derived from "../../_styles/common/light.mjs";
import buttonLight from "../../button/styles/light.mjs";
import _common_default from "./_common.mjs";
//#region src/dialog/styles/light.ts
function self(vars) {
  const {
    textColor1,
    textColor2,
    modalColor,
    closeIconColor,
    closeIconColorHover,
    closeIconColorPressed,
    closeColorHover,
    closeColorPressed,
    infoColor,
    successColor,
    warningColor,
    errorColor,
    primaryColor,
    dividerColor,
    borderRadius,
    fontWeightStrong,
    lineHeight,
    fontSize
  } = vars;
  return {
    ..._common_default,
    fontSize,
    lineHeight,
    border: `1px solid ${dividerColor}`,
    titleTextColor: textColor1,
    textColor: textColor2,
    color: modalColor,
    closeColorHover,
    closeColorPressed,
    closeIconColor,
    closeIconColorHover,
    closeIconColorPressed,
    closeBorderRadius: borderRadius,
    iconColor: primaryColor,
    iconColorInfo: infoColor,
    iconColorSuccess: successColor,
    iconColorWarning: warningColor,
    iconColorError: errorColor,
    borderRadius,
    titleFontWeight: fontWeightStrong
  };
}
const dialogLight = createTheme({
  name: "Dialog",
  common: derived,
  peers: {
    Button: buttonLight
  },
  self
});
//#endregion
export { dialogLight as default, self };