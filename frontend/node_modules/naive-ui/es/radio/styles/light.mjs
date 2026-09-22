import derived from "../../_styles/common/light.mjs";
import _common_default from "./_common.mjs";
import { changeColor } from "seemly";
//#region src/radio/styles/light.ts
function self(vars) {
  const {
    borderColor,
    primaryColor,
    baseColor,
    textColorDisabled,
    inputColorDisabled,
    textColor2,
    opacityDisabled,
    borderRadius,
    fontSizeSmall,
    fontSizeMedium,
    fontSizeLarge,
    heightSmall,
    heightMedium,
    heightLarge,
    lineHeight
  } = vars;
  return {
    ..._common_default,
    labelLineHeight: lineHeight,
    buttonHeightSmall: heightSmall,
    buttonHeightMedium: heightMedium,
    buttonHeightLarge: heightLarge,
    fontSizeSmall,
    fontSizeMedium,
    fontSizeLarge,
    boxShadow: `inset 0 0 0 1px ${borderColor}`,
    boxShadowActive: `inset 0 0 0 1px ${primaryColor}`,
    boxShadowFocus: `inset 0 0 0 1px ${primaryColor}, 0 0 0 2px ${changeColor(primaryColor, {
      alpha: .2
    })}`,
    boxShadowHover: `inset 0 0 0 1px ${primaryColor}`,
    boxShadowDisabled: `inset 0 0 0 1px ${borderColor}`,
    color: baseColor,
    colorDisabled: inputColorDisabled,
    colorActive: "#0000",
    textColor: textColor2,
    textColorDisabled,
    dotColorActive: primaryColor,
    dotColorDisabled: borderColor,
    buttonBorderColor: borderColor,
    buttonBorderColorActive: primaryColor,
    buttonBorderColorHover: borderColor,
    buttonColor: baseColor,
    buttonColorActive: baseColor,
    buttonTextColor: textColor2,
    buttonTextColorActive: primaryColor,
    buttonTextColorHover: primaryColor,
    opacityDisabled,
    buttonBoxShadowFocus: `inset 0 0 0 1px ${primaryColor}, 0 0 0 2px ${changeColor(primaryColor, {
      alpha: .3
    })}`,
    buttonBoxShadowHover: "inset 0 0 0 1px #0000",
    buttonBoxShadow: "inset 0 0 0 1px #0000",
    buttonBorderRadius: borderRadius
  };
}
const radioLight = {
  name: "Radio",
  common: derived,
  self
};
//#endregion
export { radioLight as default };