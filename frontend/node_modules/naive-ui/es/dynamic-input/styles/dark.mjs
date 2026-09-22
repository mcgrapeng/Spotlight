import derived from "../../_styles/common/dark.mjs";
import inputDark from "../../input/styles/dark.mjs";
import buttonDark from "../../button/styles/dark.mjs";
import _common_default from "./_common.mjs";
//#region src/dynamic-input/styles/dark.ts
const dynamicInputDark = {
  name: "DynamicInput",
  common: derived,
  peers: {
    Input: inputDark,
    Button: buttonDark
  },
  self() {
    return _common_default;
  }
};
//#endregion
export { dynamicInputDark as default };