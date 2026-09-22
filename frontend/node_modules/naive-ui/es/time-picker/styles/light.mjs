import { createTheme } from "../../_mixins/use-theme.mjs";
import derived from "../../_styles/common/light.mjs";
import scrollbarLight from "../../_internal/scrollbar/styles/light.mjs";
import inputLight from "../../input/styles/light.mjs";
import buttonLight from "../../button/styles/light.mjs";
import _common_default from "./_common.mjs";
//#region src/time-picker/styles/light.ts
function self(vars) {
  const {
    popoverColor,
    textColor2,
    primaryColor,
    hoverColor,
    dividerColor,
    opacityDisabled,
    boxShadow2,
    borderRadius,
    iconColor,
    iconColorDisabled
  } = vars;
  return {
    ..._common_default,
    panelColor: popoverColor,
    panelBoxShadow: boxShadow2,
    panelDividerColor: dividerColor,
    itemTextColor: textColor2,
    itemTextColorActive: primaryColor,
    itemColorHover: hoverColor,
    itemOpacityDisabled: opacityDisabled,
    itemBorderRadius: borderRadius,
    borderRadius,
    iconColor,
    iconColorDisabled
  };
}
const timePickerLight = createTheme({
  name: "TimePicker",
  common: derived,
  peers: {
    Scrollbar: scrollbarLight,
    Button: buttonLight,
    Input: inputLight
  },
  self
});
//#endregion
export { timePickerLight as default, self };