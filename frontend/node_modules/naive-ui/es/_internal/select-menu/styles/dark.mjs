import derived from "../../../_styles/common/dark.mjs";
import scrollbarDark from "../../scrollbar/styles/dark.mjs";
import emptyDark from "../../../empty/styles/dark.mjs";
import { self } from "./light.mjs";
//#region src/_internal/select-menu/styles/dark.ts
const internalSelectMenuDark = {
  name: "InternalSelectMenu",
  common: derived,
  peers: {
    Scrollbar: scrollbarDark,
    Empty: emptyDark
  },
  self
};
//#endregion
export { internalSelectMenuDark as default };