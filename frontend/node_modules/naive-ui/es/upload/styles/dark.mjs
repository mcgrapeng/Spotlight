import derived from "../../_styles/common/dark.mjs";
import buttonDark from "../../button/styles/dark.mjs";
import progressDark from "../../progress/styles/dark.mjs";
import { self } from "./light.mjs";
import { changeColor } from "seemly";
//#region src/upload/styles/dark.ts
const uploadDark = {
  name: "Upload",
  common: derived,
  peers: {
    Button: buttonDark,
    Progress: progressDark
  },
  self(vars) {
    const {
      errorColor
    } = vars;
    const commonSelf = self(vars);
    commonSelf.itemColorHoverError = changeColor(errorColor, {
      alpha: .09
    });
    return commonSelf;
  }
};
//#endregion
export { uploadDark as default };