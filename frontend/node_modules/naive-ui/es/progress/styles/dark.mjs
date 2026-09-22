import derived from "../../_styles/common/dark.mjs";
import { self } from "./light.mjs";
//#region src/progress/styles/dark.ts
const progressDark = {
  name: "Progress",
  common: derived,
  self(vars) {
    const commonSelf = self(vars);
    commonSelf.textColorLineInner = "rgb(0, 0, 0)";
    commonSelf.lineBgProcessing = "linear-gradient(90deg, rgba(255, 255, 255, .3) 0%, rgba(255, 255, 255, .5) 100%)";
    return commonSelf;
  }
};
//#endregion
export { progressDark as default };