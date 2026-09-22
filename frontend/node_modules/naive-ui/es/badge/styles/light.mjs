import derived from "../../_styles/common/light.mjs";
//#region src/badge/styles/light.ts
function self(vars) {
  const {
    errorColor,
    infoColor,
    successColor,
    warningColor,
    fontFamily
  } = vars;
  return {
    color: errorColor,
    colorInfo: infoColor,
    colorSuccess: successColor,
    colorError: errorColor,
    colorWarning: warningColor,
    fontSize: "12px",
    fontFamily
  };
}
const badgeLight = {
  name: "Badge",
  common: derived,
  self
};
//#endregion
export { badgeLight as default };