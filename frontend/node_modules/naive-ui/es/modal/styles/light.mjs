import { createTheme } from "../../_mixins/use-theme.mjs";
import derived from "../../_styles/common/light.mjs";
import scrollbarLight from "../../_internal/scrollbar/styles/light.mjs";
import cardLight from "../../card/styles/light.mjs";
import dialogLight from "../../dialog/styles/light.mjs";
//#region src/modal/styles/light.ts
function self(vars) {
  const {
    modalColor,
    textColor2,
    boxShadow3
  } = vars;
  return {
    color: modalColor,
    textColor: textColor2,
    boxShadow: boxShadow3
  };
}
const modalLight = createTheme({
  name: "Modal",
  common: derived,
  peers: {
    Scrollbar: scrollbarLight,
    Dialog: dialogLight,
    Card: cardLight
  },
  self
});
//#endregion
export { modalLight as default, self };