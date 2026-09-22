import derived from "../../_styles/common/dark.mjs";
import internalSelectMenuDark from "../../_internal/select-menu/styles/dark.mjs";
import inputDark from "../../input/styles/dark.mjs";
import { self } from "./light.mjs";
//#region src/auto-complete/styles/dark.ts
const autoCompleteDark = {
  name: "AutoComplete",
  common: derived,
  peers: {
    InternalSelectMenu: internalSelectMenuDark,
    Input: inputDark
  },
  self
};
//#endregion
export { autoCompleteDark as default };