import derived from "../../_styles/common/light.mjs";
import _common_default from "./_common.mjs";
//#region src/form/styles/light.ts
function self(vars) {
  const {
    heightSmall,
    heightMedium,
    heightLarge,
    textColor1,
    errorColor,
    warningColor,
    lineHeight,
    textColor3
  } = vars;
  return {
    ..._common_default,
    blankHeightSmall: heightSmall,
    blankHeightMedium: heightMedium,
    blankHeightLarge: heightLarge,
    lineHeight,
    labelTextColor: textColor1,
    asteriskColor: errorColor,
    feedbackTextColorError: errorColor,
    feedbackTextColorWarning: warningColor,
    feedbackTextColor: textColor3
  };
}
const formLight = {
  name: "Form",
  common: derived,
  self
};
//#endregion
export { formLight as default, self };