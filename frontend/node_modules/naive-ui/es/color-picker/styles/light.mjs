import { createTheme } from "../../_mixins/use-theme.mjs";
import derived from "../../_styles/common/light.mjs";
import inputLight from "../../input/styles/light.mjs";
import buttonLight from "../../button/styles/light.mjs";
//#region src/color-picker/styles/light.ts
function self(vars) {
  const {
    fontSize,
    boxShadow2,
    popoverColor,
    textColor2,
    borderRadius,
    borderColor,
    heightSmall,
    heightMedium,
    heightLarge,
    fontSizeSmall,
    fontSizeMedium,
    fontSizeLarge,
    dividerColor
  } = vars;
  return {
    panelFontSize: fontSize,
    boxShadow: boxShadow2,
    color: popoverColor,
    textColor: textColor2,
    borderRadius,
    border: `1px solid ${borderColor}`,
    heightSmall,
    heightMedium,
    heightLarge,
    fontSizeSmall,
    fontSizeMedium,
    fontSizeLarge,
    dividerColor
  };
}
const colorPickerLight = createTheme({
  name: "ColorPicker",
  common: derived,
  peers: {
    Input: inputLight,
    Button: buttonLight
  },
  self
});
//#endregion
export { colorPickerLight as default, self };