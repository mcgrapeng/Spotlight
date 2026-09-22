import derived from "../../_styles/common/light.mjs";
import _common_default from "./_common.mjs";
//#region src/empty/styles/light.ts
function self(vars) {
  const {
    textColorDisabled,
    iconColor,
    textColor2,
    fontSizeTiny,
    fontSizeSmall,
    fontSizeMedium,
    fontSizeLarge,
    fontSizeHuge
  } = vars;
  return {
    ..._common_default,
    fontSizeTiny,
    fontSizeSmall,
    fontSizeMedium,
    fontSizeLarge,
    fontSizeHuge,
    textColor: textColorDisabled,
    iconColor,
    extraTextColor: textColor2
  };
}
const emptyLight = {
  name: "Empty",
  common: derived,
  self
};
//#endregion
export { emptyLight as default, self };