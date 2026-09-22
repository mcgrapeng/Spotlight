import derived from "../../_styles/common/dark.mjs";
import buttonDark from "../../button/styles/dark.mjs";
import { self } from "./light.mjs";
//#region src/calendar/styles/dark.ts
const calendarDark = {
  name: "Calendar",
  common: derived,
  peers: {
    Button: buttonDark
  },
  self
};
//#endregion
export { calendarDark as default };