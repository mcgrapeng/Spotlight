import derived from "../../_styles/common/dark.mjs";
import scrollbarDark from "../../_internal/scrollbar/styles/dark.mjs";
import inputDark from "../../input/styles/dark.mjs";
import buttonDark from "../../button/styles/dark.mjs";
import { self } from "./light.mjs";
//#region src/time-picker/styles/dark.ts
const timePickerDark = {
  name: "TimePicker",
  common: derived,
  peers: {
    Scrollbar: scrollbarDark,
    Button: buttonDark,
    Input: inputDark
  },
  self
};
//#endregion
export { timePickerDark as default };