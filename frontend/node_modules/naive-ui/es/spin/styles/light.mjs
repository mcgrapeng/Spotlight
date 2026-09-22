import derived from "../../_styles/common/light.mjs";
//#region src/spin/styles/light.ts
function self(vars) {
  const {
    opacityDisabled,
    heightTiny,
    heightSmall,
    heightMedium,
    heightLarge,
    heightHuge,
    primaryColor,
    fontSize
  } = vars;
  return {
    fontSize,
    textColor: primaryColor,
    sizeTiny: heightTiny,
    sizeSmall: heightSmall,
    sizeMedium: heightMedium,
    sizeLarge: heightLarge,
    sizeHuge: heightHuge,
    color: primaryColor,
    opacitySpinning: opacityDisabled
  };
}
const spinLight = {
  name: "Spin",
  common: derived,
  self
};
//#endregion
export { spinLight as default, self };