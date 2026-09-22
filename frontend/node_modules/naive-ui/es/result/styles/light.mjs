import derived from "../../_styles/common/light.mjs";
import _common_default from "./_common.mjs";
//#region src/result/styles/light.ts
function self(vars) {
  const {
    textColor2,
    textColor1,
    errorColor,
    successColor,
    infoColor,
    warningColor,
    lineHeight,
    fontWeightStrong
  } = vars;
  return {
    ..._common_default,
    lineHeight,
    titleFontWeight: fontWeightStrong,
    titleTextColor: textColor1,
    textColor: textColor2,
    iconColorError: errorColor,
    iconColorSuccess: successColor,
    iconColorInfo: infoColor,
    iconColorWarning: warningColor
  };
}
const resultLight = {
  name: "Result",
  common: derived,
  self
};
//#endregion
export { resultLight as default, self };