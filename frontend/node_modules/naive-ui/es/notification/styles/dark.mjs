import derived from "../../_styles/common/dark.mjs";
import scrollbarDark from "../../_internal/scrollbar/styles/dark.mjs";
import { self } from "./light.mjs";
//#region src/notification/styles/dark.ts
const notificationDark = {
  name: "Notification",
  common: derived,
  peers: {
    Scrollbar: scrollbarDark
  },
  self
};
//#endregion
export { notificationDark as default };