import derived from "../../_styles/common/dark.mjs";
import { self } from "./light.mjs";
//#region src/button/styles/dark.ts
const buttonDark = {
  name: "Button",
  common: derived,
  self(vars) {
    const commonSelf = self(vars);
    commonSelf.waveOpacity = "0.8";
    commonSelf.colorOpacitySecondary = "0.16";
    commonSelf.colorOpacitySecondaryHover = "0.2";
    commonSelf.colorOpacitySecondaryPressed = "0.12";
    return commonSelf;
  }
};
//#endregion
export { buttonDark as default };