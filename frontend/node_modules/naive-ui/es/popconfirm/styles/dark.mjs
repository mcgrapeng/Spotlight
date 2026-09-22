import derived from "../../_styles/common/dark.mjs";
import popoverDark from "../../popover/styles/dark.mjs";
import buttonDark from "../../button/styles/dark.mjs";
import { self } from "./light.mjs";
//#region src/popconfirm/styles/dark.ts
const popconfirmDark = {
  name: "Popconfirm",
  common: derived,
  peers: {
    Button: buttonDark,
    Popover: popoverDark
  },
  self
};
//#endregion
export { popconfirmDark as default };