import derived from "../../_styles/common/light.mjs";
//#region src/statistic/styles/light.ts
function self(vars) {
  const {
    textColor2,
    textColor3,
    fontSize,
    fontWeight
  } = vars;
  return {
    labelFontSize: fontSize,
    labelFontWeight: fontWeight,
    valueFontWeight: fontWeight,
    valueFontSize: "24px",
    labelTextColor: textColor3,
    valuePrefixTextColor: textColor2,
    valueSuffixTextColor: textColor2,
    valueTextColor: textColor2
  };
}
const statisticLight = {
  name: "Statistic",
  common: derived,
  self
};
//#endregion
export { statisticLight as default, self };