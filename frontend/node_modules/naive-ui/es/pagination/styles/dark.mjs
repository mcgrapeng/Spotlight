import derived from "../../_styles/common/dark.mjs";
import inputDark from "../../input/styles/dark.mjs";
import popselect from "../../popselect/styles/dark.mjs";
import selectDark from "../../select/styles/dark.mjs";
import { self } from "./light.mjs";
import { changeColor } from "seemly";
//#region src/pagination/styles/dark.ts
const paginationDark = {
  name: "Pagination",
  common: derived,
  peers: {
    Select: selectDark,
    Input: inputDark,
    Popselect: popselect
  },
  self(vars) {
    const {
      primaryColor,
      opacity3
    } = vars;
    const borderColorActive = changeColor(primaryColor, {
      alpha: Number(opacity3)
    });
    const commonSelf = self(vars);
    commonSelf.itemBorderActive = `1px solid ${borderColorActive}`;
    commonSelf.itemBorderDisabled = "1px solid #0000";
    return commonSelf;
  }
};
//#endregion
export { paginationDark as default };