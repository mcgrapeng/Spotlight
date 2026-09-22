import derived from "../../_styles/common/light.mjs";
//#region src/float-button/styles/light.ts
function self(vars) {
  const {
    popoverColor,
    textColor2,
    buttonColor2Hover,
    buttonColor2Pressed,
    primaryColor,
    primaryColorHover,
    primaryColorPressed,
    borderRadius
  } = vars;
  return {
    color: popoverColor,
    colorHover: buttonColor2Hover,
    colorPressed: buttonColor2Pressed,
    colorPrimary: primaryColor,
    colorPrimaryHover: primaryColorHover,
    colorPrimaryPressed: primaryColorPressed,
    textColor: textColor2,
    boxShadow: "0 2px 8px 0px rgba(0, 0, 0, .16)",
    boxShadowHover: "0 2px 12px 0px rgba(0, 0, 0, .24)",
    boxShadowPressed: "0 2px 12px 0px rgba(0, 0, 0, .24)",
    textColorPrimary: "#fff",
    borderRadiusSquare: borderRadius
  };
}
const themeLight = {
  name: "FloatButton",
  common: derived,
  self
};
//#endregion
export { themeLight as default };