import derived from "../../_styles/common/dark.mjs";
import buttonDark from "../../button/styles/dark.mjs";
import { self } from "./light.mjs";
//#region src/dialog/styles/dark.ts
const dialogDark = {
  name: "Dialog",
  common: derived,
  peers: {
    Button: buttonDark
  },
  self
};
//#endregion
export { dialogDark as default };