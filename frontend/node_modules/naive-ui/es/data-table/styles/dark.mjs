import derived from "../../_styles/common/dark.mjs";
import scrollbarDark from "../../_internal/scrollbar/styles/dark.mjs";
import emptyDark from "../../empty/styles/dark.mjs";
import popoverDark from "../../popover/styles/dark.mjs";
import buttonDark from "../../button/styles/dark.mjs";
import checkboxDark from "../../checkbox/styles/dark.mjs";
import paginationDark from "../../pagination/styles/dark.mjs";
import dropdownDark from "../../dropdown/styles/dark.mjs";
import ellipsisDark from "../../ellipsis/styles/dark.mjs";
import radioDark from "../../radio/styles/dark.mjs";
import { self } from "./light.mjs";
//#region src/data-table/styles/dark.ts
const dataTableDark = {
  name: "DataTable",
  common: derived,
  peers: {
    Button: buttonDark,
    Checkbox: checkboxDark,
    Radio: radioDark,
    Pagination: paginationDark,
    Scrollbar: scrollbarDark,
    Empty: emptyDark,
    Popover: popoverDark,
    Ellipsis: ellipsisDark,
    Dropdown: dropdownDark
  },
  self(vars) {
    const commonSelf = self(vars);
    commonSelf.boxShadowAfter = "inset 12px 0 8px -12px rgba(0, 0, 0, .36)";
    commonSelf.boxShadowBefore = "inset -12px 0 8px -12px rgba(0, 0, 0, .36)";
    return commonSelf;
  }
};
//#endregion
export { dataTableDark as default };