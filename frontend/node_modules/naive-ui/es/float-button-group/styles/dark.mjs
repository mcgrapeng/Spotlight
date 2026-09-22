import derived from "../../_styles/common/dark.mjs";
//#region src/float-button-group/styles/dark.ts
const floatButtonGroupDark = {
  name: "FloatButtonGroup",
  common: derived,
  self(vars) {
    const {
      popoverColor,
      dividerColor,
      borderRadius
    } = vars;
    return {
      color: popoverColor,
      buttonBorderColor: dividerColor,
      borderRadiusSquare: borderRadius,
      boxShadow: "0 2px 8px 0px rgba(0, 0, 0, .12)"
    };
  }
};
//#endregion
export { floatButtonGroupDark as default };