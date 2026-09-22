import derived from "../../_styles/common/dark.mjs";
import scrollbarDark from "../../_internal/scrollbar/styles/dark.mjs";
import inputDark from "../../input/styles/dark.mjs";
import buttonDark from "../../button/styles/dark.mjs";
import timePickerDark from "../../time-picker/styles/dark.mjs";
import { self } from "./light.mjs";
import { changeColor, composite } from "seemly";
//#region src/date-picker/styles/dark.ts
const datePickerDark = {
  name: "DatePicker",
  common: derived,
  peers: {
    Input: inputDark,
    Button: buttonDark,
    TimePicker: timePickerDark,
    Scrollbar: scrollbarDark
  },
  self(vars) {
    const {
      popoverColor,
      hoverColor,
      primaryColor
    } = vars;
    const commonSelf = self(vars);
    commonSelf.itemColorDisabled = composite(popoverColor, hoverColor);
    commonSelf.itemColorIncluded = changeColor(primaryColor, {
      alpha: .15
    });
    commonSelf.itemColorHover = composite(popoverColor, hoverColor);
    return commonSelf;
  }
};
//#endregion
export { datePickerDark as default };