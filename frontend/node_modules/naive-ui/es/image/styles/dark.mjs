import derived from "../../_styles/common/dark.mjs";
import tooltipDark from "../../tooltip/styles/dark.mjs";
//#region src/image/styles/dark.ts
const imageDark = {
  name: "Image",
  common: derived,
  peers: {
    Tooltip: tooltipDark
  },
  self: vars => {
    const {
      textColor2
    } = vars;
    return {
      toolbarIconColor: textColor2,
      toolbarColor: "rgba(0, 0, 0, .35)",
      toolbarBoxShadow: "none",
      toolbarBorderRadius: "24px"
    };
  }
};
//#endregion
export { imageDark };