import derived from "../../_styles/common/light.mjs";
import { changeColor } from "seemly";
//#region src/gradient-text/styles/light.ts
function self(vars) {
  const {
    primaryColor,
    successColor,
    warningColor,
    errorColor,
    infoColor,
    fontWeightStrong
  } = vars;
  return {
    fontWeight: fontWeightStrong,
    rotate: "252deg",
    colorStartPrimary: changeColor(primaryColor, {
      alpha: .6
    }),
    colorEndPrimary: primaryColor,
    colorStartInfo: changeColor(infoColor, {
      alpha: .6
    }),
    colorEndInfo: infoColor,
    colorStartWarning: changeColor(warningColor, {
      alpha: .6
    }),
    colorEndWarning: warningColor,
    colorStartError: changeColor(errorColor, {
      alpha: .6
    }),
    colorEndError: errorColor,
    colorStartSuccess: changeColor(successColor, {
      alpha: .6
    }),
    colorEndSuccess: successColor
  };
}
const gradientTextLight = {
  name: "GradientText",
  common: derived,
  self
};
//#endregion
export { gradientTextLight as default };