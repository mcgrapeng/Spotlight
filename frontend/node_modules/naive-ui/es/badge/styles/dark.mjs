import derived from "../../_styles/common/dark.mjs";
//#region src/badge/styles/dark.ts
const badgeDark = {
  name: "Badge",
  common: derived,
  self(vars) {
    const {
      errorColorSuppl,
      infoColorSuppl,
      successColorSuppl,
      warningColorSuppl,
      fontFamily
    } = vars;
    return {
      color: errorColorSuppl,
      colorInfo: infoColorSuppl,
      colorSuccess: successColorSuppl,
      colorError: errorColorSuppl,
      colorWarning: warningColorSuppl,
      fontSize: "12px",
      fontFamily
    };
  }
};
//#endregion
export { badgeDark as default };