import derived from "../../_styles/common/light.mjs";
//#region src/rate/styles/light.ts
function self(vars) {
  const {
    railColor
  } = vars;
  return {
    itemColor: railColor,
    itemColorActive: "#FFCC33",
    sizeSmall: "16px",
    sizeMedium: "20px",
    sizeLarge: "24px"
  };
}
const themeLight = {
  name: "Rate",
  common: derived,
  self
};
//#endregion
export { themeLight as default };