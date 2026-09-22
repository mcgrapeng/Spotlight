import derived from "../../_styles/common/dark.mjs";
import { self } from "./light.mjs";
//#region src/card/styles/dark.ts
const cardDark = {
  name: "Card",
  common: derived,
  self(vars) {
    const commonSelf = self(vars);
    const {
      cardColor,
      modalColor,
      popoverColor
    } = vars;
    commonSelf.colorEmbedded = cardColor;
    commonSelf.colorEmbeddedModal = modalColor;
    commonSelf.colorEmbeddedPopover = popoverColor;
    return commonSelf;
  }
};
//#endregion
export { cardDark as default };