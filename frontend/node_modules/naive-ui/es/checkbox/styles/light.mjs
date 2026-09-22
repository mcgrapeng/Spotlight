import derived from "../../_styles/common/light.mjs";
import _common_default from "./_common.mjs";
import { changeColor } from "seemly";
//#region src/checkbox/styles/light.ts
function self(vars) {
  const {
    baseColor,
    inputColorDisabled,
    cardColor,
    modalColor,
    popoverColor,
    textColorDisabled,
    borderColor,
    primaryColor,
    textColor2,
    fontSizeSmall,
    fontSizeMedium,
    fontSizeLarge,
    borderRadiusSmall,
    lineHeight
  } = vars;
  return {
    ..._common_default,
    labelLineHeight: lineHeight,
    fontSizeSmall,
    fontSizeMedium,
    fontSizeLarge,
    borderRadius: borderRadiusSmall,
    color: baseColor,
    colorChecked: primaryColor,
    colorDisabled: inputColorDisabled,
    colorDisabledChecked: inputColorDisabled,
    colorTableHeader: cardColor,
    colorTableHeaderModal: modalColor,
    colorTableHeaderPopover: popoverColor,
    checkMarkColor: baseColor,
    checkMarkColorDisabled: textColorDisabled,
    checkMarkColorDisabledChecked: textColorDisabled,
    border: `1px solid ${borderColor}`,
    borderDisabled: `1px solid ${borderColor}`,
    borderDisabledChecked: `1px solid ${borderColor}`,
    borderChecked: `1px solid ${primaryColor}`,
    borderFocus: `1px solid ${primaryColor}`,
    boxShadowFocus: `0 0 0 2px ${changeColor(primaryColor, {
      alpha: .3
    })}`,
    textColor: textColor2,
    textColorDisabled
  };
}
const checkboxLight = {
  name: "Checkbox",
  common: derived,
  self
};
//#endregion
export { checkboxLight as default, self };