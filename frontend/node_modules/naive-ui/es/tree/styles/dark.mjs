import derived from "../../_styles/common/dark.mjs";
import scrollbarDark from "../../_internal/scrollbar/styles/dark.mjs";
import emptyDark from "../../empty/styles/dark.mjs";
import checkboxDark from "../../checkbox/styles/dark.mjs";
import { self } from "./light.mjs";
import { changeColor } from "seemly";
//#region src/tree/styles/dark.ts
const treeDark = {
  name: "Tree",
  common: derived,
  peers: {
    Checkbox: checkboxDark,
    Scrollbar: scrollbarDark,
    Empty: emptyDark
  },
  self(vars) {
    const {
      primaryColor
    } = vars;
    const commonSelf = self(vars);
    commonSelf.nodeColorActive = changeColor(primaryColor, {
      alpha: .15
    });
    return commonSelf;
  }
};
//#endregion
export { treeDark as default };