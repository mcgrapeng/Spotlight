import derived from "../../_styles/common/dark.mjs";
//#region src/rate/styles/dark.ts
const rateDark = {
  name: "Rate",
  common: derived,
  self(vars) {
    const {
      railColor
    } = vars;
    return {
      itemColor: railColor,
      itemColorActive: "#CCAA33",
      itemSize: "20px",
      sizeSmall: "16px",
      sizeMedium: "20px",
      sizeLarge: "24px"
    };
  }
};
//#endregion
export { rateDark as default };