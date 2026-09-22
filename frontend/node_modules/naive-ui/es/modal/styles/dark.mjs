import derived from "../../_styles/common/dark.mjs";
import scrollbarDark from "../../_internal/scrollbar/styles/dark.mjs";
import cardDark from "../../card/styles/dark.mjs";
import dialogDark from "../../dialog/styles/dark.mjs";
import { self } from "./light.mjs";
//#region src/modal/styles/dark.ts
const modalDark = {
  name: "Modal",
  common: derived,
  peers: {
    Scrollbar: scrollbarDark,
    Dialog: dialogDark,
    Card: cardDark
  },
  self
};
//#endregion
export { modalDark as default };