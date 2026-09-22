import derived from "../../_styles/common/dark.mjs";
import scrollbarDark from "../../_internal/scrollbar/styles/dark.mjs";
import { self } from "./light.mjs";
//#region src/drawer/styles/dark.ts
const drawerDark = {
  name: "Drawer",
  common: derived,
  peers: {
    Scrollbar: scrollbarDark
  },
  self
};
//#endregion
export { drawerDark as default };