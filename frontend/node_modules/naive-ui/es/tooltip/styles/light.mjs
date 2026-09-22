import { createTheme } from "../../_mixins/use-theme.mjs";
import derived from "../../_styles/common/light.mjs";
import popoverLight from "../../popover/styles/light.mjs";
import _common_default from "./_common.mjs";
import { composite } from "seemly";
//#region src/tooltip/styles/light.ts
function self(vars) {
  const {
    borderRadius,
    boxShadow2,
    baseColor
  } = vars;
  return {
    ..._common_default,
    borderRadius,
    boxShadow: boxShadow2,
    color: composite(baseColor, "rgba(0, 0, 0, .85)"),
    textColor: baseColor
  };
}
const tooltipLight = createTheme({
  name: "Tooltip",
  common: derived,
  peers: {
    Popover: popoverLight
  },
  self
});
//#endregion
export { tooltipLight as default };