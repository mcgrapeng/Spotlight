import derived from "../../_styles/common/dark.mjs";
import { self } from "./light.mjs";
//#region src/heatmap/styles/dark.ts
const HeatmapDark = {
  name: "Heatmap",
  common: derived,
  self(vars) {
    return {
      ...self(vars),
      activeColors: ["#0d4429", "#006d32", "#26a641", "#39d353"],
      mininumColor: "rgba(255, 255, 255, 0.1)",
      loadingColorStart: "rgba(255, 255, 255, 0.12)",
      loadingColorEnd: "rgba(255, 255, 255, 0.18)"
    };
  }
};
//#endregion
export { HeatmapDark as default };