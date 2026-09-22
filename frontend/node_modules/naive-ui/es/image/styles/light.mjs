import { createTheme } from "../../_mixins/use-theme.mjs";
import derived from "../../_styles/common/light.mjs";
import tooltipLight from "../../tooltip/styles/light.mjs";
//#region src/image/styles/light.ts
function self() {
  return {
    toolbarIconColor: "rgba(255, 255, 255, .9)",
    toolbarColor: "rgba(0, 0, 0, .35)",
    toolbarBoxShadow: "none",
    toolbarBorderRadius: "24px"
  };
}
const imageLight = createTheme({
  name: "Image",
  common: derived,
  peers: {
    Tooltip: tooltipLight
  },
  self
});
//#endregion
export { imageLight };