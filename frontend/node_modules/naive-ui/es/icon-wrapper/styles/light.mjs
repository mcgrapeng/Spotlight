import derived from "../../_styles/common/light.mjs";
//#region src/icon-wrapper/styles/light.ts
function self(vars) {
  const {
    primaryColor,
    baseColor
  } = vars;
  return {
    color: primaryColor,
    iconColor: baseColor
  };
}
const iconWrapperLight = {
  name: "IconWrapper",
  common: derived,
  self
};
//#endregion
export { iconWrapperLight as default, self };