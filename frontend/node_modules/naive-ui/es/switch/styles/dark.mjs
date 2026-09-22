import derived from "../../_styles/common/dark.mjs";
import _common_default from "./_common.mjs";
import { changeColor } from "seemly";
//#region src/switch/styles/dark.ts
const switchDark = {
  name: "Switch",
  common: derived,
  self(vars) {
    const {
      primaryColorSuppl,
      opacityDisabled,
      borderRadius,
      primaryColor,
      textColor2,
      baseColor
    } = vars;
    const railOverlayColor = "rgba(255, 255, 255, .20)";
    return {
      ..._common_default,
      iconColor: baseColor,
      textColor: textColor2,
      loadingColor: primaryColorSuppl,
      opacityDisabled,
      railColor: railOverlayColor,
      railColorActive: primaryColorSuppl,
      buttonBoxShadow: "0px 2px 4px 0 rgba(0, 0, 0, 0.4)",
      buttonColor: "#FFF",
      railBorderRadiusSmall: borderRadius,
      railBorderRadiusMedium: borderRadius,
      railBorderRadiusLarge: borderRadius,
      buttonBorderRadiusSmall: borderRadius,
      buttonBorderRadiusMedium: borderRadius,
      buttonBorderRadiusLarge: borderRadius,
      boxShadowFocus: `0 0 8px 0 ${changeColor(primaryColor, {
        alpha: .3
      })}`
    };
  }
};
//#endregion
export { switchDark as default };