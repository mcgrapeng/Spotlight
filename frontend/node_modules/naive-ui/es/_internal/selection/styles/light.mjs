import { createTheme } from "../../../_mixins/use-theme.mjs";
import derived from "../../../_styles/common/light.mjs";
import popoverLight from "../../../popover/styles/light.mjs";
import _common_default from "./_common.mjs";
import { changeColor } from "seemly";
//#region src/_internal/selection/styles/light.ts
function self(vars) {
  const {
    borderRadius,
    textColor2,
    textColorDisabled,
    inputColor,
    inputColorDisabled,
    primaryColor,
    primaryColorHover,
    warningColor,
    warningColorHover,
    errorColor,
    errorColorHover,
    borderColor,
    iconColor,
    iconColorDisabled,
    clearColor,
    clearColorHover,
    clearColorPressed,
    placeholderColor,
    placeholderColorDisabled,
    fontSizeTiny,
    fontSizeSmall,
    fontSizeMedium,
    fontSizeLarge,
    heightTiny,
    heightSmall,
    heightMedium,
    heightLarge,
    fontWeight
  } = vars;
  return {
    ..._common_default,
    fontSizeTiny,
    fontSizeSmall,
    fontSizeMedium,
    fontSizeLarge,
    heightTiny,
    heightSmall,
    heightMedium,
    heightLarge,
    borderRadius,
    fontWeight,
    textColor: textColor2,
    textColorDisabled,
    placeholderColor,
    placeholderColorDisabled,
    color: inputColor,
    colorDisabled: inputColorDisabled,
    colorActive: inputColor,
    border: `1px solid ${borderColor}`,
    borderHover: `1px solid ${primaryColorHover}`,
    borderActive: `1px solid ${primaryColor}`,
    borderFocus: `1px solid ${primaryColorHover}`,
    boxShadowHover: "none",
    boxShadowActive: `0 0 0 2px ${changeColor(primaryColor, {
      alpha: .2
    })}`,
    boxShadowFocus: `0 0 0 2px ${changeColor(primaryColor, {
      alpha: .2
    })}`,
    caretColor: primaryColor,
    arrowColor: iconColor,
    arrowColorDisabled: iconColorDisabled,
    loadingColor: primaryColor,
    borderWarning: `1px solid ${warningColor}`,
    borderHoverWarning: `1px solid ${warningColorHover}`,
    borderActiveWarning: `1px solid ${warningColor}`,
    borderFocusWarning: `1px solid ${warningColorHover}`,
    boxShadowHoverWarning: "none",
    boxShadowActiveWarning: `0 0 0 2px ${changeColor(warningColor, {
      alpha: .2
    })}`,
    boxShadowFocusWarning: `0 0 0 2px ${changeColor(warningColor, {
      alpha: .2
    })}`,
    colorActiveWarning: inputColor,
    caretColorWarning: warningColor,
    borderError: `1px solid ${errorColor}`,
    borderHoverError: `1px solid ${errorColorHover}`,
    borderActiveError: `1px solid ${errorColor}`,
    borderFocusError: `1px solid ${errorColorHover}`,
    boxShadowHoverError: "none",
    boxShadowActiveError: `0 0 0 2px ${changeColor(errorColor, {
      alpha: .2
    })}`,
    boxShadowFocusError: `0 0 0 2px ${changeColor(errorColor, {
      alpha: .2
    })}`,
    colorActiveError: inputColor,
    caretColorError: errorColor,
    clearColor,
    clearColorHover,
    clearColorPressed
  };
}
const internalSelectionLight = createTheme({
  name: "InternalSelection",
  common: derived,
  peers: {
    Popover: popoverLight
  },
  self
});
//#endregion
export { internalSelectionLight as default };