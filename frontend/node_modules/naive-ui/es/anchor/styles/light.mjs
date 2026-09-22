import derived from "../../_styles/common/light.mjs";
import _common_default from "./_common.mjs";
import { changeColor } from "seemly";
//#region src/anchor/styles/light.ts
function self(vars) {
  const {
    borderRadius,
    railColor,
    primaryColor,
    primaryColorHover,
    primaryColorPressed,
    textColor2
  } = vars;
  return {
    ..._common_default,
    borderRadius,
    railColor,
    railColorActive: primaryColor,
    linkColor: changeColor(primaryColor, {
      alpha: .15
    }),
    linkTextColor: textColor2,
    linkTextColorHover: primaryColorHover,
    linkTextColorPressed: primaryColorPressed,
    linkTextColorActive: primaryColor
  };
}
const anchorLight = {
  name: "Anchor",
  common: derived,
  self
};
//#endregion
export { anchorLight as default, self };