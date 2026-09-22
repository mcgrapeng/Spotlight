import derived from "../../_styles/common/dark.mjs";
import tooltipDark from "../../tooltip/styles/dark.mjs";
//#region src/ellipsis/styles/dark.ts
const ellipsisDark = {
  name: "Ellipsis",
  common: derived,
  peers: {
    Tooltip: tooltipDark
  }
};
//#endregion
export { ellipsisDark as default };