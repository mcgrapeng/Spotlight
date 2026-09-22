import derived from "../../_styles/common/dark.mjs";
import scrollbarDark from "../../_internal/scrollbar/styles/dark.mjs";
import emptyLight from "../../empty/styles/light.mjs";
import internalSelectMenuDark from "../../_internal/select-menu/styles/dark.mjs";
import internalSelectionDark from "../../_internal/selection/styles/dark.mjs";
import checkboxDark from "../../checkbox/styles/dark.mjs";
import { self } from "./light.mjs";
//#region src/cascader/styles/dark.ts
const cascaderDark = {
  name: "Cascader",
  common: derived,
  peers: {
    InternalSelectMenu: internalSelectMenuDark,
    InternalSelection: internalSelectionDark,
    Scrollbar: scrollbarDark,
    Checkbox: checkboxDark,
    Empty: emptyLight
  },
  self
};
//#endregion
export { cascaderDark as default };