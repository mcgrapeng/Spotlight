import derived from "../../_styles/common/light.mjs";
//#region src/float-button-group/styles/light.ts
function self(vars) {
  const {
    popoverColor,
    dividerColor,
    borderRadius
  } = vars;
  return {
    color: popoverColor,
    buttonBorderColor: dividerColor,
    borderRadiusSquare: borderRadius,
    boxShadow: "0 2px 8px 0px rgba(0, 0, 0, .12)"
  };
}
const themeLight = {
  name: "FloatButtonGroup",
  common: derived,
  self
};
//#endregion
export { themeLight as default };