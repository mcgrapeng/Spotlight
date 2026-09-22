import derived from "../../_styles/common/light.mjs";
import _common_default from "./_common.mjs";
//#region src/steps/styles/light.ts
function self(vars) {
  const {
    fontWeightStrong,
    baseColor,
    textColorDisabled,
    primaryColor,
    errorColor,
    textColor1,
    textColor2
  } = vars;
  return {
    ..._common_default,
    stepHeaderFontWeight: fontWeightStrong,
    indicatorTextColorProcess: baseColor,
    indicatorTextColorWait: textColorDisabled,
    indicatorTextColorFinish: primaryColor,
    indicatorTextColorError: errorColor,
    indicatorBorderColorProcess: primaryColor,
    indicatorBorderColorWait: textColorDisabled,
    indicatorBorderColorFinish: primaryColor,
    indicatorBorderColorError: errorColor,
    indicatorColorProcess: primaryColor,
    indicatorColorWait: "#0000",
    indicatorColorFinish: "#0000",
    indicatorColorError: "#0000",
    splitorColorProcess: textColorDisabled,
    splitorColorWait: textColorDisabled,
    splitorColorFinish: primaryColor,
    splitorColorError: textColorDisabled,
    headerTextColorProcess: textColor1,
    headerTextColorWait: textColorDisabled,
    headerTextColorFinish: textColorDisabled,
    headerTextColorError: errorColor,
    descriptionTextColorProcess: textColor2,
    descriptionTextColorWait: textColorDisabled,
    descriptionTextColorFinish: textColorDisabled,
    descriptionTextColorError: errorColor
  };
}
const stepsLight = {
  name: "Steps",
  common: derived,
  self
};
//#endregion
export { stepsLight as default, self };