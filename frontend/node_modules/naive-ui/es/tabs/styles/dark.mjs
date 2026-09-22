import derived from "../../_styles/common/dark.mjs";
import buttonDark from "../../button/styles/dark.mjs";
import { self } from "./light.mjs";
//#region src/tabs/styles/dark.ts
const tabsDark = {
  name: "Tabs",
  common: derived,
  peers: {
    Button: buttonDark
  },
  self(vars) {
    const commonSelf = self(vars);
    const {
      inputColor
    } = vars;
    commonSelf.colorSegment = inputColor;
    commonSelf.tabColorSegment = inputColor;
    return commonSelf;
  }
};
//#endregion
export { tabsDark as default };