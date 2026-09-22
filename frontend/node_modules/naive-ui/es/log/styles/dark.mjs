import derived from "../../_styles/common/dark.mjs";
import scrollbarDark from "../../_internal/scrollbar/styles/dark.mjs";
import codeDark from "../../code/styles/dark.mjs";
//#region src/log/styles/dark.ts
const logDark = {
  name: "Log",
  common: derived,
  peers: {
    Scrollbar: scrollbarDark,
    Code: codeDark
  },
  self(vars) {
    const {
      textColor2,
      inputColor,
      fontSize,
      primaryColor
    } = vars;
    return {
      loaderFontSize: fontSize,
      loaderTextColor: textColor2,
      loaderColor: inputColor,
      loaderBorder: "1px solid #0000",
      loadingColor: primaryColor
    };
  }
};
//#endregion
export { logDark as default };