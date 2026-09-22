import derived from "../../_styles/common/light.mjs";
//#region src/thing/styles/light.ts
function self(vars) {
  const {
    textColor1,
    textColor2,
    fontWeightStrong,
    fontSize
  } = vars;
  return {
    fontSize,
    titleTextColor: textColor1,
    textColor: textColor2,
    titleFontWeight: fontWeightStrong
  };
}
const thingLight = {
  name: "Thing",
  common: derived,
  self
};
//#endregion
export { thingLight as default, self };