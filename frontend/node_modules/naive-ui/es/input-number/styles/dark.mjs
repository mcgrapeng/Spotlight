import derived from "../../_styles/common/dark.mjs";
import inputDark from "../../input/styles/dark.mjs";
import buttonDark from "../../button/styles/dark.mjs";
//#region src/input-number/styles/dark.ts
const inputNumberDark = {
  name: "InputNumber",
  common: derived,
  peers: {
    Button: buttonDark,
    Input: inputDark
  },
  self(vars) {
    const {
      textColorDisabled
    } = vars;
    return {
      iconColorDisabled: textColorDisabled
    };
  }
};
//#endregion
export { inputNumberDark as default };