import { createTheme } from "../../_mixins/use-theme.mjs";
import derived from "../../_styles/common/light.mjs";
import scrollbarLight from "../../_internal/scrollbar/styles/light.mjs";
import codeLight from "../../code/styles/light.mjs";
//#region src/log/styles/light.ts
function self(vars) {
  const {
    textColor2,
    modalColor,
    borderColor,
    fontSize,
    primaryColor
  } = vars;
  return {
    loaderFontSize: fontSize,
    loaderTextColor: textColor2,
    loaderColor: modalColor,
    loaderBorder: `1px solid ${borderColor}`,
    loadingColor: primaryColor
  };
}
const logLight = createTheme({
  name: "Log",
  common: derived,
  peers: {
    Scrollbar: scrollbarLight,
    Code: codeLight
  },
  self
});
//#endregion
export { logLight as default };