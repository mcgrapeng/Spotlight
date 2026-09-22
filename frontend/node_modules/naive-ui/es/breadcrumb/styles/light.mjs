import derived from "../../_styles/common/light.mjs";
import _common_default from "./_common.mjs";
//#region src/breadcrumb/styles/light.ts
function self(vars) {
  const {
    fontSize,
    textColor3,
    textColor2,
    borderRadius,
    buttonColor2Hover,
    buttonColor2Pressed
  } = vars;
  return {
    ..._common_default,
    fontSize,
    itemLineHeight: "1.25",
    itemTextColor: textColor3,
    itemTextColorHover: textColor2,
    itemTextColorPressed: textColor2,
    itemTextColorActive: textColor2,
    itemBorderRadius: borderRadius,
    itemColorHover: buttonColor2Hover,
    itemColorPressed: buttonColor2Pressed,
    separatorColor: textColor3
  };
}
const breadcrumbLight = {
  name: "Breadcrumb",
  common: derived,
  self
};
//#endregion
export { breadcrumbLight as default, self };