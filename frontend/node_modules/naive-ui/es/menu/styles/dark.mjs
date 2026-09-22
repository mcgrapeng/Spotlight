import derived from "../../_styles/common/dark.mjs";
import dropdownDark from "../../dropdown/styles/dark.mjs";
import tooltipDark from "../../tooltip/styles/dark.mjs";
import { self } from "./light.mjs";
import { changeColor } from "seemly";
//#region src/menu/styles/dark.ts
const menuDark = {
  name: "Menu",
  common: derived,
  peers: {
    Tooltip: tooltipDark,
    Dropdown: dropdownDark
  },
  self(vars) {
    const {
      primaryColor,
      primaryColorSuppl
    } = vars;
    const commonSelf = self(vars);
    commonSelf.itemColorActive = changeColor(primaryColor, {
      alpha: .15
    });
    commonSelf.itemColorActiveHover = changeColor(primaryColor, {
      alpha: .15
    });
    commonSelf.itemColorActiveCollapsed = changeColor(primaryColor, {
      alpha: .15
    });
    commonSelf.itemColorActiveInverted = primaryColorSuppl;
    commonSelf.itemColorActiveHoverInverted = primaryColorSuppl;
    commonSelf.itemColorActiveCollapsedInverted = primaryColorSuppl;
    return commonSelf;
  }
};
//#endregion
export { menuDark as default };