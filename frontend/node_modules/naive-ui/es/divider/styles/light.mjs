import derived from "../../_styles/common/light.mjs";
//#region src/divider/styles/light.ts
function self(vars) {
  const {
    textColor1,
    dividerColor,
    fontWeightStrong
  } = vars;
  return {
    textColor: textColor1,
    color: dividerColor,
    fontWeight: fontWeightStrong
  };
}
const dividerLight = {
  name: "Divider",
  common: derived,
  self
};
//#endregion
export { dividerLight as default, self };