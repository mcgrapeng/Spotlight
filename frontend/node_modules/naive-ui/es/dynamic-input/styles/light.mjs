import { createTheme } from "../../_mixins/use-theme.mjs";
import derived from "../../_styles/common/light.mjs";
import inputLight from "../../input/styles/light.mjs";
import buttonLight from "../../button/styles/light.mjs";
import _common_default from "./_common.mjs";
//#region src/dynamic-input/styles/light.ts
function self() {
  return _common_default;
}
const dynamicInputLight = createTheme({
  name: "DynamicInput",
  common: derived,
  peers: {
    Input: inputLight,
    Button: buttonLight
  },
  self
});
//#endregion
export { dynamicInputLight as default };