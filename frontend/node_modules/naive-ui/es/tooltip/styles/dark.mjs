import derived from "../../_styles/common/dark.mjs";
import popoverDark from "../../popover/styles/dark.mjs";
import _common_default from "./_common.mjs";
//#region src/tooltip/styles/dark.ts
const tooltipDark = {
  name: "Tooltip",
  common: derived,
  peers: {
    Popover: popoverDark
  },
  self(vars) {
    const {
      borderRadius,
      boxShadow2,
      popoverColor,
      textColor2
    } = vars;
    return {
      ..._common_default,
      borderRadius,
      boxShadow: boxShadow2,
      color: popoverColor,
      textColor: textColor2
    };
  }
};
//#endregion
export { tooltipDark as default };