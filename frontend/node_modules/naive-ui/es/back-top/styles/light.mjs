import derived from "../../_styles/common/light.mjs";
import _common_default from "./_common.mjs";
//#region src/back-top/styles/light.ts
function self(vars) {
  const {
    popoverColor,
    textColor2,
    primaryColorHover,
    primaryColorPressed
  } = vars;
  return {
    ..._common_default,
    color: popoverColor,
    textColor: textColor2,
    iconColor: textColor2,
    iconColorHover: primaryColorHover,
    iconColorPressed: primaryColorPressed,
    boxShadow: "0 2px 8px 0px rgba(0, 0, 0, .12)",
    boxShadowHover: "0 2px 12px 0px rgba(0, 0, 0, .18)",
    boxShadowPressed: "0 2px 12px 0px rgba(0, 0, 0, .18)"
  };
}
const backTopLight = {
  name: "BackTop",
  common: derived,
  self
};
//#endregion
export { backTopLight as default };