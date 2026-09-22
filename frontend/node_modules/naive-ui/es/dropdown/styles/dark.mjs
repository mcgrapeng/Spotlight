import derived from "../../_styles/common/dark.mjs";
import popoverDark from "../../popover/styles/dark.mjs";
import { self } from "./light.mjs";
import { changeColor } from "seemly";
//#region src/dropdown/styles/dark.ts
const dropdownDark = {
  name: "Dropdown",
  common: derived,
  peers: {
    Popover: popoverDark
  },
  self(vars) {
    const {
      primaryColorSuppl,
      primaryColor,
      popoverColor
    } = vars;
    const commonSelf = self(vars);
    commonSelf.colorInverted = popoverColor;
    commonSelf.optionColorActive = changeColor(primaryColor, {
      alpha: .15
    });
    commonSelf.optionColorActiveInverted = primaryColorSuppl;
    commonSelf.optionColorHoverInverted = primaryColorSuppl;
    return commonSelf;
  }
};
//#endregion
export { dropdownDark as default };