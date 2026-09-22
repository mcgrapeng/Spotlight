import { createTheme } from "../../_mixins/use-theme.mjs";
import derived from "../../_styles/common/light.mjs";
import inputLight from "../../input/styles/light.mjs";
import buttonLight from "../../button/styles/light.mjs";
//#region src/input-number/styles/light.ts
function self(vars) {
  const {
    textColorDisabled
  } = vars;
  return {
    iconColorDisabled: textColorDisabled
  };
}
const inputNumberLight = createTheme({
  name: "InputNumber",
  common: derived,
  peers: {
    Button: buttonLight,
    Input: inputLight
  },
  self
});
//#endregion
export { inputNumberLight as default };