import derived from "../../_styles/common/dark.mjs";
import inputDark from "../../input/styles/dark.mjs";
import buttonDark from "../../button/styles/dark.mjs";
import { self } from "./light.mjs";
//#region src/color-picker/styles/dark.ts
const colorPickerDark = {
  name: "ColorPicker",
  common: derived,
  peers: {
    Input: inputDark,
    Button: buttonDark
  },
  self
};
//#endregion
export { colorPickerDark as default };