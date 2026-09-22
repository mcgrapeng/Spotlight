import derived from "../../_styles/common/dark.mjs";
import internalSelectMenuDark from "../../_internal/select-menu/styles/dark.mjs";
import popoverDark from "../../popover/styles/dark.mjs";
//#region src/popselect/styles/dark.ts
const popselect = {
  name: "Popselect",
  common: derived,
  peers: {
    Popover: popoverDark,
    InternalSelectMenu: internalSelectMenuDark
  }
};
//#endregion
export { popselect as default };