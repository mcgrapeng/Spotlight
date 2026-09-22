import derived from "../../_styles/common/dark.mjs";
import scrollbarDark from "../../_internal/scrollbar/styles/dark.mjs";
import { self } from "./light.mjs";
//#region src/popover/styles/dark.ts
const popoverDark = {
  name: "Popover",
  common: derived,
  peers: {
    Scrollbar: scrollbarDark
  },
  self
};
//#endregion
export { popoverDark as default };