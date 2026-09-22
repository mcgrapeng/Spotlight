import derived from "../../_styles/common/dark.mjs";
import _common_default from "./_common.mjs";
//#region src/slider/styles/dark.ts
const sliderDark = {
  name: "Slider",
  common: derived,
  self(vars) {
    const boxShadow = "0 2px 8px 0 rgba(0, 0, 0, 0.12)";
    const {
      railColor,
      modalColor,
      primaryColorSuppl,
      popoverColor,
      textColor2,
      cardColor,
      borderRadius,
      fontSize,
      opacityDisabled
    } = vars;
    return {
      ..._common_default,
      fontSize,
      markFontSize: fontSize,
      railColor,
      railColorHover: railColor,
      fillColor: primaryColorSuppl,
      fillColorHover: primaryColorSuppl,
      opacityDisabled,
      handleColor: "#FFF",
      dotColor: cardColor,
      dotColorModal: modalColor,
      dotColorPopover: popoverColor,
      handleBoxShadow: "0px 2px 4px 0 rgba(0, 0, 0, 0.4)",
      handleBoxShadowHover: "0px 2px 4px 0 rgba(0, 0, 0, 0.4)",
      handleBoxShadowActive: "0px 2px 4px 0 rgba(0, 0, 0, 0.4)",
      handleBoxShadowFocus: "0px 2px 4px 0 rgba(0, 0, 0, 0.4)",
      indicatorColor: popoverColor,
      indicatorBoxShadow: boxShadow,
      indicatorTextColor: textColor2,
      indicatorBorderRadius: borderRadius,
      dotBorder: `2px solid ${railColor}`,
      dotBorderActive: `2px solid ${primaryColorSuppl}`,
      dotBoxShadow: ""
    };
  }
};
//#endregion
export { sliderDark as default };