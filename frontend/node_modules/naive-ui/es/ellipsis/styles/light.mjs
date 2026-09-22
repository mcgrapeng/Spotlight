import { createTheme } from "../../_mixins/use-theme.mjs";
import derived from "../../_styles/common/light.mjs";
import tooltipLight from "../../tooltip/styles/light.mjs";
//#region src/ellipsis/styles/light.ts
const ellipsisLight = createTheme({
  name: "Ellipsis",
  common: derived,
  peers: {
    Tooltip: tooltipLight
  }
});
//#endregion
export { ellipsisLight as default };