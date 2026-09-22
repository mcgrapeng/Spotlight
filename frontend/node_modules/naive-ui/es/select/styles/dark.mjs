import derived from "../../_styles/common/dark.mjs";
import internalSelectMenuDark from "../../_internal/select-menu/styles/dark.mjs";
import internalSelectionDark from "../../_internal/selection/styles/dark.mjs";
import { self } from "./light.mjs";
//#region src/select/styles/dark.ts
const selectDark = {
  name: "Select",
  common: derived,
  peers: {
    InternalSelection: internalSelectionDark,
    InternalSelectMenu: internalSelectMenuDark
  },
  self
};
//#endregion
export { selectDark as default };