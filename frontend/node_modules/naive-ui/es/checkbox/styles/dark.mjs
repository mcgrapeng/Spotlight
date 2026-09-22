import derived from "../../_styles/common/dark.mjs";
import { self } from "./light.mjs";
//#region src/checkbox/styles/dark.ts
const checkboxDark = {
  name: "Checkbox",
  common: derived,
  self(vars) {
    const {
      cardColor
    } = vars;
    const commonSelf = self(vars);
    commonSelf.color = "#0000";
    commonSelf.checkMarkColor = cardColor;
    return commonSelf;
  }
};
//#endregion
export { checkboxDark as default };