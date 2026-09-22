import derived from "../../_styles/common/light.mjs";
import _common_default from "./_common.mjs";
import { changeColor } from "seemly";
//#region src/switch/styles/light.ts
function self(vars) {
  const {
    primaryColor,
    opacityDisabled,
    borderRadius,
    textColor3
  } = vars;
  const railOverlayColor = "rgba(0, 0, 0, .14)";
  return {
    ..._common_default,
    iconColor: textColor3,
    textColor: "white",
    loadingColor: primaryColor,
    opacityDisabled,
    railColor: railOverlayColor,
    railColorActive: primaryColor,
    buttonBoxShadow: "0 1px 4px 0 rgba(0, 0, 0, 0.3), inset 0 0 1px 0 rgba(0, 0, 0, 0.05)",
    buttonColor: "#FFF",
    railBorderRadiusSmall: borderRadius,
    railBorderRadiusMedium: borderRadius,
    railBorderRadiusLarge: borderRadius,
    buttonBorderRadiusSmall: borderRadius,
    buttonBorderRadiusMedium: borderRadius,
    buttonBorderRadiusLarge: borderRadius,
    boxShadowFocus: `0 0 0 2px ${changeColor(primaryColor, {
      alpha: .2
    })}`
  };
}
const switchLight = {
  name: "Switch",
  common: derived,
  self
};
//#endregion
export { switchLight as default };