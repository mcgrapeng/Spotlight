import derived from "../../_styles/common/light.mjs";
//#region src/split/styles/light.ts
function self(vars) {
  const {
    primaryColorHover,
    borderColor
  } = vars;
  return {
    resizableTriggerColorHover: primaryColorHover,
    resizableTriggerColor: borderColor
  };
}
const themeLight = {
  name: "Split",
  common: derived,
  self
};
//#endregion
export { themeLight as default, self };